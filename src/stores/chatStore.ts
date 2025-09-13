import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StreamChat, Channel } from 'stream-chat';
import { chatService } from '../services/chatService';
import type { User } from '../types/user-types';


export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

type ChatState = {
  // Stream Chat client
  client: StreamChat | null;
  connectionStatus: ConnectionStatus;
  
  // Current channel
  currentChannel: Channel | null;
  
  // Doctor channels (for doctor users)
  doctorChannels: Channel[];
  
  // Error handling
  error: string | null;
  
  // Tab-based connection actions
  connectToChat: (user: User) => Promise<void>;
  disconnectFromChat: () => Promise<void>;
  safeDisconnectFromChat: () => void; // Non-async version for cleanup functions
  
  // Channel actions
  loadPatientChannel: () => Promise<void>;
  loadDoctorChannels: () => Promise<void>;
  
  // Legacy methods (for compatibility)
  getPatientChannel: () => Promise<void>;
  getDoctorChannels: () => Promise<void>;
  setCurrentChannel: (channel: Channel) => void;
  
  // Utility actions
  clearError: () => void;
  
  // Legacy actions (for compatibility)
  initializeChat: (user: User) => Promise<void>;
  disconnect: () => Promise<void>;
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      client: null,
      connectionStatus: 'disconnected' as ConnectionStatus,
      currentChannel: null,
      doctorChannels: [],
      error: null,

      connectToChat: async (user: User) => {
        set({ error: null, connectionStatus: 'connecting' });
        
        try {
          const client = await chatService.initialize(user);
          
          set({ 
            client,
            connectionStatus: 'connected',
            error: null
          });

          // Auto-load channels based on user role
          if (user.role === 'patient') {
            await get().getPatientChannel();
          } else if (user.role === 'doctor') {
            await get().getDoctorChannels();
          }

        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to connect to chat';
          console.error('Failed to connect to chat:', error);
          set({ 
            connectionStatus: 'error',
            error: errorMessage
          });
        }
      },

      disconnectFromChat: async () => {
        // Immediately clear state to prevent further operations
        set({
          client: null,
          connectionStatus: 'disconnected',
          currentChannel: null,
          doctorChannels: [],
          error: null
        });

        try {
          await chatService.disconnect();
        } catch (error: unknown) {
          console.error('Failed to disconnect from chat:', error);
          // Don't set error after successful state clear
        }
      },

      // Legacy method (for compatibility)
      initializeChat: async (user: User) => {
        await get().connectToChat(user);
      },

      getPatientChannel: async () => {
        const { connectionStatus } = get();

        // Don't attempt channel operations if not connected
        if (connectionStatus !== 'connected') {
          console.log('Skipping getPatientChannel - not connected:', connectionStatus);
          return;
        }

        try {
          const channel = await chatService.getPatientChannel();
          // Double-check we're still connected before setting state
          if (get().connectionStatus === 'connected') {
            set({ currentChannel: channel, error: null });
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to get patient channel';
          console.error('Failed to get patient channel:', error);

          // Only set error if we're still connected (error is relevant)
          if (get().connectionStatus === 'connected') {
            set({ error: errorMessage });
          }
        }
      },

      getDoctorChannels: async () => {
        const { connectionStatus } = get();

        // Don't attempt channel operations if not connected
        if (connectionStatus !== 'connected') {
          console.log('Skipping getDoctorChannels - not connected:', connectionStatus);
          return;
        }

        try {
          const channels = await chatService.getDoctorChannels();
          // Double-check we're still connected before setting state
          if (get().connectionStatus === 'connected') {
            set({
              doctorChannels: channels,
              currentChannel: channels[0] || null,
              error: null
            });
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to get doctor channels';
          console.error('Failed to get doctor channels:', error);

          // Only set error if we're still connected (error is relevant)
          if (get().connectionStatus === 'connected') {
            set({ error: errorMessage });
          }
        }
      },

      setCurrentChannel: (channel: Channel) => {
        set({ currentChannel: channel });
      },

      // Legacy method (for compatibility)
      disconnect: async () => {
        await get().disconnectFromChat();
      },

      clearError: () => {
        set({ error: null });
      },

      safeDisconnectFromChat: () => {
        // Immediately clear state first
        set({
          client: null,
          connectionStatus: 'disconnected',
          currentChannel: null,
          doctorChannels: [],
          error: null
        });

        try {
          chatService.disconnect();
        } catch (error: unknown) {
          console.error('Failed to safely disconnect from chat:', error);
        }
      },

      loadPatientChannel: async () => {
        await get().getPatientChannel();
      },

      loadDoctorChannels: async () => {
        await get().getDoctorChannels();
      }
    }),
    {
      name: 'chat-storage',
      partialize: () => ({
        // Don't persist client, connection status, or channels - these need to be re-initialized
        connectionStatus: 'disconnected' as ConnectionStatus,
      }),
    }
  )
);