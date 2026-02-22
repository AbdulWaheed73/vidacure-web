import { api } from './api';
import type { DoctorProfileResponse } from '../types/doctor-types';

export const doctorProfileService = {
  getDoctorProfile: async (): Promise<DoctorProfileResponse> => {
    const response = await api.get('/api/doctor/profile');
    return response.data;
  },
};
