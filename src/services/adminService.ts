import { api } from './api';
import type { PatientStripeData, PatientSubscriptionDetailsResponse } from '../types/payment-types';
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
} from '../types/admin-types';

export type DashboardStats = {
  totalPatients: number;
  totalDoctors: number;
  unassignedPatients: number;
  activeSubscriptions: number;
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
  }
};
