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
        try {
          await chatService.disconnect();
          set({
            client: null,
            connectionStatus: 'disconnected',
            currentChannel: null,
            doctorChannels: [],
            error: null
          });
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to disconnect from chat';
          console.error('Failed to disconnect from chat:', error);
          set({ error: errorMessage });
        }
      },

      // Legacy method (for compatibility)
      initializeChat: async (user: User) => {
        await get().connectToChat(user);
      },

      getPatientChannel: async () => {
        try {
          const channel = await chatService.getPatientChannel();
          set({ currentChannel: channel, error: null });
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to get patient channel';
          console.error('Failed to get patient channel:', error);
          set({ error: errorMessage });
        }
      },

      getDoctorChannels: async () => {
        try {
          const channels = await chatService.getDoctorChannels();
          set({ 
            doctorChannels: channels, 
            currentChannel: channels[0] || null, // Set first channel as current
            error: null 
          });
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to get doctor channels';
          console.error('Failed to get doctor channels:', error);
          set({ error: errorMessage });
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
        try {
          chatService.disconnect();
          set({
            client: null,
            connectionStatus: 'disconnected',
            currentChannel: null,
            doctorChannels: [],
            error: null
          });
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