import { api } from './api';
import type {
  CreateCheckoutSessionResponse,
  SubscriptionStatus,
  CreatePortalSessionResponse,
  Invoice,
  CancellationReason,
  CancellationFeedbackRequest
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
   * Cancel current subscription (cancels at period end)
   */
  static async cancelSubscription(reason: CancellationReason): Promise<{ currentPeriodEnd?: string }> {
    const response = await api.post('/api/payment/subscription/cancel', { reason });
    return {
      currentPeriodEnd: response.data?.subscription?.currentPeriodEnd,
    };
  }

  /**
   * Submit cancellation feedback (rating + comments)
   */
  static async submitCancellationFeedback(data: CancellationFeedbackRequest): Promise<void> {
    await api.post('/api/payment/subscription/feedback', data);
  }

  /**
   * Change subscription plan (lifestyle <-> medical)
   * Returns a Stripe Checkout URL for the new plan
   */
  static async changePlan(planType: 'lifestyle' | 'medical'): Promise<{ checkoutUrl?: string; message?: string }> {
    const response = await api.post('/api/payment/subscription/change-plan', { planType });
    return response.data;
  }

  /**
   * Create Stripe customer portal session
   */
  static async createPortalSession(): Promise<CreatePortalSessionResponse> {
    const response = await api.post('/api/payment/create-portal-session');
    return response.data;
  }

  /**
   * Get invoice history for the current patient
   */
  static async getInvoiceHistory(): Promise<Invoice[]> {
    const response = await api.get('/api/payment/invoices');
    return response.data.invoices;
  }

  /**
   * Get plan details
   */
  static getPlanDetails(planType: 'lifestyle' | 'medical') {
    if (planType === 'lifestyle') {
      return {
        name: 'Medical Program Membership',
        price: 495,
        originalPrice: 695,
        currency: 'SEK',
        interval: 'month',
        description: 'Your all-in-one access to our medical team, coaching, and support.',
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
        name: 'Lifestyle Program Membership',
        price: 895,
        originalPrice: 1095,
        currency: 'SEK',
        interval: 'month',
        description: 'Your access to expert coaching and support for a healthier lifestyle.',
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
   * Create Stripe checkout session for hypnotherapist one-time purchase
   */
  static async createHypnotherapistCheckout(): Promise<CreateCheckoutSessionResponse> {
    const response = await api.post('/api/payment/hypnotherapist-checkout');
    return response.data;
  }

  /**
   * Format price for display
   */
  static formatPrice(price: number, currency: string = 'SEK'): string {
    return `${price} ${currency}`;
  }
}