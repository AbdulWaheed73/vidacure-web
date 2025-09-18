import { api } from './api';
import type {
  CreateCheckoutSessionResponse,
  SubscriptionStatus,
  CreatePortalSessionResponse
} from '../types/payment-types';

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
        name: 'Lifestyle Program Membership',
        price: 795,
        currency: 'SEK',
        interval: 'month',
        description: 'Your access to expert coaching and support for a healthier lifestyle.',
        features: [
          'Initial Health Assessment',
          'Personalized Lifestyle Plan',
          'Regular Medical Check-ins',
          'Unlimited Care Team Messaging',
          'Ongoing Progress Tracking',
          'Nutrition & Habit Coaching'
        ]
      };
    } else {
      return {
        name: 'Medical Program Membership',
        price: 1495,
        currency: 'SEK',
        interval: 'month',
        description: 'Your all-in-one access to our medical team, coaching, and support.',
        features: [
          ' Initial Doctor Consultation',
          'Personalized Treatment Plan',
          'Regular Medical Check-ins',
          'GLP-1 Medication Prescription',
          'Unlimited Care Team Messaging',
          'Ongoing Progress Tracking',
          'Nutrition & Habit Coaching',
          'Discreet Delivery Management'
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