import { useState, useEffect, useCallback } from 'react';
import { meetingService, type MeetingStatusResponse } from '@/services/meetingService';

export type MeetingStatusHookResult = {
  isLoading: boolean;
  error: string | null;
  meetingStatus: 'none' | 'scheduled' | 'completed';
  scheduledMeetingTime: Date | null;
  completedAt: Date | null;
  isMeetingGatePassed: boolean;
  refetch: () => Promise<void>;
};

export const useMeetingStatus = (): MeetingStatusHookResult => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<MeetingStatusResponse | null>(null);

  const fetchMeetingStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await meetingService.getMeetingStatus();
      setStatus(response);
    } catch (err) {
      console.error('Error fetching meeting status:', err);
      setError('Failed to fetch meeting status');
      setStatus(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMeetingStatus();
  }, [fetchMeetingStatus]);

  // Calculate derived values
  const meetingStatus = status?.meetingStatus || 'none';
  const scheduledMeetingTime = status?.scheduledMeetingTime
    ? new Date(status.scheduledMeetingTime)
    : null;
  const completedAt = status?.completedAt
    ? new Date(status.completedAt)
    : null;

  // Server is the source of truth for meeting gate status
  const isMeetingGatePassed = status?.isMeetingGatePassed || false;

  return {
    isLoading,
    error,
    meetingStatus,
    scheduledMeetingTime,
    completedAt,
    isMeetingGatePassed,
    refetch: fetchMeetingStatus,
  };
};

export default useMeetingStatus;
