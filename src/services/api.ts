import axios from 'axios';
import { config } from '../constants';
import { getClientType } from '../utils';

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
      
      // Redirect to login page (only if not already there)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Update CSRF token in headers
export const updateCsrfToken = (token: string) => {
  api.defaults.headers['x-csrf-token'] = token;
};
