import { StreamChat, Channel } from 'stream-chat';
import type { User } from './user-types';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export type ChatState = {
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