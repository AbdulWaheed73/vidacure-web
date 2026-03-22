import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useDoctorPrescriptions, useApprovePrescription } from '@/hooks/useDoctorDashboardQueries';
import { PrescriptionRequestStatus } from '@/types/doctor-prescription-types';
import type { DoctorPrescriptionRequest } from '@/types/doctor-prescription-types';
import { PrescriptionRequestDetailModal } from '@/components/PrescriptionRequestDetailModal';
import { RefreshCw } from 'lucide-react';

const DoctorPrescriptions = () => {
  const { t } = useTranslation();
  const { data, isLoading, error, refetch, isRefetching } = useDoctorPrescriptions();
  const approveMutation = useApprovePrescription();
  const [selectedRequest, setSelectedRequest] = useState<DoctorPrescriptionRequest | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const requests = data?.data?.prescriptionRequests ?? [];

  const { pending, history } = useMemo(() => {
    const p: DoctorPrescriptionRequest[] = [];
    const h: DoctorPrescriptionRequest[] = [];
    for (const r of requests) {
      if (r.status === PrescriptionRequestStatus.PENDING || r.status === PrescriptionRequestStatus.UNDER_REVIEW) {
        p.push(r);
      } else {
        h.push(r);
      }
    }
    return { pending: p, history: h };
  }, [requests]);

  const handleReview = (request: DoctorPrescriptionRequest) => {
    setSelectedRequest(request);
    setModalOpen(true);
  };

  const handleApprove = async (
    requestId: string,
    prescriptionData: {
      medicationName: string;
      dosage: string;
      usageInstructions: string;
      dateIssued: string;
      validTill: string;
    }
  ) => {
    await approveMutation.mutateAsync({ requestId, prescriptionData });
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h1 className="font-sora font-bold text-xl md:text-2xl text-[#282828]">{t('doctorPrescriptions.title')}</h1>
        </div>
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h1 className="font-sora font-bold text-xl md:text-2xl text-[#282828]">{t('doctorPrescriptions.title')}</h1>
        </div>
        <div className="text-red-600 bg-red-50 p-4 rounded-lg">
          {t('doctorPrescriptions.loadFailed')}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h1 className="font-sora font-bold text-xl md:text-2xl text-[#282828]">{t('doctorPrescriptions.title')}</h1>
        <button
          onClick={() => refetch()}
          disabled={isRefetching}
          className="flex items-center gap-2 bg-[#f0f7f4] text-[#005044] rounded-full px-5 py-2.5 font-sora font-semibold text-sm hover:bg-[#c0ebe5] transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
          {t('doctorPrescriptions.refresh')}
        </button>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="!bg-transparent border-b border-[#e0e0e0] rounded-none w-full justify-start gap-6 h-auto p-0 mb-6">
          <TabsTrigger
            value="pending"
            className="rounded-none !bg-transparent shadow-none px-0 pb-3 text-base font-sora font-medium text-[#b0b0b0] data-[state=active]:text-[#282828] data-[state=active]:!bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#005044]"
          >
            {t('doctorPrescriptions.pendingRequests')}
            {pending.length > 0 && (
              <span className="ml-2 bg-[#f0f7f4] text-[#005044] rounded-full px-2.5 py-0.5 text-xs font-sora font-semibold">
                {pending.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="rounded-none !bg-transparent shadow-none px-0 pb-3 text-base font-sora font-medium text-[#b0b0b0] data-[state=active]:text-[#282828] data-[state=active]:!bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#005044]"
          >
            {t('doctorPrescriptions.history')}
          </TabsTrigger>
        </TabsList>

        {/* Pending Tab */}
        <TabsContent value="pending" className="mt-0">
          <div className="bg-white rounded-[20px] shadow-[0px_4px_10px_0px_rgba(0,0,0,0.08)] p-4 md:p-8">
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <div className="w-2 h-2 rounded-full bg-[#005044]" />
              <h2 className="font-sora font-bold text-lg text-[#282828]">{t('doctorPrescriptions.prescriptionRequests')}</h2>
              {pending.length > 0 && (
                <span className="bg-[#f0f7f4] text-[#005044] rounded-full px-2.5 py-0.5 text-xs font-sora font-semibold">
                  {pending.length} {t('doctorPrescriptions.pending')}
                </span>
              )}
            </div>

            {pending.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#b0b0b0] font-manrope text-sm">{t('doctorPrescriptions.noPending')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pending.map((request) => (
                  <div
                    key={request._id}
                    className="bg-white border border-[#e0e0e0] rounded-2xl p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-[#c0ebe5] transition-colors"
                  >
                    <div>
                      <h3 className="font-sora font-semibold text-[#282828]">
                        {request.patient.name}
                      </h3>
                      <p className="text-[#b0b0b0] text-sm font-manrope mt-0.5">
                        {request.hasSideEffects ? t('doctorPrescriptions.sideEffectsReported') : t('doctorPrescriptions.prescriptionRequest')}
                      </p>
                      <p className="text-[#b0b0b0] text-sm font-manrope">
                        {t('doctorPrescriptions.latestWeight')} {request.currentWeight} kg
                      </p>
                    </div>
                    <button
                      onClick={() => handleReview(request)}
                      className="bg-[#f0f7f4] text-[#005044] rounded-full px-6 py-2.5 font-sora font-semibold text-sm hover:bg-[#c0ebe5] transition-colors self-start md:self-auto shrink-0"
                    >
                      {t('doctorPrescriptions.review')}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="mt-0">
          <div className="bg-white rounded-[20px] shadow-[0px_4px_10px_0px_rgba(0,0,0,0.08)] p-4 md:p-8">
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <div className="w-2 h-2 rounded-full bg-[#b0b0b0]" />
              <h2 className="font-sora font-bold text-lg text-[#282828]">{t('doctorPrescriptions.recentPrescriptions')}</h2>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#b0b0b0] font-manrope text-sm">{t('doctorPrescriptions.noHistory')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((request) => (
                  <div
                    key={request._id}
                    className="bg-white border border-[#e0e0e0] rounded-2xl p-4 md:p-5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="font-sora font-semibold text-[#282828]">
                          {request.patient.name}
                        </h3>
                        <p className="text-[#b0b0b0] text-sm font-manrope mt-0.5">
                          {request.hasSideEffects ? t('doctorPrescriptions.sideEffectsReported') : t('doctorPrescriptions.prescriptionRequest')}
                        </p>
                        <p className="text-[#b0b0b0] text-sm font-manrope">
                          {t('doctorPrescriptions.latestWeight')} {request.currentWeight} kg
                        </p>
                      </div>
                      {request.status === PrescriptionRequestStatus.APPROVED ? (
                        <span className="bg-[rgba(3,160,0,0.15)] text-[#03a000] rounded-full px-5 py-2 font-sora font-semibold text-sm self-start sm:self-auto shrink-0">
                          {t('doctorPrescriptions.approved')}
                        </span>
                      ) : request.status === PrescriptionRequestStatus.DENIED ? (
                        <span className="bg-red-50 text-red-600 rounded-full px-5 py-2 font-sora font-semibold text-sm self-start sm:self-auto shrink-0">
                          {t('doctorPrescriptions.denied')}
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-[#b0b0b0] rounded-full px-5 py-2 font-sora font-semibold text-sm capitalize self-start sm:self-auto shrink-0">
                          {request.status.replace('_', ' ')}
                        </span>
                      )}
                    </div>

                    {/* Inline prescription details for approved items */}
                    {request.status === PrescriptionRequestStatus.APPROVED &&
                      (request.medicationName || request.dosage || request.usageInstructions) && (
                        <div className="bg-[#f0f7f4] rounded-2xl px-4 md:px-6 py-3 md:py-4 mt-3 md:mt-4">
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                            {request.medicationName && (
                              <div className="min-w-0">
                                <p className="text-xs text-[#005044]/60 font-manrope mb-1">{t('doctorPrescriptions.medication')}</p>
                                <p className="text-sm font-semibold text-[#005044] font-manrope break-words">{request.medicationName}</p>
                              </div>
                            )}
                            {request.dosage && (
                              <div className="min-w-0">
                                <p className="text-xs text-[#005044]/60 font-manrope mb-1">{t('doctorPrescriptions.dosage')}</p>
                                <p className="text-sm font-semibold text-[#005044] font-manrope break-words">{request.dosage}</p>
                              </div>
                            )}
                            {request.usageInstructions && (
                              <div className="min-w-0 col-span-2 sm:col-span-1">
                                <p className="text-xs text-[#005044]/60 font-manrope mb-1">{t('doctorPrescriptions.instructions')}</p>
                                <p className="text-sm text-[#005044] font-manrope break-words">{request.usageInstructions}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <PrescriptionRequestDetailModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        request={selectedRequest}
        onApprove={handleApprove}
      />
    </div>
  );
};

export default DoctorPrescriptions;
