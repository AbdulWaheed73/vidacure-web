import { create } from "zustand";
import { chatService } from "../services/chatService";
import { queryClient } from "../lib/queryClient";
import type {
  Message,
  LocalMessage,
  MessageStatus,
  Conversation,
  ConversationWithDetails,
  ConnectionStatus,
  UnreadState,
  ChatState,
} from "../types/chat-types";

const initialState = {
  connectionStatus: "disconnected" as ConnectionStatus,
  conversation: null as Conversation | null,
  conversations: [] as ConversationWithDetails[],
  messages: [] as LocalMessage[],
  error: null as string | null,
  isLoadingMessages: false,
  currentUserId: null as string | null,
  currentUserRole: null as "patient" | "doctor" | null,
  subscriptionActive: false,
  doctorName: null as string | null,
  // Unread message state
  unreadCounts: {} as UnreadState,
  messageReadStatus: {} as { [messageId: string]: boolean },
  chatPageVisible: false,
  // Pagination state
  hasMoreMessages: true,
  isLoadingMoreMessages: false,
};

// Helper to convert Message to LocalMessage
const messageToLocalMessage = (message: Message): LocalMessage => ({
  ...message,
  localId: message.id,
  status: "sent" as MessageStatus,
});

export const useChatStore = create<ChatState>((set, get) => ({
  ...initialState,

  connect: async (
    userId: string,
    _userName: string,
    userRole: "patient" | "doctor"
  ) => {
    set({ error: null, connectionStatus: "connecting" });

    try {
      await chatService.connect(userId, userRole);

      // Wire up event listeners
      chatService.onNewMessage((message) => {
        const state = get();
        const isActiveConversation =
          state.conversation?.id === message.conversationId;

        // Update sidebar lastMessage for this conversation
        set((s) => ({
          conversations: s.conversations.map((conv) =>
            conv.id === message.conversationId
              ? {
                  ...conv,
                  lastMessage: message,
                  lastMessageAt: message.createdAt,
                }
              : conv
          ),
        }));

        if (isActiveConversation) {
          get().addMessage(message);
        } else {
          // Not viewing this conversation — increment unread count
          set((s) => ({
            unreadCounts: {
              ...s.unreadCounts,
              [message.conversationId]:
                (s.unreadCounts[message.conversationId] || 0) + 1,
            },
          }));
        }
      });

      chatService.onMessagesSeen((event) => {
        set((s) => {
          const newReadStatus = { ...s.messageReadStatus };
          event.messageIds.forEach((id) => {
            newReadStatus[id] = true;
          });
          return { messageReadStatus: newReadStatus };
        });
      });

      chatService.onUnreadUpdate((event) => {
        const state = get();
        // Ignore delta increments for the active conversation when chat is visible
        // — the message is already being auto-marked as read via addMessage
        if (
          event.count === -1 &&
          state.chatPageVisible &&
          state.conversation?.id === event.conversationId
        ) {
          return;
        }

        set((s) => ({
          unreadCounts: {
            ...s.unreadCounts,
            [event.conversationId]:
              event.count === -1
                ? (s.unreadCounts[event.conversationId] || 0) + 1
                : event.count,
          },
        }));
      });

      chatService.onDoctorReassigned(() => {
        // Reload conversations
        const state = get();
        if (state.currentUserRole === "patient") {
          state.loadPatientConversation();
        } else {
          state.loadDoctorConversations();
        }
      });

      set({
        connectionStatus: "connected",
        currentUserId: userId,
        currentUserRole: userRole,
        subscriptionActive: true, // Chat server doesn't check subscription — main server does via consent
        error: null,
      });

      // Auto-load conversations based on role
      if (userRole === "patient") {
        await get().loadPatientConversation();
      } else if (userRole === "doctor") {
        await get().loadDoctorConversations();
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to connect to chat";
      console.error("Failed to connect to chat:", error);
      set({
        connectionStatus: "error",
        error: errorMessage,
      });
    }
  },

  disconnect: async () => {
    set({ ...initialState });
    try {
      await chatService.disconnect();
    } catch (error) {
      console.error("Failed to disconnect from chat:", error);
    }
  },

  loadPatientConversation: async () => {
    const { connectionStatus } = get();
    if (connectionStatus !== "connected") return;

    try {
      const result = await chatService.getPatientConversation();

      if (get().connectionStatus === "connected") {
        if (result) {
          set({
            conversation: result.conversation,
            doctorName: result.doctorName || null,
            error: null,
          });

          await get().loadMessages(result.conversation.id);
          await get().markConversationAsRead(result.conversation.id);
        } else {
          set({ conversation: null, error: null });
        }
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to load conversation";
      if (get().connectionStatus === "connected") {
        console.error("Failed to load patient conversation:", error);
        set({ error: errorMessage });
      }
    }
  },

  loadDoctorConversations: async () => {
    const { connectionStatus } = get();
    if (connectionStatus !== "connected") return;

    try {
      const conversations = await chatService.getDoctorConversations();

      if (get().connectionStatus === "connected") {
        set({
          conversations,
          conversation: null,
          error: null,
        });

        await get().fetchUnreadCounts();
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to load conversations";
      if (get().connectionStatus === "connected") {
        console.error("Failed to load doctor conversations:", error);
        set({ error: errorMessage });
      }
    }
  },

  selectConversation: async (conversation: ConversationWithDetails) => {
    set({
      conversation,
      messages: [],
    });

    chatService.joinConversation(conversation.id);
    await get().loadMessages(conversation.id);
    await get().markConversationAsRead(conversation.id);
  },

  deselectConversation: () => {
    set({
      conversation: null,
      messages: [],
      hasMoreMessages: true,
    });
  },

  loadMessages: async (conversationId: string) => {
    set({ isLoadingMessages: true });

    try {
      const messages = await chatService.getMessages(conversationId, 15);
      const localMessages = messages.map(messageToLocalMessage);

      // Initialize read status from seenAt field on loaded messages
      const readStatus: { [messageId: string]: boolean } = {};
      for (const msg of messages) {
        if (msg.seenAt) {
          readStatus[msg.id] = true;
        }
      }

      set((s) => ({
        messages: localMessages,
        isLoadingMessages: false,
        hasMoreMessages: messages.length === 15,
        messageReadStatus: { ...s.messageReadStatus, ...readStatus },
        error: null,
      }));
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load messages";
      console.error("Failed to load messages:", error);
      set({
        isLoadingMessages: false,
        error: errorMessage,
      });
    }
  },

  sendMessage: async (content: string) => {
    const { conversation, currentUserId, currentUserRole } = get();

    if (!conversation || !currentUserId || !currentUserRole) {
      console.error("Cannot send message: missing conversation or user info");
      return;
    }

    // 1. Create optimistic message
    const localId = `local-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const optimisticMessage: LocalMessage = {
      id: localId,
      localId,
      conversationId: conversation.id,
      senderId: currentUserId,
      senderRole: currentUserRole,
      content,
      messageType: "text",
      seenAt: null,
      clientOffset: localId,
      createdAt: new Date().toISOString(),
      isDeleted: false,
      status: "sending",
    };

    // 2. Add to UI immediately
    get().addOptimisticMessage(optimisticMessage);

    try {
      // 3. Send with ACK
      const serverMessage = await chatService.sendMessage(
        conversation.id,
        content,
        localId
      );

      // 4. Replace optimistic with server message
      get().updateMessageStatus(localId, "sent", serverMessage);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to send message";
      console.error("Failed to send message:", error);
      get().updateMessageStatus(localId, "failed", null, errorMessage);
    }
  },

  addMessage: (message: Message) => {
    const { conversation } = get();

    set((state) => {
      const exists = state.messages.some(
        (m) => m.id === message.id || m.localId === message.id
      );
      if (exists) return state;

      const localMessage = messageToLocalMessage(message);

      const updatedConversations = state.conversations.map((conv) =>
        conv.id === message.conversationId
          ? {
              ...conv,
              lastMessage: message,
              lastMessageAt: message.createdAt,
            }
          : conv
      );

      return {
        messages: [...state.messages, localMessage],
        conversations: updatedConversations,
      };
    });

    // Auto-mark as read if user has this conversation open
    const { chatPageVisible } = get();
    if (
      chatPageVisible &&
      conversation?.id === message.conversationId
    ) {
      get().markConversationAsRead(message.conversationId);
    }
  },

  addOptimisticMessage: (message: LocalMessage) => {
    set((state) => {
      const updatedConversations = state.conversations.map((conv) =>
        conv.id === message.conversationId
          ? {
              ...conv,
              lastMessage: message as Message,
              lastMessageAt: message.createdAt,
            }
          : conv
      );

      return {
        messages: [...state.messages, message],
        conversations: updatedConversations,
      };
    });
  },

  updateMessageStatus: (
    localId: string,
    status: MessageStatus,
    serverMessage?: Message | null,
    error?: string
  ) => {
    set((state) => ({
      messages: state.messages.map((msg) => {
        if (msg.localId === localId) {
          if (status === "sent" && serverMessage) {
            return {
              ...serverMessage,
              localId,
              status: "sent" as MessageStatus,
            };
          }
          return { ...msg, status, error };
        }
        return msg;
      }),
    }));
  },

  retryMessage: async (localId: string) => {
    const { conversation, messages } = get();
    const message = messages.find((m) => m.localId === localId);

    if (!message || message.status !== "failed" || !conversation) return;

    get().updateMessageStatus(localId, "sending");

    try {
      const serverMessage = await chatService.sendMessage(
        conversation.id,
        message.content,
        localId
      );
      get().updateMessageStatus(localId, "sent", serverMessage);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to send message";
      get().updateMessageStatus(localId, "failed", null, errorMessage);
    }
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set({ ...initialState });
  },

  fetchUnreadCounts: async () => {
    const { currentUserId, connectionStatus } = get();
    if (connectionStatus !== "connected" || !currentUserId) return;

    try {
      const counts = await chatService.getUnreadCounts();
      set({ unreadCounts: counts });
    } catch (error) {
      console.error("Failed to fetch unread counts:", error);
    }
  },

  markConversationAsRead: async (conversationId: string) => {
    const { currentUserId } = get();
    if (!currentUserId) return;

    try {
      chatService.markSeen(conversationId);

      set((state) => ({
        unreadCounts: {
          ...state.unreadCounts,
          [conversationId]: 0,
        },
      }));

      queryClient.invalidateQueries({ queryKey: ["chatUnreadCounts"] });
    } catch (error) {
      console.error("Failed to mark conversation as read:", error);
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

  fetchMessageReadStatus: async (
    _messageIds: string[],
    _recipientId: string
  ) => {
    // Read status is handled via messages_seen socket event in real-time.
    // No separate fetch needed — seenAt is on the message itself.
  },

  loadOlderMessages: async () => {
    const { hasMoreMessages, isLoadingMoreMessages, messages, conversation } =
      get();

    if (
      !hasMoreMessages ||
      isLoadingMoreMessages ||
      messages.length === 0 ||
      !conversation
    )
      return;

    set({ isLoadingMoreMessages: true });

    try {
      const cursor = messages[0].createdAt;
      const olderMessages = await chatService.getMessages(
        conversation.id,
        15,
        cursor
      );
      const olderLocalMessages = olderMessages.map(messageToLocalMessage);

      const readStatus: { [messageId: string]: boolean } = {};
      for (const msg of olderMessages) {
        if (msg.seenAt) {
          readStatus[msg.id] = true;
        }
      }

      set((state) => ({
        messages: [...olderLocalMessages, ...state.messages],
        hasMoreMessages: olderMessages.length === 15,
        isLoadingMoreMessages: false,
        messageReadStatus: { ...state.messageReadStatus, ...readStatus },
      }));
    } catch (error) {
      console.error("Failed to load older messages:", error);
      set({ isLoadingMoreMessages: false });
    }
  },

  setChatPageVisible: (visible: boolean) => {
    set({ chatPageVisible: visible });
  },
}));

// Selectors — same names as supabaseChatStore for easy swap
export const selectConnectionStatus = (state: ChatState) =>
  state.connectionStatus;
export const selectConversation = (state: ChatState) => state.conversation;
export const selectConversations = (state: ChatState) => state.conversations;
export const selectMessages = (state: ChatState) => state.messages;
export const selectError = (state: ChatState) => state.error;
export const selectIsLoadingMessages = (state: ChatState) =>
  state.isLoadingMessages;
export const selectSubscriptionActive = (state: ChatState) =>
  state.subscriptionActive;
export const selectCurrentUserId = (state: ChatState) => state.currentUserId;
export const selectCurrentUserRole = (state: ChatState) =>
  state.currentUserRole;
export const selectDoctorName = (state: ChatState) => state.doctorName;
export const selectUnreadCounts = (state: ChatState) => state.unreadCounts;
export const selectMessageReadStatus = (state: ChatState) =>
  state.messageReadStatus;
export const selectUnreadCountForConversation =
  (conversationId: string) => (state: ChatState) =>
    state.unreadCounts[conversationId] || 0;
export const selectHasMoreMessages = (state: ChatState) =>
  state.hasMoreMessages;
export const selectIsLoadingMoreMessages = (state: ChatState) =>
  state.isLoadingMoreMessages;
