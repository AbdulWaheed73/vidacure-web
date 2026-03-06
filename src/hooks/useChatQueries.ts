import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryClient';
import { chatService } from '@/services/chatService';

export const useChatConversation = (enabled = true) => {
  return useQuery({
    queryKey: queryKeys.chatConversation,
    queryFn: () => chatService.getPatientConversation(),
    enabled,
  });
};

export const useChatConversations = (enabled = true) => {
  return useQuery({
    queryKey: queryKeys.chatConversations,
    queryFn: () => chatService.getDoctorConversations(),
    enabled,
  });
};

export const useChatUnreadCounts = (enabled = true) => {
  return useQuery({
    queryKey: queryKeys.chatUnreadCounts,
    queryFn: async () => {
      return chatService.getUnreadCounts();
    },
    enabled,
    staleTime: 10 * 1000, // Consider stale after 10 seconds
    refetchInterval: 15000, // Poll every 15 seconds
    refetchIntervalInBackground: false, // Stop polling when tab is hidden
  });
};
