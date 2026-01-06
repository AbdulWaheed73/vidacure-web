import { api } from './api';

export type MeetingStatusResponse = {
  success: boolean;
  meetingStatus: 'none' | 'scheduled' | 'completed';
  scheduledMeetingTime: string | null;
  completedAt: string | null;
  isMeetingGatePassed: boolean;
};

export const meetingService = {
  // Get meeting status for current patient
  async getMeetingStatus(): Promise<MeetingStatusResponse> {
    const response = await api.get<MeetingStatusResponse>('/api/pending-booking/meeting-status');
    return response.data;
  },

  // Check if meeting gate is passed (can subscribe)
  async canSubscribe(): Promise<boolean> {
    try {
      const status = await this.getMeetingStatus();
      return status.isMeetingGatePassed;
    } catch (error) {
      console.error('Error checking meeting status:', error);
      return false;
    }
  },
};
