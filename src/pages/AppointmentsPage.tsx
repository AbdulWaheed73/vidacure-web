import React, { useState, useEffect, useRef } from 'react';
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
  MoreHorizontal,
  User,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryClient';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { PopupModal } from 'react-calendly';
import { calendlyService } from '../services/calendlyService';
import { providerService } from '../services/providerService';
import { usePatientMeetings, useMyProviders, useProviderMeetings } from '@/hooks/useDashboardQueries';
import type { PatientMeeting } from '../types/calendly-types';
import type { ProviderMeeting } from '../types/provider-types';
import { useCookieConsentStore } from '@/stores/cookieConsentStore';
import { useAuthStore } from '@/stores/authStore';
import { CALENDLY_FREE_CONSULTATION_URL } from '@/constants';
import { MeetingRequired } from '@/components/subscription';

// Horizontal scrolling carousel for upcoming appointment cards
const UpcomingAppointmentsCarousel: React.FC<{
  meetings: {
    id: string;
    startTime: string;
    endTime: string | null | undefined;
    specialist: string;
    type: string;
    tag: string;
    meetingUrl?: string | null;
    source: 'doctor' | 'provider';
    original: PatientMeeting | ProviderMeeting;
  }[];
  t: any;
  formatDate: (d: string) => string;
  formatTime: (d: string) => string;
  onViewDetails: (meeting: any) => void;
}> = ({ meetings, t, formatDate, formatTime, onViewDetails }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [meetings]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector<HTMLElement>('[data-card]')?.offsetWidth || 340;
    el.scrollBy({ left: direction === 'left' ? -cardWidth - 16 : cardWidth + 16, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Nav arrows */}
      {meetings.length > 1 && (
        <div className="flex justify-end gap-2 mb-3">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      )}

      {/* Scrollable cards */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        <style>{`[data-appointments-scroll]::-webkit-scrollbar { display: none; }`}</style>
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            data-card
            className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 shrink-0 w-[85vw] sm:w-[340px]"
          >
            {/* Tag */}
            <div className="mb-3">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-sora font-semibold ${
                meeting.source === 'doctor'
                  ? 'bg-[#f0f7f4] text-[#005044]'
                  : 'bg-purple-50 text-purple-700'
              }`}>
                {meeting.tag}
              </span>
            </div>

            {/* 2x2 grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-0.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{t('appointments.date')}</span>
                </div>
                <p className="text-sm font-medium text-gray-800">{formatDate(meeting.startTime)}</p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-0.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{t('appointments.time')}</span>
                </div>
                <p className="text-sm font-medium text-gray-800">
                  {formatTime(meeting.startTime)}
                  {meeting.endTime ? ` - ${formatTime(meeting.endTime)}` : ''}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-0.5">
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>{t('appointments.specialist', 'Specialist')}</span>
                </div>
                <p className="text-sm font-medium text-gray-800">{meeting.specialist}</p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-0.5">
                  <Video className="w-3.5 h-3.5" />
                  <span>{t('appointments.type')}</span>
                </div>
                <p className="text-sm font-medium text-gray-800">{meeting.type}</p>
              </div>
            </div>

            {/* Action button */}
            <div className="mt-4">
              {meeting.source === 'doctor' ? (
                <button
                  onClick={() => onViewDetails(meeting)}
                  className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                >
                  {t('appointments.viewDetails')}
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : meeting.meetingUrl ? (
                <a
                  href={meeting.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                >
                  <Video className="w-4 h-4" />
                  {t('appointments.joinMeeting', 'Join Meeting')}
                </a>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AppointmentsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const qc = useQueryClient();
  const { data: meetingsData, isLoading, error: meetingsError, refetch: refetchMeetings } = usePatientMeetings();
  const { data: providersData, refetch: refetchProviders } = useMyProviders();
  const { data: providerMeetingsData, refetch: refetchProviderMeetings } = useProviderMeetings();

  const meetings = meetingsData?.meetings ?? [];
  const doctorName = meetingsData?.doctorName ?? '';
  const myProviders = providersData?.providers ?? [];
  const providerMeetings = providerMeetingsData?.meetings ?? [];

  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [schedulingLink, setSchedulingLink] = useState<string | null>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<PatientMeeting | null>(null);
  const [isProviderBookingLoading, setIsProviderBookingLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('doctor');
  const [useFallbackBooking, setUseFallbackBooking] = useState(false);
  const { consent, openPreferences } = useCookieConsentStore();
  const hasFunctionalConsent = consent?.functional ?? false;
  const user = useAuthStore((s) => s.user);

  // Derive display error from query error or booking error
  const error = bookingError || (meetingsError ? t('appointments.errors.loadFailed') : null);

  const handleProviderBooking = async (providerId: string) => {
    if (!hasFunctionalConsent) {
      openPreferences();
      return;
    }
    setIsProviderBookingLoading(true);
    setBookingError(null);
    try {
      const response = await providerService.createBookingLink(providerId);
      if (response.success) {
        setSchedulingLink(response.schedulingLink);
      }
    } catch (err: any) {
      setBookingError(err.response?.data?.error || 'Failed to generate booking link');
    } finally {
      setIsProviderBookingLoading(false);
    }
  };

  const handleRefresh = () => {
    refetchMeetings();
    refetchProviders();
    refetchProviderMeetings();
  };

  const handleBookingSuccess = () => {
    setTimeout(() => {
      qc.invalidateQueries({ queryKey: queryKeys.patientMeetings });
      qc.invalidateQueries({ queryKey: queryKeys.myProviders });
      qc.invalidateQueries({ queryKey: queryKeys.providerMeetings });
    }, 2000);
  };

  const handleDirectBooking = async () => {
    setIsBookingLoading(true);
    setBookingError(null);

    try {
      const eventTypesResponse = await calendlyService.getAvailableEventTypes();

      if (eventTypesResponse.success && eventTypesResponse.eventType) {
        const bookingResponse = await calendlyService.createPatientBookingLink(eventTypesResponse.eventType.type);

        if (bookingResponse.success) {
          setSchedulingLink(bookingResponse.schedulingLink);
        } else {
          // No booking link — fall back to generic URL
          setUseFallbackBooking(true);
        }
      } else {
        // No event types (no doctor assigned) — fall back to generic URL
        setUseFallbackBooking(true);
      }
    } catch (err: any) {
      console.error('Booking error:', err);
      // Fall back to generic URL instead of showing an error
      setUseFallbackBooking(true);
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

  const upcomingProviderMeetings = providerMeetings
    .filter(m => new Date(m.scheduledTime) > new Date() && m.status === 'scheduled')
    .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime());

  const pastProviderMeetings = providerMeetings
    .filter(m => new Date(m.scheduledTime) <= new Date() || m.status === 'completed' || m.status === 'canceled')
    .sort((a, b) => new Date(b.scheduledTime).getTime() - new Date(a.scheduledTime).getTime());

  // Unified upcoming list: merge doctor appointments + provider meetings
  type UnifiedMeeting = {
    id: string;
    startTime: string;
    endTime: string | null | undefined;
    specialist: string;
    type: string;
    tag: string;
    meetingUrl?: string | null;
    source: 'doctor' | 'provider';
    original: PatientMeeting | ProviderMeeting;
  };

  const allUpcoming: UnifiedMeeting[] = [
    ...upcomingMeetings.map((m): UnifiedMeeting => ({
      id: m.id,
      startTime: m.startTime,
      endTime: m.endTime,
      specialist: getMeetingDoctor(m),
      type: m.eventType || t('appointments.followUp'),
      tag: t('appointments.doctor', 'Doctor'),
      meetingUrl: m.meetingUrl,
      source: 'doctor',
      original: m,
    })),
    ...upcomingProviderMeetings.map((m): UnifiedMeeting => ({
      id: m._id || m.eventUri,
      startTime: m.scheduledTime,
      endTime: m.endTime || null,
      specialist: m.providerName,
      type: m.eventType || m.providerType,
      tag: m.providerType.charAt(0).toUpperCase() + m.providerType.slice(1),
      meetingUrl: m.meetingUrl,
      source: 'provider',
      original: m,
    })),
  ].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  return (
    <MeetingRequired>
    <div className="p-4 md:p-8">
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="doctor">{t('appointments.title')}</TabsTrigger>
          <TabsTrigger value="specialists">
            {t('appointments.specialists', 'Specialists')}
            {myProviders.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">{myProviders.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="specialists" className="mt-6">
          {/* Assigned Providers */}
          {myProviders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="text-center py-12">
                <Stethoscope className="size-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2 font-manrope">
                  {t('appointments.noSpecialists', 'No specialists assigned yet')}
                </h2>
                <p className="text-gray-500 font-manrope">
                  {t('appointments.noSpecialistsMessage', 'Your care team will assign specialists as needed.')}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Provider Cards */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 font-manrope mb-4">
                  {t('appointments.yourSpecialists', 'Your Specialists')}
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {myProviders.map((provider) => (
                    <div key={provider._id} className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-gray-800">{provider.name}</h3>
                          <Badge variant="secondary" className="mt-1">
                            {provider.providerType === 'physician' ? t('appointments.physician', 'Physician') : provider.providerType === 'hypnotherapist' ? t('appointments.hypnotherapist', 'Hypnotherapist') : provider.providerType}
                          </Badge>
                          {provider.specialty && (
                            <p className="text-sm text-gray-500 mt-1">{provider.specialty}</p>
                          )}
                          {provider.bio && (
                            <p className="text-sm text-gray-600 mt-2">{provider.bio}</p>
                          )}
                        </div>
                        <Button
                          onClick={() => handleProviderBooking(provider._id)}
                          disabled={isProviderBookingLoading}
                          size="sm"
                          className="bg-teal-600 hover:bg-teal-700"
                        >
                          <Calendar className="w-4 h-4 mr-1" />
                          {t('appointments.bookSpecialist', 'Book')}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Provider Meetings */}
              {upcomingProviderMeetings.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-800 font-manrope mb-4">
                    {t('appointments.upcoming')}
                  </h2>
                  <div className="space-y-4">
                    {upcomingProviderMeetings.map((meeting, idx) => (
                      <div key={idx} className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6">
                        <div className="grid grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4">
                          <div>
                            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 mb-1">
                              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              <span>{t('appointments.date')}</span>
                            </div>
                            <p className="text-sm sm:text-base font-medium text-gray-800">{formatDate(meeting.scheduledTime)}</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 mb-1">
                              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              <span>{t('appointments.time')}</span>
                            </div>
                            <p className="text-sm sm:text-base font-medium text-gray-800">
                              {formatTime(meeting.scheduledTime)}
                              {meeting.endTime ? ` - ${formatTime(meeting.endTime)}` : ''}
                            </p>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 mb-1">
                              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              <span>{t('appointments.specialist', 'Specialist')}</span>
                            </div>
                            <p className="text-sm sm:text-base font-medium text-gray-800">{meeting.providerName}</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 mb-1">
                              <Stethoscope className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              <span>{t('appointments.type')}</span>
                            </div>
                            <p className="text-sm sm:text-base font-medium text-gray-800 capitalize">{meeting.providerType}</p>
                          </div>
                        </div>
                        {meeting.meetingUrl && (
                          <div className="mt-4">
                            <Button
                              size="sm"
                              onClick={() => window.open(meeting.meetingUrl!, '_blank')}
                              className="bg-teal-600 hover:bg-teal-700 text-white"
                            >
                              <Video className="w-4 h-4 mr-1" />
                              {t('appointments.joinMeeting')}
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Past Provider Meetings */}
              {pastProviderMeetings.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-800 font-manrope mb-4">
                    {t('appointments.past')}
                  </h2>
                  <div className="bg-[#F0F7F4] rounded-2xl p-4 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-gray-200 hover:bg-transparent">
                          <TableHead className="font-semibold text-gray-700">{t('appointments.date')}</TableHead>
                          <TableHead className="font-semibold text-gray-700">{t('appointments.specialist', 'Specialist')}</TableHead>
                          <TableHead className="font-semibold text-gray-700">{t('appointments.type')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pastProviderMeetings.map((meeting, idx) => (
                          <TableRow key={idx} className="border-b border-gray-200/60 hover:bg-white/40">
                            <TableCell>
                              {meeting.status === 'canceled' ? (
                                <span className="text-red-500 font-semibold">{t('appointments.canceled')}</span>
                              ) : (
                                <span className="text-gray-700">{formatDate(meeting.scheduledTime)}</span>
                              )}
                            </TableCell>
                            <TableCell className="text-gray-700">{meeting.providerName}</TableCell>
                            <TableCell className="text-gray-700 capitalize">{meeting.providerType}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="doctor" className="mt-6">

      {/* Header */}
      <div className="flex items-center justify-end mb-4 md:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
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
            <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-8 max-w-2xl">
              <div className="grid grid-cols-2 gap-x-4 sm:gap-x-12 gap-y-4 sm:gap-y-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-16 sm:w-24" />
                    <Skeleton className="h-5 w-24 sm:w-40" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-10 w-36 mt-4 sm:mt-8 rounded-lg" />
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
      ) : meetings.length === 0 && providerMeetings.length === 0 ? (
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
            {allUpcoming.length === 0 ? (
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
              <UpcomingAppointmentsCarousel
                meetings={allUpcoming}
                t={t}
                formatDate={formatDate}
                formatTime={formatTime}
                onViewDetails={(meeting) => setSelectedMeeting(meeting.original as PatientMeeting)}
              />
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
              <div className="bg-[#F0F7F4] rounded-2xl p-2 sm:p-4 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-gray-200 hover:bg-transparent">
                      <TableHead className="font-semibold text-gray-700 text-sm sm:text-base hidden sm:table-cell">
                        {t('appointments.date')}
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700 text-sm sm:text-base">
                        {t('appointments.doctor')}
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700 text-sm sm:text-base">
                        {t('appointments.reason')}
                      </TableHead>
                      <TableHead className="w-10 sm:w-12" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pastMeetings.map((meeting) => (
                      <TableRow key={meeting.id} className="border-b border-gray-200/60 hover:bg-white/40">
                        <TableCell className="hidden sm:table-cell">
                          {meeting.status === 'canceled' ? (
                            <span className="text-red-500 font-semibold text-sm">
                              {t('appointments.canceled')}
                            </span>
                          ) : (
                            <span className="text-gray-700 text-sm">
                              {formatDate(meeting.startTime)}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-gray-700 text-sm">
                          <div>{getMeetingDoctor(meeting)}</div>
                          <div className="sm:hidden text-xs text-gray-400 mt-0.5">
                            {meeting.status === 'canceled'
                              ? <span className="text-red-500 font-semibold">{t('appointments.canceled')}</span>
                              : formatDate(meeting.startTime)}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-700 text-sm">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
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
                <div className="flex flex-wrap gap-2 pt-1">
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

      {/* Close doctor TabsContent and Tabs */}
        </TabsContent>
      </Tabs>

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

      {/* Fallback generic booking popup (no doctor assigned) */}
      {hasFunctionalConsent && (
        <PopupModal
          url={CALENDLY_FREE_CONSULTATION_URL}
          open={useFallbackBooking}
          onModalClose={() => {
            setUseFallbackBooking(false);
            handleBookingSuccess();
          }}
          rootElement={document.getElementById('root')!}
          utm={user?.userId ? { utmTerm: `patient_${user.userId}` } : undefined}
        />
      )}
    </div>
    </MeetingRequired>
  );
};
