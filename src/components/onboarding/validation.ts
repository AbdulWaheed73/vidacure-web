import type { PersonalInfo, PhysicalDetails, HealthBackground, MedicalHistory } from "./types";

export const validatePersonalInfo = (data: PersonalInfo): boolean => {
  return !!(
    data.fullName.trim() &&
    data.dateOfBirth.trim() &&
    data.gender.trim()
  );
};

export const validatePhysicalDetails = (data: PhysicalDetails): boolean => {
  return !!(
    data.height.trim() &&
    data.currentWeight.trim() &&
    data.goalWeight.trim() &&
    data.lowestWeight.trim() &&
    data.highestWeight.trim() &&
    data.expectedWeightLoss.trim() &&
    data.waistCircumference.trim() &&
    data.bmi.trim()
  );
};

export const validateHealthBackground = (data: HealthBackground): boolean => {
  return !!(
    data.smokingStatus.trim() &&
    data.smokingAlcoholDetails.trim() &&
    data.physicalActivity.trim() &&
    data.activityLevel.trim() &&
    data.eatingHabits.trim() &&
    data.sugarIntake.trim() &&
    data.carbohydrateIntake.trim() &&
    data.processedFoodIntake.trim() &&
    data.previousWeightLoss.trim() &&
    data.weightLossDuration.trim()
  );
};

export const validateMedicalHistory = (data: MedicalHistory): boolean => {
  return !!(
    data.illnesses.trim() &&
    data.medications.trim() &&
    data.conditions.length > 0 &&
    data.familyHistory.length > 0
  );
};

export const getValidationErrors = (step: number, data: PersonalInfo | PhysicalDetails | HealthBackground | MedicalHistory): string[] => {
  const errors: string[] = [];
  
  switch (step) {
    case 1: {
      const personalInfo = data as PersonalInfo;
      if (!personalInfo.fullName.trim()) errors.push("Full Name is required");
      if (!personalInfo.dateOfBirth.trim()) errors.push("Date of birth is required");
      if (!personalInfo.gender.trim()) errors.push("Gender is required");
      break;
    }
      
    case 2: {
      const physicalDetails = data as PhysicalDetails;
      if (!physicalDetails.height.trim()) errors.push("Height is required");
      if (!physicalDetails.currentWeight.trim()) errors.push("Current Weight is required");
      if (!physicalDetails.goalWeight.trim()) errors.push("Goal Weight is required");
      if (!physicalDetails.lowestWeight.trim()) errors.push("Lowest weight is required");
      if (!physicalDetails.highestWeight.trim()) errors.push("Highest weight is required");
      if (!physicalDetails.expectedWeightLoss.trim()) errors.push("Expected weight loss is required");
      if (!physicalDetails.waistCircumference.trim()) errors.push("Waist circumference is required");
      if (!physicalDetails.bmi.trim()) errors.push("BMI is required");
      break;
    }
      
    case 3: {
      const healthBackground = data as HealthBackground;
      if (!healthBackground.smokingStatus.trim()) errors.push("Smoking status is required");
      if (!healthBackground.smokingAlcoholDetails.trim()) errors.push("Smoking/Alcohol details are required");
      if (!healthBackground.physicalActivity.trim()) errors.push("Physical activity description is required");
      if (!healthBackground.activityLevel.trim()) errors.push("Activity level is required");
      if (!healthBackground.eatingHabits.trim()) errors.push("Eating habits description is required");
      if (!healthBackground.sugarIntake.trim()) errors.push("Sugar intake level is required");
      if (!healthBackground.carbohydrateIntake.trim()) errors.push("Carbohydrate intake level is required");
      if (!healthBackground.processedFoodIntake.trim()) errors.push("Processed food intake level is required");
      if (!healthBackground.previousWeightLoss.trim()) errors.push("Previous weight loss attempts are required");
      if (!healthBackground.weightLossDuration.trim()) errors.push("Weight loss duration is required");
      break;
    }
      
    case 4: {
      const medicalHistory = data as MedicalHistory;
      if (!medicalHistory.illnesses.trim()) errors.push("Illnesses information is required");
      if (!medicalHistory.medications.trim()) errors.push("Medications information is required");
      if (medicalHistory.conditions.length === 0) errors.push("Please select at least one condition option");
      if (medicalHistory.familyHistory.length === 0) errors.push("Please select at least one family history option");
      break;
    }
  }
  
  return errors;
};