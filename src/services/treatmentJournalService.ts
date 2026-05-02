import { api } from './api';
import type { TreatmentJournalResponse } from '../types/treatment-journal-types';

export const treatmentJournalService = {
  getDoctorPatientJournal: async (patientId: string): Promise<TreatmentJournalResponse> => {
    const response = await api.get('/api/doctor/treatment-journal', {
      params: { patientId },
    });
    return response.data;
  },

  upsertDoctorPatientJournal: async (
    patientId: string,
    content: string
  ): Promise<TreatmentJournalResponse> => {
    const response = await api.put('/api/doctor/treatment-journal', {
      patientId,
      content,
    });
    return response.data;
  },

  getUnassignedDoctorPatientJournal: async (
    patientId: string
  ): Promise<TreatmentJournalResponse> => {
    const response = await api.get(
      `/api/doctor/unassigned-patient-treatment-journal/${patientId}`
    );
    return response.data;
  },

  upsertUnassignedDoctorPatientJournal: async (
    patientId: string,
    content: string
  ): Promise<TreatmentJournalResponse> => {
    const response = await api.put(
      `/api/doctor/unassigned-patient-treatment-journal/${patientId}`,
      { content }
    );
    return response.data;
  },

  getPatientJournal: async (): Promise<TreatmentJournalResponse> => {
    const response = await api.get('/api/patient/treatment-journal');
    return response.data;
  },
};
