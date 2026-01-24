import { RealtimeChannel } from "@supabase/supabase-js";
import {
  getSupabaseClient,
  setSupabaseAccessToken,
  clearSupabaseSession,
} from "../lib/supabase";
import { api } from "./api";
import type {
  Message,
  Conversation,
  Participant,
  ConversationWithDetails,
  TokenResponse,
} from "../types/supabase-chat-types";

type MessageCallback = (message: Message) => void;
type PresenceCallback = (userId: string, status: "online" | "offline") => void;

class SupabaseChatService {
  private messageChannel: RealtimeChannel | null = null;
  private presenceChannel: RealtimeChannel | null = null;
  private currentConversationId: string | null = null;
  private currentUserId: string | null = null;
  private isRefreshing = false;
  private refreshPromise: Promise<void> | null = null;
  private tokenRefreshTimer: ReturnType<typeof setTimeout> | null = null;

  // Store callbacks for re-subscribing after token refresh
  private messageCallback: MessageCallback | null = null;
  private presenceCallback: PresenceCallback | null = null;
  private presenceUserData: { userId: string; name: string } | null = null;

  // Visibility handling for token refresh on tab focus
  private tokenExpiresAt: number | null = null;
  private visibilityHandler: (() => void) | null = null;

  /**
   * Initialize the chat service by getting a token from the server
   */
  async initialize(
    userId: string,
    _userRole: "patient" | "doctor"
  ): Promise<TokenResponse> {
    try {
      // Get Supabase JWT from our server
      const response = await api.post<TokenResponse>(
        "/api/supabase-chat/token"
      );
      const { token, expiresAt, user } = response.data;

      // Set the token in Supabase client
      await setSupabaseAccessToken(token);

      this.currentUserId = userId;

      // Store token expiry for visibility-based refresh
      this.tokenExpiresAt = new Date(expiresAt).getTime();

      // Schedule proactive token refresh before expiry
      this.scheduleTokenRefresh(expiresAt);

      // Start listening for tab visibility changes
      this.startVisibilityListener();

      return { token, expiresAt, user };
    } catch (error) {
      console.error("Failed to initialize Supabase chat:", error);
      throw error;
    }
  }

  /**
   * Schedule proactive token refresh before expiry
   * Refreshes at 80% of token lifetime to ensure continuous connection
   */
  private scheduleTokenRefresh(expiresAt: string): void {
    // Clear any existing timer
    if (this.tokenRefreshTimer) {
      clearTimeout(this.tokenRefreshTimer);
      this.tokenRefreshTimer = null;
    }

    const expiresAtMs = new Date(expiresAt).getTime();
    const nowMs = Date.now();
    const tokenLifetimeMs = expiresAtMs - nowMs;

    // Refresh at 80% of token lifetime (or minimum 10 seconds before expiry)
    const refreshInMs = Math.max(tokenLifetimeMs * 0.8, tokenLifetimeMs - 10000);

    if (refreshInMs > 0) {
      console.log(`Scheduling proactive token refresh in ${Math.round(refreshInMs / 1000)} seconds`);

      this.tokenRefreshTimer = setTimeout(async () => {
        console.log("Proactive token refresh triggered");
        try {
          await this.refreshToken();
        } catch (error) {
          console.error("Proactive token refresh failed:", error);
        }
      }, refreshInMs);
    }
  }

  /**
   * Handle visibility change - refresh token when tab becomes visible
   */
  private handleVisibilityChange = (): void => {
    if (!document.hidden && this.currentUserId) {
      console.log("Tab became visible - checking token validity");
      this.checkAndRefreshTokenOnResume();
    }
  };

  /**
   * Check token validity and refresh if needed when returning to tab
   */
  private async checkAndRefreshTokenOnResume(): Promise<void> {
    if (!this.tokenExpiresAt) {
      return;
    }

    const timeUntilExpiry = this.tokenExpiresAt - Date.now();
    const REFRESH_THRESHOLD = 60 * 1000; // 1 minute buffer

    if (timeUntilExpiry < REFRESH_THRESHOLD) {
      console.log(`Token ${timeUntilExpiry < 0 ? "expired" : "expiring soon"}, refreshing...`);
      try {
        await this.refreshToken();
      } catch (error) {
        console.error("Token refresh on visibility change failed:", error);
      }
    } else {
      console.log("Token still valid, re-subscribing to channels");
      this.resubscribeToChannels();
    }
  }

  /**
   * Start listening for visibility changes
   */
  private startVisibilityListener(): void {
    if (this.visibilityHandler) {
      return; // Already listening
    }
    this.visibilityHandler = this.handleVisibilityChange;
    document.addEventListener("visibilitychange", this.visibilityHandler);
    console.log("Started visibility listener for token refresh");
  }

  /**
   * Stop listening for visibility changes
   */
  private stopVisibilityListener(): void {
    if (this.visibilityHandler) {
      document.removeEventListener("visibilitychange", this.visibilityHandler);
      this.visibilityHandler = null;
      console.log("Stopped visibility listener");
    }
  }

  /**
   * Check if error is a JWT expired error
   */
  private isTokenExpiredError(error: any): boolean {
    return (
      error?.code === "PGRST303" ||
      error?.message?.toLowerCase().includes("jwt expired") ||
      error?.message?.toLowerCase().includes("token expired")
    );
  }

  /**
   * Refresh the Supabase token from the server
   * Ensures only one refresh happens at a time
   */
  async refreshToken(): Promise<void> {
    // If already refreshing, wait for that to complete
    if (this.isRefreshing && this.refreshPromise) {
      console.log("Token refresh already in progress, waiting...");
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    console.log("Starting token refresh...");

    this.refreshPromise = (async () => {
      try {
        // Request new token from server
        const response = await api.post<TokenResponse>("/api/supabase-chat/token");
        const { token, expiresAt } = response.data;

        // Update Supabase client with new token (this recreates the client)
        await setSupabaseAccessToken(token);

        // Update stored token expiry
        this.tokenExpiresAt = new Date(expiresAt).getTime();

        // Re-subscribe to channels with the new client (await to ensure proper cleanup)
        await this.resubscribeToChannels();

        // Schedule the next proactive refresh
        this.scheduleTokenRefresh(expiresAt);

        console.log("Token refresh successful");
      } catch (error) {
        console.error("Token refresh failed:", error);
        throw error;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  /**
   * Re-subscribe to realtime channels after token refresh
   */
  private async resubscribeToChannels(): Promise<void> {
    if (this.currentConversationId) {
      console.log("Re-subscribing to channels after token refresh...");

      // Re-subscribe to messages (await to ensure old subscription is cleaned up first)
      if (this.messageCallback) {
        await this.subscribeToMessages(this.currentConversationId, this.messageCallback);
      }

      // Re-subscribe to presence
      if (this.presenceCallback && this.presenceUserData) {
        this.subscribeToPresence(
          this.currentConversationId,
          this.presenceUserData,
          this.presenceCallback
        );
      }

      console.log("Re-subscribed to channels successfully");
    }
  }

  /**
   * Send a message with automatic token refresh on expiry
   */
  async sendMessageWithRetry(
    conversationId: string,
    content: string,
    senderId: string,
    senderRole: "patient" | "doctor"
  ): Promise<Message> {
    try {
      // First attempt
      return await this.sendMessage(conversationId, content, senderId, senderRole);
    } catch (error) {
      if (this.isTokenExpiredError(error)) {
        console.log("Token expired, refreshing before retry...");

        // WAIT for token refresh to complete - do NOT proceed until done
        await this.refreshToken();

        // Only retry AFTER refresh is confirmed complete
        console.log("Token refreshed, retrying message send...");
        return await this.sendMessage(conversationId, content, senderId, senderRole);
      }
      throw error;
    }
  }

  /**
   * Helper for other operations that need token refresh
   */
  async withTokenRefresh<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (this.isTokenExpiredError(error)) {
        await this.refreshToken(); // Wait for refresh
        return await operation(); // Then retry
      }
      throw error;
    }
  }

  /**
   * Disconnect from chat
   */
  async disconnect(): Promise<void> {
    try {
      // Stop visibility listener
      this.stopVisibilityListener();

      // Clear token refresh timer
      if (this.tokenRefreshTimer) {
        clearTimeout(this.tokenRefreshTimer);
        this.tokenRefreshTimer = null;
      }

      // Unsubscribe from channels
      if (this.messageChannel) {
        await this.messageChannel.unsubscribe();
        this.messageChannel = null;
      }

      if (this.presenceChannel) {
        await this.presenceChannel.unsubscribe();
        this.presenceChannel = null;
      }

      // Clear session
      await clearSupabaseSession();

      this.currentConversationId = null;
      this.currentUserId = null;
      this.tokenExpiresAt = null;
    } catch (error) {
      console.error("Failed to disconnect from Supabase chat:", error);
    }
  }

  /**
   * Get patient's conversation
   */
  async getPatientConversation(): Promise<{
    conversation: Conversation;
    participants: Participant[];
  } | null> {
    try {
      const response = await api.get("/api/supabase-chat/conversation");
      const { conversation, participants } = response.data;

      if (conversation) {
        this.currentConversationId = conversation.id;
      }

      return conversation ? { conversation, participants } : null;
    } catch (error: any) {
      if (
        error.response?.status === 400 &&
        error.response?.data?.error?.includes("No doctor assigned")
      ) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Get doctor's conversations
   */
  async getDoctorConversations(): Promise<ConversationWithDetails[]> {
    try {
      const response = await api.get("/api/supabase-chat/conversations");
      return response.data.conversations || [];
    } catch (error) {
      console.error("Failed to get doctor conversations:", error);
      throw error;
    }
  }

  /**
   * Load messages for a conversation
   */
  async loadMessages(conversationId: string, limit = 50): Promise<Message[]> {
    try {
      const supabase = getSupabaseClient();

      const { data: messages, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .eq("is_deleted", false)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;

      this.currentConversationId = conversationId;

      // Return messages in chronological order (oldest first)
      return (messages || []).reverse();
    } catch (error) {
      console.error("Failed to load messages:", error);
      throw error;
    }
  }

  /**
   * Send a message using optimized RPC function
   * This replaces REST API insert with a single RPC call
   * The database trigger will broadcast the message to all clients
   */
  async sendMessage(
    conversationId: string,
    content: string,
    senderId: string,
    senderRole: "patient" | "doctor"
  ): Promise<Message> {
    try {
      const supabase = getSupabaseClient();

      // Use RPC function for optimized message sending
      const { data, error } = await supabase.rpc("send_chat_message", {
        p_conversation_id: conversationId,
        p_sender_id: senderId,
        p_sender_role: senderRole,
        p_content: content,
        p_message_type: "text",
      });

      if (error) throw error;

      // The RPC returns JSONB, so we need to parse it as Message
      return data as Message;
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  }

  /**
   * Subscribe to new messages in a conversation
   * Uses optimized channel naming (chat:{conversationId}) and combines
   * broadcast events with postgres_changes for maximum compatibility
   */
  async subscribeToMessages(
    conversationId: string,
    onMessage: MessageCallback
  ): Promise<RealtimeChannel> {
    const supabase = getSupabaseClient();

    // Store callback for re-subscribing after token refresh
    this.messageCallback = onMessage;

    // Unsubscribe from previous channel if exists - MUST await to prevent duplicate subscriptions
    if (this.messageChannel) {
      await this.messageChannel.unsubscribe();
      this.messageChannel = null;
    }

    console.log("Setting up optimized message subscription for:", conversationId);

    // Use optimized channel name format: chat:{conversationId}
    this.messageChannel = supabase
      .channel(`chat:${conversationId}`, {
        config: {
          broadcast: { self: false }, // Don't receive own broadcasts
        },
      })
      // Listen for broadcast events (from Edge Functions or other clients)
      .on("broadcast", { event: "new_message" }, (payload) => {
        console.log("Received broadcast message:", payload);
        if (payload.payload && typeof payload.payload === "object") {
          const message = payload.payload as Message;
          onMessage(message);
        }
      })
      // Also listen for postgres_changes as fallback/compatibility
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          console.log("Received postgres_changes message:", payload);
          const message = payload.new as Message;
          onMessage(message);
        }
      )
      .subscribe((status, err) => {
        console.log("Message channel status:", status, err);
        if (err) {
          console.error("Message subscription error:", err);
        }
      });

    return this.messageChannel;
  }

  /**
   * Subscribe to presence (online/offline status)
   */
  subscribeToPresence(
    conversationId: string,
    userData: { userId: string; name: string },
    onPresence: PresenceCallback
  ): RealtimeChannel {
    const supabase = getSupabaseClient();

    // Store callback and data for re-subscribing after token refresh
    this.presenceCallback = onPresence;
    this.presenceUserData = userData;

    // Unsubscribe from previous channel if exists
    if (this.presenceChannel) {
      this.presenceChannel.unsubscribe();
    }

    this.presenceChannel = supabase.channel(`presence:${conversationId}`, {
      config: {
        presence: { key: userData.userId },
      },
    });

    this.presenceChannel
      .on("presence", { event: "join" }, ({ newPresences }) => {
        newPresences.forEach((presence: any) => {
          onPresence(presence.userId, "online");
        });
      })
      .on("presence", { event: "leave" }, ({ leftPresences }) => {
        leftPresences.forEach((presence: any) => {
          onPresence(presence.userId, "offline");
        });
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await this.presenceChannel?.track({
            userId: userData.userId,
            name: userData.name,
            online_at: new Date().toISOString(),
          });
        }
      });

    return this.presenceChannel;
  }

  /**
   * Mark message as read
   */
  async markAsRead(messageId: string, userId: string): Promise<void> {
    try {
      const supabase = getSupabaseClient();

      await supabase.from("message_read_receipts").upsert({
        message_id: messageId,
        user_id: userId,
        read_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Failed to mark message as read:", error);
    }
  }

  /**
   * Get unread count for a specific conversation
   */
  async getUnreadCount(conversationId: string, userId: string): Promise<number> {
    try {
      const supabase = getSupabaseClient();

      const { data, error } = await supabase.rpc("get_unread_count", {
        p_conversation_id: conversationId,
        p_user_id: userId,
      });

      if (error) throw error;
      return data || 0;
    } catch (error) {
      console.error("Failed to get unread count:", error);
      return 0;
    }
  }

  /**
   * Get unread counts for all conversations
   */
  async getAllUnreadCounts(userId: string): Promise<{ [conversationId: string]: number }> {
    try {
      const supabase = getSupabaseClient();

      const { data, error } = await supabase.rpc("get_all_unread_counts", {
        p_user_id: userId,
      });

      if (error) throw error;

      // Convert array to object
      const counts: { [conversationId: string]: number } = {};
      if (data) {
        data.forEach((item: { conversation_id: string; unread_count: number }) => {
          counts[item.conversation_id] = item.unread_count;
        });
      }
      return counts;
    } catch (error) {
      console.error("Failed to get all unread counts:", error);
      return {};
    }
  }

  /**
   * Mark all messages in a conversation as read
   */
  async markConversationAsRead(conversationId: string, userId: string): Promise<number> {
    try {
      const supabase = getSupabaseClient();

      const { data, error } = await supabase.rpc("mark_messages_as_read", {
        p_conversation_id: conversationId,
        p_user_id: userId,
      });

      if (error) throw error;
      return data || 0;
    } catch (error) {
      console.error("Failed to mark conversation as read:", error);
      return 0;
    }
  }

  /**
   * Get read status for multiple messages (for displaying checkmarks)
   */
  async getMessagesReadStatus(
    messageIds: string[],
    recipientId: string
  ): Promise<{ [messageId: string]: { isRead: boolean; readAt: string | null } }> {
    try {
      const supabase = getSupabaseClient();

      const { data, error } = await supabase.rpc("get_messages_read_status", {
        p_message_ids: messageIds,
        p_recipient_id: recipientId,
      });

      if (error) throw error;

      // Convert array to object
      const status: { [messageId: string]: { isRead: boolean; readAt: string | null } } = {};
      if (data) {
        data.forEach((item: { message_id: string; is_read: boolean; read_at: string | null }) => {
          status[item.message_id] = {
            isRead: item.is_read,
            readAt: item.read_at,
          };
        });
      }
      return status;
    } catch (error) {
      console.error("Failed to get messages read status:", error);
      return {};
    }
  }

  /**
   * Subscribe to read receipt updates for real-time checkmarks
   */
  subscribeToReadReceipts(
    conversationId: string,
    onReadReceipt: (messageId: string, userId: string) => void
  ): RealtimeChannel {
    const supabase = getSupabaseClient();

    return supabase
      .channel(`read-receipts:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "message_read_receipts",
        },
        (payload) => {
          const receipt = payload.new as { message_id: string; user_id: string };
          onReadReceipt(receipt.message_id, receipt.user_id);
        }
      )
      .subscribe();
  }

  /**
   * Get current conversation ID
   */
  getCurrentConversationId(): string | null {
    return this.currentConversationId;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.currentUserId !== null;
  }
}

// Export singleton instance
export const supabaseChatService = new SupabaseChatService();
