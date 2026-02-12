import { create } from 'zustand';
import { getStatus, recordConsent } from '../services/consentService';

type ConsentState = {
  hasAcceptedLatest: boolean;
  currentVersion: string;
  isChecking: boolean;
  showConsentModal: boolean;
  checkConsentStatus: () => Promise<void>;
  acceptConsent: () => Promise<void>;
  dismissModal: () => void;
};

export const useConsentStore = create<ConsentState>((set, get) => ({
  hasAcceptedLatest: true,
  currentVersion: '',
  isChecking: false,
  showConsentModal: false,

  checkConsentStatus: async () => {
    set({ isChecking: true });
    try {
      const status = await getStatus();
      set({
        hasAcceptedLatest: status.hasAcceptedLatest,
        currentVersion: status.currentVersion,
        showConsentModal: !status.hasAcceptedLatest,
      });
    } catch (error) {
      console.error('Failed to check consent status:', error);
    } finally {
      set({ isChecking: false });
    }
  },

  acceptConsent: async () => {
    const { currentVersion } = get();
    try {
      await recordConsent(currentVersion, true);
      set({
        hasAcceptedLatest: true,
        showConsentModal: false,
      });
    } catch (error) {
      console.error('Failed to record consent:', error);
      throw error;
    }
  },

  dismissModal: () => {
    set({ showConsentModal: false });
  },
}));
