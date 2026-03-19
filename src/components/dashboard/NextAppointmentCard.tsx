import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, Video } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/skeleton';
import { usePatientMeetings } from '@/hooks/useDashboardQueries';

export const NextAppointmentCard: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { data, isLoading } = usePatientMeetings();

  const doctorName = data?.doctor?.name || data?.doctorName || '';

  const now = new Date();
  const nextMeeting = data?.meetings
    ?.filter(m => new Date(m.startTime) > now && m.status !== 'canceled')
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0] ?? null;

  const dateLocale = i18n.language === 'sv' ? 'sv-SE' : 'en-US';

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
          <CardTitle className="text-lg font-manrope">{t('dashboard.nextAppointment')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <p className="text-gray-500 mb-4 text-center text-sm">{t('dashboard.noUpcomingAppointments')}</p>
          <Button onClick={() => navigate('/appointments')} className="bg-teal-600 hover:bg-teal-700 text-white">
            {t('dashboard.bookAppointment')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const startDate = new Date(nextMeeting.startTime);
  const dateStr = startDate.toLocaleDateString(dateLocale, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const timeStr = startDate.toLocaleTimeString(dateLocale, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card className="bg-white/95 backdrop-blur-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-manrope">{t('dashboard.nextAppointment')}</CardTitle>
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
          <span>{t('dashboard.videoCall')}</span>
        </div>
        {doctorName && (
          <p className="text-sm text-gray-500">{t('dashboard.withDr')} {doctorName}</p>
        )}
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-2"
          onClick={() => navigate('/appointments')}
        >
          {t('dashboard.viewDetails')}
        </Button>
      </CardContent>
    </Card>
  );
};
