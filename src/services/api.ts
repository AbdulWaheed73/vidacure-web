import axios from 'axios';
import { toast } from 'sonner';
import { config } from '../constants';
import { getClientType } from '../utils';
import { navigateTo } from '../lib/navigation';
import i18n from '../i18n';

const clientType = getClientType();

const csrfHeader = localStorage.getItem("csrfToken");
// console.log("csrf: ", csrfHeader);

export const api = axios.create({
  baseURL: config.getServerUrl(),
  headers: {
    'x-client': clientType,
    'x-csrf-token': csrfHeader,
  },
  withCredentials: true,
  timeout: 10000, // 10 second timeout
});

// Auth cleanup function
const clearAuthData = () => {
  // Clear localStorage
  localStorage.removeItem('csrfToken');
  localStorage.removeItem('auth-storage'); // Zustand persisted auth data
  
  // Clear session storage
  sessionStorage.clear();
  
  // Clear axios headers
  delete api.defaults.headers['x-csrf-token'];
  
  // Note: httpOnly cookies are automatically cleared by the browser when server responds with 401
};

// Response interceptor for 401 handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.log('🔐 Session expired - clearing auth data and redirecting to login');

      // Clear all auth data
      clearAuthData();

      // Import auth store dynamically to avoid circular dependency
      import('../stores/authStore').then(({ useAuthStore }) => {
        // Clear Zustand auth state
        useAuthStore.getState().logout();
      });

      // Redirect to login page (only if not already there or on admin routes)
      const isAdminRoute = window.location.pathname.startsWith('/admin');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/' && !isAdminRoute) {
        window.location.href = '/login';
      }
    }

    // 451 — Consent required. Show a clear message and redirect to /consent.
    if (error.response?.status === 451) {
      // Only show the toast once (avoid spamming from multiple parallel 451 responses)
      if (window.location.pathname !== '/consent') {
        toast.error(i18n.t('consent.errors.toastMessage'), {
          id: 'consent-required',
          duration: 6000,
          action: {
            label: i18n.t('consent.errors.toastAction'),
            onClick: () => { navigateTo('/consent'); },
          },
        });
      }
    }

    return Promise.reject(error);
  }
);

// Update CSRF token in headers
export const updateCsrfToken = (token: string) => {
  api.defaults.headers['x-csrf-token'] = token;
};
