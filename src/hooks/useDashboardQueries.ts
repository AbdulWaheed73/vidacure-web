import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryClient';
import { getWeightHistory } from '@/services/weightHistory';
import { patientService } from '@/services/patientService';
import { calendlyService } from '@/services/calendlyService';
import { prescriptionService } from '@/services/prescriptionService';

export const useWeightHistory = () => {
  return useQuery({
    queryKey: queryKeys.weightHistory,
    queryFn: () => getWeightHistory(),
  });
};

export const usePatientProfile = () => {
  return useQuery({
    queryKey: queryKeys.patientProfile,
    queryFn: () => patientService.getPatientProfile(),
  });
};

export const usePatientMeetings = () => {
  return useQuery({
    queryKey: queryKeys.patientMeetings,
    queryFn: () => calendlyService.getPatientMeetings(),
  });
};

export const usePrescriptionRequests = () => {
  return useQuery({
    queryKey: queryKeys.prescriptionRequests,
    queryFn: () => prescriptionService.getPrescriptionRequests(),
  });
};
