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

export type ConsentType = 'privacy_policy' | 'treatment_consent' | 'data_sharing' | 'lab_test_consent' | 'communication_consent';

export type ConsentStatus = {
  hasAcceptedLatest: boolean;
  currentVersion: string;
  userConsentVersion?: string;
  acceptedAt?: string;
};

export type AllConsentsStatus = {
  consents: Record<ConsentType, ConsentStatus>;
};

export type AccessLogEntry = {
  accessedBy: {
    role: string;
    userId: string;
  };
  action: string;
  operation: string;
  timestamp: string;
  ipAddress?: string;
};
