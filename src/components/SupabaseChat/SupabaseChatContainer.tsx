import React, { useEffect, useState } from 'react';
import { Loader2, AlertCircle, MessageSquare } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import {
  useSupabaseChatStore,
  selectConnectionStatus,
  selectConversation,
  selectMessages,
  selectError,
  selectIsLoadingMessages,
  selectSubscriptionActive,
  selectCurrentUserId,
  selectCurrentUserRole,
  selectMessageReadStatus,
} from '../../stores/supabaseChatStore';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

export const SupabaseChatContainer: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  // Supabase chat store
  const connectionStatus = useSupabaseChatStore(selectConnectionStatus);
  const conversation = useSupabaseChatStore(selectConversation);
  const messages = useSupabaseChatStore(selectMessages);
  const error = useSupabaseChatStore(selectError);
  const isLoadingMessages = useSupabaseChatStore(selectIsLoadingMessages);
  const subscriptionActive = useSupabaseChatStore(selectSubscriptionActive);
  const currentUserId = useSupabaseChatStore(selectCurrentUserId);
  const currentUserRole = useSupabaseChatStore(selectCurrentUserRole);
  const messageReadStatus = useSupabaseChatStore(selectMessageReadStatus);
  const { connect, disconnect, sendMessage, clearError } = useSupabaseChatStore();

  // Initialize chat
  useEffect(() => {
    const initChat = async () => {
      if (!isAuthenticated || !user) {
        setIsInitializing(false);
        return;
      }

      try {
        if (connectionStatus === 'disconnected') {
          await connect(user.userId, user.name, user.role as 'patient' | 'doctor');
        }
      } catch (err) {
        console.error('Failed to initialize chat:', err);
      } finally {
        setIsInitializing(false);
      }
    };

    initChat();

    // Cleanup on unmount
    return () => {
      if (connectionStatus === 'connected') {
        disconnect().catch(console.error);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.userId]);

  const handleRetry = async () => {
    if (user) {
      clearError();
      await connect(user.userId, user.name, user.role as 'patient' | 'doctor');
    }
  };

  const handleSendMessage = (content: string) => {
    sendMessage(content);
  };

  // Loading state
  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50">
        <Loader2 className="w-10 h-10 text-[#00a38a] animate-spin" />
        <p className="mt-4 text-gray-500">Loading chat...</p>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="mt-4 text-lg font-semibold text-gray-900">Authentication Required</p>
        <p className="mt-2 text-gray-500">Please log in to access chat</p>
      </div>
    );
  }

  // Subscription required for patients
  if (user.role === 'patient' && !subscriptionActive && connectionStatus === 'connected') {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 px-8">
        <MessageSquare className="w-12 h-12 text-gray-400" />
        <p className="mt-4 text-lg font-semibold text-gray-900">Subscription Required</p>
        <p className="mt-2 text-gray-500 text-center">
          Please subscribe to access chat with your doctor
        </p>
      </div>
    );
  }

  // Connecting state
  if (connectionStatus === 'connecting') {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50">
        <Loader2 className="w-10 h-10 text-[#00a38a] animate-spin" />
        <p className="mt-4 text-gray-500">Connecting to chat...</p>
      </div>
    );
  }

  // Error state
  if (connectionStatus === 'error' || error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 px-8">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="mt-4 text-lg font-semibold text-red-600">Connection Error</p>
        <p className="mt-2 text-gray-500 text-center">{error || 'Failed to connect to chat'}</p>
        <button
          onClick={handleRetry}
          className="mt-4 px-6 py-2 bg-[#00a38a] text-white rounded-lg hover:bg-[#008f79] transition-colors"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  // No doctor assigned (for patients)
  if (user.role === 'patient' && !conversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 px-8">
        <MessageSquare className="w-12 h-12 text-gray-400" />
        <p className="mt-4 text-lg font-semibold text-gray-900">No Doctor Assigned</p>
        <p className="mt-2 text-gray-500 text-center">
          Please wait for a doctor to be assigned to your case.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h2 className="text-xl font-bold text-gray-900">Medical Chat</h2>
        <p className="text-sm text-gray-500">Secure communication with your doctor</p>
      </div>

      {/* Connection status */}
      {connectionStatus === 'connected' && (
        <div className="flex items-center bg-green-50 border-b border-green-100 px-4 py-2">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
          <span className="text-sm text-green-700">Connected</span>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <MessageList
          messages={messages}
          currentUserId={currentUserId || ''}
          currentUserRole={currentUserRole || 'patient'}
          isLoading={isLoadingMessages}
          messageReadStatus={messageReadStatus}
        />
      </div>

      {/* Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        disabled={connectionStatus !== 'connected'}
      />
    </div>
  );
};

export default SupabaseChatContainer;
