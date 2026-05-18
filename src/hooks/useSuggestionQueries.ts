import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryClient';
import { suggestionService } from '@/services/suggestionService';
import type {
  CreateSuggestionPayload,
  SuggestionSubmitterRole,
} from '@/types/suggestion-types';

export const useSubmitSuggestion = (role: SuggestionSubmitterRole) => {
  return useMutation({
    mutationFn: (payload: CreateSuggestionPayload) =>
      role === 'patient'
        ? suggestionService.submitAsPatient(payload)
        : suggestionService.submitAsDoctor(payload),
  });
};

export const useAdminSuggestions = () => {
  return useQuery({
    queryKey: queryKeys.adminSuggestions,
    queryFn: () => suggestionService.list(),
  });
};

export const useDeleteSuggestion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => suggestionService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.adminSuggestions });
    },
  });
};
