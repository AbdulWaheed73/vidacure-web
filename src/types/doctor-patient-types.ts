export type SubscriptionStatus =
  | 'incomplete'
  | 'incomplete_expired'
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'unpaid';

export type SubscriptionPlan = 'lifestyle' | 'medical';

export type DoctorPatientListItem = {
  id: string;
  name: string;
  givenName: string | null;
  familyName: string | null;
  email: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  height: number | null;
  bmi: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  subscriptionStatus: SubscriptionStatus | null;
  subscriptionPlan: SubscriptionPlan | null;
};

export type DoctorPatientListResponse = {
  patients: DoctorPatientListItem[];
};

export type WeightHistoryEntry = {
  weight: number;
  date: string | null;
  sideEffects: string | null;
  notes: string | null;
};

export type PrescriptionRequestEntry = {
  id?: string;
  status: string;
  currentWeight: number;
  hasSideEffects: boolean;
  sideEffectsDescription: string | null;
  medicationName: string | null;
  dosage: string | null;
  usageInstructions: string | null;
  dateIssued: string | null;
  validTill: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type PatientPrescription = {
  medicationDetails: string | null;
  validFrom: string | null;
  validTo: string | null;
  status: string | null;
  updatedAt: string | null;
};

export type DoctorPatientProfile = {
  id: string;
  name: string;
  givenName: string | null;
  familyName: string | null;
  email: string | null;
  phone: string | null;
  ssn: string;
  dateOfBirth: string | null;
  gender: string | null;
  height: number | null;
  bmi: number | null;
  weightHistory: WeightHistoryEntry[];
  prescription: PatientPrescription | null;
  prescriptionRequests: PrescriptionRequestEntry[];
};

export type DoctorPatientProfileResponse = {
  patientProfile: DoctorPatientProfile;
  limits: {
    weightHistory: number;
    prescriptionRequests: number;
  };
};

export type PatientQuestionnaireItem = {
  questionId: string;
  answer: string;
};

export type PatientQuestionnaireResponse = {
  questionnaire: PatientQuestionnaireItem[];
};
