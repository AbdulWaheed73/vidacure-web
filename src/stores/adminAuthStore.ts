import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { adminAuthService } from '../services/adminAuthService';
import type { AdminUser } from '../services/adminAuthService';

type AdminAuthStore = {
  // State
  isAdminAuthenticated: boolean;
  adminUser: AdminUser | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  checkAdminAuth: () => Promise<void>;
  loginAdmin: () => void;
  logoutAdmin: () => Promise<void>;
  clearError: () => void;
};

// Guard to prevent multiple simultaneous auth checks
let isCheckingAdminAuth = false;

export const useAdminAuthStore = create<AdminAuthStore>()(
  persist(
    (set) => ({
      // State
      isAdminAuthenticated: false,
      adminUser: null,
      isLoading: false,
      error: null,

      // Actions
      checkAdminAuth: async () => {
        // Prevent multiple simultaneous auth checks
        if (isCheckingAdminAuth) {
          console.log('Admin auth check already in progress, skipping...');
          return;
        }

        isCheckingAdminAuth = true;
        set({ isLoading: true, error: null });

        try {
          const adminUser = await adminAuthService.getCurrentAdmin();

          console.log('Admin auth check successful:', adminUser);

          set({
            isAdminAuthenticated: true,
            adminUser,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          console.log('Admin auth check failed:', error);

          set({
            isAdminAuthenticated: false,
            adminUser: null,
            isLoading: false,
            error: error.response?.data?.message || 'Admin authentication failed',
          });
        } finally {
          isCheckingAdminAuth = false;
        }
      },

      loginAdmin: () => {
        // Initiate admin login - redirects to BankID
        adminAuthService.initiateAdminLogin();
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
          });

          console.log('Admin logged out successfully');

          // Redirect to admin login page
          window.location.href = '/admin/login';
        } catch (error: any) {
          console.error('Admin logout error:', error);

          set({
            isLoading: false,
            error: error.response?.data?.message || 'Logout failed',
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'admin-auth-storage',
      partialize: (state) => ({
        // Only persist authentication status, not loading/error states
        isAdminAuthenticated: state.isAdminAuthenticated,
        adminUser: state.adminUser,
      }),
    }
  )
);
