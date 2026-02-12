import { api } from './api';
import type { ConsentStatusResponse } from '../types';

/**
 * Get current consent status for the authenticated user
 */
export const getStatus = async (): Promise<ConsentStatusResponse> => {
  const response = await api.get<ConsentStatusResponse>('/api/consent/status');
  return response.data;
};

/**
 * Record a consent decision
 */
export const recordConsent = async (
  version: string,
  accepted: boolean
): Promise<void> => {
  await api.post('/api/consent', {
    consentType: 'privacy_policy',
    version,
    accepted,
  });
};

/**
 * Get full consent history
 */
export const getHistory = async () => {
  const response = await api.get('/api/consent');
  return response.data;
};

export default {
  getStatus,
  recordConsent,
  getHistory,
};
