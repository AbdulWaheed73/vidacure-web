import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryClient';
import { calendlyService } from '@/services/calendlyService';
import { doctorPrescriptionService } from '@/services/doctorPrescriptionService';
import { doctorPatientService } from '@/services/doctorPatientService';
import { doctorProfileService } from '@/services/doctorProfileService';
import { doctorLabTestService } from '@/services/doctorLabTestService';
import { chatService } from '@/services/chatService';
import { treatmentJournalService } from '@/services/treatmentJournalService';
import { PrescriptionRequestStatus } from '@/types/doctor-prescription-types';

export const useDoctorMeetings = () => {
  return useInfiniteQuery({
    queryKey: queryKeys.doctorMeetings,
    queryFn: ({ pageParam }) => calendlyService.getDoctorOwnMeetings(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.pagination?.hasMore ? lastPage.pagination.nextPageToken ?? undefined : undefined,
  });
};

export const useDoctorPrescriptions = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: [...queryKeys.doctorPrescriptions, params],
    queryFn: () => doctorPrescriptionService.getDoctorPrescriptionRequests(params),
  });
};

export const useApprovePrescription = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      requestId,
      prescriptionData,
    }: {
      requestId: string;
      prescriptionData: {
        medicationName: string;
        dosage: string;
        usageInstructions?: string;
        dateIssued: string;
      };
    }) =>
      doctorPrescriptionService.updatePrescriptionRequestStatus(
        requestId,
        PrescriptionRequestStatus.APPROVED,
        prescriptionData
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.doctorPrescriptions });
    },
  });
};

export const useDoctorConversations = () => {
  return useQuery({
    queryKey: queryKeys.doctorConversations,
    queryFn: () => chatService.getDoctorConversations(),
  });
};

export const useDoctorPatients = () => {
  return useQuery({
    queryKey: queryKeys.doctorPatients,
    queryFn: () => doctorPatientService.getDoctorPatients(),
  });
};

export const useDoctorUnassignedPatients = () => {
  return useQuery({
    queryKey: queryKeys.doctorUnassignedPatients,
    queryFn: () => doctorPatientService.getUnassignedPatients(),
  });
};

export const useDoctorUnassignedPatientQuestionnaire = (patientId: string | null, enabled: boolean) => {
  return useQuery({
    queryKey: queryKeys.doctorUnassignedPatientQuestionnaire(patientId ?? ''),
    queryFn: () => doctorPatientService.getUnassignedPatientQuestionnaire(patientId!),
    enabled: !!patientId && enabled,
  });
};

export const useDoctorPatientProfile = (patientId: string | null) => {
  return useQuery({
    queryKey: queryKeys.doctorPatientProfile(patientId ?? ''),
    queryFn: () => doctorPatientService.getPatientProfile(patientId!),
    enabled: !!patientId,
  });
};

export const useDoctorProfile = () => {
  return useQuery({
    queryKey: queryKeys.doctorProfile,
    queryFn: () => doctorProfileService.getDoctorProfile(),
  });
};

export const useDoctorPatientQuestionnaire = (patientId: string | null, enabled: boolean) => {
  return useQuery({
    queryKey: queryKeys.doctorPatientQuestionnaire(patientId ?? ''),
    queryFn: () => doctorPatientService.getPatientQuestionnaire(patientId!),
    enabled: !!patientId && enabled,
  });
};

export const useDoctorPatientLabOrders = (patientId: string | null, enabled: boolean) => {
  return useQuery({
    queryKey: queryKeys.doctorPatientLabOrders(patientId ?? ''),
    queryFn: () => doctorLabTestService.getPatientLabOrders(patientId!),
    enabled: !!patientId && enabled,
  });
};

export const useDoctorPatientJournal = (patientId: string | null, enabled: boolean) => {
  return useQuery({
    queryKey: queryKeys.doctorPatientJournal(patientId ?? ''),
    queryFn: () => treatmentJournalService.getDoctorPatientJournal(patientId!),
    enabled: !!patientId && enabled,
  });
};

export const useUpsertDoctorPatientJournal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ patientId, content }: { patientId: string; content: string }) =>
      treatmentJournalService.upsertDoctorPatientJournal(patientId, content),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({
        queryKey: queryKeys.doctorPatientJournal(variables.patientId),
      });
    },
  });
};
