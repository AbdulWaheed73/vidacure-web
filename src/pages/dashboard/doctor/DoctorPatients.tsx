import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RefreshCw, Users, Info } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useDoctorPatients, useDoctorUnassignedPatients } from '@/hooks/useDoctorDashboardQueries';
import { PatientProfilePanel } from '@/components/doctor/PatientProfilePanel';
import type { DoctorPatientListItem, SubscriptionPlan, SubscriptionStatus } from '@/types/doctor-patient-types';

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const ACTIVE_STATUSES: SubscriptionStatus[] = ['active', 'trialing'];
const WARNING_STATUSES: SubscriptionStatus[] = ['past_due', 'unpaid'];

const SubscriptionBadge: React.FC<{
  status: SubscriptionStatus | null;
  plan: SubscriptionPlan | null;
}> = ({ status, plan }) => {
  const { t } = useTranslation();

  if (!status || !ACTIVE_STATUSES.includes(status) || !plan) {
    const isWarning = status && WARNING_STATUSES.includes(status);
    const label = status
      ? t(`doctorPatients.subscription.status.${status}`)
      : t('doctorPatients.subscription.noSubscription');

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-sora font-semibold border ${
          isWarning
            ? 'bg-amber-50 text-amber-700 border-amber-200'
            : 'bg-gray-100 text-gray-500 border-gray-200'
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isWarning ? 'bg-amber-500' : 'bg-gray-400'
          }`}
        />
        {label}
      </span>
    );
  }

  const planLabel = t(`doctorPatients.subscription.plan.${plan}`);
  const isMedical = plan === 'medical';
  const isTrial = status === 'trialing';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-sora font-semibold border ${
        isMedical
          ? 'bg-[#005044] text-white border-[#005044]'
          : 'bg-[#f0f7f4] text-[#005044] border-[#c0ebe5]'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isMedical ? 'bg-[#c0ebe5]' : 'bg-[#005044]'
        }`}
      />
      {planLabel}
      {isTrial && (
        <span className={`opacity-80 font-manrope font-medium ${isMedical ? 'text-white' : 'text-[#005044]'}`}>
          · {t('doctorPatients.subscription.status.trialing')}
        </span>
      )}
    </span>
  );
};

const SkeletonRow: React.FC = () => (
  <div className="animate-pulse rounded-2xl border border-gray-100 p-5 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-gray-200 rounded-full" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-32" />
        <div className="h-3 bg-gray-200 rounded w-48" />
      </div>
    </div>
    <div className="flex items-center gap-3">
      <div className="h-7 bg-gray-200 rounded-full w-20" />
      <div className="h-7 bg-gray-200 rounded-full w-24" />
    </div>
  </div>
);

const PatientCard: React.FC<{
  patient: DoctorPatientListItem;
  onClick: () => void;
}> = ({ patient, onClick }) => (
  <button
    onClick={onClick}
    className="w-full bg-white border border-[#e0e0e0] rounded-2xl p-5 flex items-center justify-between hover:border-[#c0ebe5] transition-colors text-left cursor-pointer"
  >
    <div className="flex items-center gap-4 min-w-0">
      <div className="w-10 h-10 rounded-full bg-[#f0f7f4] flex items-center justify-center flex-shrink-0">
        <span className="text-[#005044] font-sora font-semibold text-sm">
          {(patient.givenName?.[0] ?? patient.name?.[0] ?? '?').toUpperCase()}
        </span>
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-sora font-semibold text-[#282828]">
            {patient.name}
          </h3>
          <SubscriptionBadge
            status={patient.subscriptionStatus}
            plan={patient.subscriptionPlan}
          />
        </div>
        {patient.email && (
          <p className="text-[#b0b0b0] text-sm font-manrope mt-0.5 truncate">
            {patient.email}
          </p>
        )}
      </div>
    </div>
    <div className="flex items-center gap-2 flex-shrink-0">
      {patient.gender && (
        <span className="bg-[#f0f7f4] text-[#005044] rounded-full px-3 py-1 text-sm font-sora font-medium capitalize">
          {patient.gender}
        </span>
      )}
      {patient.dateOfBirth && (
        <span className="bg-[#f0f7f4] text-[#005044] rounded-full px-3 py-1 text-sm font-sora font-medium">
          {formatDate(patient.dateOfBirth)}
        </span>
      )}
    </div>
  </button>
);

const DoctorPatients: React.FC = () => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<'assigned' | 'unassigned'>('assigned');
  const { data, isLoading, refetch, isRefetching } = useDoctorPatients();
  const { data: unassignedData, isLoading: unassignedLoading, refetch: refetchUnassigned, isRefetching: isRefetchingUnassigned } = useDoctorUnassignedPatients();
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const patients = viewMode === 'assigned' ? (data?.patients ?? []) : (unassignedData?.patients ?? []);
  const currentLoading = viewMode === 'assigned' ? isLoading : unassignedLoading;
  const currentRefetching = viewMode === 'assigned' ? isRefetching : isRefetchingUnassigned;
  const handleRefetch = viewMode === 'assigned' ? refetch : refetchUnassigned;

  // Auto-open profile panel when navigated with ?patientId=
  useEffect(() => {
    const patientId = searchParams.get('patientId');
    if (patientId) {
      setSelectedPatientId(patientId);
      setSheetOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handlePatientClick = (patientId: string) => {
    setSelectedPatientId(patientId);
    setSheetOpen(true);
  };

  const handleSheetClose = (open: boolean) => {
    setSheetOpen(open);
    if (!open) {
      setSelectedPatientId(null);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-sora font-bold text-2xl text-[#282828]">{t('doctorPatients.title')}</h1>
        <button
          onClick={() => handleRefetch()}
          disabled={currentRefetching}
          className="flex items-center gap-2 bg-[#f0f7f4] text-[#005044] rounded-full px-5 py-2.5 font-sora font-semibold text-sm hover:bg-[#c0ebe5] transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${currentRefetching ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{t('doctorPatients.refresh')}</span>
        </button>
      </div>

      {/* Toggle */}
      <div className="flex bg-white rounded-full p-1 border border-[#e0e0e0] shadow-sm w-fit mb-6">
        <button
          onClick={() => setViewMode('assigned')}
          className={`px-5 py-2 rounded-full text-sm font-sora font-semibold transition-all ${
            viewMode === 'assigned'
              ? 'bg-[#005044] text-white shadow-md'
              : 'bg-transparent text-[#282828] hover:bg-[#f0f7f4]'
          }`}
        >
          {t('doctorPatients.myPatients')}
        </button>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setViewMode('unassigned')}
              className={`px-5 py-2 rounded-full text-sm font-sora font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'unassigned'
                  ? 'bg-[#005044] text-white shadow-md'
                  : 'bg-transparent text-[#282828] hover:bg-[#f0f7f4]'
              }`}
            >
              {t('doctorPatients.newPatients')}
              <Info className={`w-3.5 h-3.5 ${viewMode === 'unassigned' ? 'text-white/70' : 'text-[#b0b0b0]'}`} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-[220px]">
            {t('doctorPatients.newPatientsTooltip')}
          </TooltipContent>
        </Tooltip>
      </div>

      {currentLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      ) : patients.length === 0 ? (
        <div className="bg-white rounded-[20px] shadow-[0px_4px_10px_0px_rgba(0,0,0,0.08)] p-16 text-center">
          <Users className="w-16 h-16 text-[#c0ebe5] mx-auto mb-4" />
          <h2 className="font-sora font-semibold text-lg text-[#282828] mb-2">
            {viewMode === 'assigned' ? t('doctorPatients.noPatientsYet') : t('doctorPatients.noNewPatients')}
          </h2>
          <p className="text-[#b0b0b0] font-manrope text-sm">
            {viewMode === 'assigned' ? t('doctorPatients.noPatientsMessage') : t('doctorPatients.noNewPatientsMessage')}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {patients.map((patient) => (
            <PatientCard
              key={patient.id}
              patient={patient}
              onClick={() => handlePatientClick(patient.id)}
            />
          ))}
        </div>
      )}

      <PatientProfilePanel
        patientId={selectedPatientId}
        open={sheetOpen}
        onOpenChange={handleSheetClose}
        isUnassigned={viewMode === 'unassigned'}
      />
    </div>
  );
};

export default DoctorPatients;
