export const PrescriptionRequestStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  DENIED: "denied",
  UNDER_REVIEW: "under_review"
} as const;

export type PrescriptionRequestStatusType = typeof PrescriptionRequestStatus[keyof typeof PrescriptionRequestStatus];

// A medication the patient reports currently taking (self-reported at request time).
export type CurrentMedication = {
  name: string;
  dosage?: string;
};

export type PrescriptionRequest = {
  _id: string;
  status: PrescriptionRequestStatusType;
  currentWeight: number;
  hasSideEffects: boolean;
  sideEffectsDescription?: string;
  currentMedications?: CurrentMedication[];
  prescribedMedications?: CurrentMedication[];
  medicationName?: string;
  dosage?: string;
  usageInstructions?: string;
  dateIssued?: string;
  validTill?: string;
  rejectionNote?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreatePrescriptionRequestData = {
  currentWeight: number;
  hasSideEffects: boolean;
  sideEffectsDescription?: string;
  currentMedications?: CurrentMedication[];
};

export type PrescriptionRequestResponse = {
  message: string;
  request: PrescriptionRequest;
};

export type PrescriptionRequestsResponse = {
  prescriptionRequests: PrescriptionRequest[];
};