import axios from 'axios';
import { config } from '../constants';

// Use a separate axios instance for pre-login requests (no auth needed)
const publicApi = axios.create({
  baseURL: config.getServerUrl(),
  timeout: 10000,
});

export type CreatePendingSessionRequest = {
  height: number;
  weight: number;
  bmi: number;
};

export type CreatePendingSessionResponse = {
  success: boolean;
  token: string;
  expiresAt: string;
};

export type LinkBookingRequest = {
  token: string;
};

export type LinkBookingResponse = {
  success: boolean;
  message: string;
  scheduledMeetingTime?: string;
};

// Storage keys
const PENDING_TOKEN_KEY = 'vidacure_pending_token';
const PENDING_BMI_KEY = 'vidacure_pending_bmi';

export const pendingSessionService = {
  // Create a new pending session (before login)
  async createPendingSession(data: CreatePendingSessionRequest): Promise<CreatePendingSessionResponse> {
    const response = await publicApi.post<CreatePendingSessionResponse>('/api/pending-booking/session', data);
    return response.data;
  },

  // Store token in localStorage
  storeToken(token: string): void {
    localStorage.setItem(PENDING_TOKEN_KEY, token);
  },

  // Get token from localStorage
  getStoredToken(): string | null {
    return localStorage.getItem(PENDING_TOKEN_KEY);
  },

  // Clear stored token
  clearStoredToken(): void {
    localStorage.removeItem(PENDING_TOKEN_KEY);
    localStorage.removeItem(PENDING_BMI_KEY);
  },

  // Store BMI data locally (backup)
  storeBmiData(data: CreatePendingSessionRequest): void {
    localStorage.setItem(PENDING_BMI_KEY, JSON.stringify(data));
  },

  // Get stored BMI data
  getStoredBmiData(): CreatePendingSessionRequest | null {
    const data = localStorage.getItem(PENDING_BMI_KEY);
    return data ? JSON.parse(data) : null;
  },

  // Link pending booking to authenticated user (after login)
  async linkBookingToUser(token: string, csrfToken: string): Promise<LinkBookingResponse> {
    const response = await axios.post<LinkBookingResponse>(
      `${config.getServerUrl()}/api/pending-booking/link`,
      { token },
      {
        headers: {
          'x-csrf-token': csrfToken,
        },
        withCredentials: true,
      }
    );
    return response.data;
  },
};
