import React from 'react';
import { Check, CheckCheck, AlertCircle, Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import type { LocalMessage } from '../../types/supabase-chat-types';

type MessageBubbleProps = {
  message: LocalMessage;
  isOwnMessage: boolean;
  isRead?: boolean;
  onRetry?: (localId: string) => void;
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwnMessage, isRead, onRetry }) => {
  const isSystemMessage = message.sender_role === 'system' || message.message_type === 'system';

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const StatusIndicator = () => {
    if (!isOwnMessage) return null;

    switch (message.status) {
      case 'sending':
        return (
          <span className="ml-1 inline-flex items-center">
            <Loader2 className="w-3 h-3 text-muted-foreground/60 animate-spin" aria-label="Sending" />
          </span>
        );
      case 'sent':
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="ml-1 inline-flex items-center">
                  {isRead ? (
                    <CheckCheck className="w-3.5 h-3.5 text-[#00a38a]" aria-label="Read" />
                  ) : (
                    <Check className="w-3.5 h-3.5 text-muted-foreground/60" aria-label="Sent" />
                  )}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isRead ? 'Read' : 'Sent'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case 'failed':
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onRetry?.(message.localId)}
                  className="ml-1 inline-flex items-center gap-1 text-destructive hover:text-destructive/80 transition-colors"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Retry</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to retry sending</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      default:
        return null;
    }
  };

  if (isSystemMessage) {
    return (
      <div className="flex justify-center my-3">
        <div className="bg-muted rounded-full px-4 py-1.5 max-w-[85%]">
          <p className="text-xs text-muted-foreground text-center">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} my-2 px-4 md:px-6`}>
      <div
        className={`max-w-[75%] md:max-w-[55%] w-fit px-4 py-3 rounded-2xl ${
          isOwnMessage
            ? message.status === 'failed'
              ? 'bg-red-50 text-foreground border border-red-200'
              : 'bg-[#E6F7F5] text-foreground'
            : 'bg-[#ebf2f1] text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04)]'
        }`}
      >
        <p className="text-base whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
        <div className={`flex items-center gap-1 mt-1 ${isOwnMessage ? 'justify-end' : ''}`}>
          <span className="text-[11px] text-muted-foreground/60">{formatTime(message.created_at)}</span>
          <StatusIndicator />
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
