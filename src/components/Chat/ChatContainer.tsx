import React, { useEffect } from 'react';
import { Chat, Channel, ChannelHeader, MessageList, MessageInput, Thread, Window } from 'stream-chat-react';
import { useChatStore } from '../../stores/chatStore';
import { useAuthStore } from '../../stores/authStore';
import { Card } from '../ui/card';
import { Alert } from '../ui/Alert';
import { Loader2, Wifi, WifiOff } from 'lucide-react';

import 'stream-chat-react/dist/css/v2/index.css';

const ChatContainer: React.FC = () => {
  const { user } = useAuthStore();
  const {
    client,
    currentChannel,
    connectionStatus,
    error,
    connectToChat,
    disconnectFromChat,
    clearError
  } = useChatStore();

  // Connect when component mounts (user is on chat page)
  useEffect(() => {
    if (user && connectionStatus === 'disconnected') {
      connectToChat(user).catch((error) => {
        console.error('🔥 Failed to connect to chat on mount:', error);
      });
    }
    
    // Cleanup: disconnect when component unmounts (user leaves chat page)
    return () => {
      if (connectionStatus === 'connected') {
        disconnectFromChat().catch((error) => {
          console.error('Failed to disconnect on cleanup:', error);
        });
      }
    };
  }, [user, connectToChat, disconnectFromChat, connectionStatus]);
  
  // Handle page unload/close - disconnect to free up connections
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (connectionStatus === 'connected') {
        disconnectFromChat().catch((error) => {
          console.error('Failed to disconnect on page unload:', error);
        });
      }
    };
    
    // Handle tab visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden && connectionStatus === 'connected') {
        console.log('👁️ Tab hidden - disconnecting from chat');
        disconnectFromChat().catch((error) => {
          console.error('Failed to disconnect on tab hidden:', error);
        });
      } else if (!document.hidden && connectionStatus === 'disconnected' && user) {
        console.log('👁️ Tab visible - reconnecting to chat');
        connectToChat(user).catch((error) => {
          console.error('Failed to reconnect on tab visible:', error);
        });
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [connectionStatus, disconnectFromChat, connectToChat, user]);

  if (!user) {
    return (
      <Card className="p-8 text-center">
        <p>Please log in to access chat</p>
      </Card>
    );
  }

  // Show connection status
  if (connectionStatus === 'connecting') {
    return (
      <Card className="p-8 text-center">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <p>Connecting to chat...</p>
        </div>
      </Card>
    );
  }
  
  if (connectionStatus === 'disconnected' && !error) {
    return (
      <Card className="p-8 text-center">
        <div className="flex items-center justify-center gap-2">
          <WifiOff className="h-4 w-4 text-gray-500" />
          <p>Chat disconnected. Connecting...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8">
        <Alert
          type="error"
          message={error}
          onClose={clearError}
        />
      </Card>
    );
  }

  if (!client) {
    return (
      <Card className="p-8 text-center">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <p>Initializing chat...</p>
        </div>
      </Card>
    );
  }

  if (!currentChannel) {
    return (
      <Card className="p-8 text-center">
        {connectionStatus === 'connected' ? (
          <p>
            {user.role === 'patient'
              ? 'No doctor assigned yet. Please wait for a doctor to be assigned to your case.'
              : 'No patient channels available.'
            }
          </p>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p>Loading channels...</p>
          </div>
        )}
      </Card>
    );
  }

  return (
    <div className="h-full">
      {/* Connection Status Indicator */}
      {connectionStatus === 'connected' && (
        <div className="bg-green-50 border-b border-green-200 px-4 py-2">
          <div className="flex items-center gap-2 text-sm text-green-700">
            <Wifi className="h-3 w-3" />
            <span>Connected to chat</span>
          </div>
        </div>
      )}
      
      <Chat client={client} theme="str-chat__theme-light">
        <Channel channel={currentChannel}>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput 
              focus 
              additionalTextareaProps={{
                placeholder: "Type your message here..."
              }}
            />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatContainer;