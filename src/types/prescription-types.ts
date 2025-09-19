export type PrescriptionRequest = {
  _id: string;
  status: 'pending' | 'approved' | 'denied' | 'under_review';
  currentWeight: number;
  hasSideEffects: boolean;
  sideEffectsDescription?: string;
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