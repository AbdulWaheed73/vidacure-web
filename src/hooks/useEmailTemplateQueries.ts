import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryClient';
import { emailTemplateService } from '@/services/emailTemplateService';
import type {
  CreateEmailTemplatePayload,
  UpdateEmailTemplatePayload,
} from '@/types/email-template-types';

export const useEmailTemplates = () => {
  return useQuery({
    queryKey: queryKeys.adminEmailTemplates,
    queryFn: () => emailTemplateService.list(),
  });
};

export const useCreateEmailTemplate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateEmailTemplatePayload) => emailTemplateService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.adminEmailTemplates });
    },
  });
};

export const useUpdateEmailTemplate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateEmailTemplatePayload }) =>
      emailTemplateService.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.adminEmailTemplates });
    },
  });
};

export const useDeleteEmailTemplate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => emailTemplateService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.adminEmailTemplates });
    },
  });
};
