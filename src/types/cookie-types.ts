export type CookieConsent = {
  essential: boolean; // always true
  functional: boolean; // Calendly, etc.
};

export type CookieConsentState = {
  consent: CookieConsent | null;
  hasInteracted: boolean;
  showBanner: boolean;
  showPreferences: boolean;
};

export type CookieConsentActions = {
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (consent: CookieConsent) => void;
  openPreferences: () => void;
  closePreferences: () => void;
  closeBanner: () => void;
  resetConsent: () => void;
};

export type CookieConsentStore = CookieConsentState & CookieConsentActions;
