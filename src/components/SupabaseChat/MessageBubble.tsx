import React from 'react';
import { Check, CheckCheck, AlertCircle, Loader2 } from 'lucide-react';
import type { LocalMessage } from '../../types/supabase-chat-types';

type MessageBubbleProps = {
  message: LocalMessage;
  isOwnMessage: boolean;
  isRead?: boolean; // Whether the message has been read by recipient
  onRetry?: (localId: string) => void;
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwnMessage, isRead, onRetry }) => {
  const isSystemMessage = message.sender_role === 'system' || message.message_type === 'system';

  // Format timestamp
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Status indicator component for own messages
  const StatusIndicator = () => {
    if (!isOwnMessage) return null;

    switch (message.status) {
      case 'sending':
        return (
          <span className="ml-1 inline-flex items-center">
            <Loader2 className="w-4 h-4 text-white/70 animate-spin" aria-label="Sending" />
          </span>
        );
      case 'sent':
        return (
          <span className="ml-1 inline-flex items-center">
            {isRead ? (
              <CheckCheck className="w-4 h-4 text-white/90" aria-label="Read" />
            ) : (
              <Check className="w-4 h-4 text-white/90" aria-label="Sent" />
            )}
          </span>
        );
      case 'failed':
        return (
          <button
            onClick={() => onRetry?.(message.localId)}
            className="ml-1 inline-flex items-center gap-1 text-red-500 hover:text-red-600 transition-colors"
          >
            <AlertCircle className="w-4 h-4" />
            <span className="text-xs font-medium">Retry</span>
          </button>
        );
      default:
        return null;
    }
  };

  if (isSystemMessage) {
    return (
      <div className="flex justify-center my-2">
        <div className="bg-gray-100 rounded-xl px-4 py-2 max-w-[90%]">
          <p className="text-sm text-gray-500 text-center">{message.content}</p>
          <p className="text-xs text-gray-400 text-center mt-1">{formatTime(message.created_at)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} my-1 px-4`}>
      <div
        className={`max-w-[80%] px-4 py-2 rounded-2xl ${
          isOwnMessage
            ? message.status === 'failed'
              ? 'bg-red-200 text-gray-900 border border-red-400 rounded-br-sm'
              : 'bg-[#00a38a] text-white rounded-br-sm'
            : 'bg-gray-200 text-gray-900 rounded-bl-sm'
        }`}
      >
        <p className="text-base whitespace-pre-wrap break-words">{message.content}</p>
        <div
          className={`flex items-center justify-end gap-1 mt-1 ${
            isOwnMessage
              ? message.status === 'failed'
                ? 'text-red-600'
                : 'text-white/70'
              : 'text-gray-500'
          }`}
        >
          <span className="text-xs">{formatTime(message.created_at)}</span>
          <StatusIndicator />
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
