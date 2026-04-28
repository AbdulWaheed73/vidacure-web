import i18n from '../../i18n';
import type { PersonalInfo, PhysicalDetails, HealthBackground, MedicalHistory } from "./types";

const t = (key: string) => i18n.t(key);

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidSwedishPhone = (value: string): boolean => {
  const cleaned = value.replace(/[\s\-()]/g, "");
  return /^(\+46\d{8,9}|0\d{8,9})$/.test(cleaned);
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
  if (!data.fullName.trim() || !data.dateOfBirth.trim() || !data.gender.trim() || !data.email.trim() || !data.phone.trim()) return false;
  if (!isValidEmail(data.email)) return false;
  if (!isValidSwedishPhone(data.phone)) return false;
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
      if (!d.fullName.trim()) errors.push(t("onboarding.validation.fullNameRequired"));
      if (!d.dateOfBirth.trim()) errors.push(t("onboarding.validation.dobRequired"));
      else {
        const age = getAge(d.dateOfBirth);
        if (age < 18) errors.push(t("onboarding.validation.ageMinimum"));
        if (age > 120) errors.push(t("onboarding.validation.dobInvalid"));
      }
      if (!d.gender.trim()) errors.push(t("onboarding.validation.genderRequired"));
      if (!d.email.trim()) errors.push(t("onboarding.validation.emailRequired"));
      else if (!isValidEmail(d.email)) errors.push(t("onboarding.validation.emailInvalid"));
      if (!d.phone.trim()) errors.push(t("onboarding.validation.phoneRequired"));
      else if (!isValidSwedishPhone(d.phone)) errors.push(t("onboarding.validation.phoneInvalid"));
      break;
    }

    case 2: {
      const d = data as PhysicalDetails;
      if (!d.height.trim()) errors.push(t("onboarding.validation.heightRequired"));
      else if (toNum(d.height) < 100 || toNum(d.height) > 250) errors.push(t("onboarding.validation.heightRange"));

      if (!d.currentWeight.trim()) errors.push(t("onboarding.validation.currentWeightRequired"));
      else if (toNum(d.currentWeight) < 30 || toNum(d.currentWeight) > 400) errors.push(t("onboarding.validation.currentWeightRange"));

      if (!d.goalWeight.trim()) errors.push(t("onboarding.validation.goalWeightRequired"));
      else if (toNum(d.goalWeight) < 30 || toNum(d.goalWeight) > 400) errors.push(t("onboarding.validation.goalWeightRange"));
      else if (d.currentWeight.trim() && toNum(d.goalWeight) >= toNum(d.currentWeight)) errors.push(t("onboarding.validation.goalWeightLess"));

      if (!d.lowestWeight.trim()) errors.push(t("onboarding.validation.lowestWeightRequired"));
      else if (toNum(d.lowestWeight) < 30 || toNum(d.lowestWeight) > 400) errors.push(t("onboarding.validation.lowestWeightRange"));

      if (!d.highestWeight.trim()) errors.push(t("onboarding.validation.highestWeightRequired"));
      else if (toNum(d.highestWeight) < 30 || toNum(d.highestWeight) > 400) errors.push(t("onboarding.validation.highestWeightRange"));

      if (d.lowestWeight.trim() && d.highestWeight.trim() && toNum(d.lowestWeight) > toNum(d.highestWeight)) {
        errors.push(t("onboarding.validation.lowestHighestMismatch"));
      }

      if (!d.expectedWeightLoss.trim()) errors.push(t("onboarding.validation.expectedWeightLossRequired"));
      else if (toNum(d.expectedWeightLoss) <= 0 || toNum(d.expectedWeightLoss) > 200) errors.push(t("onboarding.validation.expectedWeightLossRange"));

      if (!d.waistCircumference.trim()) errors.push(t("onboarding.validation.waistRequired"));
      else if (toNum(d.waistCircumference) < 20 || toNum(d.waistCircumference) > 250) errors.push(t("onboarding.validation.waistRange"));

      if (!d.bmi.trim()) errors.push(t("onboarding.validation.bmiRequired"));
      else if (toNum(d.bmi) < 10 || toNum(d.bmi) > 80) errors.push(t("onboarding.validation.bmiRange"));
      break;
    }

    case 3: {
      const d = data as HealthBackground;
      if (!d.smokingStatus.trim()) errors.push(t("onboarding.validation.smokingRequired"));
      if (!d.smokingAlcoholDetails.trim()) errors.push(t("onboarding.validation.smokingAlcoholRequired"));
      if (!d.physicalActivity.trim()) errors.push(t("onboarding.validation.physicalActivityRequired"));
      if (!d.activityLevel.trim()) errors.push(t("onboarding.validation.activityLevelRequired"));
      if (!d.eatingHabits.trim()) errors.push(t("onboarding.validation.eatingHabitsRequired"));
      if (!d.sugarIntake.trim()) errors.push(t("onboarding.validation.sugarIntakeRequired"));
      if (!d.carbohydrateIntake.trim()) errors.push(t("onboarding.validation.carbohydrateIntakeRequired"));
      if (!d.processedFoodIntake.trim()) errors.push(t("onboarding.validation.processedFoodRequired"));
      if (!d.previousWeightLoss.trim()) errors.push(t("onboarding.validation.previousWeightLossRequired"));
      if (!d.weightLossDuration.trim()) errors.push(t("onboarding.validation.weightLossDurationRequired"));
      break;
    }

    case 4: {
      const d = data as MedicalHistory;
      if (!d.illnesses.trim()) errors.push(t("onboarding.validation.illnessesRequired"));
      if (!d.medications.trim()) errors.push(t("onboarding.validation.medicationsRequired"));
      if (d.conditions.length === 0) errors.push(t("onboarding.validation.conditionsRequired"));
      if (d.familyHistory.length === 0) errors.push(t("onboarding.validation.familyHistoryRequired"));
      break;
    }
  }

  return errors;
};
