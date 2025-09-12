import React, { useEffect, useState } from 'react';
import { Chat, Channel, ChannelHeader, MessageList, MessageInput, Thread, Window } from 'stream-chat-react';
import type { Channel as StreamChannel } from 'stream-chat';
import { useChatStore } from '../../stores/chatStore';
import { useAuthStore } from '../../stores/authStore';
import { Card } from '../ui/card';
import { Alert } from '../ui/Alert';
import { Loader2, Wifi, WifiOff, Users } from 'lucide-react';
import { cn } from '../../lib/utils';

import 'stream-chat-react/dist/css/v2/index.css';

const DoctorChat: React.FC = () => {
  const { user } = useAuthStore();
  const {
    client,
    currentChannel,
    doctorChannels,
    connectionStatus,
    error,
    connectToChat,
    disconnectFromChat,
    setCurrentChannel,
    clearError
  } = useChatStore();

  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);

  // Connect when component mounts (user is on chat page)
  useEffect(() => {
    if (user && user.role === 'doctor' && connectionStatus === 'disconnected') {
      connectToChat(user).catch((error) => {
        console.error('🔥 Doctor failed to connect to chat on mount:', error);
      });
    }
    
    // Cleanup: disconnect when component unmounts (user leaves chat page)
    return () => {
      if (connectionStatus === 'connected') {
        disconnectFromChat();
      }
    };
  }, [user, connectToChat, disconnectFromChat, connectionStatus]);
  
  // Handle page unload/close - disconnect to free up connections
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (connectionStatus === 'connected') {
        disconnectFromChat();
      }
    };
    
    // Handle tab visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden && connectionStatus === 'connected') {
        console.log('👁️ Doctor tab hidden - disconnecting from chat');
        disconnectFromChat();
      } else if (!document.hidden && connectionStatus === 'disconnected' && user && user.role === 'doctor') {
        console.log('👁️ Doctor tab visible - reconnecting to chat');
        connectToChat(user);
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [connectionStatus, disconnectFromChat, connectToChat, user]);

  useEffect(() => {
    if (doctorChannels.length > 0 && !selectedChannelId) {
      const firstChannelId = doctorChannels[0]?.id;
      if (firstChannelId) {
        setSelectedChannelId(firstChannelId);
        setCurrentChannel(doctorChannels[0]);
      }
    }
  }, [doctorChannels, selectedChannelId, setCurrentChannel]);

  const handleChannelSelect = (channel: StreamChannel) => {
    setSelectedChannelId(channel.id || '');
    setCurrentChannel(channel);
  };

  if (!user || user.role !== 'doctor') {
    return (
      <Card className="p-8 text-center">
        <p>Access denied. This interface is for doctors only.</p>
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
        <p>Unable to connect to chat service</p>
      </Card>
    );
  }

  if (doctorChannels.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p>No patients assigned yet.</p>
      </Card>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Connection Status Indicator */}
      {connectionStatus === 'connected' && (
        <div className="bg-green-50 border-b border-green-200 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-green-700">
              <Wifi className="h-3 w-3" />
              <span>Connected to chat</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-700">
              <Users className="h-3 w-3" />
              <span>{doctorChannels.length} patients</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex-1 flex">
        <Chat client={client} theme="str-chat__theme-light">
        {/* Patient List Sidebar */}
        <div className="w-80 border-r border-gray-200 bg-gray-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">My Patients</h3>
            <p className="text-sm text-gray-600">{doctorChannels.length} active conversations</p>
          </div>
          
          <div className="overflow-y-auto h-full">
            {doctorChannels.map((channel) => {
              // Extract patient ID from channel ID (patient-{id}-medical)
              const patientId = channel.id?.replace('patient-', '')?.replace('-medical', '') || 'Unknown';
              const lastMessage = (channel as any).state?.last_message_at;
              const isSelected = selectedChannelId === channel.id;
              
              return (
                <div
                  key={channel.id}
                  onClick={() => handleChannelSelect(channel)}
                  className={cn(
                    "p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors",
                    isSelected && "bg-blue-50 border-blue-200"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <h4 className="font-medium text-gray-900">
                          Patient {patientId.slice(-4)} {/* Show last 4 chars of patient ID for privacy */}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Medical Chat
                      </p>
                      {lastMessage && (
                        <p className="text-xs text-gray-500 mt-1">
                          Last message: {new Date(lastMessage).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1">
          {currentChannel ? (
            <Channel channel={currentChannel}>
              <Window>
                <ChannelHeader />
                <MessageList />
                <MessageInput focus />
              </Window>
              <Thread />
            </Channel>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">Select a patient to start chatting</p>
            </div>
          )}
        </div>
        </Chat>
      </div>
    </div>
  );
};

export default DoctorChat;