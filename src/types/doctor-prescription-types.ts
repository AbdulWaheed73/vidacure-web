export type DoctorPrescriptionRequest = {
  _id: string;
  status: 'pending' | 'approved' | 'denied' | 'under_review';
  currentWeight: number;
  hasSideEffects: boolean;
  sideEffectsDescription?: string;
  createdAt: string;
  updatedAt: string;
  patient: {
    id: string;
    name: string;
  };
};

export type DoctorPrescriptionStats = {
  totalCount: number;
  pendingCount: number;
  approvedCount: number;
  deniedCount: number;
  underReviewCount: number;
};

export type DoctorPrescriptionResponse = {
  success: boolean;
  data: {
    prescriptionRequests: DoctorPrescriptionRequest[];
    totalCount: number;
    pendingCount: number;
    approvedCount: number;
    deniedCount: number;
    underReviewCount: number;
  };
};