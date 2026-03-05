export type PromotionCoupon = {
  id: string;
  name: string | null;
  percentOff: number | null;
  amountOff: number | null;
  currency: string | null;
  duration: 'once' | 'repeating' | 'forever';
  durationInMonths: number | null;
  valid: boolean;
};

export type PromotionAppliesTo = 'all' | 'subscriptions' | 'lab_tests';

export type Promotion = {
  id: string;
  code: string;
  active: boolean;
  coupon: PromotionCoupon;
  maxRedemptions: number | null;
  timesRedeemed: number;
  expiresAt: string | null;
  created: string;
  appliesTo: PromotionAppliesTo;
};

export type PromotionsListResponse = {
  promotions: Promotion[];
  hasMore: boolean;
};

export type CreatePromotionRequest = {
  code: string;
  name: string;
  discountType: 'percent' | 'fixed';
  percentOff?: number;
  amountOff?: number;
  duration: 'once' | 'repeating' | 'forever';
  durationInMonths?: number;
  maxRedemptions?: number;
  expiresAt?: string;
  appliesTo: PromotionAppliesTo;
};

export type CreatePromotionResponse = {
  message: string;
  promotion: Promotion;
};

export type DeactivatePromotionResponse = {
  message: string;
  promotion: {
    id: string;
    code: string;
    active: boolean;
  };
};
