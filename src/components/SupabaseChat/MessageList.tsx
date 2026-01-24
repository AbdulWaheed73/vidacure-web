import React, { useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import type { LocalMessage } from '../../types/supabase-chat-types';

type MessageListProps = {
  messages: LocalMessage[];
  currentUserId: string;
  currentUserRole?: 'patient' | 'doctor';
  isLoading?: boolean;
  messageReadStatus?: { [messageId: string]: boolean };
};

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  currentUserRole,
  isLoading = false,
  messageReadStatus = {},
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages.length]);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 text-[#00a38a] animate-spin" />
        <p className="mt-3 text-gray-500">Loading messages...</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white px-8">
        <p className="text-lg font-semibold text-gray-900">No messages yet</p>
        <p className="text-sm text-gray-500 mt-2 text-center">
          Start the conversation by sending a message
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-white py-4">
      {messages.map((message) => {
        // Use role-based comparison for doctor reassignment support
        // Falls back to sender_id comparison if role not provided
        const isOwnMessage = currentUserRole
          ? message.sender_role === currentUserRole
          : message.sender_id === currentUserId;
        return (
          <MessageBubble
            key={message.id}
            message={message}
            isOwnMessage={isOwnMessage}
            isRead={messageReadStatus[message.id]}
          />
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
