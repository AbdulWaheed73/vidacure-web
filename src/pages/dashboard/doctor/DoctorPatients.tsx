import React, { useState } from 'react';
import { RefreshCw, Users } from 'lucide-react';
import { useDoctorPatients } from '@/hooks/useDoctorDashboardQueries';
import { PatientProfilePanel } from '@/components/doctor/PatientProfilePanel';
import type { DoctorPatientListItem } from '@/types/doctor-patient-types';

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
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
        <h3 className="font-sora font-semibold text-[#282828]">
          {patient.name}
        </h3>
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
  const { data, isLoading, refetch, isRefetching } = useDoctorPatients();
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const patients = data?.patients ?? [];

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
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-sora font-bold text-2xl text-[#282828]">Patients</h1>
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
      ) : patients.length === 0 ? (
        <div className="bg-white rounded-[20px] shadow-[0px_4px_10px_0px_rgba(0,0,0,0.08)] p-16 text-center">
          <Users className="w-16 h-16 text-[#c0ebe5] mx-auto mb-4" />
          <h2 className="font-sora font-semibold text-lg text-[#282828] mb-2">No Patients Yet</h2>
          <p className="text-[#b0b0b0] font-manrope text-sm">
            Assigned patients will appear here
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
      />
    </div>
  );
};

export default DoctorPatients;
