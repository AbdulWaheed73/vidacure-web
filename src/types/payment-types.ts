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

// Stripe-related types for admin dashboard
export type StripeSubscription = {
  id: string;
  status: 'incomplete' | 'incomplete_expired' | 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid';
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
  canceled_at: number | null;
  trial_start: number | null;
  trial_end: number | null;
  default_payment_method?: StripePaymentMethod | string | null;
  latest_invoice?: any;
  customer?: any;
};

export type StripePaymentMethod = {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  billing_details?: {
    email?: string;
    name?: string;
  };
};

export type StripeInvoice = {
  id: string;
  amount_due: number;
  amount_paid: number;
  currency: string;
  period_start: number;
  period_end: number;
  status: string;
};

export type PatientStripeData = {
  subscription: StripeSubscription;
  paymentMethod: StripePaymentMethod | null;
  upcomingInvoice: StripeInvoice | null;
};

export type PatientSubscriptionDetailsResponse = {
  patient: any;
  stripeData: {
    subscription: StripeSubscription;
    defaultPaymentMethod: StripePaymentMethod | null;
    upcomingInvoice: StripeInvoice | null;
    allPaymentMethods: StripePaymentMethod[];
  } | null;
  message?: string;
};