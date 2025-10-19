export const PrescriptionRequestStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  DENIED: "denied",
  UNDER_REVIEW: "under_review"
} as const;

export type PrescriptionRequestStatusType = typeof PrescriptionRequestStatus[keyof typeof PrescriptionRequestStatus];

export type PrescriptionRequest = {
  _id: string;
  status: PrescriptionRequestStatusType;
  currentWeight: number;
  hasSideEffects: boolean;
  sideEffectsDescription?: string;
  medicationName?: string;
  dosage?: string;
  usageInstructions?: string;
  dateIssued?: string;
  validTill?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreatePrescriptionRequestData = {
  currentWeight: number;
  hasSideEffects: boolean;
  sideEffectsDescription?: string;
};

export type PrescriptionRequestResponse = {
  message: string;
  request: PrescriptionRequest;
};

export type PrescriptionRequestsResponse = {
  prescriptionRequests: PrescriptionRequest[];
};