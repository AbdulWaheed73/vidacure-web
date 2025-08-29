import { createContext } from "react";

export interface PersonalInfo {
  fullName: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other" | "";
}

export interface PhysicalDetails {
  height: string;
  currentWeight: string;
  goalWeight: string;
  lowestWeight: string;
  highestWeight: string;
  expectedWeightLoss: string;
  waistCircumference: string;
  bmi: string;
}

export interface HealthBackground {
  smokingStatus: "yes" | "no" | "";
  smokingAlcoholDetails: string;
  physicalActivity: string;
  activityLevel: "sedentary" | "active" | "very-active" | "";
  eatingHabits: string;
  sugarIntake: "low" | "moderate" | "high" | "";
  carbohydrateIntake: "low" | "moderate" | "high" | "";
  processedFoodIntake: "low" | "moderate" | "high" | "";
  previousWeightLoss: string;
  weightLossDuration: string;
}

export interface MedicalHistory {
  illnesses: string;
  medications: string;
  conditions: string[];
  familyHistory: string[];
}

export interface OnboardingData {
  personalInfo: PersonalInfo;
  physicalDetails: PhysicalDetails;
  healthBackground: HealthBackground;
  medicalHistory: MedicalHistory;
}

export const OnboardingContext = createContext<{
  data: OnboardingData;
  updateData: (step: keyof OnboardingData, newData: PersonalInfo | PhysicalDetails | HealthBackground | MedicalHistory) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  validationErrors: string[];
  showErrors: boolean;
} | null>(null);