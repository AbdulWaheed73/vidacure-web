import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertCircle, MessageSquare, Search, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import {
  useChatStore,
  selectConnectionStatus,
  selectConversation,
  selectConversations,
  selectMessages,
  selectError,
  selectIsLoadingMessages,
  selectCurrentUserId,
  selectUnreadCounts,
  selectMessageReadStatus,
  selectHasMoreMessages,
  selectIsLoadingMoreMessages,
} from '../../stores/chatStore';
import { Skeleton } from '../ui/skeleton';
import { Input } from '../ui/input';
import { Button } from '../ui/Button';
import { Badge } from '../ui/badge';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import type { ConversationWithDetails } from '../../types/chat-types';

const formatTimeAgo = (dateString: string | null | undefined, t: (key: string) => string) => {
  if (!dateString) return '';
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return t('chat.now');
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const SupabaseDoctorChat: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { t } = useTranslation();
  const [isInitializing, setIsInitializing] = useState(true);
  const [hasLoadedConversations, setHasLoadedConversations] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const connectionStatus = useChatStore(selectConnectionStatus);
  const conversation = useChatStore(selectConversation);
  const conversations = useChatStore(selectConversations);
  const messages = useChatStore(selectMessages);
  const error = useChatStore(selectError);
  const isLoadingMessages = useChatStore(selectIsLoadingMessages);
  const currentUserId = useChatStore(selectCurrentUserId);
  const unreadCounts = useChatStore(selectUnreadCounts);
  const messageReadStatus = useChatStore(selectMessageReadStatus);
  const hasMoreMessages = useChatStore(selectHasMoreMessages);
  const isLoadingMoreMessages = useChatStore(selectIsLoadingMoreMessages);
  const {
    connect,
    sendMessage,
    clearError,
    selectConversation: selectConv,
    deselectConversation,
    setChatPageVisible,
    loadOlderMessages,
    retryMessage,
  } = useChatStore();

  // Track chat page visibility for read receipts
  useEffect(() => {
    setChatPageVisible(true);
    return () => setChatPageVisible(false);
  }, [setChatPageVisible]);

  useEffect(() => {
    const initChat = async () => {
      if (!isAuthenticated || !user || user.role !== 'doctor') {
        setIsInitializing(false);
        return;
      }

      try {
        const currentStatus = useChatStore.getState().connectionStatus;

        if (currentStatus === 'disconnected') {
          await connect(user.userId, user.name, 'doctor');
        } else if (currentStatus === 'connected') {
          const currentConversations = useChatStore.getState().conversations;
          if (currentConversations.length === 0) {
            await useChatStore.getState().loadDoctorConversations();
          }
        }
      } catch (err) {
        console.error('Failed to initialize chat:', err);
      } finally {
        setIsInitializing(false);
        setHasLoadedConversations(true);
      }
    };

    initChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.userId]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && conversation) {
        deselectConversation();
      }
    },
    [conversation, deselectConversation]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

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

  const filteredConversations = searchQuery.trim()
    ? conversations.filter((conv) =>
        conv.patientName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conversations;

  const DoctorChatSkeleton = () => (
    <div className="flex h-full gap-0 lg:gap-4 p-2 lg:p-4 bg-[#F0F7F4]">
      <div className="w-full lg:w-[380px] lg:shrink-0 bg-white rounded-2xl shadow-sm flex flex-col overflow-hidden">
        <div className="p-4">
          <Skeleton className="h-10 w-full rounded-full" />
        </div>
        <div className="flex-1 px-2 space-y-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-3.5">
              <Skeleton className="w-11 h-11 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-36" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="hidden lg:flex flex-1 bg-white rounded-2xl shadow-sm flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
        <div className="flex-1 px-6 py-4 space-y-5">
          <div className="flex flex-col items-start"><Skeleton className="h-11 w-[40%] rounded-2xl" /></div>
          <div className="flex flex-col items-end"><Skeleton className="h-11 w-[30%] rounded-2xl" /></div>
          <div className="flex flex-col items-start"><Skeleton className="h-16 w-[50%] rounded-2xl" /></div>
          <div className="flex flex-col items-end"><Skeleton className="h-11 w-[35%] rounded-2xl" /></div>
          <div className="flex flex-col items-start"><Skeleton className="h-11 w-[25%] rounded-2xl" /></div>
        </div>
        <div className="px-6 py-4">
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </div>
    </div>
  );

  if (isInitializing) {
    return <DoctorChatSkeleton />;
  }

  if (!isAuthenticated || !user || user.role !== 'doctor') {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <p className="mt-4 text-lg font-semibold">{t('chat.doctorAccessDenied')}</p>
        <p className="mt-2 text-sm text-muted-foreground">{t('chat.doctorAccessRequired')}</p>
      </div>
    );
  }

  if (connectionStatus === 'connecting') {
    return <DoctorChatSkeleton />;
  }

  if (connectionStatus === 'error' || error) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-8">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <p className="mt-4 text-lg font-semibold text-destructive">{t('chat.connectionError')}</p>
        <p className="mt-2 text-sm text-muted-foreground text-center">{error || t('chat.failedToConnect')}</p>
        <Button onClick={handleRetry} className="mt-4 bg-[#00a38a] hover:bg-[#008f79]">
          {t('chat.retry')}
        </Button>
      </div>
    );
  }

  const selectedPatientName = conversations.find((c) => c.id === conversation?.id)?.patientName || t('doctorDashboard.patient');

  const hasMobileConversation = !!conversation;

  return (
    <div className="flex h-full gap-0 lg:gap-4 p-2 lg:p-4 bg-[#F0F7F4]">
      {/* Sidebar - Patient list card */}
      <div className={`${hasMobileConversation ? 'hidden' : 'flex'} lg:flex w-full lg:w-[380px] lg:shrink-0 bg-white rounded-2xl shadow-sm flex-col overflow-hidden`}>
        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t('chat.searchPatients')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-full border-border bg-white"
            />
          </div>
        </div>

        {/* Patient list */}
        <div className="flex-1 overflow-y-auto px-2">
          {filteredConversations.length === 0 ? (
            !hasLoadedConversations && !searchQuery ? (
              <div className="space-y-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-3.5">
                    <Skeleton className="w-11 h-11 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-36" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full px-4 py-8">
                <MessageSquare className="w-10 h-10 text-muted-foreground/30" />
                <p className="mt-3 text-sm text-muted-foreground text-center">
                  {searchQuery ? t('chat.noMatchesFound') : t('chat.noPatientsAssigned')}
                </p>
              </div>
            )
          ) : (
            filteredConversations.map((conv) => {
              const unreadCount = unreadCounts[conv.id] || 0;
              const isSelected = conversation?.id === conv.id;
              return (
                <button
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`w-full flex items-center gap-3 px-3 py-3.5 rounded-xl transition-colors hover:bg-[#F0F7F4]/60 ${
                    isSelected ? 'bg-[#F0F7F4]' : ''
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="w-11 h-11 bg-[#c0ebe5] rounded-full flex items-center justify-center text-[#00a38a] font-semibold text-sm">
                      {getInitials(conv.patientName || 'P')}
                    </div>
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 text-[10px] bg-[#00a38a] text-white border-2 border-white hover:bg-[#00a38a]">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </Badge>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-sm truncate ${unreadCount > 0 ? 'font-bold text-foreground' : 'font-semibold text-foreground'}`}>
                        {conv.patientName || t('doctorDashboard.patient')}
                      </p>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {formatTimeAgo(conv.lastMessage?.createdAt || conv.lastMessageAt, t)}
                      </span>
                    </div>
                    <p className={`text-xs truncate mt-0.5 ${unreadCount > 0 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                      {conv.lastMessage?.content || t('chat.noMessages')}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Main chat area card */}
      <div className={`${hasMobileConversation ? 'flex' : 'hidden'} lg:flex flex-1 bg-white rounded-2xl shadow-sm flex-col overflow-hidden`}>
        {conversation ? (
          <>
            {/* Chat header */}
            <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={deselectConversation}
                  className="lg:hidden flex items-center justify-center h-9 w-9 rounded-full hover:bg-[#F0F7F4] transition-colors shrink-0"
                >
                  <ArrowLeft className="h-5 w-5 text-foreground" />
                </button>
                <h2 className="text-lg md:text-xl font-bold text-foreground truncate">{selectedPatientName}</h2>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full px-5 border-foreground/20 hover:bg-white hidden md:inline-flex"
                  onClick={() => {
                    if (conversation?.patientId) {
                      navigate(`/dashboard/doctor/patients?patientId=${conversation.patientId}`);
                    }
                  }}
                >
                  {t('chat.viewProfile')}
                </Button>
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
                hasMoreMessages={hasMoreMessages}
                isLoadingMoreMessages={isLoadingMoreMessages}
                onLoadMore={loadOlderMessages}
                onRetry={retryMessage}
              />
            </div>

            {/* Input */}
            <MessageInput
              onSendMessage={handleSendMessage}
              disabled={connectionStatus !== 'connected'}
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <MessageSquare className="w-12 h-12 text-muted-foreground/30" />
            <p className="mt-4 text-sm text-muted-foreground">{t('chat.selectPatient')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupabaseDoctorChat;
