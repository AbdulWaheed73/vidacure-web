import { StreamChat } from 'stream-chat';
import { api } from './api';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

export class ChatService {
  private static instance: ChatService;
  private client: StreamChat | null = null;
  private currentUser: any = null;

  private constructor() {}

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  /**
   * Initialize chat client and connect user
   */
  async initialize(user: { userId: string; name: string; role: string }): Promise<StreamChat> {
    if (!STREAM_API_KEY) {
      throw new Error('Stream API key not configured');
    }

    if (!this.client) {
      this.client = StreamChat.getInstance(STREAM_API_KEY);
    }

    // If user is already connected, return client
    if (this.currentUser && this.currentUser.userId === user.userId) {
      return this.client;
    }

    try {
      // Get token from our backend
      const response = await api.post('/api/chat/initialize');
      const { token } = response.data;

      // Connect user to Stream
      await this.client.connectUser({
        id: user.userId,
        name: user.name,
        role: user.role,
      }, token);

      this.currentUser = user;
      return this.client;
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      throw error;
    }
  }

  /**
   * Get patient's medical channel
   */
  async getPatientChannel() {
    if (!this.client) {
      throw new Error('Chat client not initialized');
    }

    try {
      const response = await api.get('/api/chat/patient/channel');
      const { channelId } = response.data;

      const channel = this.client.channel('messaging', channelId);
      await channel.watch();
      return channel;
    } catch (error) {
      console.error('Failed to get patient channel:', error);
      throw error;
    }
  }

  /**
   * Get all channels for doctor
   */
  async getDoctorChannels() {
    if (!this.client) {
      throw new Error('Chat client not initialized');
    }

    try {
      const response = await api.get('/api/chat/doctor/channels');
      const { channels } = response.data;

      // Get Stream channel objects
      const streamChannels = [];
      for (const data of channels) {
        const channel = this.client.channel('messaging', data.id);
        await channel.watch();
        streamChannels.push(channel);
      }

      return streamChannels;
    } catch (error) {
      console.error('Failed to get doctor channels:', error);
      throw error;
    }
  }

  /**
   * Get specific patient channel for doctor
   */
  async getPatientChannelForDoctor(patientId: string) {
    if (!this.client) {
      throw new Error('Chat client not initialized');
    }

    try {
      const response = await api.get(`/api/chat/patient/${patientId}/channel`);
      const { channelId } = response.data;

      const channel = this.client.channel('messaging', channelId);
      await channel.watch();
      return channel;
    } catch (error) {
      console.error('Failed to get patient channel for doctor:', error);
      throw error;
    }
  }

  /**
   * Check if currently connected
   */
  isConnected(): boolean {
    return this.client && this.currentUser;
  }

  /**
   * Disconnect from chat
   */
  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.disconnectUser();
      this.currentUser = null;
    }
  }
}

export const chatService = ChatService.getInstance();