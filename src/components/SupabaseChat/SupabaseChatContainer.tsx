import React, { useEffect, useState } from 'react';
import { AlertCircle, MessageSquare, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants';
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
  selectDoctorName,
  selectHasMoreMessages,
  selectIsLoadingMoreMessages,
} from '../../stores/supabaseChatStore';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Separator } from '../ui/separator';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/Button';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

export const SupabaseChatContainer: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [isInitializing, setIsInitializing] = useState(true);

  const connectionStatus = useSupabaseChatStore(selectConnectionStatus);
  const conversation = useSupabaseChatStore(selectConversation);
  const messages = useSupabaseChatStore(selectMessages);
  const error = useSupabaseChatStore(selectError);
  const isLoadingMessages = useSupabaseChatStore(selectIsLoadingMessages);
  const subscriptionActive = useSupabaseChatStore(selectSubscriptionActive);
  const currentUserId = useSupabaseChatStore(selectCurrentUserId);
  const currentUserRole = useSupabaseChatStore(selectCurrentUserRole);
  const messageReadStatus = useSupabaseChatStore(selectMessageReadStatus);
  const doctorName = useSupabaseChatStore(selectDoctorName);
  const hasMoreMessages = useSupabaseChatStore(selectHasMoreMessages);
  const isLoadingMoreMessages = useSupabaseChatStore(selectIsLoadingMoreMessages);
  const { connect, sendMessage, clearError, setChatPageVisible, loadOlderMessages } = useSupabaseChatStore();

  // Track chat page visibility for read receipts
  useEffect(() => {
    setChatPageVisible(true);
    return () => setChatPageVisible(false);
  }, [setChatPageVisible]);

  useEffect(() => {
    const initChat = async () => {
      if (!isAuthenticated || !user) {
        setIsInitializing(false);
        return;
      }

      try {
        const currentStatus = useSupabaseChatStore.getState().connectionStatus;

        if (currentStatus === 'disconnected') {
          await connect(user.userId, user.name, user.role as 'patient' | 'doctor');
        } else if (currentStatus === 'connected') {
          // Already connected — ensure conversation is loaded
          const currentConv = useSupabaseChatStore.getState().conversation;
          if (!currentConv) {
            await useSupabaseChatStore.getState().loadPatientConversation();
          } else {
            // Conversation already loaded — mark as read (patient returned to chat page)
            await useSupabaseChatStore.getState().markConversationAsRead(currentConv.id);
          }
        }
      } catch (err) {
        console.error('Failed to initialize chat:', err);
      } finally {
        setIsInitializing(false);
      }
    };

    initChat();
    // Don't disconnect on cleanup — let Zustand state persist across navigation.
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Loading state
  if (isInitializing) {
    return (
      <Card className="flex flex-col h-full border-0 shadow-none rounded-none bg-transparent py-0 gap-0">
        <CardHeader className="px-4 md:px-6 py-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-5 w-32" />
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="flex-1 px-4 md:px-6 py-4 space-y-5">
          <div className="flex flex-col items-start"><Skeleton className="h-11 w-[40%] rounded-2xl" /></div>
          <div className="flex flex-col items-end"><Skeleton className="h-11 w-[30%] rounded-2xl" /></div>
          <div className="flex flex-col items-start"><Skeleton className="h-16 w-[50%] rounded-2xl" /></div>
          <div className="flex flex-col items-end"><Skeleton className="h-11 w-[35%] rounded-2xl" /></div>
          <div className="flex flex-col items-start"><Skeleton className="h-11 w-[25%] rounded-2xl" /></div>
          <div className="flex flex-col items-end"><Skeleton className="h-16 w-[45%] rounded-2xl" /></div>
        </CardContent>
        <div className="px-4 md:px-6 py-4">
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </Card>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return (
      <Card className="flex flex-col h-full items-center justify-center border-0 shadow-none rounded-none bg-transparent">
        <CardContent className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
          <p className="mt-4 text-lg font-semibold">Authentication Required</p>
          <p className="mt-2 text-sm text-muted-foreground">Please log in to access chat</p>
        </CardContent>
      </Card>
    );
  }

  // Subscription required
  if (user.role === 'patient' && !subscriptionActive && connectionStatus === 'connected') {
    return (
      <Card className="flex flex-col h-full items-center justify-center border-0 shadow-none rounded-none bg-transparent">
        <CardContent className="text-center">
          <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto" />
          <p className="mt-4 text-lg font-semibold">Subscription Required</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Please subscribe to access chat with your doctor
          </p>
        </CardContent>
      </Card>
    );
  }

  // Connecting
  if (connectionStatus === 'connecting') {
    return (
      <Card className="flex flex-col h-full border-0 shadow-none rounded-none bg-transparent py-0 gap-0">
        <CardHeader className="px-4 md:px-6 py-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-5 w-32" />
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="flex-1 px-4 md:px-6 py-4 space-y-5">
          <div className="flex flex-col items-start"><Skeleton className="h-11 w-[40%] rounded-2xl" /></div>
          <div className="flex flex-col items-end"><Skeleton className="h-11 w-[30%] rounded-2xl" /></div>
          <div className="flex flex-col items-start"><Skeleton className="h-16 w-[50%] rounded-2xl" /></div>
          <div className="flex flex-col items-end"><Skeleton className="h-11 w-[35%] rounded-2xl" /></div>
          <div className="flex flex-col items-start"><Skeleton className="h-11 w-[25%] rounded-2xl" /></div>
          <div className="flex flex-col items-end"><Skeleton className="h-16 w-[45%] rounded-2xl" /></div>
        </CardContent>
        <div className="px-4 md:px-6 py-4">
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </Card>
    );
  }

  // Consent required (451)
  if (error?.includes('451')) {
    return (
      <Card className="flex flex-col h-full items-center justify-center border-0 shadow-none rounded-none bg-transparent">
        <CardContent className="text-center">
          <ShieldAlert className="w-12 h-12 text-amber-400 mx-auto" />
          <p className="mt-4 text-lg font-semibold text-gray-800">Consent Required</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Please accept the latest consent terms to access chat.
          </p>
          <Button onClick={() => navigate(ROUTES.PATIENT_CONSENT)} className="mt-4 bg-amber-500 hover:bg-amber-600 text-white">
            Review Consent
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Error
  if (connectionStatus === 'error' || error) {
    return (
      <Card className="flex flex-col h-full items-center justify-center border-0 shadow-none rounded-none bg-transparent">
        <CardContent className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
          <p className="mt-4 text-lg font-semibold text-destructive">Connection Error</p>
          <p className="mt-2 text-sm text-muted-foreground">{error || 'Failed to connect to chat'}</p>
          <Button onClick={handleRetry} className="mt-4 bg-[#00a38a] hover:bg-[#008f79]">
            Retry Connection
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Still loading conversation data — show skeleton instead of empty state
  if (isLoadingMessages) {
    return (
      <Card className="flex flex-col h-full border-0 shadow-none rounded-none bg-transparent py-0 gap-0">
        <CardHeader className="px-4 md:px-6 py-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-5 w-32" />
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="flex-1 px-4 md:px-6 py-4 space-y-5">
          <div className="flex flex-col items-start"><Skeleton className="h-11 w-[40%] rounded-2xl" /></div>
          <div className="flex flex-col items-end"><Skeleton className="h-11 w-[30%] rounded-2xl" /></div>
          <div className="flex flex-col items-start"><Skeleton className="h-16 w-[50%] rounded-2xl" /></div>
          <div className="flex flex-col items-end"><Skeleton className="h-11 w-[35%] rounded-2xl" /></div>
        </CardContent>
        <div className="px-4 md:px-6 py-4">
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </Card>
    );
  }

  // No doctor assigned
  if (user.role === 'patient' && !conversation) {
    return (
      <Card className="flex flex-col h-full items-center justify-center border-0 shadow-none rounded-none bg-transparent">
        <CardContent className="text-center">
          <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto" />
          <p className="mt-4 text-lg font-semibold">No Doctor Assigned</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Please wait for a doctor to be assigned to your case.
          </p>
        </CardContent>
      </Card>
    );
  }

  const displayName = doctorName || 'Your Doctor';

  return (
    <Card className="flex flex-col h-full border-0 shadow-none rounded-none bg-transparent py-0 gap-0">
      {/* Header */}
      <CardHeader className="px-4 md:px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#00a38a] rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0">
            {getInitials(displayName)}
          </div>
          <span className="text-base font-semibold text-foreground">{displayName}</span>
        </div>
      </CardHeader>

      <Separator />

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <MessageList
          messages={messages}
          currentUserId={currentUserId || ''}
          currentUserRole={currentUserRole || 'patient'}
          isLoading={isLoadingMessages}
          messageReadStatus={messageReadStatus}
          hasMoreMessages={hasMoreMessages}
          isLoadingMoreMessages={isLoadingMoreMessages}
          onLoadMore={loadOlderMessages}
        />
      </div>

      {/* Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        disabled={connectionStatus !== 'connected'}
      />
    </Card>
  );
};

export default SupabaseChatContainer;
