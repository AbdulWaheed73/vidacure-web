import { api } from './api';
import type { GetLabTestOrdersResponse } from '../types/lab-test-types';

export const doctorLabTestService = {
  getPatientLabOrders: async (patientId: string): Promise<GetLabTestOrdersResponse> => {
    const response = await api.get<GetLabTestOrdersResponse>(
      `/api/doctor/patient/${patientId}/lab-orders`
    );
    return response.data;
  },
};
