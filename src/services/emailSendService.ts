import { api } from './api';
import type {
  EmailLogResponse,
  EmailLogFilters,
  PatientEmailStatusResponse,
  SendPatientEmailPayload,
} from '@/types/email-send-log-types';

export const emailSendService = {
  sendToPatient: async (
    patientId: string,
    payload: SendPatientEmailPayload,
  ): Promise<{ message: string; consentGranted: boolean }> => {
    const response = await api.post(`/api/admin/patients/${patientId}/send-email`, payload);
    return response.data;
  },

  getPatientEmailStatus: async (patientId: string): Promise<PatientEmailStatusResponse> => {
    const response = await api.get(`/api/admin/patients/${patientId}/email-status`);
    return response.data;
  },

  getEmailLog: async (filters: EmailLogFilters = {}): Promise<EmailLogResponse> => {
    const response = await api.get('/api/admin/email-log', { params: filters });
    return response.data;
  },
};
