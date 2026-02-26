import { api } from './api';
import type { Provider, ProviderMeeting } from '../types/provider-types';

export const providerService = {
  async getMyProviders(): Promise<{ providers: Provider[] }> {
    const response = await api.get('/api/providers/my');
    return response.data;
  },

  async getProviderDetails(providerId: string): Promise<{ provider: Provider }> {
    const response = await api.get(`/api/providers/${providerId}`);
    return response.data;
  },

  async createBookingLink(
    providerId: string
  ): Promise<{ success: boolean; schedulingLink: string; provider: { name: string; providerType: string }; tier: string }> {
    const response = await api.post('/api/providers/booking-link', {
      providerId,
    });
    return response.data;
  },

  async getMyProviderMeetings(): Promise<{ meetings: ProviderMeeting[] }> {
    const response = await api.get('/api/providers/meetings/my');
    return response.data;
  },
};
