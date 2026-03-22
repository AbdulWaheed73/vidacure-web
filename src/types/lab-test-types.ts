// ============================================================================
// Lab Test Order Status
// ============================================================================

export const LAB_TEST_ORDER_STATUS = {
  DRAFT: "draft",
  CREATED: "created",
  SENDING: "sending",
  SENT: "sent",
  SENT_FAILED: "sent-failed",
  ACCEPTED: "accepted",
  RECEIVED: "received",
  SAMPLE_RECEIVED: "sample-received",
  PARTIAL_REPORT: "partial-report",
  FINAL_REPORT: "final-report",
  UPDATED_FINAL_REPORT: "updated-final-report",
  SIGNED: "signed",
  COMPLETED_UPDATED: "completed-updated",
  REVOKED: "revoked",
} as const;

export type LabTestOrderStatusType =
  (typeof LAB_TEST_ORDER_STATUS)[keyof typeof LAB_TEST_ORDER_STATUS];

// ============================================================================
// Lab Test Package
// ============================================================================

export type LabTestAnalysis = {
  code: string;
  name: string;
  nameSv: string;
};

export type LabTestPackage = {
  id: string;
  productCode: string;
  name: string;
  nameSv: string;
  description: string;
  descriptionSv: string;
  analyses: LabTestAnalysis[];
  priceAmountOre: number;
  priceCurrency: string;
};

// ============================================================================
// Lab Test Result
// ============================================================================

export type LabTestResult = {
  observationId: string;
  code: string;
  name: string;
  valueType: "quantity" | "string" | "codeableConcept" | "absent";
  valueQuantity?: {
    value: number;
    unit: string;
  };
  valueString?: string;
  referenceRange?: {
    low?: number;
    high?: number;
    text?: string;
  };
  isOutOfRange: boolean;
  interpretation?: string;
  effectiveDateTime?: string;
  note?: string;
};

// ============================================================================
// Lab Test Payment
// ============================================================================

export type LabTestPaymentStatus = "pending_payment" | "paid" | "payment_failed";

export type CreateLabTestCheckoutResponse = {
  success: boolean;
  sessionId: string;
  url: string;
  orderId: string;
};

// ============================================================================
// Lab Test Order
// ============================================================================

export type LabTestStatusHistoryEntry = {
  status: LabTestOrderStatusType;
  timestamp: string;
};

export type LabTestOrder = {
  _id: string;
  patient: string;
  giddirServiceRequestId?: string;
  externalTrackingId?: string;
  testPackage: {
    id: string;
    productCode: string;
    name: string;
    nameSv: string;
  };
  status: LabTestOrderStatusType;
  paymentStatus?: LabTestPaymentStatus;
  stripeCheckoutSessionId?: string;
  stripePaymentIntentId?: string;
  statusHistory: LabTestStatusHistoryEntry[];
  results: LabTestResult[];
  labComment?: string;
  orderedAt: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
};

// ============================================================================
// API Response Types
// ============================================================================

export type GetLabTestPackagesResponse = {
  success: boolean;
  packages: LabTestPackage[];
};

export type PlaceLabTestOrderResponse = {
  success: boolean;
  order: LabTestOrder;
  message: string;
};

export type GetLabTestOrdersResponse = {
  success: boolean;
  orders: LabTestOrder[];
};

export type GetLabTestOrderResponse = {
  success: boolean;
  order: LabTestOrder;
};

export type SyncLabTestOrdersResponse = {
  success: boolean;
  orders: LabTestOrder[];
  discovered: number;
  updated: number;
};
