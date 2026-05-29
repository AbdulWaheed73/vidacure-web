import { QueryClient } from '@tanstack/react-query';
import type { AuditLogsQueryParams, LogReviewsQueryParams } from '@/types/admin-types';

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
  doctorUnassignedPatients: ['doctorUnassignedPatients'] as const,
  doctorUnassignedPatientQuestionnaire: (patientId: string) => ['doctorUnassignedPatientQuestionnaire', patientId] as const,
  doctorPatientProfile: (patientId: string) => ['doctorPatientProfile', patientId] as const,
  doctorUnassignedPatientProfile: (patientId: string) => ['doctorUnassignedPatientProfile', patientId] as const,
  doctorPatientQuestionnaire: (patientId: string) => ['doctorPatientQuestionnaire', patientId] as const,
  doctorPatientLabOrders: (patientId: string) => ['doctorPatientLabOrders', patientId] as const,
  doctorProfile: ['doctorProfile'] as const,
  doctorPatientJournal: (patientId: string) => ['doctorPatientJournal', patientId] as const,
  doctorUnassignedPatientJournal: (patientId: string) => ['doctorUnassignedPatientJournal', patientId] as const,
  patientJournal: ['patientJournal'] as const,
  myProviders: ['myProviders'] as const,
  providerMeetings: ['providerMeetings'] as const,
  adminSuggestions: ['admin', 'suggestions'] as const,
  adminAuditLogs: (params: AuditLogsQueryParams) => ['admin', 'auditLogs', params] as const,
  adminAuditAnomalies: ['admin', 'auditAnomalies'] as const,
  adminLogReviews: (params: LogReviewsQueryParams) => ['admin', 'logReviews', params] as const,
  labTestOrders: ['labTestOrders'] as const,
};
