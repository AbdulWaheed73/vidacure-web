// Questionnaire API service for backend integration

import { api } from './api';
import type { QuestionnaireAnswer } from '@/components/onboarding/questionMapping';
import type {
  QuestionnaireResponse,
} from '../types/questionnaire-types';

/**
 * Submit complete questionnaire to backend
 */
export const submitQuestionnaire = async (
  questionnaire: QuestionnaireAnswer[],
  phone: string,
): Promise<QuestionnaireResponse> => {
  try {
    const response = await api.post('/api/patient/questionnaire', {
      questionnaire,
      phone,
    });

    return response.data;
  } catch (error: any) {
    console.error('Error submitting questionnaire:', error);
    throw new Error(error.response?.data?.error || 'Failed to submit questionnaire');
  }
};

/**
 * Get existing questionnaire data from backend
 */
export const getQuestionnaire = async (): Promise<QuestionnaireAnswer[]> => {
  try {
    const response = await api.get('/api/patient/questionnaire');
    return response.data.questionnaire || [];
  } catch (error: any) {
    console.error('Error fetching questionnaire:', error);
    
    // If patient not found or no questionnaire exists, return empty array
    if (error.response?.status === 404) {
      return [];
    }
    
    throw new Error(error.response?.data?.error || 'Failed to fetch questionnaire');
  }
};

/**
 * Update specific questionnaire answers
 */
export const updateQuestionnaire = async (updates: QuestionnaireAnswer[]): Promise<QuestionnaireResponse> => {
  try {
    const response = await api.patch('/api/patient/questionnaire', {
      updates
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Error updating questionnaire:', error);
    throw new Error(error.response?.data?.error || 'Failed to update questionnaire');
  }
};

export const saveHeightEmail = async (email: string, height: string) => {
  try {
    await api.patch('/api/patient/profile', {
      email,
      height: height ? parseFloat(height) : undefined,
    });
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to save email or height');
  }
};

export const savePhone = async (phone: string): Promise<void> => {
  await api.patch('/api/patient/profile', { phone });
};
