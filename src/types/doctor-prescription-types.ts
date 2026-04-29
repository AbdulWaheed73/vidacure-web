import { PrescriptionRequestStatus } from './prescription-types';
import type { PrescriptionRequestStatusType } from './prescription-types';

export type DoctorPrescriptionRequest = {
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
  patient: {
    id: string;
    name: string;
  };
};

export type PrescriptionRequestDetailModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: DoctorPrescriptionRequest | null;
  onApprove: (requestId: string, prescriptionData: {
    medicationName: string;
    dosage: string;
    usageInstructions?: string;
    dateIssued: string;
  }) => Promise<void>;
};


export { PrescriptionRequestStatus };

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
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
};

export type UpdatePrescriptionStatusData = {
  status: string;
  medicationName?: string;
  dosage?: string;
  usageInstructions?: string;
  dateIssued?: string;
  validTill?: string;
};