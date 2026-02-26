import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Video } from 'lucide-react';
import { useDoctorMeetings, useDoctorPrescriptions, useDoctorConversations } from '@/hooks/useDoctorDashboardQueries';
import { useChatUnreadCounts } from '@/hooks/useChatQueries';
import type { DashboardPageProps } from '../types';
import type { PatientMeeting } from '@/types/calendly-types';
import type { DoctorPrescriptionRequest } from '@/types/doctor-prescription-types';
import type { ConversationWithDetails } from '@/types/supabase-chat-types';

const formatTime = (dateStr: string): string => {
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

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
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const formatRelativeTime = (dateStr: string): string => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// --- Sub-components ---

const AppointmentCardHighlighted: React.FC<{ meeting: PatientMeeting }> = ({ meeting }) => (
  <div className="bg-[#005044] rounded-2xl p-4 sm:p-6 text-white">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
      <h3 className="font-sora font-semibold text-lg">
        {meeting.patientName || meeting.inviteeName || 'Patient'}
      </h3>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="bg-white/20 rounded-full px-3 py-1 text-sm font-sora">
          {formatDate(meeting.startTime)}
        </span>
        <span className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 text-sm font-sora">
          <Video className="w-3.5 h-3.5" />
          {formatTime(meeting.startTime)}
        </span>
      </div>
    </div>
    <p className="text-white/80 text-sm mb-4 font-manrope">{meeting.eventType}</p>
    {meeting.meetingUrl && (
      <button
        onClick={() => window.open(meeting.meetingUrl!, '_blank')}
        className="bg-white text-[#005044] rounded-full px-6 py-2.5 font-sora font-semibold text-sm hover:bg-white/90 transition-colors"
      >
        Start Call
      </button>
    )}
  </div>
);

const AppointmentCard: React.FC<{ meeting: PatientMeeting }> = ({ meeting }) => (
  <div className="border border-[#e0e0e0] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
    <div>
      <h3 className="font-sora font-semibold text-[#282828]">
        {meeting.patientName || meeting.inviteeName || 'Patient'}
      </h3>
      <p className="text-[#b0b0b0] text-sm font-manrope mt-0.5">{meeting.eventType}</p>
    </div>
    <div className="flex items-center gap-2 flex-wrap">
      <span className="bg-[#f0f7f4] text-[#005044] rounded-full px-3 py-1 text-sm font-sora font-medium">
        {formatDate(meeting.startTime)}
      </span>
      <span className="flex items-center gap-1.5 bg-[#f0f7f4] text-[#005044] rounded-full px-3 py-1 text-sm font-sora font-medium">
        <Video className="w-3.5 h-3.5" />
        {formatTime(meeting.startTime)}
      </span>
    </div>
  </div>
);

const PrescriptionRow: React.FC<{ request: DoctorPrescriptionRequest; onReview: () => void }> = ({
  request,
  onReview,
}) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-4 border-b border-[#e0e0e0] last:border-b-0">
    <div>
      <h4 className="font-sora font-semibold text-base md:text-lg text-[#282828]">{request.patient.name}</h4>
      <p className="text-[#b0b0b0] text-sm font-manrope mt-0.5">Reason: Prescription Request</p>
      <p className="text-[#b0b0b0] text-sm font-manrope">Latest weight: {request.currentWeight} kg</p>
    </div>
    {request.status === 'pending' ? (
      <button
        onClick={onReview}
        className="bg-[#f0f7f4] text-[#005044] rounded-full px-6 py-2.5 font-sora font-semibold text-sm hover:bg-[#c0ebe5] transition-colors"
      >
        Review
      </button>
    ) : request.status === 'approved' ? (
      <span className="bg-[rgba(3,160,0,0.15)] text-[#03a000] rounded-full px-5 py-2 font-sora font-semibold text-sm">
        Approved
      </span>
    ) : (
      <span className="bg-gray-100 text-gray-500 rounded-full px-5 py-2 font-sora font-semibold text-sm capitalize">
        {request.status.replace('_', ' ')}
      </span>
    )}
  </div>
);

const InboxRow: React.FC<{ conversation: ConversationWithDetails; unreadCount: number; onClick: () => void }> = ({
  conversation,
  unreadCount,
  onClick,
}) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 md:gap-4 py-3 md:py-4 border-b border-[#e0e0e0] last:border-b-0 w-full text-left hover:bg-[#f9fafb] transition-colors rounded-lg px-2 -mx-2"
  >
    <div className="w-10 h-10 bg-[#c0ebe5] rounded-full flex items-center justify-center flex-shrink-0">
      <span className="font-sora text-sm text-[#005044] font-semibold">
        {getInitials(conversation.patientName || 'P')}
      </span>
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="font-manrope font-semibold text-[#282828] text-sm">
        {conversation.patientName || 'Patient'}
      </h4>
      <p className={`text-sm font-manrope truncate ${unreadCount > 0 ? 'text-[#007ed2] font-medium' : 'text-[#b0b0b0]'}`}>
        {unreadCount > 0
          ? `${unreadCount} new message${unreadCount > 1 ? 's' : ''}`
          : conversation.lastMessage?.content || 'No messages yet'}
      </p>
    </div>
    <div className="flex flex-col items-end gap-1 flex-shrink-0">
      {conversation.last_message_at && (
        <span className="text-[#b0b0b0] text-xs font-manrope">
          {formatRelativeTime(conversation.last_message_at)}
        </span>
      )}
      {unreadCount > 0 && (
        <span className="bg-[#007ed2] text-white text-xs font-sora font-semibold rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </div>
  </button>
);

// --- Loading skeleton ---

const SkeletonCard: React.FC = () => (
  <div className="animate-pulse space-y-3">
    <div className="h-4 bg-gray-200 rounded w-3/4" />
    <div className="h-3 bg-gray-200 rounded w-1/2" />
  </div>
);

// --- Main Page ---

export const DoctorDashboardPage: React.FC<DashboardPageProps> = () => {
  const navigate = useNavigate();

  const { data: meetingsData, isLoading: meetingsLoading } = useDoctorMeetings();
  const { data: prescriptionsData, isLoading: prescriptionsLoading } = useDoctorPrescriptions();
  const { data: conversationsData, isLoading: conversationsLoading } = useDoctorConversations();

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const upcomingMeetings = (meetingsData?.pages ?? [])
    .flatMap((page) => page.meetings)
    .filter((m) => m.status !== 'canceled' && new Date(m.startTime) >= startOfToday)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const prescriptionRequests = prescriptionsData?.data?.prescriptionRequests ?? [];
  const pendingCount = prescriptionsData?.data?.pendingCount ?? 0;

  const conversations = conversationsData ?? [];
  const { data: unreadCounts } = useChatUnreadCounts(true);

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-6">
      {/* Left Column — Appointments */}
      <div className="flex-[3] min-w-0">
        <div className="bg-white rounded-[20px] shadow-[0px_4px_10px_0px_rgba(0,0,0,0.08)] p-4 md:p-8 h-full flex flex-col">
          <h2 className="font-sora font-bold text-lg md:text-[21px] text-[#282828] mb-4 md:mb-6">
            Upcoming Appointments
          </h2>

          {meetingsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse border border-gray-100 rounded-2xl p-5">
                  <SkeletonCard />
                </div>
              ))}
            </div>
          ) : upcomingMeetings.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-[#b0b0b0] font-manrope text-sm">No appointments</p>
            </div>
          ) : (
            <div className="space-y-4 overflow-y-auto max-h-[60vh] lg:max-h-[calc(100vh-200px)] pr-1">
              {upcomingMeetings.map((meeting, index) =>
                index === 0 ? (
                  <AppointmentCardHighlighted key={meeting.id} meeting={meeting} />
                ) : (
                  <AppointmentCard key={meeting.id} meeting={meeting} />
                )
              )}
              <button
                onClick={() => navigate('/dashboard/doctor/appointments')}
                className="w-full py-3 text-[#005044] font-sora font-semibold text-sm hover:bg-[#f0f7f4] rounded-2xl transition-colors"
              >
                View all appointments
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Column — Prescriptions + Inbox */}
      <div className="flex-[2] min-w-0 flex flex-col gap-6">
        {/* Prescription Requests */}
        <div className="bg-white rounded-[20px] shadow-[0px_4px_10px_0px_rgba(0,0,0,0.08)] p-4 md:p-8 flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <h2 className="font-sora font-bold text-lg md:text-[21px] text-[#282828]">
              Prescription Requests
            </h2>
            {pendingCount > 0 && (
              <span className="bg-[rgba(195,188,0,0.15)] text-[#c3bc00] rounded-full px-3 py-0.5 text-sm font-sora font-semibold">
                {pendingCount} pending
              </span>
            )}
          </div>

          {prescriptionsLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="py-4 border-b border-gray-100">
                  <SkeletonCard />
                </div>
              ))}
            </div>
          ) : prescriptionRequests.length === 0 ? (
            <p className="text-[#b0b0b0] font-manrope text-sm">No prescription requests</p>
          ) : (
            <div className="overflow-y-auto flex-1">
              {prescriptionRequests.map((request) => (
                <PrescriptionRow
                  key={request._id}
                  request={request}
                  onReview={() => navigate('/dashboard/doctor/prescriptions')}
                />
              ))}
            </div>
          )}
        </div>

        {/* Inbox */}
        <div className="bg-white rounded-[20px] shadow-[0px_4px_10px_0px_rgba(0,0,0,0.08)] p-4 md:p-8 flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <h2 className="font-sora font-bold text-lg md:text-[21px] text-[#282828]">Inbox</h2>
          </div>

          {conversationsLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="py-4 border-b border-gray-100">
                  <SkeletonCard />
                </div>
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <p className="text-[#b0b0b0] font-manrope text-sm">No messages</p>
          ) : (
            <div className="overflow-y-auto flex-1">
              {conversations.map((conversation) => (
                <InboxRow
                  key={conversation.id}
                  conversation={conversation}
                  unreadCount={unreadCounts?.[conversation.id] ?? 0}
                  onClick={() => navigate('/supabase-chat')}
                />
              ))}
            </div>
          )}

          <div className="mt-3 md:mt-4 pt-3 md:pt-4">
            <button
              onClick={() => navigate('/supabase-chat')}
              className="bg-[#282828] text-white rounded-full px-4 md:px-6 py-2 md:py-2.5 font-sora font-semibold text-sm hover:bg-[#3a3a3a] transition-colors w-full"
            >
              View all messages
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
