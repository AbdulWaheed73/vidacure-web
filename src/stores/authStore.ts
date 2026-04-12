import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api, updateCsrfToken } from '../services/api';
import { useConsentStore } from './consentStore';
import type { AuthStore } from '../types';


// Guard to prevent multiple simultaneous auth checks
let isCheckingAuth = false;

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
        // Disconnect chat socket to stop reconnection attempts
        import('../stores/chatStore').then(({ useChatStore }) => {
          useChatStore.getState().disconnect();
        });

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