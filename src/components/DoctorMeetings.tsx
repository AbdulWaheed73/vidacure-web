import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Video, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { calendlyService } from '../services/calendlyService';
import type { PatientMeeting } from '../types/calendly-types';

export const DoctorMeetings: React.FC = () => {
  const [meetings, setMeetings] = useState<PatientMeeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMeetings = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await calendlyService.getDoctorOwnMeetings();

      if (response.success) {
        setMeetings(response.meetings);
      }
    } catch (err: any) {
      console.error('Error loading doctor meetings:', err);

      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to load meetings');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMeetings();
  }, []);

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
            Active
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

  const isCurrent = (startTime: string, endTime: string) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    return now >= start && now <= end;
  };

  const getCardStyle = (meeting: PatientMeeting) => {
    if (isCurrent(meeting.startTime, meeting.endTime)) {
      return "bg-green-50 border-green-200";
    }
    return "bg-white/95";
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
                My Appointments
              </h1>
              <p className="text-sm text-gray-600 font-manrope">
                Manage your scheduled patient appointments
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={loadMeetings}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
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
            <p className="text-gray-600 font-manrope">Loading appointments...</p>
          </div>
        </div>
      ) : meetings.length === 0 ? (
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-6">
          <div className="text-center py-12">
            <Calendar className="size-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2 font-manrope">
              No Appointments Scheduled
            </h2>
            <p className="text-gray-500 font-manrope">
              You don't have any upcoming appointments
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {meetings.map((meeting) => (
            <Card key={meeting.id} className={`${getCardStyle(meeting)} backdrop-blur-md shadow-lg`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-manrope flex items-center gap-2">
                    <Clock className="w-5 h-5 text-teal-600" />
                    {meeting.eventType}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(meeting.status)}
                    {isCurrent(meeting.startTime, meeting.endTime) && (
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs animate-pulse">
                        Live Now
                      </Badge>
                    )}
                    {isUpcoming(meeting.startTime) && meeting.status === 'active' && !isCurrent(meeting.startTime, meeting.endTime) && (
                      <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs">
                        Upcoming
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      Patient
                    </p>
                    <p className="text-gray-900 font-medium">{meeting.patientName}</p>
                    <p className="text-xs text-gray-500">
                      {meeting.patientEmail}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      Date & Time
                    </p>
                    <p className="text-gray-600">
                      {formatDate(meeting.startTime)}
                    </p>
                    <p className="text-gray-600">
                      {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Booked: {formatDate(meeting.createdAt)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      Actions
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {meeting.meetingUrl && meeting.status === 'active' && (
                        <Button
                          size="sm"
                          onClick={() => window.open(meeting.meetingUrl!, '_blank')}
                          className={`text-xs ${
                            isCurrent(meeting.startTime, meeting.endTime)
                              ? 'bg-green-600 hover:bg-green-700'
                              : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                        >
                          <Video className="w-3 h-3 mr-1" />
                          {isCurrent(meeting.startTime, meeting.endTime) ? 'Start Call' : 'Join Meeting'}
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
    </div>
  );
};