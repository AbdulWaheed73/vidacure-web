import { z } from 'zod';

// Swedish SSN validation (12 digits)
export const ssnSchema = z.string()
  .length(12, 'SSN must be exactly 12 digits')
  .regex(/^\d{12}$/, 'SSN must contain only numbers');

// Email validation
export const emailSchema = z.string()
  .min(1, 'Email is required')
  .email('Invalid email format');

// Name validation
export const nameSchema = z.string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be less than 100 characters');

// Add Doctor form schema
export const addDoctorFormSchema = z.object({
  ssn: ssnSchema,
  email: emailSchema,
});

export type AddDoctorFormValues = z.infer<typeof addDoctorFormSchema>;

// SSN Check Response types
export type SSNCheckResponse = {
  exists: boolean;
  type?: 'doctor' | 'patient';
  patientId?: string;
  patientName?: string;
  doctorName?: string;
};

export type ConvertPatientToDoctorRequest = {
  patientId: string;
  email: string;
};
