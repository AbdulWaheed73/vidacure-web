import React, { useState, useCallback, type KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

type MessageInputProps = {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = 'Type a message...',
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

  return (
    <div className="bg-white border-t border-gray-200 px-4 py-3">
      <div className="flex items-end bg-gray-100 rounded-3xl px-4 py-2">
        <textarea
          className="flex-1 bg-transparent text-base resize-none outline-none max-h-24 text-gray-900 placeholder-gray-400"
          value={message}
          onChange={handleChangeText}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          maxLength={2000}
          rows={1}
          disabled={disabled}
          style={{ minHeight: '24px' }}
        />
        <button
          className={`ml-2 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
            message.trim() && !disabled
              ? 'bg-[#00a38a] text-white hover:bg-[#008f79]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          onClick={handleSend}
          disabled={!message.trim() || disabled}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
