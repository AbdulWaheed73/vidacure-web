import type { QuestionnaireAnswer } from '../components/onboarding/questionMapping';

export type QuestionnaireResponse = {
  message?: string;
  questionnaire: QuestionnaireAnswer[];
};

export type QuestionnaireUpdateRequest = {
  updates: QuestionnaireAnswer[];
};