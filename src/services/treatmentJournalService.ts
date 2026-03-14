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

  getPatientJournal: async (): Promise<TreatmentJournalResponse> => {
    const response = await api.get('/api/patient/treatment-journal');
    return response.data;
  },
};
