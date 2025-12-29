import { useState, useEffect, useCallback } from 'react';
import { meetingService, type MeetingStatusResponse } from '@/services/meetingService';

export type MeetingStatusHookResult = {
  isLoading: boolean;
  error: string | null;
  meetingStatus: 'none' | 'scheduled' | 'completed';
  scheduledMeetingTime: Date | null;
  meetingCompletedAt: Date | null;
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
  const meetingCompletedAt = status?.meetingCompletedAt
    ? new Date(status.meetingCompletedAt)
    : null;

  // Check if meeting gate is passed (can subscribe)
  // This is also calculated on the server, but we compute it client-side for real-time updates
  let isMeetingGatePassed = status?.isMeetingGatePassed || false;

  // Client-side auto-unlock: if scheduled time has passed, consider gate as passed
  if (!isMeetingGatePassed && meetingStatus === 'scheduled' && scheduledMeetingTime) {
    isMeetingGatePassed = new Date() > scheduledMeetingTime;
  }

  return {
    isLoading,
    error,
    meetingStatus,
    scheduledMeetingTime,
    meetingCompletedAt,
    isMeetingGatePassed,
    refetch: fetchMeetingStatus,
  };
};

export default useMeetingStatus;
