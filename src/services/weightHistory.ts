import { api } from './api';

export type WeightHistoryEntry = {
  weight: number;
  date: string; // yyyy-mm-dd format
  sideEffects?: string;
  notes?: string;
};

export type AddWeightHistoryRequest = {
  weight: number;
  sideEffects?: string;
  notes?: string;
};

export type WeightHistoryResponse = {
  weightHistory: WeightHistoryEntry[];
};

export type AddWeightHistoryResponse = {
  message: string;
  entry: WeightHistoryEntry;
};

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