import { api } from './api';
import type {
  ConsentStatusResponse,
  ConsentType,
  AllConsentsStatus,
  ConsentRecord,
  AccessLogEntry,
} from '../types';

/**
 * Get current consent status for the authenticated user (privacy_policy only - legacy)
 */
export const getStatus = async (): Promise<ConsentStatusResponse> => {
  const response = await api.get<ConsentStatusResponse>('/api/consent/status');
  return response.data;
};

/**
 * Get status for all consent types
 */
export const getAllConsentsStatus = async (): Promise<AllConsentsStatus> => {
  const response = await api.get<AllConsentsStatus>('/api/consent/status?all=true');
  return response.data;
};

/**
 * Record a consent decision
 */
export const recordConsent = async (
  version: string,
  accepted: boolean,
  consentType: ConsentType = 'privacy_policy'
): Promise<void> => {
  await api.post('/api/consent', {
    consentType,
    version,
    accepted,
  });
};

/**
 * Withdraw a specific consent
 */
export const withdrawConsent = async (
  consentType: ConsentType
): Promise<void> => {
  await api.post('/api/consent/withdraw', {
    consentType,
  });
};

/**
 * Get full consent history
 */
export const getHistory = async (): Promise<ConsentRecord[]> => {
  const response = await api.get<{ consents: ConsentRecord[] }>('/api/consent');
  return response.data.consents;
};

/**
 * Get patient access log (loggutdrag)
 */
export const getAccessLog = async (): Promise<AccessLogEntry[]> => {
  const response = await api.get<{ logs: AccessLogEntry[] }>('/api/patient/access-log');
  return response.data.logs;
};

export default {
  getStatus,
  getAllConsentsStatus,
  recordConsent,
  withdrawConsent,
  getHistory,
  getAccessLog,
};
