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

// Event types schema for Calendly integration
export const eventTypesSchema = z.object({
  free: z.string().optional(),
  standard: z.string().optional(),
  premium: z.string().optional(),
});

// Add Doctor form schema
export const addDoctorFormSchema = z.object({
  ssn: ssnSchema,
  email: emailSchema,
  eventTypes: eventTypesSchema.optional(),
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

// Admin Notification Types
export type NotificationType = 'calendly_deletion' | 'general';
export type NotificationPriority = 'high' | 'medium' | 'low';

export type AdminNotification = {
  _id: string;
  type: NotificationType;
  priority: NotificationPriority;
  read: boolean;
  message: string;
  actionRequired: string;
  metadata: {
    userEmail?: string;
    userName?: string;
    calendlyUserUri?: string;
    deletionLogId?: string;
    [key: string]: unknown;
  };
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
};

export type NotificationCountResponse = {
  total: number;
  unreadCount: number;
  highPriorityUnread: number;
};

export type NotificationsResponse = {
  notifications: AdminNotification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    unreadCount: number;
  };
};

// User Deletion Types
export type DeletionStatus = 'in_progress' | 'completed' | 'partial_failure' | 'failed';

export type DeletionResult = {
  success: boolean;
  error?: string;
  channelIds?: string[];
  notificationCreated?: boolean;
  email?: string;
};

export type DeletionResults = {
  stripe: DeletionResult;
  stream: DeletionResult;
  calendly: DeletionResult;
  mongodb: DeletionResult;
};

export type DeletionLog = {
  _id: string;
  deletionId: string;
  userId: string;
  userType: 'patient' | 'doctor';
  userEmail: string;
  userName: string;
  requestedBy: string;
  requestedAt: string;
  completedAt?: string;
  status: DeletionStatus;
  deletionResults: DeletionResults;
  metadata: {
    stripeCustomerId?: string;
    patientCount?: number;
    calendlyUserUri?: string;
    reassignedDoctorId?: string;
  };
  confirmationId: string;
};

export type DeletionLogsResponse = {
  deletions: DeletionLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
};

export type DeleteUserRequest = {
  userType: 'patient' | 'doctor';
  reassignDoctorId?: string;
};

export type DeleteUserResponse = {
  success: boolean;
  message: string;
  deletionId: string;
  confirmationId: string;
  results: DeletionResults;
};

// Audit Log Types
export type AuditLog = {
  _id: string;
  userId: string;
  role: string;
  action: string;
  operation: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
  success: boolean;
  targetId?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
  integrityHash?: string;
};

export type AuditLogsResponse = {
  logs: AuditLog[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
};

export type AuditAnomaliesResponse = {
  period: {
    from: string;
    to: string;
  };
  anomalies: {
    highVolumeAccessors: {
      userId: string;
      uniqueTargetCount: number;
      totalAccess: number;
    }[];
    failedAccessClusters: {
      _id: { userId: string; action: string };
      count: number;
      latestAttempt: string;
    }[];
    afterHoursAccess: {
      _id: string;
      afterHoursCount: number;
    }[];
  };
};

// Admin Login/2FA Response Types
export type AdminLoginResponse = {
  requires2FA?: boolean;
  requires2FASetup?: boolean;
  pendingToken: string;
};

export type Admin2FASetupResponse = {
  qrCodeUrl: string;
  secret: string;
  backupCodes: string[];
};

export type Admin2FAVerifyResponse = {
  success: boolean;
  user: {
    userId: string;
    role: "admin" | "superadmin";
    isAdmin: true;
  };
};
