import React, { useState, useCallback, type KeyboardEvent } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '../ui/Button';

type MessageInputProps = {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = 'Write your message.',
}) => {
  const [message, setMessage] = useState('');

  const handleChangeText = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMessage(e.target.value);
    },
    []
  );

  const handleSend = useCallback(() => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || disabled) return;

    onSendMessage(trimmedMessage);
    setMessage('');
  }, [message, disabled, onSendMessage]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = message.trim() && !disabled;

  return (
    <div className="px-6 py-4">
      <div className="flex items-center gap-3 rounded-full border border-border/40 bg-white/80 px-5 py-2.5">
        <textarea
          className="flex-1 bg-transparent text-base resize-none outline-none max-h-24 text-foreground placeholder:text-muted-foreground leading-relaxed"
          value={message}
          onChange={handleChangeText}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          maxLength={2000}
          rows={1}
          disabled={disabled}
          style={{ minHeight: '24px' }}
        />
        <Button
          size="icon"
          className={`h-9 w-9 rounded-full shrink-0 ${
            canSend
              ? 'bg-[#1a3a34] hover:bg-[#0f2620] text-white'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
          onClick={handleSend}
          disabled={!canSend}
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
