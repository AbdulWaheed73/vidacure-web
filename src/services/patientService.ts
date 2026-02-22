import { api } from './api';
import type { PatientProfileResponse, UpdatePatientProfileData } from '../types/patient-types';

export const patientService = {
  getPatientProfile: async (): Promise<PatientProfileResponse> => {
    const response = await api.get('/api/patient/profile');
    return response.data;
  },

  updatePatientProfile: async (data: UpdatePatientProfileData): Promise<{ message: string }> => {
    const response = await api.patch('/api/patient/profile', data);
    return response.data;
  },
};
