export type CreateCheckoutSessionRequest = {
  planType: 'lifestyle' | 'medical';
};

export type CreateCheckoutSessionResponse = {
  sessionId: string;
  url: string;
  customerId: string;
};

export type SubscriptionStatus = {
  hasSubscription: boolean;
  subscriptionStatus: string | null;
  planType: 'lifestyle' | 'medical' | null;
  subscription: {
    id: string;
    status: string;
    planType: string;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
  } | null;
};

export type CreatePortalSessionResponse = {
  url: string;
};