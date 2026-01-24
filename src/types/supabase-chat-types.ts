// Supabase Chat Types for Web App

export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_role: 'patient' | 'doctor' | 'system';
  content: string;
  message_type: 'text' | 'system' | 'attachment' | 'doctor_handoff';
  attachments: Attachment[];
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
};

export type Attachment = {
  id?: string;
  type: string;
  file_name: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  thumbnail_path?: string;
  url?: string;
};

export type Conversation = {
  id: string;
  channel_id: string;
  type: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  last_message_at: string | null;
  metadata: Record<string, unknown>;
};

export type Participant = {
  id: string;
  conversation_id: string;
  user_id: string;
  user_role: 'patient' | 'doctor';
  is_active: boolean;
  joined_at: string;
  left_at: string | null;
};

export type PresenceState = {
  [userId: string]: {
    status: 'online' | 'offline' | 'away';
    lastSeen: string;
  };
};

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export type ConversationWithDetails = Conversation & {
  participants: Participant[];
  lastMessage?: Message;
  patientId?: string;
  patientName?: string;
};

export type TokenResponse = {
  token: string;
  expiresAt: string;
  user: {
    id: string;
    name: string;
    role: 'patient' | 'doctor';
    subscriptionActive: boolean;
  };
};

// Message status for optimistic UI
export type MessageStatus = 'sending' | 'sent' | 'failed';

// Local message extends Message with status tracking
export type LocalMessage = Message & {
  localId: string;        // Temporary ID before server confirms
  status: MessageStatus;  // Track send status
  error?: string;         // Error message if failed
};

// Unread message tracking
export type UnreadState = {
  [conversationId: string]: number;
};

// Read status for messages (for checkmarks)
export type MessageReadStatus = {
  message_id: string;
  is_read: boolean;
  read_at: string | null;
};

// Extended message with read status
export type MessageWithReadStatus = Message & {
  isRead?: boolean;
  readAt?: string | null;
};

export type SupabaseChatState = {
  // State
  connectionStatus: ConnectionStatus;
  conversation: Conversation | null;
  conversations: ConversationWithDetails[];
  messages: LocalMessage[];
  participants: Participant[];
  presenceState: PresenceState;
  error: string | null;
  isLoadingMessages: boolean;
  currentUserId: string | null;
  currentUserRole: 'patient' | 'doctor' | null;
  subscriptionActive: boolean;
  // Unread message state
  unreadCounts: UnreadState;
  messageReadStatus: { [messageId: string]: boolean };

  // Actions
  connect: (userId: string, userName: string, userRole: 'patient' | 'doctor') => Promise<void>;
  disconnect: () => Promise<void>;
  loadPatientConversation: () => Promise<void>;
  loadDoctorConversations: () => Promise<void>;
  selectConversation: (conversation: ConversationWithDetails) => Promise<void>;
  loadMessages: (conversationId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  addMessage: (message: Message) => void;
  addOptimisticMessage: (message: LocalMessage) => void;
  updateMessageStatus: (localId: string, status: MessageStatus, serverMessage?: Message | null, error?: string) => void;
  retryMessage: (localId: string) => Promise<void>;
  updatePresenceState: (userId: string, status: 'online' | 'offline') => void;
  clearError: () => void;
  reset: () => void;
  // Unread message actions
  fetchUnreadCounts: () => Promise<void>;
  markConversationAsRead: (conversationId: string) => Promise<void>;
  updateUnreadCount: (conversationId: string, count: number) => void;
  fetchMessageReadStatus: (messageIds: string[], recipientId: string) => Promise<void>;
};
