import { api } from './api';
import { config } from '../constants';

export type AdminUser = {
  userId: string;
  role: 'admin' | 'superadmin';
  isAdmin: true;
};

/**
 * Admin Authentication Service
 * Handles admin-specific authentication flow
 * Completely separate from regular user authentication
 */
export const adminAuthService = {
  /**
   * Initiate admin login with BankID
   * Redirects to BankID authentication
   */
  initiateAdminLogin: () => {
    // Redirect to admin login endpoint
    const serverUrl = config.getServerUrl();
    console.log("serverUrl: ", serverUrl);
    window.location.href = `${serverUrl}/api/admin/auth/login`;
  },

  /**
   * Get current admin user
   * Uses admin_token cookie automatically
   */
  getCurrentAdmin: async (): Promise<AdminUser> => {
    const response = await api.get('/api/admin/auth/me');
    return response.data;
  },

  /**
   * Admin logout
   * Clears admin_token cookie
   */
  logout: async (): Promise<void> => {
    await api.post('/admin/auth/logout');
    // Clear any local storage
    localStorage.removeItem('admin-auth-storage');
  },

  /**
   * Check if admin is authenticated
   * Returns true if admin_token cookie is valid
   */
  checkAuth: async (): Promise<boolean> => {
    try {
      await adminAuthService.getCurrentAdmin();
      return true;
    } catch (error) {
      return false;
    }
  },
};
