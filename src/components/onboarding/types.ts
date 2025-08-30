import { createContext } from "react";
import type { User } from "../../types";

export type PersonalInfo = {
  fullName: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other" | "";
}

export type PhysicalDetails = {
  height: string;
  currentWeight: string;
  goalWeight: string;
  lowestWeight: string;
  highestWeight: string;
  expectedWeightLoss: string;
  waistCircumference: string;
  bmi: string;
}

export type HealthBackground = {
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

export type MedicalHistory = {
  illnesses: string;
  medications: string;
  conditions: string[];
  familyHistory: string[];
}

export type OnboardingData = {
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
  user: User | null;
} | null>(null);