import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock } from 'lucide-react';
import { PopupModal } from 'react-calendly';
import { meetingService } from '@/services/meetingService';
import { calendlyService } from '@/services/calendlyService';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

type MeetingRequiredProps = {
  children: React.ReactNode;
};

export const MeetingRequired: React.FC<MeetingRequiredProps> = ({ children }) => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [isMeetingGatePassed, setIsMeetingGatePassed] = useState(false);
  const [meetingStatus, setMeetingStatus] = useState<'none' | 'scheduled' | 'completed'>('none');
  const [scheduledTime, setScheduledTime] = useState<string | null>(null);
  const [schedulingLink, setSchedulingLink] = useState<string | null>(null);
  const [isBookingLoading, setIsBookingLoading] = useState(false);

  useEffect(() => {
    const checkMeetingStatus = async () => {
      try {
        const status = await meetingService.getMeetingStatus();
        setIsMeetingGatePassed(status.isMeetingGatePassed);
        setMeetingStatus(status.meetingStatus);
        setScheduledTime(status.scheduledMeetingTime);
      } catch (error) {
        console.error('Error checking meeting status:', error);
        setIsMeetingGatePassed(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkMeetingStatus();
  }, []);

  const handleBookConsultation = async () => {
    setIsBookingLoading(true);
    try {
      const eventTypesResponse = await calendlyService.getAvailableEventTypes();
      if (eventTypesResponse.success && eventTypesResponse.eventType) {
        const bookingResponse = await calendlyService.createPatientBookingLink(eventTypesResponse.eventType.type);
        if (bookingResponse.success) {
          setSchedulingLink(bookingResponse.schedulingLink);
        }
      }
    } catch (error) {
      console.error('Error generating booking link:', error);
    } finally {
      setIsBookingLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (isMeetingGatePassed) {
    return <>{children}</>;
  }

  // Format the scheduled time if available
  const formatScheduledTime = () => {
    if (!scheduledTime) return null;
    const date = new Date(scheduledTime);
    const locale = i18n.language === 'sv' ? 'sv-SE' : 'en-GB';
    return new Intl.DateTimeFormat(locale, {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(date);
  };

  return (
    <div className="relative h-full min-h-[400px]">
      {/* Blurred content */}
      <div className="blur-sm pointer-events-none select-none">
        {children}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-[#F0F7F4]/80 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4 text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            {meetingStatus === 'scheduled' ? (
              <Clock className="w-8 h-8 text-amber-600" />
            ) : (
              <Calendar className="w-8 h-8 text-amber-600" />
            )}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3 font-sora">
            {meetingStatus === 'scheduled'
              ? 'Complete Your Consultation First'
              : 'Doctor Consultation Required'}
          </h2>

          {meetingStatus === 'scheduled' ? (
            <>
              <p className="text-gray-600 mb-4 font-manrope">
                You have a scheduled consultation with your doctor.
                You'll be able to subscribe after your meeting.
              </p>
              {scheduledTime && (
                <div className="bg-teal-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-teal-700 font-medium">
                    Scheduled for:
                  </p>
                  <p className="text-lg text-teal-800 font-semibold">
                    {formatScheduledTime()}
                  </p>
                </div>
              )}
              <Button
                onClick={() => navigate(ROUTES.PATIENT_APPOINTMENTS)}
                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-full font-semibold"
              >
                View Appointments
              </Button>
            </>
          ) : (
            <>
              <p className="text-gray-600 mb-6 font-manrope">
                Before you can subscribe, you need to complete a consultation
                with one of our doctors to discuss your treatment plan.
              </p>
              <Button
                onClick={handleBookConsultation}
                disabled={isBookingLoading}
                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-full font-semibold"
              >
                {isBookingLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Calendar className="w-4 h-4 mr-2" />
                )}
                {isBookingLoading ? 'Loading...' : 'Book Consultation'}
              </Button>
            </>
          )}
        </div>
      </div>

      <PopupModal
        url={schedulingLink || ''}
        open={!!schedulingLink}
        onModalClose={() => {
          setSchedulingLink(null);
          // Re-check meeting status after booking
          window.location.reload();
        }}
        rootElement={document.getElementById('root')!}
      />
    </div>
  );
};
