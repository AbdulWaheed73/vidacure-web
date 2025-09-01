import { api } from './api';

export interface CreateCheckoutSessionRequest {
  planType: 'lifestyle' | 'medical';
}

export interface CreateCheckoutSessionResponse {
  sessionId: string;
  url: string;
  customerId: string;
}

export interface SubscriptionStatus {
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
}

export interface CreatePortalSessionResponse {
  url: string;
}

export class PaymentService {
  /**
   * Create Stripe checkout session for subscription
   */
  static async createCheckoutSession(planType: 'lifestyle' | 'medical'): Promise<CreateCheckoutSessionResponse> {
    const response = await api.post('/api/payment/create-checkout-session', { planType });
    return response.data;
  }

  /**
   * Get current subscription status
   */
  static async getSubscriptionStatus(): Promise<SubscriptionStatus> {
    const response = await api.get('/api/payment/subscription/status');
    return response.data;
  }

  /**
   * Cancel current subscription
   */
  static async cancelSubscription(): Promise<void> {
    await api.post('/api/payment/subscription/cancel');
  }

  /**
   * Create Stripe customer portal session
   */
  static async createPortalSession(): Promise<CreatePortalSessionResponse> {
    const response = await api.post('/api/payment/create-portal-session');
    return response.data;
  }

  /**
   * Get plan details
   */
  static getPlanDetails(planType: 'lifestyle' | 'medical') {
    if (planType === 'lifestyle') {
      return {
        name: 'Lifestyle Program',
        price: 795,
        currency: 'SEK',
        interval: 'month',
        description: 'Expert coaching and support for a healthier lifestyle.',
        features: [
          'Personal health coaching',
          'Lifestyle tracking and analytics',
          'Community support',
          'Weekly progress reviews'
        ]
      };
    } else {
      return {
        name: 'Medical Program',
        price: 1495,
        currency: 'SEK',
        interval: 'month',
        description: 'All-in-one access to our medical team, coaching, and support.',
        features: [
          'All Lifestyle Program features',
          'Medical team access',
          'Prescription management',
          'Priority support',
          'Advanced health monitoring'
        ]
      };
    }
  }

  /**
   * Format price for display
   */
  static formatPrice(price: number, currency: string = 'SEK'): string {
    return `${price} ${currency}`;
  }
}