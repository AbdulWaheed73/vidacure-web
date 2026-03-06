import axios from "axios";
import { getChatSocket, disconnectChatSocket, getChatUrl } from "../lib/chatSocket";
import type {
  Message,
  Conversation,
  ConversationWithDetails,
  SendMessagePayload,
  MessagesSeenEvent,
  UnreadUpdateEvent,
  DoctorReassignedEvent,
  UnreadState,
} from "../types/chat-types";

// Create a separate axios instance for the chat server
const chatApi = axios.create({
  baseURL: getChatUrl(),
  withCredentials: true,
  timeout: 10000,
});

// Copy CSRF token from main api headers
chatApi.interceptors.request.use((config) => {
  const csrfToken = localStorage.getItem("csrfToken");
  if (csrfToken) {
    config.headers["x-csrf-token"] = csrfToken;
  }
  config.headers["x-client"] = "web";
  return config;
});

type MessageCallback = (message: Message) => void;
type SeenCallback = (event: MessagesSeenEvent) => void;
type UnreadCallback = (event: UnreadUpdateEvent) => void;
type ReassignCallback = (event: DoctorReassignedEvent) => void;

// Module-level state
let currentUserId: string | null = null;
let messageCallback: MessageCallback | null = null;
let seenCallback: SeenCallback | null = null;
let unreadCallback: UnreadCallback | null = null;
let reassignCallback: ReassignCallback | null = null;

function connect(userId: string, userRole: "patient" | "doctor"): Promise<void> {
  return new Promise((resolve, reject) => {
    currentUserId = userId;

    const socket = getChatSocket();
    socket.removeAllListeners();

    const onConnect = () => {
      console.log("Chat socket connected");
      socket.emit("rejoin", { userId, role: userRole });
      resolve();
    };

    const onConnectError = (error: Error) => {
      console.error("Chat socket connection error:", error);
      socket.off("connect", onConnect);
      reject(error);
    };

    socket.once("connect", onConnect);
    socket.once("connect_error", onConnectError);

    // Persistent listeners for reconnection
    socket.on("connect", () => {
      console.log("Chat socket reconnected");
      socket.emit("rejoin", { userId, role: userRole });
    });

    socket.on("new_message", (message: Message) => {
      if (message.senderId !== currentUserId) {
        messageCallback?.(message);
      }
    });

    socket.on("messages_seen", (event: MessagesSeenEvent) => {
      seenCallback?.(event);
    });

    socket.on("unread_update", (event: UnreadUpdateEvent) => {
      unreadCallback?.(event);
    });

    socket.on("doctor_reassigned", (event: DoctorReassignedEvent) => {
      reassignCallback?.(event);
    });

    socket.connect();
  });
}

function disconnect(): void {
  messageCallback = null;
  seenCallback = null;
  unreadCallback = null;
  reassignCallback = null;
  currentUserId = null;
  disconnectChatSocket();
}

function onNewMessage(callback: MessageCallback): void {
  messageCallback = callback;
}

function onMessagesSeen(callback: SeenCallback): void {
  seenCallback = callback;
}

function onUnreadUpdate(callback: UnreadCallback): void {
  unreadCallback = callback;
}

function onDoctorReassigned(callback: ReassignCallback): void {
  reassignCallback = callback;
}

function sendMessage(
  conversationId: string,
  content: string,
  clientOffset: string
): Promise<Message> {
  const socket = getChatSocket();

  const payload: SendMessagePayload = {
    conversationId,
    content,
    clientOffset,
  };

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Message send timed out"));
    }, 10000);

    socket.emit(
      "send_message",
      payload,
      (response: { ok: boolean; message?: Message; error?: string }) => {
        clearTimeout(timeout);
        if (response.ok && response.message) {
          resolve(response.message);
        } else {
          reject(new Error(response.error || "Failed to send message"));
        }
      }
    );
  });
}

function markSeen(conversationId: string): void {
  const socket = getChatSocket();
  socket.emit("mark_seen", { conversationId });
}

function joinConversation(conversationId: string): void {
  const socket = getChatSocket();
  socket.emit("join_conversation", { conversationId });
}

async function getPatientConversation(): Promise<{
  conversation: Conversation;
  doctorName?: string;
} | null> {
  const response = await chatApi.get("/api/chat/conversation");
  const { conversation, doctorName } = response.data;
  return conversation ? { conversation, doctorName } : null;
}

async function getDoctorConversations(): Promise<ConversationWithDetails[]> {
  const response = await chatApi.get("/api/chat/conversations");
  return response.data.conversations || [];
}

async function getMessages(
  conversationId: string,
  limit = 15,
  before?: string
): Promise<Message[]> {
  const params: Record<string, unknown> = { limit };
  if (before) params.before = before;

  const response = await chatApi.get(
    `/api/chat/messages/${conversationId}`,
    { params }
  );
  return response.data.messages || [];
}

async function getUnreadCounts(): Promise<UnreadState> {
  const response = await chatApi.get("/api/chat/unread-counts");
  return response.data.counts || {};
}

function isConnected(): boolean {
  const socket = getChatSocket();
  return socket.connected;
}

export const chatService = {
  connect,
  disconnect,
  onNewMessage,
  onMessagesSeen,
  onUnreadUpdate,
  onDoctorReassigned,
  sendMessage,
  markSeen,
  joinConversation,
  getPatientConversation,
  getDoctorConversations,
  getMessages,
  getUnreadCounts,
  isConnected,
};
