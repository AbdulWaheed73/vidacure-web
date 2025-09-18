import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { chatService } from '../services/chatService';
import type { ConnectionStatus, ChatState } from '../types/chat-types';
import type { User } from '@/types';
import type { Channel } from 'stream-chat';

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

          // Auto-load channels based on user role with retry logic
          if (user.role === 'patient') {
            // Retry channel loading if it fails due to connection timing
            const retryPatientChannel = async (attempts = 3) => {
              try {
                await get().getPatientChannel();
              } catch {
                if (attempts > 1 && get().connectionStatus === 'connected') {
                  console.log('Retrying patient channel loading...');
                  setTimeout(() => retryPatientChannel(attempts - 1), 1000);
                }
              }
            };
            await retryPatientChannel();
          } else if (user.role === 'doctor') {
            // Retry channel loading if it fails due to connection timing
            const retryDoctorChannels = async (attempts = 3) => {
              try {
                await get().getDoctorChannels();
              } catch {
                if (attempts > 1 && get().connectionStatus === 'connected') {
                  console.log('Retrying doctor channels loading...');
                  setTimeout(() => retryDoctorChannels(attempts - 1), 1000);
                }
              }
            };
            await retryDoctorChannels();
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

          // Don't show connection errors to users - these are expected during connect/disconnect cycles
          const isConnectionError = errorMessage.includes('connectUser') || errorMessage.includes('connectAnonymousUser');

          // Only set error if we're still connected and it's not a connection error
          if (get().connectionStatus === 'connected' && !isConnectionError) {
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

          // Don't show connection errors to users - these are expected during connect/disconnect cycles
          const isConnectionError = errorMessage.includes('connectUser') || errorMessage.includes('connectAnonymousUser');

          // Only set error if we're still connected and it's not a connection error
          if (get().connectionStatus === 'connected' && !isConnectionError) {
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