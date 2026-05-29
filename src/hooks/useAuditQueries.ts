import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryClient';
import { adminService } from '@/services/adminService';
import type {
  AuditLogsQueryParams,
  LogReviewsQueryParams,
  CreateLogReviewRequest,
} from '@/types/admin-types';

export const useAuditLogs = (params: AuditLogsQueryParams) => {
  return useQuery({
    queryKey: queryKeys.adminAuditLogs(params),
    queryFn: () => adminService.getAuditLogs(params),
  });
};

export const useAuditAnomalies = () => {
  return useQuery({
    queryKey: queryKeys.adminAuditAnomalies,
    queryFn: () => adminService.getAuditAnomalies(),
    enabled: false, // triggered on demand via refetch (Anomaly Scan button)
  });
};

export const useLogReviews = (params: LogReviewsQueryParams) => {
  return useQuery({
    queryKey: queryKeys.adminLogReviews(params),
    queryFn: () => adminService.getLogReviews(params),
  });
};

export const useCreateLogReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLogReviewRequest) => adminService.createLogReview(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'logReviews'] });
    },
  });
};

export const useResolveLogReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, resolutionNotes }: { id: string; resolutionNotes?: string }) =>
      adminService.resolveLogReview(id, resolutionNotes),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'logReviews'] });
    },
  });
};
