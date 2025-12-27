import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CookieConsentStore, CookieConsent } from '@/types/cookie-types';

export const useCookieConsentStore = create<CookieConsentStore>()(
  persist(
    (set) => ({
      // State
      consent: null,
      hasInteracted: false,
      showBanner: true,
      showPreferences: false,

      // Actions
      acceptAll: () => {
        set({
          consent: { essential: true, functional: true },
          hasInteracted: true,
          showBanner: false,
          showPreferences: false,
        });
      },

      rejectAll: () => {
        set({
          consent: { essential: true, functional: false },
          hasInteracted: true,
          showBanner: false,
          showPreferences: false,
        });
      },

      savePreferences: (consent: CookieConsent) => {
        set({
          consent: { ...consent, essential: true }, // Essential always true
          hasInteracted: true,
          showBanner: false,
          showPreferences: false,
        });
      },

      openPreferences: () => {
        set({ showPreferences: true });
      },

      closePreferences: () => {
        set({ showPreferences: false });
      },

      closeBanner: () => {
        set({ showBanner: false });
      },

      resetConsent: () => {
        set({
          consent: null,
          hasInteracted: false,
          showBanner: true,
          showPreferences: false,
        });
      },
    }),
    {
      name: 'cookie-consent-storage',
      partialize: (state) => ({
        consent: state.consent,
        hasInteracted: state.hasInteracted,
      }),
    }
  )
);
