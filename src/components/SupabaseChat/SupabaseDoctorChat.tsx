import React, { useEffect, useState } from 'react';
import { Loader2, AlertCircle, MessageSquare, Search, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import {
  useSupabaseChatStore,
  selectConnectionStatus,
  selectConversation,
  selectConversations,
  selectMessages,
  selectError,
  selectIsLoadingMessages,
  selectCurrentUserId,
  selectUnreadCounts,
  selectMessageReadStatus,
} from '../../stores/supabaseChatStore';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import type { ConversationWithDetails } from '../../types/supabase-chat-types';

export const SupabaseDoctorChat: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Supabase chat store
  const connectionStatus = useSupabaseChatStore(selectConnectionStatus);
  const conversation = useSupabaseChatStore(selectConversation);
  const conversations = useSupabaseChatStore(selectConversations);
  const messages = useSupabaseChatStore(selectMessages);
  const error = useSupabaseChatStore(selectError);
  const isLoadingMessages = useSupabaseChatStore(selectIsLoadingMessages);
  const currentUserId = useSupabaseChatStore(selectCurrentUserId);
  const unreadCounts = useSupabaseChatStore(selectUnreadCounts);
  const messageReadStatus = useSupabaseChatStore(selectMessageReadStatus);
  const {
    connect,
    disconnect,
    sendMessage,
    clearError,
    selectConversation: selectConv,
  } = useSupabaseChatStore();

  // Initialize chat
  useEffect(() => {
    const initChat = async () => {
      if (!isAuthenticated || !user || user.role !== 'doctor') {
        setIsInitializing(false);
        return;
      }

      try {
        if (connectionStatus === 'disconnected') {
          await connect(user.userId, user.name, 'doctor');
        }
      } catch (err) {
        console.error('Failed to initialize chat:', err);
      } finally {
        setIsInitializing(false);
      }
    };

    initChat();

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
      await connect(user.userId, user.name, 'doctor');
    }
  };

  const handleSendMessage = (content: string) => {
    sendMessage(content);
  };

  const handleSelectConversation = (conv: ConversationWithDetails) => {
    selectConv(conv);
  };

  // Filter conversations by search
  const filteredConversations = searchQuery.trim()
    ? conversations.filter((conv) =>
        conv.patientName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conversations;

  // Loading state
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <Loader2 className="w-10 h-10 text-[#00a38a] animate-spin" />
      </div>
    );
  }

  // Not authenticated or not doctor
  if (!isAuthenticated || !user || user.role !== 'doctor') {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="mt-4 text-lg font-semibold text-gray-900">Access Denied</p>
        <p className="mt-2 text-gray-500">Doctor access required</p>
      </div>
    );
  }

  // Connecting
  if (connectionStatus === 'connecting') {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <Loader2 className="w-10 h-10 text-[#00a38a] animate-spin" />
      </div>
    );
  }

  // Error
  if (connectionStatus === 'error' || error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 px-8">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="mt-4 text-lg font-semibold text-red-600">Connection Error</p>
        <p className="mt-2 text-gray-500 text-center">{error || 'Failed to connect'}</p>
        <button
          onClick={handleRetry}
          className="mt-4 px-6 py-2 bg-[#00a38a] text-white rounded-lg hover:bg-[#008f79]"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-gray-50">
      {/* Sidebar - Patient list */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Patient Chats</h2>
          <div className="mt-3 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#00a38a]/20"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-4 py-8">
              <MessageSquare className="w-10 h-10 text-gray-300" />
              <p className="mt-3 text-sm text-gray-500 text-center">
                {searchQuery ? 'No matches found' : 'No patients assigned'}
              </p>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const unreadCount = unreadCounts[conv.id] || 0;
              return (
                <button
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`w-full flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    conversation?.id === conv.id ? 'bg-[#00a38a]/5' : ''
                  }`}
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-[#c0ebe5] rounded-full flex items-center justify-center text-[#00a38a] font-semibold">
                      {conv.patientName?.charAt(0).toUpperCase() || 'P'}
                    </div>
                    {/* Unread badge */}
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-[#00a38a] text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 ml-3 text-left">
                    <div className="flex items-center justify-between">
                      <p className={`font-medium ${unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
                        {conv.patientName || 'Patient'}
                      </p>
                    </div>
                    <p className={`text-sm truncate ${unreadCount > 0 ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>
                      {conv.lastMessage?.content || 'No messages yet'}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {conversation ? (
          <>
            {/* Chat header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {conversations.find((c) => c.id === conversation.id)?.patientName || 'Patient'}
              </h3>
              <div className="flex items-center mt-1">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                <span className="text-sm text-gray-500">Active conversation</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-hidden">
              <MessageList
                messages={messages}
                currentUserId={currentUserId || ''}
                currentUserRole="doctor"
                isLoading={isLoadingMessages}
                messageReadStatus={messageReadStatus}
              />
            </div>

            {/* Input */}
            <MessageInput
              onSendMessage={handleSendMessage}
              disabled={connectionStatus !== 'connected'}
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
            <MessageSquare className="w-12 h-12 text-gray-300" />
            <p className="mt-4 text-gray-500">Select a patient to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupabaseDoctorChat;
