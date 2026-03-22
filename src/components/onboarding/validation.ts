import type { PersonalInfo, PhysicalDetails, HealthBackground, MedicalHistory } from "./types";

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const getAge = (dateOfBirth: string): number => {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

const toNum = (val: string): number => parseFloat(val) || 0;

export const validatePersonalInfo = (data: PersonalInfo): boolean => {
  if (!data.fullName.trim() || !data.dateOfBirth.trim() || !data.gender.trim() || !data.email.trim()) return false;
  if (!isValidEmail(data.email)) return false;
  const age = getAge(data.dateOfBirth);
  if (age < 18 || age > 120) return false;
  return true;
};

export const validatePhysicalDetails = (data: PhysicalDetails): boolean => {
  if (!data.height.trim() || !data.currentWeight.trim() || !data.goalWeight.trim() ||
      !data.lowestWeight.trim() || !data.highestWeight.trim() || !data.expectedWeightLoss.trim() ||
      !data.waistCircumference.trim() || !data.bmi.trim()) return false;
  const h = toNum(data.height);
  const cw = toNum(data.currentWeight);
  const gw = toNum(data.goalWeight);
  const lw = toNum(data.lowestWeight);
  const hw = toNum(data.highestWeight);
  if (h < 100 || h > 250) return false;
  if (cw < 30 || cw > 400) return false;
  if (gw < 30 || gw > 400) return false;
  if (lw < 30 || lw > 400) return false;
  if (hw < 30 || hw > 400) return false;
  if (gw >= cw) return false;
  if (lw > hw) return false;
  return true;
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
      const d = data as PersonalInfo;
      if (!d.fullName.trim()) errors.push("Full Name is required");
      if (!d.dateOfBirth.trim()) errors.push("Date of birth is required");
      else {
        const age = getAge(d.dateOfBirth);
        if (age < 18) errors.push("You must be at least 18 years old");
        if (age > 120) errors.push("Please enter a valid date of birth");
      }
      if (!d.gender.trim()) errors.push("Gender is required");
      if (!d.email.trim()) errors.push("Email is required");
      else if (!isValidEmail(d.email)) errors.push("Please enter a valid email address");
      break;
    }

    case 2: {
      const d = data as PhysicalDetails;
      if (!d.height.trim()) errors.push("Height is required");
      else if (toNum(d.height) < 100 || toNum(d.height) > 250) errors.push("Height must be between 100 and 250 cm");

      if (!d.currentWeight.trim()) errors.push("Current Weight is required");
      else if (toNum(d.currentWeight) < 30 || toNum(d.currentWeight) > 400) errors.push("Current weight must be between 30 and 400 kg");

      if (!d.goalWeight.trim()) errors.push("Goal Weight is required");
      else if (toNum(d.goalWeight) < 30 || toNum(d.goalWeight) > 400) errors.push("Goal weight must be between 30 and 400 kg");
      else if (d.currentWeight.trim() && toNum(d.goalWeight) >= toNum(d.currentWeight)) errors.push("Goal weight must be less than current weight");

      if (!d.lowestWeight.trim()) errors.push("Lowest weight is required");
      else if (toNum(d.lowestWeight) < 30 || toNum(d.lowestWeight) > 400) errors.push("Lowest weight must be between 30 and 400 kg");

      if (!d.highestWeight.trim()) errors.push("Highest weight is required");
      else if (toNum(d.highestWeight) < 30 || toNum(d.highestWeight) > 400) errors.push("Highest weight must be between 30 and 400 kg");

      if (d.lowestWeight.trim() && d.highestWeight.trim() && toNum(d.lowestWeight) > toNum(d.highestWeight)) {
        errors.push("Lowest weight cannot be greater than highest weight");
      }

      if (!d.expectedWeightLoss.trim()) errors.push("Expected weight loss is required");
      else if (toNum(d.expectedWeightLoss) <= 0 || toNum(d.expectedWeightLoss) > 200) errors.push("Expected weight loss must be between 1 and 200 kg");

      if (!d.waistCircumference.trim()) errors.push("Waist circumference is required");
      else if (toNum(d.waistCircumference) < 20 || toNum(d.waistCircumference) > 250) errors.push("Waist circumference must be between 20 and 250 cm");

      if (!d.bmi.trim()) errors.push("BMI is required");
      else if (toNum(d.bmi) < 10 || toNum(d.bmi) > 80) errors.push("BMI must be between 10 and 80");
      break;
    }

    case 3: {
      const d = data as HealthBackground;
      if (!d.smokingStatus.trim()) errors.push("Smoking status is required");
      if (!d.smokingAlcoholDetails.trim()) errors.push("Smoking/Alcohol details are required");
      if (!d.physicalActivity.trim()) errors.push("Physical activity description is required");
      if (!d.activityLevel.trim()) errors.push("Activity level is required");
      if (!d.eatingHabits.trim()) errors.push("Eating habits description is required");
      if (!d.sugarIntake.trim()) errors.push("Sugar intake level is required");
      if (!d.carbohydrateIntake.trim()) errors.push("Carbohydrate intake level is required");
      if (!d.processedFoodIntake.trim()) errors.push("Processed food intake level is required");
      if (!d.previousWeightLoss.trim()) errors.push("Previous weight loss attempts are required");
      if (!d.weightLossDuration.trim()) errors.push("Weight loss duration is required");
      break;
    }

    case 4: {
      const d = data as MedicalHistory;
      if (!d.illnesses.trim()) errors.push("Illnesses information is required");
      if (!d.medications.trim()) errors.push("Medications information is required");
      if (d.conditions.length === 0) errors.push("Please select at least one condition option");
      if (d.familyHistory.length === 0) errors.push("Please select at least one family history option");
      break;
    }
  }

  return errors;
};
