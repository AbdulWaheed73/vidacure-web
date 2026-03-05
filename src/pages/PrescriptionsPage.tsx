import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  ArrowRight,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
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
import { Skeleton } from '@/components/ui/skeleton';
import { PrescriptionRequestModal } from '../components/PrescriptionRequestModal';
import { prescriptionService } from '../services/prescriptionService';
import { PrescriptionRequestStatus } from '../types/prescription-types';
import type { PrescriptionRequest } from '../types/prescription-types';
import { SubscriptionRequired } from '@/components/subscription/SubscriptionRequired';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';

export const PrescriptionsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<PrescriptionRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [consentRequired, setConsentRequired] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<PrescriptionRequest | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const dateLocale = i18n.language === 'sv' ? 'sv-SE' : 'en-US';

  const loadRequests = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await prescriptionService.getPrescriptionRequests();
      setRequests(response.prescriptionRequests);
    } catch (err: any) {
      if (err.response?.status === 451) {
        setConsentRequired(true);
      } else {
        console.error('Error loading prescriptions:', err);
        setError(
          err.response?.data?.error ||
          err.response?.data?.message ||
          t('prescriptions.errors.loadFailed')
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [isLoading, requests, updateScrollState]);

  const handleRequestSuccess = () => {
    loadRequests();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(dateLocale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Active = first approved request; rest go to history
  const activeRequest = requests.find(
    (r) => r.status === PrescriptionRequestStatus.APPROVED
  );

  const historyRequests = requests.filter(
    (r) => r._id !== activeRequest?._id
  );

  const getStatusBadge = (request: PrescriptionRequest, isActive: boolean) => {
    if (isActive) {
      return (
        <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
          {t('prescriptions.statusActive')}
        </span>
      );
    }

    if (request.status === PrescriptionRequestStatus.APPROVED) {
      return (
        <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-600">
          {t('prescriptions.statusExpired')}
        </span>
      );
    }

    if (request.status === PrescriptionRequestStatus.PENDING) {
      return (
        <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700">
          {t('prescriptions.statusPending')}
        </span>
      );
    }

    if (request.status === PrescriptionRequestStatus.DENIED) {
      return (
        <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-600">
          {t('prescriptions.statusDenied')}
        </span>
      );
    }

    if (request.status === PrescriptionRequestStatus.UNDER_REVIEW) {
      return (
        <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
          {t('prescriptions.statusUnderReview')}
        </span>
      );
    }

    return null;
  };

  const scrollHistory = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 340;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  const PrescriptionCard = ({
    request,
    isActive,
    className = '',
  }: {
    request: PrescriptionRequest;
    isActive: boolean;
    className?: string;
  }) => {
    const hasApprovedData = request.medicationName || request.dosage;

    return (
      <div className={`bg-white rounded-2xl border border-gray-100 p-4 sm:p-8 ${className}`}>
        {hasApprovedData ? (
          <div className="grid grid-cols-2 gap-x-6 sm:gap-x-16 gap-y-4 sm:gap-y-8">
            <div>
              <p className="text-sm sm:text-base font-semibold text-gray-800 mb-1">
                {t('prescriptions.medicationName')}
              </p>
              <p className="text-sm sm:text-base text-gray-600">{request.medicationName || '-'}</p>
            </div>
            <div>
              <p className="text-sm sm:text-base font-semibold text-gray-800 mb-1">
                {t('prescriptions.dosage')}
              </p>
              <p className="text-sm sm:text-base text-gray-600">{request.dosage || '-'}</p>
            </div>
            <div>
              <p className="text-sm sm:text-base font-semibold text-gray-800 mb-1">
                {t('prescriptions.dateIssued')}
              </p>
              <p className="text-sm sm:text-base text-gray-600">
                {request.dateIssued ? formatDate(request.dateIssued) : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm sm:text-base font-semibold text-gray-800 mb-1">
                {t('prescriptions.validTill')}
              </p>
              <p className="text-sm sm:text-base text-gray-600">
                {request.validTill ? formatDate(request.validTill) : '-'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 sm:gap-x-16 gap-y-4 sm:gap-y-8">
            <div>
              <p className="text-sm sm:text-base font-semibold text-gray-800 mb-1">
                {t('prescriptions.weight')}
              </p>
              <p className="text-sm sm:text-base text-gray-600">{request.currentWeight} kg</p>
            </div>
            <div>
              <p className="text-sm sm:text-base font-semibold text-gray-800 mb-1">
                {t('prescriptions.sideEffects')}
              </p>
              <p className="text-sm sm:text-base text-gray-600">
                {request.hasSideEffects ? t('prescriptions.yes') : t('prescriptions.no')}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-sm sm:text-base font-semibold text-gray-800 mb-1">
                {t('prescriptions.submittedOn')}
              </p>
              <p className="text-sm sm:text-base text-gray-600">{formatDate(request.createdAt)}</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-4 sm:mt-8">
          {getStatusBadge(request, isActive)}
          <button
            onClick={() => setSelectedRequest(request)}
            className="flex items-center gap-1.5 text-base font-semibold text-gray-700 hover:text-teal-600 transition-colors"
          >
            {t('prescriptions.viewDetails')}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <SubscriptionRequired featureName="Prescriptions">
      {consentRequired ? (
        <div className="p-4 md:p-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
              <ShieldAlert className="w-12 h-12 text-amber-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-800 mb-2 font-manrope">Consent Required</h2>
              <p className="text-gray-500 mb-6 text-sm">
                Please accept the latest consent terms to access your prescriptions.
              </p>
              <Button
                onClick={() => navigate(ROUTES.PATIENT_CONSENT)}
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                Review Consent
              </Button>
            </div>
          </div>
        </div>
      ) : (
      <div className="p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 font-manrope">
            {t('prescriptions.title')}
          </h1>
          <Button
            onClick={() => setModalOpen(true)}
            className="bg-teal-600 hover:bg-teal-700 flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{t('prescriptions.requestNew')}</span>
            <span className="sm:hidden">{t('prescriptions.requestNewShort', 'Request')}</span>
          </Button>
        </div>

        {/* Error */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading */}
        {isLoading ? (
          <div className="space-y-10">
            <div>
              <Skeleton className="h-7 w-48 mb-4" />
              <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-8">
                <div className="grid grid-cols-2 gap-x-6 sm:gap-x-10 gap-y-5">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-1.5">
                      <Skeleton className="h-4 w-20 sm:w-28" />
                      <Skeleton className="h-4 w-24 sm:w-36" />
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-6">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>
            <div>
              <Skeleton className="h-7 w-52 mb-4" />
              <div className="flex gap-4 overflow-hidden">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 min-w-[280px] sm:min-w-[300px]">
                    <div className="grid grid-cols-2 gap-x-6 sm:gap-x-10 gap-y-5">
                      {[...Array(4)].map((_, j) => (
                        <div key={j} className="space-y-1.5">
                          <Skeleton className="h-4 w-20 sm:w-28" />
                          <Skeleton className="h-4 w-24 sm:w-32" />
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-6">
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : requests.length === 0 ? (
          /* Empty state */
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-700 mb-2 font-manrope">
                {t('prescriptions.noFound')}
              </h2>
              <p className="text-gray-500 font-manrope mb-6">
                {t('prescriptions.emptyMessage')}
              </p>
              <Button
                onClick={() => setModalOpen(true)}
                className="bg-teal-600 hover:bg-teal-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('prescriptions.requestNew')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Active Prescriptions */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 font-manrope mb-4">
                {t('prescriptions.active')}
              </h2>
              {activeRequest ? (
                <PrescriptionCard
                  request={activeRequest}
                  isActive={true}
                  className="sm:max-w-xl"
                />
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <p className="text-gray-500 font-manrope text-center py-4">
                    {t('prescriptions.noActiveMessage')}
                  </p>
                </div>
              )}
            </div>

            {/* Prescription History */}
            {historyRequests.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800 font-manrope">
                    {t('prescriptions.history')}
                  </h2>
                  {historyRequests.length > 1 && (
                    <div className="hidden sm:flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => scrollHistory('left')}
                        disabled={!canScrollLeft}
                        className="h-8 w-8 p-0 rounded-full border-gray-300 disabled:opacity-30"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => scrollHistory('right')}
                        disabled={!canScrollRight}
                        className="h-8 w-8 p-0 rounded-full border-gray-300 disabled:opacity-30"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="relative">
                  <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {historyRequests.map((request) => (
                      <PrescriptionCard
                        key={request._id}
                        request={request}
                        isActive={false}
                        className="min-w-[280px] sm:min-w-[320px] max-w-[280px] sm:max-w-[320px] flex-shrink-0"
                      />
                    ))}
                  </div>
                  {/* Right scroll indicator */}
                  {canScrollRight && (
                    <button
                      onClick={() => scrollHistory('right')}
                      className="absolute right-0 top-0 bottom-2 w-12 flex items-center justify-end bg-gradient-to-l from-[#F0F7F4] via-[#F0F7F4]/80 to-transparent"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    </button>
                  )}
                  {/* Left scroll indicator */}
                  {canScrollLeft && (
                    <button
                      onClick={() => scrollHistory('left')}
                      className="absolute left-0 top-0 bottom-2 w-12 flex items-center justify-start bg-gradient-to-r from-[#F0F7F4] via-[#F0F7F4]/80 to-transparent"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-500" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Details Dialog */}
        <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-manrope">
                {t('prescriptions.details')}
              </DialogTitle>
              <DialogDescription>
                {t('prescriptions.detailsDesc')}
              </DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-5 pt-2">
                {/* Medication info (if approved) */}
                {(selectedRequest.medicationName || selectedRequest.dosage) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    {selectedRequest.medicationName && (
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">{t('prescriptions.medicationName')}</p>
                        <p className="text-sm font-medium text-gray-800">{selectedRequest.medicationName}</p>
                      </div>
                    )}
                    {selectedRequest.dosage && (
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">{t('prescriptions.dosage')}</p>
                        <p className="text-sm font-medium text-gray-800">{selectedRequest.dosage}</p>
                      </div>
                    )}
                    {selectedRequest.dateIssued && (
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">{t('prescriptions.dateIssued')}</p>
                        <p className="text-sm font-medium text-gray-800">{formatDate(selectedRequest.dateIssued)}</p>
                      </div>
                    )}
                    {selectedRequest.validTill && (
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">{t('prescriptions.validTill')}</p>
                        <p className="text-sm font-medium text-gray-800">{formatDate(selectedRequest.validTill)}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Usage instructions */}
                {selectedRequest.usageInstructions && (
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">{t('prescriptions.usageInstructions')}</p>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {selectedRequest.usageInstructions}
                    </p>
                  </div>
                )}

                {/* Divider if both medication and request data exist */}
                {(selectedRequest.medicationName || selectedRequest.dosage) && (
                  <div className="border-t border-gray-100" />
                )}

                {/* Request info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">{t('prescriptions.weight')}</p>
                    <p className="text-sm font-medium text-gray-800">{selectedRequest.currentWeight} kg</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">{t('prescriptions.sideEffects')}</p>
                    <p className="text-sm font-medium text-gray-800">
                      {selectedRequest.hasSideEffects ? t('prescriptions.yes') : t('prescriptions.no')}
                    </p>
                  </div>
                </div>

                {selectedRequest.hasSideEffects && selectedRequest.sideEffectsDescription && (
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">{t('prescriptions.sideEffectsDesc')}</p>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {selectedRequest.sideEffectsDescription}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-gray-400 mb-0.5">{t('prescriptions.submittedOn')}</p>
                  <p className="text-sm font-medium text-gray-800">{formatDate(selectedRequest.createdAt)}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Request Modal */}
        <PrescriptionRequestModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          onSuccess={handleRequestSuccess}
        />
      </div>
      )}
    </SubscriptionRequired>
  );
};
