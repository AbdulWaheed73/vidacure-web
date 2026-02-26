import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { adminAuthService } from '../services/adminAuthService';
import type { AdminUser } from '../services/adminAuthService';

type LoginStep = 'credentials' | '2fa' | '2fa-setup' | '2fa-backup-codes';

type AdminAuthStore = {
  // State
  isAdminAuthenticated: boolean;
  adminUser: AdminUser | null;
  isLoading: boolean;
  error: string | null;

  // 2FA flow state
  loginStep: LoginStep;
  pendingToken: string | null;
  qrCodeUrl: string | null;
  totpSecret: string | null;
  backupCodes: string[] | null;

  // Actions
  loginAdmin: (email: string, password: string) => Promise<void>;
  verify2FA: (code: string, isBackupCode?: boolean) => Promise<void>;
  setup2FA: () => Promise<void>;
  confirm2FA: (code: string) => Promise<void>;
  completeSetup: () => void;
  checkAdminAuth: () => Promise<void>;
  logoutAdmin: () => Promise<void>;
  clearError: () => void;
  resetLoginFlow: () => void;
};

// Guard to prevent multiple simultaneous auth checks
let isCheckingAdminAuth = false;

export const useAdminAuthStore = create<AdminAuthStore>()(
  persist(
    (set, get) => ({
      // State
      isAdminAuthenticated: false,
      adminUser: null,
      isLoading: false,
      error: null,

      // 2FA flow state
      loginStep: 'credentials' as LoginStep,
      pendingToken: null,
      qrCodeUrl: null,
      totpSecret: null,
      backupCodes: null,

      // Actions
      loginAdmin: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await adminAuthService.login(email, password);

          if (response.requires2FASetup) {
            set({
              loginStep: '2fa-setup',
              pendingToken: response.pendingToken,
              isLoading: false,
            });
          } else if (response.requires2FA) {
            set({
              loginStep: '2fa',
              pendingToken: response.pendingToken,
              isLoading: false,
            });
          }
        } catch (error: any) {
          const message =
            error.response?.data?.error ||
            error.response?.data?.message ||
            'Login failed';
          const retryAfter = error.response?.data?.retryAfter;

          set({
            isLoading: false,
            error: retryAfter
              ? `${message} Try again in ${Math.ceil(retryAfter / 60)} minute(s).`
              : message,
          });
        }
      },

      verify2FA: async (code: string, isBackupCode?: boolean) => {
        const { pendingToken } = get();
        if (!pendingToken) {
          set({ error: 'Session expired. Please log in again.' });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await adminAuthService.verify2FA(
            pendingToken,
            code,
            isBackupCode
          );

          set({
            isAdminAuthenticated: true,
            adminUser: response.user,
            isLoading: false,
            loginStep: 'credentials',
            pendingToken: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error:
              error.response?.data?.error || 'Invalid verification code',
          });
        }
      },

      setup2FA: async () => {
        const { pendingToken } = get();
        if (!pendingToken) {
          set({ error: 'Session expired. Please log in again.' });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await adminAuthService.setup2FA(pendingToken);

          set({
            qrCodeUrl: response.qrCodeUrl,
            totpSecret: response.secret,
            backupCodes: response.backupCodes,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.error || '2FA setup failed',
          });
        }
      },

      confirm2FA: async (code: string) => {
        const { pendingToken, totpSecret, backupCodes } = get();
        if (!pendingToken || !totpSecret || !backupCodes) {
          set({ error: 'Session expired. Please log in again.' });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await adminAuthService.confirm2FA(
            pendingToken,
            code,
            totpSecret,
            backupCodes
          );

          set({
            isAdminAuthenticated: true,
            adminUser: response.user,
            isLoading: false,
            loginStep: '2fa-backup-codes',
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error:
              error.response?.data?.error ||
              'Invalid code. Please scan the QR code and try again.',
          });
        }
      },

      completeSetup: () => {
        set({
          loginStep: 'credentials',
          pendingToken: null,
          qrCodeUrl: null,
          totpSecret: null,
          backupCodes: null,
        });
      },

      checkAdminAuth: async () => {
        if (isCheckingAdminAuth) return;

        isCheckingAdminAuth = true;
        set({ isLoading: true, error: null });

        try {
          const adminUser = await adminAuthService.getCurrentAdmin();

          set({
            isAdminAuthenticated: true,
            adminUser,
            isLoading: false,
            error: null,
          });
        } catch {
          set({
            isAdminAuthenticated: false,
            adminUser: null,
            isLoading: false,
          });
        } finally {
          isCheckingAdminAuth = false;
        }
      },

      logoutAdmin: async () => {
        set({ isLoading: true });

        try {
          await adminAuthService.logout();

          set({
            isAdminAuthenticated: false,
            adminUser: null,
            isLoading: false,
            error: null,
            loginStep: 'credentials',
            pendingToken: null,
            qrCodeUrl: null,
            totpSecret: null,
            backupCodes: null,
          });

          window.location.href = '/admin/login';
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Logout failed',
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      resetLoginFlow: () => {
        set({
          loginStep: 'credentials',
          pendingToken: null,
          qrCodeUrl: null,
          totpSecret: null,
          backupCodes: null,
          error: null,
          isLoading: false,
        });
      },
    }),
    {
      name: 'admin-auth-storage',
      partialize: (state) => ({
        isAdminAuthenticated: state.isAdminAuthenticated,
        adminUser: state.adminUser,
      }),
    }
  )
);
