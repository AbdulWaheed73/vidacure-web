import { api } from './api';
import type {
  DoctorPatientListResponse,
  DoctorPatientProfileResponse,
  PatientQuestionnaireResponse,
} from '../types/doctor-patient-types';

export const doctorPatientService = {
  getDoctorPatients: async (): Promise<DoctorPatientListResponse> => {
    const response = await api.get('/api/doctor/patients');
    return response.data;
  },

  getPatientProfile: async (
    patientId: string,
    limit: number = 50
  ): Promise<DoctorPatientProfileResponse> => {
    const response = await api.get('/api/doctor/patient-profile', {
      params: { patientId, limit },
    });
    return response.data;
  },

  getPatientQuestionnaire: async (
    patientId: string
  ): Promise<PatientQuestionnaireResponse> => {
    const response = await api.get('/api/doctor/patient-questionnaire', {
      params: { patientId },
    });
    return response.data;
  },

  getUnassignedPatients: async (): Promise<DoctorPatientListResponse> => {
    const response = await api.get('/api/doctor/unassigned-patients');
    return response.data;
  },

  getUnassignedPatientQuestionnaire: async (
    patientId: string
  ): Promise<PatientQuestionnaireResponse> => {
    const response = await api.get(`/api/doctor/unassigned-patient-questionnaire/${patientId}`);
    return response.data;
  },
};
