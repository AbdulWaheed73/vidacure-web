export type ProviderType = "physician" | "hypnotherapist" | string;

export type ProviderTier = "free" | "premium";

export type ProviderTierOverride = {
  providerId: string;
  tier: ProviderTier;
  setBy?: string;
  setAt?: string;
};

export type Provider = {
  _id: string;
  name: string;
  email: string;
  providerType: ProviderType;
  specialty?: string;
  bio?: string;
  isActive: boolean;
  patientCount?: number;
  createdAt: string;
  updatedAt: string;
};

export type ProviderMeeting = {
  _id?: string;
  providerId: string;
  providerName: string;
  providerType: string;
  eventUri: string;
  inviteeUri?: string;
  scheduledTime: string;
  endTime?: string;
  status: "scheduled" | "completed" | "canceled";
  completedAt?: string;
  eventType: string;
  meetingUrl?: string;
  createdAt: string;
};
