import { api, updateCsrfToken } from './api';
import { config } from '../constants';
import type { User } from '../types';

export class AuthService {
  /**
   * Check current authentication status
   */
  static async checkAuthStatus() {
    const response = await api.get('/api/me');
    return response.data;
  }

  /**
   * Initiate login process - redirects to server login endpoint
   */
  static initiateLogin() {
    window.location.href = `${config.getServerUrl()}/api/login`;
  }

  /**
   * Logout user
   */
  static async logout() {
    await api.post('/api/logout');
  }

  /**
   * Store user data and CSRF token in localStorage
   */
  static storeUserData(user: User, csrfToken?: string) {
    localStorage.setItem('user', JSON.stringify(user));
    if (csrfToken) {
      localStorage.setItem('csrfToken', csrfToken);
      // Update API headers with new token
      updateCsrfToken(csrfToken);
    }
  }

  /**
   * Clear stored user data
   */
  static clearUserData() {
    localStorage.removeItem('user');
    localStorage.removeItem('csrfToken');
    // Clear API headers
    updateCsrfToken('');
  }

  /**
   * Get stored user data
   */
  static getStoredUser(): User | null {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  }

  /**
   * Get stored CSRF token
   */
  static getStoredCsrfToken(): string | null {
    return localStorage.getItem('csrfToken');
  }
}
