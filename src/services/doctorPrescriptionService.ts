import { api } from './api';
import type { DoctorPrescriptionResponse } from '../types/doctor-prescription-types';

export const doctorPrescriptionService = {
  // Get all prescription requests for the doctor's assigned patients
  getDoctorPrescriptionRequests: async (): Promise<DoctorPrescriptionResponse> => {
    const response = await api.get('/api/doctor/prescriptions');
    return response.data;
  },

  // Update prescription request status
  updatePrescriptionRequestStatus: async (requestId: string, status: string): Promise<{ message: string }> => {
    const response = await api.put(`/api/doctor/prescription-requests/${requestId}/status`, { status });
    return response.data;
  },
};