import { api } from './api';
import type { DoctorPrescriptionResponse, UpdatePrescriptionStatusData } from '../types/doctor-prescription-types';



export const doctorPrescriptionService = {
  // Get prescription requests for the doctor's assigned patients.
  // Pending requests always come back in full; `page` only paginates the history.
  getDoctorPrescriptionRequests: async (page: number = 1, limit: number = 10): Promise<DoctorPrescriptionResponse> => {
    const response = await api.get('/api/doctor/prescriptions', { params: { page, limit } });
    const d = response.data?.data as Record<string, unknown> | undefined;
    console.log('[doctorPrescriptionService] page=%s keys=%o pendingRequests=%s legacy.prescriptionRequests=%s pendingCount=%s',
      page,
      d ? Object.keys(d) : null,
      (d?.pendingRequests as unknown[] | undefined)?.length,
      (d?.prescriptionRequests as unknown[] | undefined)?.length,
      d?.pendingCount,
    );
    return response.data;
  },

  // Update prescription request status
  updatePrescriptionRequestStatus: async (
    requestId: string,
    status: string,
    prescriptionData?: Omit<UpdatePrescriptionStatusData, 'status'>
  ): Promise<{ message: string }> => {
    const payload = {
      status,
      ...prescriptionData
    };
    // console.log('Sending prescription update to backend:', payload);
    const response = await api.put(`/api/doctor/prescription-requests/${requestId}/status`, payload);
    return response.data;
  },
};