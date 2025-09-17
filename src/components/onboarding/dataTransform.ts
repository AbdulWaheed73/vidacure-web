// Data transformation utilities for converting between frontend form data and backend question format

import type { OnboardingData } from './types';
import { QUESTION_MAPPING, REVERSE_QUESTION_MAPPING, type QuestionnaireAnswer } from './questionMapping';

/**
 * Converts frontend form data to backend questionnaire format
 * Example: {personalInfo: {fullName: "John"}} → [{questionId: "Q1", answer: "John"}]
 */
export const transformFormDataToQuestionnaire = (formData: OnboardingData): QuestionnaireAnswer[] => {
  const questionnaire: QuestionnaireAnswer[] = [];

  // Helper function to safely get nested values
  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  };

  // Transform each field to question format
  Object.entries(QUESTION_MAPPING).forEach(([fieldPath, questionId]) => {
    const value = getNestedValue(formData, fieldPath);
    
    if (value !== null && value !== undefined && value !== '') {
      let answer: string;
      
      // Handle arrays (conditions, familyHistory)
      if (Array.isArray(value)) {
        answer = value.join(', ');
      } else {
        answer = String(value);
      }
      
      questionnaire.push({
        questionId,
        answer
      });
    }
  });

  return questionnaire;
};

/**
 * Converts backend questionnaire format to frontend form data
 * Example: [{questionId: "Q1", answer: "John"}] → {personalInfo: {fullName: "John"}}
 */
export const transformQuestionnaireToFormData = (questionnaire: QuestionnaireAnswer[]): OnboardingData => {
  // Initialize empty form data structure
  const formData: OnboardingData = {
    personalInfo: {
      fullName: '',
      dateOfBirth: '',
      gender: '',
      email: '',
    },
    physicalDetails: {
      height: '',
      currentWeight: '',
      goalWeight: '',
      lowestWeight: '',
      highestWeight: '',
      expectedWeightLoss: '',
      waistCircumference: '',
      bmi: '',
    },
    healthBackground: {
      smokingStatus: '',
      smokingAlcoholDetails: '',
      physicalActivity: '',
      activityLevel: '',
      eatingHabits: '',
      sugarIntake: '',
      carbohydrateIntake: '',
      processedFoodIntake: '',
      previousWeightLoss: '',
      weightLossDuration: '',
    },
    medicalHistory: {
      illnesses: '',
      medications: '',
      conditions: [],
      familyHistory: [],
    },
  };

  // Helper function to safely set nested values
  const setNestedValue = (obj: any, path: string, value: any): void => {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((current, key) => {
      if (!current[key]) current[key] = {};
      return current[key];
    }, obj);
    
    // Handle arrays (conditions, familyHistory)
    if (path.includes('conditions') || path.includes('familyHistory')) {
      target[lastKey] = value.split(', ').filter((item: string) => item.trim());
    } else {
      target[lastKey] = value;
    }
  };

  // Transform questionnaire answers back to form data
  questionnaire.forEach(({ questionId, answer }) => {
    const fieldPath = REVERSE_QUESTION_MAPPING[questionId];
    if (fieldPath && answer) {
      setNestedValue(formData, fieldPath, answer);
    }
  });

  return formData;
};

/**
 * Validates that all required questions have been answered
 */
export const validateQuestionnaireCompleteness = (questionnaire: QuestionnaireAnswer[]): {
  isComplete: boolean;
  missingQuestions: string[];
} => {
  const answeredQuestions = new Set(questionnaire.map(q => q.questionId));
  const allQuestions = Object.values(QUESTION_MAPPING);
  const missingQuestions = allQuestions.filter(qId => !answeredQuestions.has(qId));

  return {
    isComplete: missingQuestions.length === 0,
    missingQuestions
  };
};

/**
 * Creates a summary of answered vs total questions for progress tracking
 */
export const getQuestionnaireProgress = (questionnaire: QuestionnaireAnswer[]): {
  answered: number;
  total: number;
  percentage: number;
} => {
  const total = Object.keys(QUESTION_MAPPING).length;
  const answered = questionnaire.length;
  const percentage = Math.round((answered / total) * 100);

  return {
    answered,
    total,
    percentage
  };
};