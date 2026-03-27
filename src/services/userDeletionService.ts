import {api} from './api';

export type DeletionResults = {
  stripe: { success: boolean; error?: string };
  stream: { success: boolean; error?: string };
  calendly: { success: boolean; notificationCreated: boolean };
  mongodb: { success: boolean; error?: string };
};

export type DeletionResponse = {
  success: boolean;
  message: string;
  deletionId: string;
  results: DeletionResults;
  confirmationId: string;
};

/**
 * Delete the currently authenticated user's account
 * This is a permanent action that removes all user data
 */
export const deleteAccount = async (): Promise<DeletionResponse> => {
  const response = await api.delete<DeletionResponse>('/api/users/me');
  return response.data;
};

/**
 * Cancel a pending deletion request within the 30-day grace period
 */
export const cancelDeletion = async (): Promise<{ success: boolean; message: string }> => {
  const response = await api.post('/api/users/me/cancel-deletion');
  return response.data;
};

export default {
  deleteAccount,
  cancelDeletion
};
