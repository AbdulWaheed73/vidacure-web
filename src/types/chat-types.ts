// Socket.IO Chat Types for Web App

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: "patient" | "doctor" | "system";
  content: string;
  messageType: "text" | "system";
  seenAt: string | null;
  clientOffset: string;
  createdAt: string;
  isDeleted: boolean;
};

export type Conversation = {
  id: string;
  patientId: string;
  doctorId: string;
  lastMessageAt: string | null;
  createdAt: string;
};

export type ConversationWithDetails = Conversation & {
  patientName?: string;
  doctorName?: string;
  lastMessage?: Message;
};

export type ConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "error";

// Message status for optimistic UI
export type MessageStatus = "sending" | "sent" | "failed";

// Local message extends Message with status tracking
export type LocalMessage = Message & {
  localId: string;
  status: MessageStatus;
  error?: string;
};

// Unread message tracking
export type UnreadState = {
  [conversationId: string]: number;
};

// Socket.IO event payloads
export type SendMessagePayload = {
  conversationId: string;
  content: string;
  clientOffset: string;
};

export type MessagesSeenEvent = {
  conversationId: string;
  seenByUserId: string;
  seenAt: string;
  messageIds: string[];
};

export type UnreadUpdateEvent = {
  conversationId: string;
  count: number;
};

export type DoctorReassignedEvent = {
  conversationId: string;
  newDoctorId: string;
};

export type ChatState = {
  // State
  connectionStatus: ConnectionStatus;
  conversation: Conversation | null;
  conversations: ConversationWithDetails[];
  messages: LocalMessage[];
  error: string | null;
  isLoadingMessages: boolean;
  currentUserId: string | null;
  currentUserRole: "patient" | "doctor" | null;
  subscriptionActive: boolean;
  doctorName: string | null;
  // Unread message state
  unreadCounts: UnreadState;
  messageReadStatus: { [messageId: string]: boolean };
  chatPageVisible: boolean;
  // Pagination state
  hasMoreMessages: boolean;
  isLoadingMoreMessages: boolean;

  // Actions
  connect: (
    userId: string,
    userName: string,
    userRole: "patient" | "doctor"
  ) => Promise<void>;
  disconnect: () => Promise<void>;
  loadPatientConversation: () => Promise<void>;
  loadDoctorConversations: () => Promise<void>;
  selectConversation: (conversation: ConversationWithDetails) => Promise<void>;
  deselectConversation: () => void;
  loadMessages: (conversationId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  addMessage: (message: Message) => void;
  addOptimisticMessage: (message: LocalMessage) => void;
  updateMessageStatus: (
    localId: string,
    status: MessageStatus,
    serverMessage?: Message | null,
    error?: string
  ) => void;
  retryMessage: (localId: string) => Promise<void>;
  clearError: () => void;
  reset: () => void;
  // Unread message actions
  fetchUnreadCounts: () => Promise<void>;
  markConversationAsRead: (conversationId: string) => Promise<void>;
  updateUnreadCount: (conversationId: string, count: number) => void;
  fetchMessageReadStatus: (
    messageIds: string[],
    recipientId: string
  ) => Promise<void>;
  setChatPageVisible: (visible: boolean) => void;
  // Pagination actions
  loadOlderMessages: () => Promise<void>;
};
