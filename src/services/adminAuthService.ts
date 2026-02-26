import { api } from './api';
import type {
  AdminLoginResponse,
  Admin2FASetupResponse,
  Admin2FAVerifyResponse,
} from '../types/admin-types';

export type AdminUser = {
  userId: string;
  role: 'admin' | 'superadmin';
  isAdmin: true;
};

export const adminAuthService = {
  login: async (email: string, password: string): Promise<AdminLoginResponse> => {
    const response = await api.post('/api/admin/auth/login', { email, password });
    return response.data;
  },

  verify2FA: async (
    pendingToken: string,
    code: string,
    isBackupCode?: boolean
  ): Promise<Admin2FAVerifyResponse> => {
    const response = await api.post('/api/admin/auth/verify-2fa', {
      pendingToken,
      code,
      isBackupCode,
    });
    return response.data;
  },

  setup2FA: async (pendingToken: string): Promise<Admin2FASetupResponse> => {
    const response = await api.post('/api/admin/auth/setup-2fa', { pendingToken });
    return response.data;
  },

  confirm2FA: async (
    pendingToken: string,
    code: string,
    secret: string,
    backupCodes: string[]
  ): Promise<Admin2FAVerifyResponse> => {
    const response = await api.post('/api/admin/auth/confirm-2fa', {
      pendingToken,
      code,
      secret,
      backupCodes,
    });
    return response.data;
  },

  getCurrentAdmin: async (): Promise<AdminUser> => {
    const response = await api.get('/api/admin/auth/me');
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/api/admin/auth/logout');
    localStorage.removeItem('admin-auth-storage');
  },
};
