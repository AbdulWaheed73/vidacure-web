import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000, // 2 minutes
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      retry: 1,
    },
  },
});

// Centralized query keys
export const queryKeys = {
  weightHistory: ['weightHistory'] as const,
  patientProfile: ['patientProfile'] as const,
  patientMeetings: ['patientMeetings'] as const,
  prescriptionRequests: ['prescriptionRequests'] as const,
  subscriptionStatus: ['subscriptionStatus'] as const,
  chatConversation: ['chatConversation'] as const,
  chatConversations: ['chatConversations'] as const,
  chatUnreadCounts: ['chatUnreadCounts'] as const,
  doctorMeetings: ['doctorMeetings'] as const,
  doctorPrescriptions: ['doctorPrescriptions'] as const,
  doctorConversations: ['doctorConversations'] as const,
  doctorPatients: ['doctorPatients'] as const,
  doctorPatientProfile: (patientId: string) => ['doctorPatientProfile', patientId] as const,
  doctorPatientQuestionnaire: (patientId: string) => ['doctorPatientQuestionnaire', patientId] as const,
  doctorPatientLabOrders: (patientId: string) => ['doctorPatientLabOrders', patientId] as const,
  doctorProfile: ['doctorProfile'] as const,
  doctorPatientJournal: (patientId: string) => ['doctorPatientJournal', patientId] as const,
  patientJournal: ['patientJournal'] as const,
  myProviders: ['myProviders'] as const,
  providerMeetings: ['providerMeetings'] as const,
};
