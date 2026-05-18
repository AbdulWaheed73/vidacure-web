import { api } from './api';
import type {
  CreateSuggestionPayload,
  CreateSuggestionResponse,
  ListSuggestionsResponse,
} from '../types/suggestion-types';

export const suggestionService = {
  submitAsPatient: async (
    payload: CreateSuggestionPayload
  ): Promise<CreateSuggestionResponse> => {
    const response = await api.post('/api/patient/suggestions', payload);
    return response.data;
  },

  submitAsDoctor: async (
    payload: CreateSuggestionPayload
  ): Promise<CreateSuggestionResponse> => {
    const response = await api.post('/api/doctor/suggestions', payload);
    return response.data;
  },

  list: async (): Promise<ListSuggestionsResponse> => {
    const response = await api.get('/api/admin/suggestions');
    return response.data;
  },

  remove: async (id: string): Promise<{ success: boolean }> => {
    const response = await api.delete(`/api/admin/suggestions/${id}`);
    return response.data;
  },
};
