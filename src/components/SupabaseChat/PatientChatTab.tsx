import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, MessageSquare } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import {
  useChatStore,
  selectConnectionStatus,
  selectConversation,
  selectMessages,
  selectError,
  selectIsLoadingMessages,
  selectCurrentUserId,
  selectMessageReadStatus,
  selectHasMoreMessages,
  selectIsLoadingMoreMessages,
} from '../../stores/chatStore';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/Button';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

type PatientChatTabProps = {
  patientId: string | null;
  enabled: boolean;
};

export const PatientChatTab: React.FC<PatientChatTabProps> = ({ patientId, enabled }) => {
  const { user, isAuthenticated } = useAuthStore();
  const { t } = useTranslation();
  const [isPreparing, setIsPreparing] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const connectionStatus = useChatStore(selectConnectionStatus);
  const conversation = useChatStore(selectConversation);
  const messages = useChatStore(selectMessages);
  const error = useChatStore(selectError);
  const isLoadingMessages = useChatStore(selectIsLoadingMessages);
  const currentUserId = useChatStore(selectCurrentUserId);
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

  // Read-receipt visibility while this tab is mounted
  useEffect(() => {
    if (!enabled) return;
    setChatPageVisible(true);
    return () => setChatPageVisible(false);
  }, [enabled, setChatPageVisible]);

  // Connect (if needed) → load conversations (if needed) → select the one for this patient
  useEffect(() => {
    if (!enabled || !patientId) return;

    let cancelled = false;

    const init = async () => {
      setIsPreparing(true);
      setNotFound(false);

      if (!isAuthenticated || !user || user.role !== 'doctor') {
        setIsPreparing(false);
        return;
      }

      try {
        const status = useChatStore.getState().connectionStatus;
        if (status === 'disconnected') {
          await connect(user.userId, user.name, 'doctor');
        }

        let convs = useChatStore.getState().conversations;
        if (convs.length === 0) {
          await useChatStore.getState().loadDoctorConversations();
          convs = useChatStore.getState().conversations;
        }

        if (cancelled) return;

        const target = convs.find((c) => c.patientId === patientId);
        if (!target) {
          setNotFound(true);
          return;
        }

        const current = useChatStore.getState().conversation;
        if (current?.id !== target.id) {
          await selectConv(target);
        }
      } catch (err) {
        console.error('Failed to prepare patient chat:', err);
      } finally {
        if (!cancelled) setIsPreparing(false);
      }
    };

    init();

    return () => {
      cancelled = true;
    };
  }, [enabled, patientId, isAuthenticated, user?.userId, connect, selectConv, user]);

  // When this tab unmounts (sheet closes / tab switch), drop the active conversation
  // so the global chat page starts clean.
  useEffect(() => {
    return () => {
      deselectConversation();
    };
  }, [deselectConversation]);

  const handleRetry = async () => {
    if (user) {
      clearError();
      await connect(user.userId, user.name, 'doctor');
    }
  };

  if (!isAuthenticated || !user || user.role !== 'doctor') {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <AlertCircle className="w-10 h-10 text-destructive" />
        <p className="mt-3 text-sm font-medium text-center">{t('chat.doctorAccessDenied')}</p>
      </div>
    );
  }

  if (isPreparing || connectionStatus === 'connecting') {
    return (
      <div className="flex flex-col h-[calc(100vh-220px)] min-h-[400px] bg-white rounded-2xl border border-[#e0e0e0] overflow-hidden">
        <div className="flex-1 p-4 space-y-4">
          <div className="flex justify-start"><Skeleton className="h-10 w-[55%] rounded-2xl" /></div>
          <div className="flex justify-end"><Skeleton className="h-10 w-[40%] rounded-2xl" /></div>
          <div className="flex justify-start"><Skeleton className="h-14 w-[60%] rounded-2xl" /></div>
          <div className="flex justify-end"><Skeleton className="h-10 w-[35%] rounded-2xl" /></div>
        </div>
        <div className="p-3 border-t border-[#e0e0e0]">
          <Skeleton className="h-11 w-full rounded-full" />
        </div>
      </div>
    );
  }

  if (connectionStatus === 'error' || error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <AlertCircle className="w-10 h-10 text-destructive" />
        <p className="mt-3 text-sm font-semibold text-destructive">{t('chat.connectionError')}</p>
        <p className="mt-1 text-xs text-muted-foreground text-center">{error || t('chat.failedToConnect')}</p>
        <Button onClick={handleRetry} className="mt-4 bg-[#005044] hover:bg-[#004038] rounded-full px-5">
          {t('chat.retry')}
        </Button>
      </div>
    );
  }

  if (notFound || !conversation) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <MessageSquare className="w-10 h-10 text-[#c0ebe5]" />
        <p className="mt-3 text-sm text-[#b0b0b0] font-manrope text-center">
          {t('chat.noConversationForPatient')}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] min-h-[400px] bg-white rounded-2xl border border-[#e0e0e0] overflow-hidden">
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
      <MessageInput
        onSendMessage={(content) => sendMessage(content)}
        disabled={connectionStatus !== 'connected'}
      />
    </div>
  );
};

export default PatientChatTab;
