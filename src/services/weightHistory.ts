import { api } from './api';
import type {
  AddWeightHistoryRequest,
  WeightHistoryResponse,
  AddWeightHistoryResponse
} from '../types/weight-types';

// Add weight history entry
export const addWeightHistory = async (data: AddWeightHistoryRequest): Promise<AddWeightHistoryResponse> => {
  const response = await api.post('/api/patient/weight-history', data);
  return response.data;
};

// Get weight history
export const getWeightHistory = async (): Promise<WeightHistoryResponse> => {
  const response = await api.get('/api/patient/weight-history');
  return response.data;
};

// Delete weight history entry by date (yyyy-mm-dd)
export const deleteWeightHistory = async (date: string): Promise<{ message: string }> => {
  const response = await api.delete(`/api/patient/weight-history/${date}`);
  return response.data;
};