import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryClient';
import { getWeightHistory } from '@/services/weightHistory';
import { patientService } from '@/services/patientService';
import { calendlyService } from '@/services/calendlyService';
import { prescriptionService } from '@/services/prescriptionService';
import { providerService } from '@/services/providerService';
import { PaymentService } from '@/services';

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

export const useSubscriptionStatus = () => {
  return useQuery({
    queryKey: queryKeys.subscriptionStatus,
    queryFn: () => PaymentService.getSubscriptionStatus(),
  });
};

export const useMyProviders = () => {
  return useQuery({
    queryKey: queryKeys.myProviders,
    queryFn: () => providerService.getMyProviders(),
  });
};

export const useProviderMeetings = () => {
  return useQuery({
    queryKey: queryKeys.providerMeetings,
    queryFn: () => providerService.getMyProviderMeetings(),
  });
};
