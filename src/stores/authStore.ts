import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../services/api';
import type { AuthStore } from '../types';


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
        set({ isLoading: true, error: null });
        try {
          const response = await api.get('/api/me');
          const data = response.data;
          console.log("data: ", data);
          
          if (data.authenticated) {
            localStorage.setItem("csrfToken", data.csrfToken);
            set({
              isAuthenticated: true,
              user: data.user,
              csrfToken: data.csrfToken,
              isLoading: false,
            });
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
        }
      },

      setAuthData: (response) => {
        if (response.authenticated && response.user) {
          set({
            isAuthenticated: true,
            user: response.user,
            csrfToken: response.csrfToken || null,
            error: null,
          });
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
    }
  )
);