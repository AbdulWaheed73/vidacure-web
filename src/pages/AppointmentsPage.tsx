import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Calendar,
  Clock,
  Video,
  Plus,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { AppointmentBooking } from '../components/AppointmentBooking';
import { calendlyService, type PatientMeeting } from '../services/calendlyService';

export const AppointmentsPage: React.FC = () => {
  const { t } = useTranslation();
  const [meetings, setMeetings] = useState<PatientMeeting[]>([]);
  const [doctorName, setDoctorName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const loadMeetings = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await calendlyService.getPatientMeetings();

      if (response.success) {
        setMeetings(response.meetings);
        setDoctorName(response.doctorName);
      }
    } catch (err: any) {
      console.error('Error loading meetings:', err);

      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(t('appointments.errors.loadFailed'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMeetings();
  }, []);

  const handleBookingSuccess = () => {
    // Refresh meetings after booking
    setTimeout(() => {
      loadMeetings();
    }, 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sv-SE', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('sv-SE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            {t('appointments.status.active')}
          </Badge>
        );
      case 'canceled':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            {t('appointments.status.canceled')}
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <AlertCircle className="w-3 h-3 mr-1" />
            {status}
          </Badge>
        );
    }
  };

  const isUpcoming = (startTime: string) => {
    return new Date(startTime) > new Date();
  };


  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Calendar className="size-8 text-teal-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800 font-manrope">
                {t('appointments.title')}
              </h1>
              {doctorName && (
                <p className="text-sm text-gray-600 font-manrope">
                  {t('appointments.assignedDoctor')}: <span className="font-medium">{doctorName}</span>
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={loadMeetings}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {t('common.refresh')}
            </Button>
            <Button
              onClick={() => setIsBookingOpen(true)}
              className="bg-teal-600 hover:bg-teal-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {t('appointments.bookNew')}
            </Button>
          </div>
        </div>
        <p className="text-lg text-gray-600 font-manrope">
          {t('appointments.description')}
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}


      {/* Meetings List */}
      {isLoading ? (
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-6">
          <div className="text-center py-12">
            <RefreshCw className="size-8 text-gray-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600 font-manrope">{t('appointments.loading')}</p>
          </div>
        </div>
      ) : meetings.length === 0 ? (
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-6">
          <div className="text-center py-12">
            <Calendar className="size-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2 font-manrope">
              {t('appointments.noScheduled')}
            </h2>
            <p className="text-gray-500 font-manrope mb-4">
              {t('appointments.emptyMessage')}
            </p>
            <Button
              onClick={() => setIsBookingOpen(true)}
              className="bg-teal-600 hover:bg-teal-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('appointments.bookFirst')}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {meetings.map((meeting) => (
            <Card key={meeting.id} className="bg-white/95 backdrop-blur-md shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-manrope flex items-center gap-2">
                    <Clock className="w-5 h-5 text-teal-600" />
                    {meeting.eventType}
                  </CardTitle>
                  {getStatusBadge(meeting.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      {t('appointments.dateTime')}
                    </p>
                    <p className="text-gray-600">
                      {formatDate(meeting.startTime)}
                    </p>
                    <p className="text-gray-600">
                      {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
                    </p>
                    {isUpcoming(meeting.startTime) && meeting.status === 'active' && (
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                        {t('appointments.upcoming')}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      {t('appointments.with')}
                    </p>
                    <p className="text-gray-600">{doctorName}</p>
                    <p className="text-xs text-gray-500">
                      {t('appointments.bookedOn')}: {formatDate(meeting.createdAt)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      {t('appointments.actions')}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {meeting.meetingUrl && meeting.status === 'active' && (
                        <Button
                          size="sm"
                          onClick={() => window.open(meeting.meetingUrl!, '_blank')}
                          className="bg-green-600 hover:bg-green-700 text-xs"
                        >
                          <Video className="w-3 h-3 mr-1" />
                          {t('appointments.joinMeeting')}
                        </Button>
                      )}
                      {meeting.rescheduleUrl && meeting.status === 'active' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(meeting.rescheduleUrl!, '_blank')}
                          className="text-xs"
                        >
                          <Calendar className="w-3 h-3 mr-1" />
                          {t('appointments.reschedule')}
                        </Button>
                      )}
                      {meeting.cancelUrl && meeting.status === 'active' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(meeting.cancelUrl!, '_blank')}
                          className="text-xs text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          {t('appointments.cancel')}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      <AppointmentBooking
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onSuccess={handleBookingSuccess}
      />
    </div>
  );
};