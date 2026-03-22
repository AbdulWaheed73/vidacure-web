import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock, Clock, Calendar } from 'lucide-react';
import { PopupModal } from 'react-calendly';
import { PaymentService } from '@/services';
import { meetingService } from '@/services/meetingService';
import { calendlyService } from '@/services/calendlyService';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants';
import { Skeleton } from '@/components/ui/skeleton';
import { GateOverlay } from './GateOverlay';

type SubscriptionRequiredProps = {
  children: React.ReactNode;
  featureName?: string;
};

export const SubscriptionRequired: React.FC<SubscriptionRequiredProps> = ({
  children,
  featureName = 'this feature',
}) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [isMeetingGatePassed, setIsMeetingGatePassed] = useState(true);
  const [meetingStatus, setMeetingStatus] = useState<'none' | 'scheduled' | 'completed'>('none');
  const [scheduledTime, setScheduledTime] = useState<string | null>(null);
  const [schedulingLink, setSchedulingLink] = useState<string | null>(null);
  const [isBookingLoading, setIsBookingLoading] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const [subStatus, mtgStatus] = await Promise.all([
          PaymentService.getSubscriptionStatus(),
          meetingService.getMeetingStatus(),
        ]);

        setHasActiveSubscription(subStatus.hasSubscription);
        setIsMeetingGatePassed(mtgStatus.isMeetingGatePassed);
        setMeetingStatus(mtgStatus.meetingStatus);
        setScheduledTime(mtgStatus.scheduledMeetingTime);
      } catch (error) {
        console.error('Error checking status:', error);
        setHasActiveSubscription(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
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
      <div className="h-full flex flex-col p-4 bg-[#F0F7F4]">
        <div className="flex-1 min-h-0 bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="border-t border-border" />
          <div className="flex-1 px-6 py-4 space-y-5">
            <div className="flex flex-col items-start"><Skeleton className="h-11 w-[40%] rounded-2xl" /></div>
            <div className="flex flex-col items-end"><Skeleton className="h-11 w-[30%] rounded-2xl" /></div>
            <div className="flex flex-col items-start"><Skeleton className="h-16 w-[50%] rounded-2xl" /></div>
            <div className="flex flex-col items-end"><Skeleton className="h-11 w-[35%] rounded-2xl" /></div>
            <div className="flex flex-col items-start"><Skeleton className="h-11 w-[25%] rounded-2xl" /></div>
          </div>
          <div className="px-6 py-4">
            <Skeleton className="h-12 w-full rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (hasActiveSubscription) {
    return <>{children}</>;
  }

  const formatScheduledTime = () => {
    if (!scheduledTime) return null;
    const date = new Date(scheduledTime);
    const locale = i18n.language === 'sv' ? 'sv-SE' : 'en-GB';
    return new Intl.DateTimeFormat(locale, {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(date);
  };

  // Meeting gate not passed — show meeting overlay
  if (!isMeetingGatePassed) {
    return (
      <>
        <GateOverlay blurredContent={children}>
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            {meetingStatus === 'scheduled' ? (
              <Clock className="w-8 h-8 text-amber-600" />
            ) : (
              <Calendar className="w-8 h-8 text-amber-600" />
            )}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3 font-sora">
            {meetingStatus === 'scheduled'
              ? t('gate.completeConsultationFirst')
              : t('gate.consultationRequired')}
          </h2>

          {meetingStatus === 'scheduled' ? (
            <>
              <p className="text-gray-600 mb-4 font-manrope">
                {t('gate.consultationScheduledFeatureMessage', { featureName })}
              </p>
              {scheduledTime && (
                <div className="bg-teal-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-teal-700 font-medium">
                    {t('gate.scheduledFor')}
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
                {t('gate.viewAppointments')}
              </Button>
            </>
          ) : (
            <>
              <p className="text-gray-600 mb-6 font-manrope">
                {t('gate.consultationRequiredFeatureMessage', { featureName })}
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
                {isBookingLoading ? t('gate.loading') : t('gate.bookConsultation')}
              </Button>
            </>
          )}
        </GateOverlay>

        <PopupModal
          url={schedulingLink || ''}
          open={!!schedulingLink}
          onModalClose={() => {
            setSchedulingLink(null);
            window.location.reload();
          }}
          rootElement={document.getElementById('root')!}
        />
      </>
    );
  }

  // Meeting completed but no subscription — show subscription overlay
  return (
    <GateOverlay blurredContent={children}>
      <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Lock className="w-8 h-8 text-teal-600" />
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-3 font-sora">
        {t('gate.subscriptionRequired')}
      </h2>

      <p className="text-gray-600 mb-6 font-manrope">
        {t('gate.subscriptionRequiredMessage', { featureName })}
      </p>

      <Button
        onClick={() => navigate(ROUTES.SUBSCRIBE)}
        className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-full font-semibold"
      >
        {t('gate.subscribeNow')}
      </Button>
    </GateOverlay>
  );
};
