import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api, updateCsrfToken } from '../services/api';
import { pendingSessionService } from '../services/pendingSessionService';
import { useConsentStore } from './consentStore';
import type { AuthStore } from '../types';


// Guard to prevent multiple simultaneous auth checks
let isCheckingAuth = false;

// Helper function to link pending booking after auth
const linkPendingBooking = async (csrfToken: string) => {
  const token = pendingSessionService.getStoredToken();
  if (!token) return;

  try {
    console.log("🔗 Attempting to link pending booking with token:", token);
    const response = await pendingSessionService.linkBookingToUser(token, csrfToken);

    if (response.success) {
      console.log("✅ Successfully linked booking to user");
      // Clear the stored token after successful link
      pendingSessionService.clearStoredToken();
      // Also clear any client-side Calendly booking data
      localStorage.removeItem("vidacure_pending_calendly_booking");
    } else {
      console.log("⚠️ Booking link response:", response.message);
    }
  } catch (error) {
    console.error("❌ Failed to link pending booking:", error);
    // Don't clear the token on error - user might retry
  }
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // State
      isAuthenticated: false,
      user: null,
      csrfToken: null,
      isLoading: false,
      error: null,

      // Actions
      checkAuthStatus: async () => {
        // Prevent multiple simultaneous auth checks
        if (isCheckingAuth) {
          console.log("Auth check already in progress, skipping...");
          return;
        }
        
        isCheckingAuth = true;
        set({ isLoading: true, error: null });
        try {
          const response = await api.get('/api/me');
          const data = response.data;
          console.log("Auth check response:", data);
          
          if (data.authenticated) {
            localStorage.setItem("csrfToken", data.csrfToken);
            updateCsrfToken(data.csrfToken); // Update axios headers
            set({
              isAuthenticated: true,
              user: data.user,
              csrfToken: data.csrfToken,
              isLoading: false,
            });

            // Set consent status from /api/me response (avoids separate API call)
            if (data.consentStatus) {
              useConsentStore.getState().setConsentFromAuth(data.consentStatus);
            }

            // After successful auth, try to link any pending booking
            // Only for patients (not doctors)
            if (data.user?.role === 'patient') {
              linkPendingBooking(data.csrfToken);
            }
          } else {
            set({
              isAuthenticated: false,
              user: null,
              csrfToken: null,
              isLoading: false,
            });
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Auth check failed', 
            isLoading: false,
            isAuthenticated: false,
            user: null,
            csrfToken: null,
          });
        } finally {
          isCheckingAuth = false; // Reset guard
        }
      },

      setAuthData: (response) => {
        if (response.authenticated && response.user) {
          if (response.csrfToken) {
            localStorage.setItem("csrfToken", response.csrfToken);
            updateCsrfToken(response.csrfToken); // Update axios headers
          }
          set({
            isAuthenticated: true,
            user: response.user,
            csrfToken: response.csrfToken || null,
            error: null,
          });

          // Set consent status if included in response
          if (response.consentStatus) {
            useConsentStore.getState().setConsentFromAuth(response.consentStatus);
          }
        } else {
          set({
            isAuthenticated: false,
            user: null,
            csrfToken: null,
          });
        }
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          csrfToken: null,
          error: null,
        });
      },
      
      clearError: () => set({ error: null }),
      
      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        csrfToken: state.csrfToken,
      }),
      onRehydrateStorage: () => (state) => {
        // Update axios headers when store is rehydrated from localStorage
        if (state?.csrfToken) {
          updateCsrfToken(state.csrfToken);
        }
      },
    }
  )
);