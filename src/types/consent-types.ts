export type ConsentStatusResponse = {
  hasAcceptedLatest: boolean;
  currentVersion: string;
  userConsentVersion?: string;
  acceptedAt?: string;
};

export type ConsentRecord = {
  consentType: string;
  version: string;
  accepted: boolean;
  timestamp: string;
  withdrawnAt?: string;
};
