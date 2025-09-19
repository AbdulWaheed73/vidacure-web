import { api } from './api';
import type {
  PrescriptionRequestsResponse,
  PrescriptionRequestResponse,
  CreatePrescriptionRequestData
} from '../types/prescription-types';

export const prescriptionService = {
  // Get all prescription requests for the patient
  getPrescriptionRequests: async (): Promise<PrescriptionRequestsResponse> => {
    const response = await api.get('/api/prescription/requests');
    return response.data;
  },

  // Create a new prescription request
  createPrescriptionRequest: async (data: CreatePrescriptionRequestData): Promise<PrescriptionRequestResponse> => {
    const response = await api.post('/api/prescription/requests', data);
    return response.data;
  },
};