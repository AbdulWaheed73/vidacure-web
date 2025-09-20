import React, { useState, useEffect } from 'react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { calendlyService } from '@/services/calendlyService';
import type { EventTypeOption } from '@/types/calendly-types';

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

  const [availableEventType, setAvailableEventType] = useState<EventTypeOption | null>(null);
  const [subscription, setSubscription] = useState<{planType: string | null, status: string | null} | null>(null);
  const [isLoadingTypes, setIsLoadingTypes] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [schedulingLink, setSchedulingLink] = useState<string | null>(null);
  const [doctorName, setDoctorName] = useState<string>('');

  // Load available event types and auto-generate booking link when modal opens
  useEffect(() => {
    if (isOpen) {
      loadAvailableEventTypes();
    }
  }, [isOpen]);

  const handleBooking = async () => {
    if (!availableEventType) {
      setError('No appointment type available');
      return;
    }

    setIsBooking(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await calendlyService.createPatientBookingLink(availableEventType.type);

      if (response.success) {
        setSchedulingLink(response.schedulingLink);
        setSuccess(`${response.eventName} booking link generated successfully!`);
      }
    } catch (err: any) {
      console.error('Booking error:', err);
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to generate booking link');
    } finally {
      setIsBooking(false);
    }
  };

  // Auto-generate booking link after event types are loaded
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
      setError(err.response?.data?.error || 'Failed to load appointment types');
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
              Book Appointment
              {doctorName && <span className="text-sm font-normal text-gray-600">with {doctorName}</span>}
            </DialogTitle>
            <DialogDescription>
              Choose an appointment type to schedule with your assigned doctor.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Loading State */}
            {(isLoadingTypes || isBooking) && (
              <div className="text-center py-8">
                <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-gray-600">
                  {isLoadingTypes ? 'Loading appointment types...' : 'Preparing your booking link...'}
                </p>
              </div>
            )}

            {/* Single Event Type Display - Only show if not booking */}
            {!isLoadingTypes && !isBooking && availableEventType && (
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
                          Based on your {subscription.planType || 'free'} subscription
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Upgrade prompt for free users */}
                {availableEventType.type === 'free' && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      💡 Upgrade to Lifestyle or Medical subscription for standard and premium appointments
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* No Event Types Available */}
            {!isLoadingTypes && !availableEventType && !error && (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-600">No appointment types available</p>
                <p className="text-sm text-gray-500">Please contact support for assistance</p>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Success Display */}
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
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Calendly Popup Modal - Opens automatically when schedulingLink is available */}
      <PopupModal
        url={schedulingLink || ''}
        open={!!schedulingLink}
        onModalClose={() => {
          setSchedulingLink(null);
          handleClose();
          if (onSuccess) onSuccess();
        }}
        rootElement={document.getElementById('root')!}
      />
    </>
  );
};