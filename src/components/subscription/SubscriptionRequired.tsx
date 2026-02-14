import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock, Clock, Calendar } from 'lucide-react';
import { PaymentService } from '@/services';
import { meetingService } from '@/services/meetingService';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

type SubscriptionRequiredProps = {
  children: React.ReactNode;
  featureName?: string;
};

export const SubscriptionRequired: React.FC<SubscriptionRequiredProps> = ({
  children,
  featureName = 'this feature',
}) => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [isMeetingGatePassed, setIsMeetingGatePassed] = useState(true);
  const [meetingStatus, setMeetingStatus] = useState<'none' | 'scheduled' | 'completed'>('none');
  const [scheduledTime, setScheduledTime] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const [subStatus, mtgStatus] = await Promise.all([
          PaymentService.getSubscriptionStatus(),
          meetingService.getMeetingStatus(),
        ]);

        setHasActiveSubscription(
          subStatus.hasSubscription && subStatus.subscriptionStatus === 'active'
        );
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <LoadingSpinner />
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

  // Meeting gate not passed — show meeting overlay instead of subscription overlay
  if (!isMeetingGatePassed) {
    return (
      <div className="relative h-full min-h-[400px]">
        <div className="blur-sm pointer-events-none select-none">
          {children}
        </div>

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
                  You'll be able to access {featureName} after your meeting.
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
                  Before you can access {featureName}, you need to complete a consultation
                  with one of our doctors to discuss your treatment plan.
                </p>
                <Button
                  onClick={() => navigate(ROUTES.PRE_LOGIN_BMI)}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-full font-semibold"
                >
                  Book Consultation
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Meeting completed but no subscription — show subscription overlay
  return (
    <div className="relative h-full min-h-[400px]">
      <div className="blur-sm pointer-events-none select-none">
        {children}
      </div>

      <div className="absolute inset-0 bg-[#F0F7F4]/80 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4 text-center">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-teal-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3 font-sora">
            Subscription Required
          </h2>

          <p className="text-gray-600 mb-6 font-manrope">
            Subscribe to a plan to unlock {featureName} and connect with your healthcare provider.
          </p>

          <Button
            onClick={() => navigate(ROUTES.SUBSCRIBE)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-full font-semibold"
          >
            Subscribe Now
          </Button>
        </div>
      </div>
    </div>
  );
};
