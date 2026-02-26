import React, { useState } from 'react';
import { Video, RefreshCw, Calendar, Clock, ChevronDown } from 'lucide-react';
import { useDoctorMeetings } from '@/hooks/useDoctorDashboardQueries';
import type { PatientMeeting } from '@/types/calendly-types';

const formatTime = (dateStr: string): string => {
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  ) {
    return 'Today';
  }
  if (
    date.getFullYear() === tomorrow.getFullYear() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getDate() === tomorrow.getDate()
  ) {
    return 'Tomorrow';
  }
  if (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  ) {
    return 'Yesterday';
  }
  return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
};

const isUpcoming = (startTime: string): boolean => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return new Date(startTime) >= startOfToday;
};

const isCurrent = (startTime: string, endTime: string | null): boolean => {
  if (!endTime) return false;
  const now = new Date();
  return now >= new Date(startTime) && now <= new Date(endTime);
};

// --- Upcoming appointment card (rich, actionable) ---

const UpcomingCard: React.FC<{ meeting: PatientMeeting; isFirst: boolean }> = ({ meeting, isFirst }) => {
  const live = meeting.endTime ? isCurrent(meeting.startTime, meeting.endTime) : false;

  if (isFirst || live) {
    return (
      <div className="bg-[#005044] rounded-2xl p-4 md:p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
          <h3 className="font-sora font-semibold text-lg">
            {meeting.patientName || meeting.inviteeName || 'Patient'}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            {live && (
              <span className="bg-white/25 rounded-full px-3 py-1 text-xs font-sora font-semibold animate-pulse">
                Live Now
              </span>
            )}
            <span className="bg-white/20 rounded-full px-3 py-1 text-sm font-sora">
              {formatDate(meeting.startTime)}
            </span>
            <span className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 text-sm font-sora">
              <Video className="w-3.5 h-3.5" />
              {formatTime(meeting.startTime)}
            </span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <p className="text-white/70 text-sm font-manrope">{meeting.eventType}</p>
            {meeting.inviteeEmail && (
              <p className="text-white/50 text-xs font-manrope mt-0.5">{meeting.inviteeEmail}</p>
            )}
          </div>
          {meeting.meetingUrl && meeting.status === 'active' && (
            <button
              onClick={() => window.open(meeting.meetingUrl!, '_blank')}
              className="bg-white text-[#005044] rounded-full px-6 py-2.5 font-sora font-semibold text-sm hover:bg-white/90 transition-colors self-start md:self-auto"
            >
              {live ? 'Start Call' : 'Join Meeting'}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#e0e0e0] rounded-2xl p-4 md:p-5 hover:border-[#c0ebe5] transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3 md:gap-4 min-w-0">
          <div className="w-10 h-10 rounded-full bg-[#f0f7f4] flex items-center justify-center flex-shrink-0">
            <Video className="w-4 h-4 text-[#005044]" />
          </div>
          <div className="min-w-0">
            <h3 className="font-sora font-semibold text-[#282828]">
              {meeting.patientName || meeting.inviteeName || 'Patient'}
            </h3>
            <p className="text-[#b0b0b0] text-sm font-manrope mt-0.5">{meeting.eventType}</p>
            {meeting.inviteeEmail && (
              <p className="text-[#b0b0b0] text-xs font-manrope mt-0.5 truncate">{meeting.inviteeEmail}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap flex-shrink-0 pl-13 md:pl-0">
          <span className="bg-[#f0f7f4] text-[#005044] rounded-full px-3 py-1 text-sm font-sora font-medium">
            {formatDate(meeting.startTime)}
          </span>
          <span className="flex items-center gap-1.5 bg-[#f0f7f4] text-[#005044] rounded-full px-3 py-1 text-sm font-sora font-medium">
            <Video className="w-3.5 h-3.5" />
            {formatTime(meeting.startTime)}
          </span>
          {meeting.meetingUrl && meeting.status === 'active' && (
            <button
              onClick={() => window.open(meeting.meetingUrl!, '_blank')}
              className="bg-[#005044] text-white rounded-full px-5 py-2 font-sora font-semibold text-sm hover:bg-[#004038] transition-colors"
            >
              Join Meeting
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Past appointment card (muted, informational) ---

const PastCard: React.FC<{ meeting: PatientMeeting }> = ({ meeting }) => (
  <div className="bg-white border border-[#ebebeb] rounded-2xl p-4 md:p-5 opacity-75 hover:opacity-100 transition-opacity">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div className="flex items-center gap-3 md:gap-4 min-w-0">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
          <Clock className="w-4 h-4 text-[#b0b0b0]" />
        </div>
        <div className="min-w-0">
          <h3 className="font-sora font-semibold text-[#282828]">
            {meeting.patientName || meeting.inviteeName || 'Patient'}
          </h3>
          <p className="text-[#b0b0b0] text-sm font-manrope mt-0.5">{meeting.eventType}</p>
          {meeting.inviteeEmail && (
            <p className="text-[#b0b0b0] text-xs font-manrope mt-0.5 truncate">{meeting.inviteeEmail}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0 pl-13 md:pl-0">
        <span className="bg-gray-100 text-[#b0b0b0] rounded-full px-3 py-1 text-sm font-sora font-medium">
          {formatDate(meeting.startTime)}
        </span>
        <span className="flex items-center gap-1.5 bg-gray-100 text-[#b0b0b0] rounded-full px-3 py-1 text-sm font-sora font-medium">
          <Clock className="w-3.5 h-3.5" />
          {formatTime(meeting.startTime)}
        </span>
      </div>
    </div>
  </div>
);

// --- Skeletons ---

const SkeletonRow: React.FC = () => (
  <div className="animate-pulse rounded-2xl border border-gray-100 p-4 md:p-5 space-y-3 md:space-y-0 md:flex md:items-center md:justify-between">
    <div className="flex items-center gap-3 md:gap-4">
      <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-32" />
        <div className="h-3 bg-gray-200 rounded w-20" />
      </div>
    </div>
    <div className="flex items-center gap-3 pl-13 md:pl-0">
      <div className="h-7 bg-gray-200 rounded-full w-16" />
      <div className="h-7 bg-gray-200 rounded-full w-20" />
    </div>
  </div>
);

// --- Main Page ---

const DoctorAppointments: React.FC = () => {
  const [showPast, setShowPast] = useState(true);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useDoctorMeetings();

  const allMeetings = (data?.pages ?? [])
    .flatMap((page) => page.meetings)
    .filter((m) => m.status !== 'canceled');

  const upcoming = allMeetings
    .filter((m) => isUpcoming(m.startTime))
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const past = allMeetings
    .filter((m) => !isUpcoming(m.startTime))
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h1 className="font-sora font-bold text-xl md:text-2xl text-[#282828]">Appointments</h1>
        <button
          onClick={() => refetch()}
          disabled={isRefetching}
          className="flex items-center gap-2 bg-[#f0f7f4] text-[#005044] rounded-full px-5 py-2.5 font-sora font-semibold text-sm hover:bg-[#c0ebe5] transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      ) : allMeetings.length === 0 ? (
        <div className="bg-white rounded-[20px] shadow-[0px_4px_10px_0px_rgba(0,0,0,0.08)] p-8 md:p-16 text-center">
          <Calendar className="w-12 h-12 md:w-16 md:h-16 text-[#c0ebe5] mx-auto mb-4" />
          <h2 className="font-sora font-semibold text-lg text-[#282828] mb-2">No Appointments Yet</h2>
          <p className="text-[#b0b0b0] font-manrope text-sm">Appointments will appear here once patients book with you</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* ── Upcoming Section ── */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#005044]" />
              <h2 className="font-sora font-bold text-lg text-[#282828]">Upcoming</h2>
              <span className="bg-[#f0f7f4] text-[#005044] rounded-full px-2.5 py-0.5 text-xs font-sora font-semibold">
                {upcoming.length}
              </span>
            </div>

            {upcoming.length === 0 ? (
              <div className="bg-[#f0f7f4] rounded-2xl p-6 md:p-8 text-center">
                <Calendar className="w-10 h-10 text-[#005044] mx-auto mb-3 opacity-40" />
                <p className="text-[#005044] font-manrope text-sm opacity-60">No upcoming appointments</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcoming.map((meeting, index) => (
                  <UpcomingCard key={meeting.id} meeting={meeting} isFirst={index === 0} />
                ))}
              </div>
            )}
          </section>

          {/* ── Past Section ── */}
          {past.length > 0 && (
            <section>
              <button
                onClick={() => setShowPast(!showPast)}
                className="flex items-center gap-3 mb-4 group cursor-pointer"
              >
                <div className="w-2 h-2 rounded-full bg-[#b0b0b0]" />
                <h2 className="font-sora font-bold text-lg text-[#b0b0b0] group-hover:text-[#282828] transition-colors">
                  Past
                </h2>
                <span className="bg-gray-100 text-[#b0b0b0] rounded-full px-2.5 py-0.5 text-xs font-sora font-semibold">
                  {past.length}
                </span>
                <ChevronDown className={`w-4 h-4 text-[#b0b0b0] transition-transform ${showPast ? 'rotate-180' : ''}`} />
              </button>

              {showPast && (
                <div className="space-y-3">
                  {past.map((meeting) => (
                    <PastCard key={meeting.id} meeting={meeting} />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ── Load More ── */}
          {hasNextPage && (
            <div className="flex justify-center pt-2 pb-4">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="bg-[#005044] text-white rounded-full px-8 py-3 font-sora font-semibold text-sm hover:bg-[#004038] transition-colors flex items-center gap-2"
              >
                {isFetchingNextPage ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More Appointments'
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
