import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PopupModal } from 'react-calendly';
import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/badge';
import { calendlyService } from '@/services/calendlyService';
import type { EventTypeOption } from '@/types/calendly-types';
import { useCookieConsentStore } from '@/stores/cookieConsentStore';

type AppointmentBookingProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export const AppointmentBooking: React.FC<AppointmentBookingProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { t } = useTranslation();
  const [availableEventType, setAvailableEventType] = useState<EventTypeOption | null>(null);
  const [subscription, setSubscription] = useState<{planType: string | null, status: string | null} | null>(null);
  const [isLoadingTypes, setIsLoadingTypes] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [schedulingLink, setSchedulingLink] = useState<string | null>(null);
  const [doctorName, setDoctorName] = useState<string>('');
  const { consent, openPreferences } = useCookieConsentStore();
  const hasFunctionalConsent = consent?.functional ?? false;

  const { cleanSchedulingUrl, utmTerm } = useMemo(() => {
    if (!schedulingLink) return { cleanSchedulingUrl: '', utmTerm: undefined };
    try {
      const urlObj = new URL(schedulingLink);
      const term = urlObj.searchParams.get('utm_term') || undefined;
      urlObj.searchParams.delete('utm_term');
      return { cleanSchedulingUrl: urlObj.toString(), utmTerm: term };
    } catch {
      return { cleanSchedulingUrl: schedulingLink, utmTerm: undefined };
    }
  }, [schedulingLink]);

  useEffect(() => {
    if (isOpen && hasFunctionalConsent) {
      loadAvailableEventTypes();
    }
  }, [isOpen, hasFunctionalConsent]);

  const handleBooking = async () => {
    if (!availableEventType) {
      setError(t('appointmentBooking.noAppointmentType'));
      return;
    }

    setIsBooking(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await calendlyService.createPatientBookingLink(availableEventType.type);
      if (response.success) {
        setSchedulingLink(response.schedulingLink);
      }
    } catch (err: any) {
      console.error('Booking error:', err);
      setError(err.response?.data?.error || err.response?.data?.message || t('appointmentBooking.bookingFailed'));
    } finally {
      setIsBooking(false);
    }
  };

  useEffect(() => {
    if (availableEventType && !schedulingLink && !isBooking) {
      handleBooking();
    }
  }, [availableEventType, isBooking, schedulingLink]);

  const loadAvailableEventTypes = async () => {
    setIsLoadingTypes(true);
    setError(null);

    try {
      const response = await calendlyService.getAvailableEventTypes();
      if (response.success) {
        setAvailableEventType(response.eventType);
        setDoctorName(response.doctor.name);
        setSubscription(response.subscription);
      }
    } catch (err: any) {
      console.error('Error loading event types:', err);
      setError(err.response?.data?.error || t('appointmentBooking.loadFailed'));
    } finally {
      setIsLoadingTypes(false);
    }
  };

  const handleClose = () => {
    setAvailableEventType(null);
    setSchedulingLink(null);
    setError(null);
    setSuccess(null);
    onClose();
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'free':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'standard':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'premium':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-teal-600" />
              {t('appointmentBooking.title')}
              {doctorName && <span className="text-sm font-normal text-gray-600">{t('appointmentBooking.withDoctor', { doctorName })}</span>}
            </DialogTitle>
            <DialogDescription>
              {t('appointmentBooking.description')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {!hasFunctionalConsent && (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('appointmentBooking.cookieRequired')}</h3>
                <p className="text-gray-600 mb-4">
                  {t('appointmentBooking.cookieMessage')}
                </p>
                <Button
                  onClick={openPreferences}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  {t('appointmentBooking.openCookieSettings')}
                </Button>
              </div>
            )}

            {hasFunctionalConsent && (isLoadingTypes || isBooking) && (
              <div className="text-center py-8">
                <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-gray-600">
                  {isLoadingTypes ? t('appointmentBooking.loadingTypes') : t('appointmentBooking.preparingLink')}
                </p>
              </div>
            )}

            {hasFunctionalConsent && !isLoadingTypes && !isBooking && availableEventType && (
              <div className="space-y-4">
                <div className="p-4 border-2 border-teal-200 bg-teal-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-gray-900">{availableEventType.name}</h3>
                        <Badge className={getEventTypeColor(availableEventType.type)}>
                          {availableEventType.type}
                        </Badge>
                      </div>
                      {subscription && (
                        <p className="text-sm text-gray-600">
                          {t('appointmentBooking.basedOnPlan', { planType: subscription.planType || 'free' })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {availableEventType.type === 'free' && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      {t('appointmentBooking.upgradePrompt')}
                    </p>
                  </div>
                )}
              </div>
            )}

            {hasFunctionalConsent && !isLoadingTypes && !availableEventType && !error && (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-600">{t('appointmentBooking.noTypes')}</p>
                <p className="text-sm text-gray-500">{t('appointmentBooking.contactSupport')}</p>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {success}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isBooking}
            >
              {t('appointmentBooking.cancel')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {hasFunctionalConsent && (
        <PopupModal
          url={cleanSchedulingUrl}
          open={!!schedulingLink}
          onModalClose={() => {
            setSchedulingLink(null);
            handleClose();
            if (onSuccess) onSuccess();
          }}
          rootElement={document.getElementById('root')!}
          utm={utmTerm ? { utmTerm } : undefined}
        />
      )}
    </>
  );
};
