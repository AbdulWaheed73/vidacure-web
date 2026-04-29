import { z } from 'zod';

const heightCmSchema = z.number().finite().min(100).max(250);
const weightKgSchema = z.number().finite().min(30).max(400);

export const BMI_DEBOUNCE_MS = 700;

export type BmiTier = 'notEligible' | 'conditional' | 'eligible';
export type BmiCategory = 'underweight' | 'normal' | 'overweight' | 'obese';

export type BmiResult = {
  value: number;
  display: string;
  tier: BmiTier;
  category: BmiCategory;
};

export const calculateBMI = (heightCm: number, weightKg: number): number | null => {
  const h = heightCmSchema.safeParse(heightCm);
  const w = weightKgSchema.safeParse(weightKg);
  if (!h.success || !w.success) return null;
  const heightM = h.data / 100;
  return w.data / (heightM * heightM);
};

export const getBmiTier = (bmi: number): BmiTier => {
  if (bmi >= 30) return 'eligible';
  if (bmi >= 27) return 'conditional';
  return 'notEligible';
};

export const getBmiCategory = (bmi: number): BmiCategory => {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obese';
};

export const formatBMI = (bmi: number): string => bmi.toFixed(1);

export const buildBmiResult = (heightCm: number, weightKg: number): BmiResult | null => {
  const bmi = calculateBMI(heightCm, weightKg);
  if (bmi === null) return null;
  return {
    value: bmi,
    display: formatBMI(bmi),
    tier: getBmiTier(bmi),
    category: getBmiCategory(bmi),
  };
};