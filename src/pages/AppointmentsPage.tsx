import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Calendar,
  Clock,
  Video,
  Plus,
  RefreshCw,
  AlertCircle,
  Stethoscope,
  ArrowRight,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { PopupModal } from 'react-calendly';
import { calendlyService } from '../services/calendlyService';
import type { PatientMeeting } from '../types/calendly-types';
import { useCookieConsentStore } from '@/stores/cookieConsentStore';
import { SubscriptionRequired } from '@/components/subscription/SubscriptionRequired';

export const AppointmentsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [meetings, setMeetings] = useState<PatientMeeting[]>([]);
  const [doctorName, setDoctorName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [schedulingLink, setSchedulingLink] = useState<string | null>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<PatientMeeting | null>(null);
  const { consent, openPreferences } = useCookieConsentStore();
  const hasFunctionalConsent = consent?.functional ?? false;

  const loadMeetings = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await calendlyService.getPatientMeetings();

      if (response.success) {
        setMeetings(response.meetings);
        setDoctorName(response.doctorName || '');
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
    setTimeout(() => {
      loadMeetings();
    }, 2000);
  };

  const handleDirectBooking = async () => {
    setIsBookingLoading(true);
    setError(null);

    try {
      const eventTypesResponse = await calendlyService.getAvailableEventTypes();

      if (eventTypesResponse.success && eventTypesResponse.eventType) {
        const bookingResponse = await calendlyService.createPatientBookingLink(eventTypesResponse.eventType.type);

        if (bookingResponse.success) {
          setSchedulingLink(bookingResponse.schedulingLink);
        } else {
          setError('Failed to generate booking link');
        }
      } else {
        setError('No appointment types available');
      }
    } catch (err: any) {
      console.error('Booking error:', err);
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to generate booking link');
    } finally {
      setIsBookingLoading(false);
    }
  };

  const dateLocale = i18n.language === 'sv' ? 'sv-SE' : 'en-US';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(dateLocale, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(dateLocale, {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isUpcoming = (startTime: string) => {
    return new Date(startTime) > new Date();
  };

  const getMeetingReason = (meeting: PatientMeeting) => {
    if (meeting.source === 'pre-login') return t('appointments.firstConsultation');
    if (meeting.source === 'post-login') return t('appointments.followUp');
    return meeting.eventType || t('appointments.followUp');
  };

  const getMeetingDoctor = (meeting: PatientMeeting) => {
    return meeting.calendlyHostName || doctorName || '-';
  };

  const isActiveStatus = (status: string) => status === 'active' || status === 'scheduled';

  const upcomingMeetings = meetings
    .filter(m => isUpcoming(m.startTime) && isActiveStatus(m.status))
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const pastMeetings = meetings
    .filter(m => !isUpcoming(m.startTime) || m.status === 'completed' || m.status === 'canceled')
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  const BookButton = ({ className = '' }: { className?: string }) => (
    <Button
      onClick={() => {
        if (hasFunctionalConsent) {
          handleDirectBooking();
        } else {
          openPreferences();
        }
      }}
      disabled={isBookingLoading}
      className={`bg-teal-600 hover:bg-teal-700 flex items-center gap-2 ${className}`}
    >
      {isBookingLoading ? (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <Calendar className="w-4 h-4" />
      )}
      {isBookingLoading ? 'Loading...' : t('appointments.bookNew')}
    </Button>
  );

  return (
    <SubscriptionRequired featureName="Appointments">
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-end mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={loadMeetings}
            disabled={isLoading}
            className="h-10 w-10 p-0 rounded-full border-gray-300"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <BookButton />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="space-y-8">
          {/* Skeleton: Upcoming Section */}
          <div>
            <Skeleton className="h-7 w-56 mb-4" />
            <div className="bg-white rounded-2xl border border-gray-100 p-8 max-w-2xl">
              <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-40" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-10 w-36 mt-8 rounded-lg" />
            </div>
          </div>
          {/* Skeleton: Past Table */}
          <div>
            <Skeleton className="h-7 w-48 mb-4" />
            <div className="bg-[#F0F7F4] rounded-2xl p-4">
              <Skeleton className="h-12 w-full mb-1 rounded-none" />
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-14 w-full mb-1 rounded-none" />
              ))}
            </div>
          </div>
        </div>
      ) : meetings.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="text-center py-12">
            <Calendar className="size-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2 font-manrope">
              {t('appointments.noScheduled')}
            </h2>
            <p className="text-gray-500 font-manrope mb-6">
              {t('appointments.emptyMessage')}
            </p>
            <Button
              onClick={() => {
                if (hasFunctionalConsent) {
                  handleDirectBooking();
                } else {
                  openPreferences();
                }
              }}
              disabled={isBookingLoading}
              className="bg-teal-600 hover:bg-teal-700"
            >
              {isBookingLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              {isBookingLoading ? 'Loading...' : t('appointments.bookFirst')}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Upcoming Appointments Section */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 font-manrope mb-4">
              {t('appointments.upcoming')}
            </h2>
            {upcomingMeetings.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="text-center py-8">
                  <Calendar className="size-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-manrope mb-1">
                    {t('appointments.noUpcoming')}
                  </p>
                  <p className="text-sm text-gray-400 font-manrope mb-4">
                    {t('appointments.noUpcomingMessage')}
                  </p>
                  <BookButton />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="bg-white rounded-2xl border border-gray-100 p-8 max-w-2xl"
                  >
                    {/* 2x2 grid layout */}
                    <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                      {/* Date */}
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                          <Calendar className="w-4 h-4" />
                          <span>{t('appointments.date')}</span>
                        </div>
                        <p className="text-base font-medium text-gray-800">
                          {formatDate(meeting.startTime)}
                        </p>
                      </div>
                      {/* Time */}
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                          <Clock className="w-4 h-4" />
                          <span>{t('appointments.time')}</span>
                        </div>
                        <p className="text-base font-medium text-gray-800">
                          {formatTime(meeting.startTime)}
                          {meeting.endTime ? ` - ${formatTime(meeting.endTime)}` : ''}
                        </p>
                      </div>
                      {/* Doctor */}
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                          <Stethoscope className="w-4 h-4" />
                          <span>{t('appointments.doctor')}</span>
                        </div>
                        <p className="text-base font-medium text-gray-800">
                          {getMeetingDoctor(meeting)}
                        </p>
                      </div>
                      {/* Type */}
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                          <Video className="w-4 h-4" />
                          <span>{t('appointments.type')}</span>
                        </div>
                        <p className="text-base font-medium text-gray-800">
                          {meeting.eventType}
                        </p>
                      </div>
                    </div>
                    <div className="mt-8">
                      <Button
                        onClick={() => setSelectedMeeting(meeting)}
                        className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2 rounded-lg px-5"
                      >
                        {t('appointments.viewDetails')}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Appointments Section */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 font-manrope mb-4">
              {t('appointments.past')}
            </h2>
            {pastMeetings.length === 0 ? (
              <div className="bg-[#F0F7F4] rounded-2xl p-6">
                <div className="text-center py-8">
                  <p className="text-gray-400 font-manrope">
                    {t('appointments.noPastMessage')}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-[#F0F7F4] rounded-2xl p-4 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-gray-200 hover:bg-transparent">
                      <TableHead className="font-semibold text-gray-700 text-base">
                        {t('appointments.date')}
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700 text-base">
                        {t('appointments.doctor')}
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700 text-base">
                        {t('appointments.reason')}
                      </TableHead>
                      <TableHead className="w-12" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pastMeetings.map((meeting) => (
                      <TableRow key={meeting.id} className="border-b border-gray-200/60 hover:bg-white/40">
                        <TableCell>
                          {meeting.status === 'canceled' ? (
                            <span className="text-red-500 font-semibold">
                              {t('appointments.canceled')}
                            </span>
                          ) : (
                            <span className="text-gray-700">
                              {formatDate(meeting.startTime)}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-gray-700">
                          {getMeetingDoctor(meeting)}
                        </TableCell>
                        <TableCell className="text-gray-700">
                          {getMeetingReason(meeting)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <MoreHorizontal className="h-5 w-5 text-gray-500" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => setSelectedMeeting(meeting)}
                              >
                                <Calendar className="w-4 h-4 mr-2" />
                                {t('appointments.viewDetails')}
                              </DropdownMenuItem>
                              {meeting.rescheduleUrl && isActiveStatus(meeting.status) && (
                                <DropdownMenuItem
                                  onClick={() => window.open(meeting.rescheduleUrl!, '_blank')}
                                >
                                  {t('appointments.reschedule')}
                                </DropdownMenuItem>
                              )}
                              {meeting.cancelUrl && isActiveStatus(meeting.status) && (
                                <DropdownMenuItem
                                  onClick={() => window.open(meeting.cancelUrl!, '_blank')}
                                  className="text-red-600"
                                >
                                  {t('appointments.cancel')}
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Meeting Details Dialog */}
      <Dialog open={!!selectedMeeting} onOpenChange={(open) => !open && setSelectedMeeting(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-manrope">
              {t('appointments.details')}
            </DialogTitle>
            <DialogDescription>
              {t('appointments.detailsDesc')}
            </DialogDescription>
          </DialogHeader>
          {selectedMeeting && (
            <div className="space-y-5 pt-2">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">{t('appointments.date')}</p>
                  <p className="text-sm font-medium text-gray-800">{formatDate(selectedMeeting.startTime)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">{t('appointments.time')}</p>
                  <p className="text-sm font-medium text-gray-800">
                    {formatTime(selectedMeeting.startTime)}
                    {selectedMeeting.endTime ? ` - ${formatTime(selectedMeeting.endTime)}` : ''}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">{t('appointments.doctor')}</p>
                  <p className="text-sm font-medium text-gray-800">{getMeetingDoctor(selectedMeeting)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">{t('appointments.type')}</p>
                  <p className="text-sm font-medium text-gray-800">{selectedMeeting.eventType}</p>
                </div>
              </div>

              {selectedMeeting.status === 'canceled' && (
                <p className="text-sm text-red-500 font-medium">{t('appointments.canceled')}</p>
              )}

              {isActiveStatus(selectedMeeting.status) && (
                <div className="flex gap-2 pt-1">
                  {selectedMeeting.meetingUrl && (
                    <Button
                      size="sm"
                      onClick={() => window.open(selectedMeeting.meetingUrl!, '_blank')}
                      className="bg-teal-600 hover:bg-teal-700 text-white"
                    >
                      <Video className="w-3.5 h-3.5 mr-1.5" />
                      {t('appointments.joinMeeting')}
                    </Button>
                  )}
                  {selectedMeeting.rescheduleUrl && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(selectedMeeting.rescheduleUrl!, '_blank')}
                      className="border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                      {t('appointments.reschedule')}
                    </Button>
                  )}
                  {selectedMeeting.cancelUrl && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(selectedMeeting.cancelUrl!, '_blank')}
                      className="text-gray-400 hover:text-red-500 hover:bg-transparent"
                    >
                      {t('appointments.cancel')}
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Calendly Popup Modal - Only show if functional cookies accepted */}
      {hasFunctionalConsent && (
        <PopupModal
          url={schedulingLink || ''}
          open={!!schedulingLink}
          onModalClose={() => {
            setSchedulingLink(null);
            handleBookingSuccess();
          }}
          rootElement={document.getElementById('root')!}
        />
      )}
    </div>
    </SubscriptionRequired>
  );
};
