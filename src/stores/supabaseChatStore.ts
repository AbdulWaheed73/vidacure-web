import { create } from 'zustand';
import { supabaseChatService } from '../services/supabaseChatService';
import type {
  Message,
  LocalMessage,
  MessageStatus,
  Conversation,
  Participant,
  ConversationWithDetails,
  ConnectionStatus,
  PresenceState,
  SupabaseChatState,
  UnreadState,
} from '../types/supabase-chat-types';

const initialState = {
  connectionStatus: 'disconnected' as ConnectionStatus,
  conversation: null as Conversation | null,
  conversations: [] as ConversationWithDetails[],
  messages: [] as LocalMessage[],
  participants: [] as Participant[],
  presenceState: {} as PresenceState,
  error: null as string | null,
  isLoadingMessages: false,
  currentUserId: null as string | null,
  currentUserRole: null as 'patient' | 'doctor' | null,
  subscriptionActive: false,
  // Unread message state
  unreadCounts: {} as UnreadState,
  messageReadStatus: {} as { [messageId: string]: boolean },
};

// Helper to convert Message to LocalMessage
const messageToLocalMessage = (message: Message): LocalMessage => ({
  ...message,
  localId: message.id,
  status: 'sent' as MessageStatus,
});

export const useSupabaseChatStore = create<SupabaseChatState>((set, get) => ({
  ...initialState,

  connect: async (userId: string, _userName: string, userRole: 'patient' | 'doctor') => {
    set({ error: null, connectionStatus: 'connecting' });

    try {
      const tokenResponse = await supabaseChatService.initialize(userId, userRole);

      set({
        connectionStatus: 'connected',
        currentUserId: userId,
        currentUserRole: userRole,
        subscriptionActive: tokenResponse.user.subscriptionActive,
        error: null,
      });

      // Auto-load conversations based on role
      if (userRole === 'patient') {
        await get().loadPatientConversation();
      } else if (userRole === 'doctor') {
        await get().loadDoctorConversations();
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect to chat';
      console.error('Failed to connect to Supabase chat:', error);
      set({
        connectionStatus: 'error',
        error: errorMessage,
      });
    }
  },

  disconnect: async () => {
    // Immediately clear state
    set({ ...initialState });

    try {
      await supabaseChatService.disconnect();
    } catch (error) {
      console.error('Failed to disconnect from chat:', error);
    }
  },

  loadPatientConversation: async () => {
    const { connectionStatus, currentUserId } = get();

    if (connectionStatus !== 'connected') {
      console.log('Skipping loadPatientConversation - not connected');
      return;
    }

    try {
      const result = await supabaseChatService.getPatientConversation();

      if (get().connectionStatus === 'connected') {
        if (result) {
          set({
            conversation: result.conversation,
            participants: result.participants,
            error: null,
          });

          // Load messages and subscribe to updates (loadMessages handles subscription)
          await get().loadMessages(result.conversation.id);

          // Subscribe to presence
          if (currentUserId) {
            supabaseChatService.subscribeToPresence(
              result.conversation.id,
              { userId: currentUserId, name: '' },
              (userId, status) => {
                get().updatePresenceState(userId, status);
              }
            );
          }
        } else {
          set({ conversation: null, participants: [], error: null });
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load conversation';
      if (get().connectionStatus === 'connected') {
        console.error('Failed to load patient conversation:', error);
        set({ error: errorMessage });
      }
    }
  },

  loadDoctorConversations: async () => {
    const { connectionStatus } = get();

    if (connectionStatus !== 'connected') {
      console.log('Skipping loadDoctorConversations - not connected');
      return;
    }

    try {
      const conversations = await supabaseChatService.getDoctorConversations();

      if (get().connectionStatus === 'connected') {
        set({
          conversations,
          conversation: conversations[0] || null,
          error: null,
        });

        // Fetch unread counts for all conversations
        await get().fetchUnreadCounts();

        // Note: Don't auto-load messages here - doctors see a conversation list first
        // Messages are loaded when doctor selects a specific conversation
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load conversations';
      if (get().connectionStatus === 'connected') {
        console.error('Failed to load doctor conversations:', error);
        set({ error: errorMessage });
      }
    }
  },

  selectConversation: async (conversation: ConversationWithDetails) => {
    const { currentUserId } = get();
    set({ conversation, messages: [], participants: conversation.participants || [] });
    await get().loadMessages(conversation.id);

    // Mark conversation as read when selected
    await get().markConversationAsRead(conversation.id);

    // Subscribe to presence for the selected conversation
    if (currentUserId) {
      supabaseChatService.subscribeToPresence(
        conversation.id,
        { userId: currentUserId, name: '' },
        (userId, status) => {
          get().updatePresenceState(userId, status);
        }
      );
    }
  },

  loadMessages: async (conversationId: string) => {
    set({ isLoadingMessages: true });

    try {
      const messages = await supabaseChatService.loadMessages(conversationId);

      // Convert messages to LocalMessage format (all loaded messages are 'sent')
      const localMessages = messages.map(messageToLocalMessage);

      set({
        messages: localMessages,
        isLoadingMessages: false,
        error: null,
      });

      // Subscribe to new messages (await to ensure old subscription is cleaned up first)
      const { currentUserId } = get();
      await supabaseChatService.subscribeToMessages(conversationId, (message) => {
        if (message.sender_id !== currentUserId) {
          get().addMessage(message);
        }
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load messages';
      console.error('Failed to load messages:', error);
      set({
        isLoadingMessages: false,
        error: errorMessage,
      });
    }
  },

  sendMessage: async (content: string) => {
    const { conversation, currentUserId, currentUserRole } = get();

    if (!conversation || !currentUserId || !currentUserRole) {
      console.error('Cannot send message: missing conversation or user info');
      return;
    }

    // 1. Create optimistic message with 'sending' status
    const localId = `local-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const optimisticMessage: LocalMessage = {
      id: localId,
      localId,
      conversation_id: conversation.id,
      sender_id: currentUserId,
      sender_role: currentUserRole,
      content,
      message_type: 'text',
      attachments: [],
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_deleted: false,
      status: 'sending',
    };

    // 2. Add to UI immediately
    get().addOptimisticMessage(optimisticMessage);

    try {
      // 3. Send in background (with auto-retry on token expiry)
      const serverMessage = await supabaseChatService.sendMessageWithRetry(
        conversation.id,
        content,
        currentUserId,
        currentUserRole
      );

      // 4. Replace optimistic message with server message
      get().updateMessageStatus(localId, 'sent', serverMessage);
    } catch (error: unknown) {
      // 5. Mark as failed - user can retry
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      console.error('Failed to send message:', error);
      get().updateMessageStatus(localId, 'failed', null, errorMessage);
    }
  },

  addMessage: (message: Message) => {
    set((state) => {
      // Check if message already exists (by id or localId)
      const exists = state.messages.some((m) => m.id === message.id || m.localId === message.id);
      if (exists) return state;

      // Convert to LocalMessage with 'sent' status (for incoming messages from realtime)
      const localMessage = messageToLocalMessage(message);

      return {
        messages: [...state.messages, localMessage],
      };
    });
  },

  addOptimisticMessage: (message: LocalMessage) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  updateMessageStatus: (localId: string, status: MessageStatus, serverMessage?: Message | null, error?: string) => {
    set((state) => ({
      messages: state.messages.map((msg) => {
        if (msg.localId === localId) {
          if (status === 'sent' && serverMessage) {
            // Replace with server message, keep localId for deduplication
            return { ...serverMessage, localId, status: 'sent' as MessageStatus };
          }
          return { ...msg, status, error };
        }
        return msg;
      }),
    }));
  },

  retryMessage: async (localId: string) => {
    const { conversation, currentUserId, currentUserRole, messages } = get();
    const message = messages.find((m) => m.localId === localId);

    if (!message || message.status !== 'failed' || !conversation || !currentUserId || !currentUserRole) {
      return;
    }

    // Update status to sending
    get().updateMessageStatus(localId, 'sending');

    try {
      const serverMessage = await supabaseChatService.sendMessageWithRetry(
        conversation.id,
        message.content,
        currentUserId,
        currentUserRole
      );
      get().updateMessageStatus(localId, 'sent', serverMessage);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      get().updateMessageStatus(localId, 'failed', null, errorMessage);
    }
  },

  updatePresenceState: (userId: string, status: 'online' | 'offline') => {
    set((state) => ({
      presenceState: {
        ...state.presenceState,
        [userId]: {
          status,
          lastSeen: new Date().toISOString(),
        },
      },
    }));
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set({ ...initialState });
  },

  // Unread message actions
  fetchUnreadCounts: async () => {
    const { currentUserId, connectionStatus } = get();

    if (connectionStatus !== 'connected' || !currentUserId) {
      return;
    }

    try {
      const counts = await supabaseChatService.getAllUnreadCounts(currentUserId);
      set({ unreadCounts: counts });
    } catch (error) {
      console.error('Failed to fetch unread counts:', error);
    }
  },

  markConversationAsRead: async (conversationId: string) => {
    const { currentUserId } = get();

    if (!currentUserId) {
      return;
    }

    try {
      await supabaseChatService.markConversationAsRead(conversationId, currentUserId);

      // Update local state
      set((state) => ({
        unreadCounts: {
          ...state.unreadCounts,
          [conversationId]: 0,
        },
      }));
    } catch (error) {
      console.error('Failed to mark conversation as read:', error);
    }
  },

  updateUnreadCount: (conversationId: string, count: number) => {
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [conversationId]: count,
      },
    }));
  },

  fetchMessageReadStatus: async (messageIds: string[], recipientId: string) => {
    try {
      const status = await supabaseChatService.getMessagesReadStatus(messageIds, recipientId);

      // Update local state
      set((state) => {
        const newReadStatus = { ...state.messageReadStatus };
        Object.entries(status).forEach(([messageId, { isRead }]) => {
          newReadStatus[messageId] = isRead;
        });
        return { messageReadStatus: newReadStatus };
      });
    } catch (error) {
      console.error('Failed to fetch message read status:', error);
    }
  },
}));

// Selectors
export const selectConnectionStatus = (state: SupabaseChatState) => state.connectionStatus;
export const selectConversation = (state: SupabaseChatState) => state.conversation;
export const selectConversations = (state: SupabaseChatState) => state.conversations;
export const selectMessages = (state: SupabaseChatState) => state.messages;
export const selectError = (state: SupabaseChatState) => state.error;
export const selectIsLoadingMessages = (state: SupabaseChatState) => state.isLoadingMessages;
export const selectSubscriptionActive = (state: SupabaseChatState) => state.subscriptionActive;
export const selectPresenceState = (state: SupabaseChatState) => state.presenceState;
export const selectCurrentUserId = (state: SupabaseChatState) => state.currentUserId;
export const selectCurrentUserRole = (state: SupabaseChatState) => state.currentUserRole;
export const selectUnreadCounts = (state: SupabaseChatState) => state.unreadCounts;
export const selectMessageReadStatus = (state: SupabaseChatState) => state.messageReadStatus;
export const selectUnreadCountForConversation = (conversationId: string) =>
  (state: SupabaseChatState) => state.unreadCounts[conversationId] || 0;
