import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Video } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/skeleton';
import { usePatientMeetings } from '@/hooks/useDashboardQueries';

export const NextAppointmentCard: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading } = usePatientMeetings();

  const doctorName = data?.doctor?.name || data?.doctorName || '';

  const now = new Date();
  const nextMeeting = data?.meetings
    ?.filter(m => new Date(m.startTime) > now && m.status !== 'canceled')
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0] ?? null;

  if (isLoading) {
    return (
      <Card className="bg-white/95 backdrop-blur-md shadow-lg">
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-5 w-32 mb-3" />
          <Skeleton className="h-5 w-24 mb-3" />
          <Skeleton className="h-5 w-28" />
        </CardContent>
      </Card>
    );
  }

  if (!nextMeeting) {
    return (
      <Card className="bg-white/95 backdrop-blur-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-manrope">Next Appointment</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <p className="text-gray-500 mb-4 text-center text-sm">No upcoming appointments</p>
          <Button onClick={() => navigate('/appointments')} className="bg-teal-600 hover:bg-teal-700 text-white">
            Book Appointment
          </Button>
        </CardContent>
      </Card>
    );
  }

  const startDate = new Date(nextMeeting.startTime);
  const dateStr = startDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const timeStr = startDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card className="bg-white/95 backdrop-blur-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-manrope">Next Appointment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <Calendar className="size-4 text-teal-600 shrink-0" />
          <span>{dateStr}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <Clock className="size-4 text-teal-600 shrink-0" />
          <span>{timeStr}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <Video className="size-4 text-teal-600 shrink-0" />
          <span>Video Call</span>
        </div>
        {doctorName && (
          <p className="text-sm text-gray-500">with Dr. {doctorName}</p>
        )}
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-2"
          onClick={() => navigate('/appointments')}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};
