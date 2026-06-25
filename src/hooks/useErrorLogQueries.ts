import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryClient';
import { adminService } from '@/services/adminService';
import type { ErrorLogsQueryParams } from '@/types/admin-types';

export const useErrorLogs = (params: ErrorLogsQueryParams) => {
  return useQuery({
    queryKey: queryKeys.adminErrorLogs(params),
    queryFn: () => adminService.getErrorLogs(params),
  });
};

// Full detail is fetched lazily — only when a row is opened (id set).
export const useErrorLog = (id: string | null) => {
  return useQuery({
    queryKey: queryKeys.adminErrorLog(id ?? ''),
    queryFn: () => adminService.getErrorLog(id as string),
    enabled: !!id,
  });
};

export const useErrorLogSummary = () => {
  return useQuery({
    queryKey: queryKeys.adminErrorLogSummary,
    queryFn: () => adminService.getErrorLogSummary(),
  });
};

export const useResolveErrorLog = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, resolved }: { id: string; resolved: boolean }) =>
      adminService.resolveErrorLog(id, resolved),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'errorLogs'] });
      qc.invalidateQueries({ queryKey: queryKeys.adminErrorLogSummary });
    },
  });
};
