import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryClient';
import { emailSendService } from '@/services/emailSendService';
import type { EmailLogFilters, SendPatientEmailPayload } from '@/types/email-send-log-types';

export const usePatientEmailStatus = (patientId: string | null) => {
  return useQuery({
    queryKey: queryKeys.adminPatientEmailStatus(patientId ?? ''),
    queryFn: () => emailSendService.getPatientEmailStatus(patientId as string),
    enabled: !!patientId,
  });
};

export const useEmailLog = (filters: EmailLogFilters) => {
  return useQuery({
    queryKey: queryKeys.adminEmailLog(filters),
    queryFn: () => emailSendService.getEmailLog(filters),
  });
};

export const useSendPatientEmail = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ patientId, payload }: { patientId: string; payload: SendPatientEmailPayload }) =>
      emailSendService.sendToPatient(patientId, payload),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: queryKeys.adminPatientEmailStatus(variables.patientId) });
      qc.invalidateQueries({ queryKey: ['admin', 'emailLog'] });
    },
  });
};
