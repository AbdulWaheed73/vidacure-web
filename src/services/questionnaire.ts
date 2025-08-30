// Questionnaire API service for backend integration

import { api } from './api';
import type { QuestionnaireAnswer } from '@/components/onboarding/questionMapping';

export interface QuestionnaireResponse {
  message?: string;
  questionnaire: QuestionnaireAnswer[];
}

export interface QuestionnaireUpdateRequest {
  updates: QuestionnaireAnswer[];
}

/**
 * Submit complete questionnaire to backend
 */
export const submitQuestionnaire = async (questionnaire: QuestionnaireAnswer[]): Promise<QuestionnaireResponse> => {
  try {
    const response = await api.post('/patient/questionnaire', {
      questionnaire
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
    const response = await api.get('/patient/questionnaire');
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
    const response = await api.patch('/patient/questionnaire', {
      updates
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Error updating questionnaire:', error);
    throw new Error(error.response?.data?.error || 'Failed to update questionnaire');
  }
};

/**
 * Save questionnaire progress (auto-save functionality)
 */
export const saveQuestionnaireProgress = async (questionnaire: QuestionnaireAnswer[]): Promise<void> => {
  try {
    await submitQuestionnaire(questionnaire);
  } catch (error) {
    // Don't throw error for auto-save failures, just log
    console.warn('Auto-save failed:', error);
  }
};