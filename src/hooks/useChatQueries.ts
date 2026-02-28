import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryClient';
import { supabaseChatService } from '@/services/supabaseChatService';
import { api } from '@/services/api';

export const useChatConversation = (enabled = true) => {
  return useQuery({
    queryKey: queryKeys.chatConversation,
    queryFn: () => supabaseChatService.getPatientConversation(),
    enabled,
  });
};

export const useChatConversations = (enabled = true) => {
  return useQuery({
    queryKey: queryKeys.chatConversations,
    queryFn: () => supabaseChatService.getDoctorConversations(),
    enabled,
  });
};

export const useChatUnreadCounts = (enabled = true) => {
  return useQuery({
    queryKey: queryKeys.chatUnreadCounts,
    queryFn: async () => {
      const response = await api.get<{ counts: { [conversationId: string]: number } }>(
        '/api/supabase-chat/unread-counts'
      );
      return response.data.counts;
    },
    enabled,
    staleTime: 10 * 1000, // Consider stale after 10 seconds
    refetchInterval: 15000, // Poll every 15 seconds
    refetchIntervalInBackground: false, // Stop polling when tab is hidden
  });
};
