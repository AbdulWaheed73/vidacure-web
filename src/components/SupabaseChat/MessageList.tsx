import React, { useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { MessageBubble } from './MessageBubble';
import { Skeleton } from '../ui/skeleton';
import type { LocalMessage } from '../../types/chat-types';

type MessageListProps = {
  messages: LocalMessage[];
  currentUserId: string;
  currentUserRole?: 'patient' | 'doctor';
  isLoading?: boolean;
  messageReadStatus?: { [messageId: string]: boolean };
  hasMoreMessages?: boolean;
  isLoadingMoreMessages?: boolean;
  onLoadMore?: () => void;
  onRetry?: (localId: string) => void;
};

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  currentUserRole,
  isLoading = false,
  messageReadStatus = {},
  hasMoreMessages = false,
  isLoadingMoreMessages = false,
  onLoadMore,
  onRetry,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number>(0);
  const prevFirstMessageIdRef = useRef<string | null>(null);
  const prevMessageCountRef = useRef(0);
  const wasPrependRef = useRef(false);

  // Capture scroll height when loading older messages starts
  useEffect(() => {
    if (isLoadingMoreMessages && containerRef.current) {
      prevScrollHeightRef.current = containerRef.current.scrollHeight;
    }
  }, [isLoadingMoreMessages]);

  // All scroll positioning runs in useLayoutEffect (before paint).
  // This ensures scrollTop is never 0 on initial load when the browser
  // first processes scroll events — eliminating the false onLoadMore trigger.
  useLayoutEffect(() => {
    if (!containerRef.current || messages.length === 0) {
      prevFirstMessageIdRef.current = null;
      return;
    }

    const firstMessageId = messages[0].id;
    const wasPrepend =
      prevFirstMessageIdRef.current !== null &&
      firstMessageId !== prevFirstMessageIdRef.current &&
      prevScrollHeightRef.current > 0;

    wasPrependRef.current = wasPrepend;

    if (wasPrepend) {
      // Older messages prepended — restore scroll position
      const newScrollHeight = containerRef.current.scrollHeight;
      containerRef.current.scrollTop = newScrollHeight - prevScrollHeightRef.current;
      prevScrollHeightRef.current = 0;
    } else if (prevMessageCountRef.current === 0) {
      // Initial load — snap to bottom before paint
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }

    prevFirstMessageIdRef.current = firstMessageId;
  }, [messages]);

  // Smooth scroll to bottom for new messages appended after initial load
  useEffect(() => {
    if (
      messages.length > 0 &&
      !wasPrependRef.current &&
      prevMessageCountRef.current > 0 &&
      messages.length > prevMessageCountRef.current
    ) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevMessageCountRef.current = messages.length;
    wasPrependRef.current = false;
  }, [messages.length]);

  // Scroll-to-top detection for loading older messages
  const handleScroll = useCallback(() => {
    if (!containerRef.current || !onLoadMore || !hasMoreMessages || isLoadingMoreMessages) return;
    if (containerRef.current.scrollTop < 80) {
      onLoadMore();
    }
  }, [onLoadMore, hasMoreMessages, isLoadingMoreMessages]);

  if (isLoading) {
    return (
      <div className="h-full bg-white/50 py-4 px-4 md:px-6 space-y-5">
        <div className="flex flex-col items-start">
          <Skeleton className="h-11 w-[40%] rounded-2xl" />
        </div>
        <div className="flex flex-col items-end">
          <Skeleton className="h-11 w-[30%] rounded-2xl" />
        </div>
        <div className="flex flex-col items-start">
          <Skeleton className="h-16 w-[50%] rounded-2xl" />
        </div>
        <div className="flex flex-col items-end">
          <Skeleton className="h-11 w-[35%] rounded-2xl" />
        </div>
        <div className="flex flex-col items-start">
          <Skeleton className="h-11 w-[25%] rounded-2xl" />
        </div>
        <div className="flex flex-col items-end">
          <Skeleton className="h-16 w-[45%] rounded-2xl" />
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-transparent px-4 md:px-8">
        <p className="text-lg font-semibold text-gray-900">No messages yet</p>
        <p className="text-sm text-gray-500 mt-2 text-center">
          Start the conversation by sending a message
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-auto bg-white/50 py-4"
      onScroll={handleScroll}
    >
      {isLoadingMoreMessages && (
        <div className="px-4 md:px-6 space-y-3 py-3">
          <div className="flex flex-col items-start">
            <Skeleton className="h-10 w-[35%] rounded-2xl" />
          </div>
          <div className="flex flex-col items-end">
            <Skeleton className="h-10 w-[30%] rounded-2xl" />
          </div>
        </div>
      )}
      {messages.map((message) => {
        const isOwnMessage = currentUserRole
          ? message.senderRole === currentUserRole
          : message.senderId === currentUserId;
        return (
          <MessageBubble
            key={message.id}
            message={message}
            isOwnMessage={isOwnMessage}
            isRead={messageReadStatus[message.id]}
            onRetry={onRetry}
          />
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
