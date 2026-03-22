import { api } from './api';
import type { PatientStripeData, PatientSubscriptionDetailsResponse } from '../types/payment-types';
import type { Provider, ProviderTier } from '../types/provider-types';
import type {
  SSNCheckResponse,
  ConvertPatientToDoctorRequest,
  AddDoctorFormValues,
  NotificationCountResponse,
  NotificationsResponse,
  AdminNotification,
  DeleteUserResponse,
  DeletionLogsResponse,
  DeletionLog,
  AuditLogsResponse,
  AuditAnomaliesResponse,
} from '../types/admin-types';
import type {
  CreatePromotionRequest,
  CreatePromotionResponse,
  PromotionsListResponse,
  DeactivatePromotionResponse,
} from '../types/promotion-types';

export type DashboardStats = {
  totalPatients: number;
  totalDoctors: number;
  unassignedPatients: number;
  activeSubscriptions: number;
  totalProviders: number;
};

export type SubscriptionInfo = {
  status: string;
  planType: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
};

export type Patient = {
  _id: string;
  name: string;
  email: string;
  doctor?: {
    _id: string;
    name: string;
    email: string;
  };
  subscription?: SubscriptionInfo;
  stripeData?: PatientStripeData;
  lastLogin: string;
  createdAt: string;
  // Calendly meeting data - grouped in nested object
  calendly?: {
    meetingStatus?: 'none' | 'scheduled' | 'completed';
    scheduledMeetingTime?: string;
    completedAt?: string;
    eventUri?: string;
    inviteeUri?: string;
    // History of all meetings
    meetings?: {
      eventUri: string;
      inviteeUri?: string;
      scheduledTime: string;
      status: 'scheduled' | 'completed' | 'canceled';
      completedAt?: string;
      source: 'pre-login' | 'post-login';
      createdAt: string;
    }[];
  };
};

export type Doctor = {
  _id: string;
  name: string;
  email: string;
  lastLogin: string;
  createdAt: string;
  patientCount: number;
  channelCount: number;
  patients: Patient[];
};

export type PaginatedPatientsResponse = {
  patients: Patient[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
};

export type DoctorsResponse = {
  doctors: Doctor[];
};

export type ReassignDoctorResponse = {
  message: string;
  patient: Patient;
  newDoctor: Doctor;
  oldDoctor: Doctor | null;
};

export const adminService = {
  /**
   * Get dashboard statistics
   */
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/api/admin/dashboard');
    return response.data;
  },

  /**
   * Get all patients with pagination
   * @param includeStripeData - If true, fetches real-time data from Stripe API
   */
  getAllPatients: async (
    page: number = 1,
    limit: number = 20,
    includeStripeData: boolean = false
  ): Promise<PaginatedPatientsResponse> => {
    const response = await api.get('/api/admin/patients', {
      params: { page, limit, includeStripeData }
    });
    return response.data;
  },

  /**
   * Get all doctors with patient details
   */
  getAllDoctors: async (): Promise<DoctorsResponse> => {
    const response = await api.get('/api/admin/doctors');
    return response.data;
  },

  /**
   * Reassign patient to a new doctor
   */
  reassignDoctor: async (patientId: string, newDoctorId: string): Promise<ReassignDoctorResponse> => {
    const response = await api.post('/api/admin/reassign-doctor', {
      patientId,
      newDoctorId
    });
    return response.data;
  },

  /**
   * Get unassigned patients
   */
  getUnassignedPatients: async (): Promise<{ patients: Patient[]; count: number }> => {
    const response = await api.get('/api/admin/unassigned-patients');
    return response.data;
  },

  /**
   * Get detailed subscription information for a specific patient
   */
  getPatientSubscriptionDetails: async (patientId: string): Promise<PatientSubscriptionDetailsResponse> => {
    const response = await api.get(`/api/admin/patients/${patientId}/subscription-details`);
    return response.data;
  },

  /**
   * Check if SSN exists in Doctor or Patient collections
   */
  checkSSN: async (ssn: string): Promise<SSNCheckResponse> => {
    const response = await api.post('/api/admin/check-ssn', { ssn });
    return response.data;
  },

  /**
   * Convert a patient to a doctor
   */
  convertPatientToDoctor: async (data: ConvertPatientToDoctorRequest): Promise<{ message: string; doctor: Doctor }> => {
    const response = await api.post('/api/admin/convert-patient-to-doctor', data);
    return response.data;
  },

  /**
   * Add a new doctor
   */
  addDoctor: async (data: AddDoctorFormValues): Promise<{ message: string; doctor: Doctor }> => {
    const response = await api.post('/api/admin/add-doctor', data);
    return response.data;
  },

  // ============ Notification Methods ============

  /**
   * Get notification counts for badges
   */
  getNotificationCount: async (): Promise<NotificationCountResponse> => {
    const response = await api.get('/api/admin/notifications/count');
    return response.data;
  },

  /**
   * Get notifications with pagination and filtering
   */
  getNotifications: async (
    page: number = 1,
    limit: number = 20,
    type?: string,
    read?: boolean
  ): Promise<NotificationsResponse> => {
    const response = await api.get('/api/admin/notifications', {
      params: { page, limit, type, read }
    });
    return response.data;
  },

  /**
   * Mark a notification as resolved
   */
  resolveNotification: async (notificationId: string): Promise<AdminNotification> => {
    const response = await api.put(`/api/admin/notifications/${notificationId}/resolve`);
    return response.data;
  },

  // ============ User Deletion Methods ============

  /**
   * Delete a user (admin action)
   */
  deleteUser: async (
    userId: string,
    userType: 'patient' | 'doctor',
    reassignDoctorId?: string
  ): Promise<DeleteUserResponse> => {
    const response = await api.delete(`/api/users/admin/${userId}`, {
      data: { userType, reassignDoctorId }
    });
    return response.data;
  },

  /**
   * Get deletion logs with pagination
   */
  getDeletionLogs: async (
    page: number = 1,
    limit: number = 20,
    status?: string
  ): Promise<DeletionLogsResponse> => {
    const response = await api.get('/api/users/admin/deletions', {
      params: { page, limit, status }
    });
    return response.data;
  },

  /**
   * Get a specific deletion log detail
   */
  getDeletionDetail: async (deletionId: string): Promise<DeletionLog> => {
    const response = await api.get(`/api/users/admin/deletions/${deletionId}`);
    return response.data;
  },

  // ============ Meeting Approval Methods ============

  /**
   * Approve a patient's meeting (mark as complete) - Admin only
   * This allows the patient to subscribe without requiring an actual meeting
   * Sends completedAt from frontend to use admin's local timezone
   * Uses force=true to override meeting end time validation (admin already confirmed via dialog)
   */
  approveMeeting: async (patientId: string): Promise<{
    success: boolean;
    message: string;
    meetingStatus: string;
    completedAt: string;
  }> => {
    const response = await api.post(`/api/calendly/mark-complete/${patientId}`, {
      completedAt: new Date().toISOString(),
      force: true  // Admin override - they already confirmed via dialog
    });
    return response.data;
  },

  // ============ Provider Management Methods ============

  getProviders: async (): Promise<{ providers: Provider[] }> => {
    const response = await api.get('/api/admin/providers');
    return response.data;
  },

  addProvider: async (data: {
    name: string;
    email: string;
    providerType: string;
    specialty?: string;
    bio?: string;
  }): Promise<{ message: string; provider: Provider }> => {
    const response = await api.post('/api/admin/providers', data);
    return response.data;
  },

  updateProvider: async (providerId: string, data: Partial<Provider>): Promise<{ provider: Provider }> => {
    const response = await api.put(`/api/admin/providers/${providerId}`, data);
    return response.data;
  },

  deactivateProvider: async (providerId: string): Promise<{ message: string; provider: Provider }> => {
    const response = await api.delete(`/api/admin/providers/${providerId}`);
    return response.data;
  },

  // ============ Provider Tier Methods ============

  setProviderTierOverride: async (
    patientId: string,
    providerId: string,
    tier: ProviderTier
  ): Promise<{ message: string; patientId: string; providerId: string; tier: ProviderTier }> => {
    const response = await api.post('/api/admin/provider-tier-override', { patientId, providerId, tier });
    return response.data;
  },

  removeProviderTierOverride: async (
    patientId: string,
    providerId: string
  ): Promise<{ message: string }> => {
    const response = await api.post('/api/admin/remove-provider-tier-override', { patientId, providerId });
    return response.data;
  },

  getPatientProviderTiers: async (patientId: string): Promise<{
    patientId: string;
    patientName: string;
    patientPlanType: string | null;
    providers: {
      _id: string;
      name: string;
      email: string;
      providerType: string;
      specialty?: string;
      tier: ProviderTier;
      source: 'override' | 'default';
    }[];
  }> => {
    const response = await api.get(`/api/admin/patients/${patientId}/provider-tiers`);
    return response.data;
  },

  // ============ Audit Log Methods ============

  /**
   * Get audit logs with filters and pagination
   */
  getAuditLogs: async (params: {
    page?: number;
    limit?: number;
    userId?: string;
    targetId?: string;
    action?: string;
    role?: string;
    success?: string;
    dateFrom?: string;
    dateTo?: string;
  } = {}): Promise<AuditLogsResponse> => {
    const response = await api.get('/api/admin/audit-logs', { params });
    return response.data;
  },

  /**
   * Get anomaly detection summary (last 7 days)
   */
  getAuditAnomalies: async (): Promise<AuditAnomaliesResponse> => {
    const response = await api.get('/api/admin/audit-logs/anomalies');
    return response.data;
  },

  // ============ Promotion / Coupon Management ============

  createPromotion: async (data: CreatePromotionRequest): Promise<CreatePromotionResponse> => {
    const response = await api.post('/api/admin/promotions', data);
    return response.data;
  },

  listPromotions: async (params?: {
    active?: boolean;
    startingAfter?: string;
    limit?: number;
  }): Promise<PromotionsListResponse> => {
    const response = await api.get('/api/admin/promotions', { params });
    return response.data;
  },

  deactivatePromotion: async (promoCodeId: string): Promise<DeactivatePromotionResponse> => {
    const response = await api.post(`/api/admin/promotions/${promoCodeId}/deactivate`);
    return response.data;
  },

  getSubscriptionProducts: async (): Promise<{
    products: Array<{
      planType: string;
      priceId: string;
      productId: string;
      productName: string;
      unitAmount: number | null;
      currency: string;
    }>;
    labTestPackages: Array<{
      name: string;
      unitAmount: number;
      currency: string;
    }>;
  }> => {
    const response = await api.get('/api/admin/subscription-products');
    return response.data;
  },

  // ============ Calendly Lookup ============

  calendlyLookup: async (email: string): Promise<{
    found: boolean;
    user: {
      name: string;
      email: string;
      avatarUrl?: string;
      schedulingUrl: string;
      timezone: string;
      uri: string;
    };
    eventTypes: {
      uri: string;
      name: string;
      slug?: string;
      duration?: number;
      schedulingUrl: string;
      active: boolean;
    }[];
  }> => {
    const response = await api.post('/api/admin/calendly-lookup', { email });
    return response.data;
  },
};
