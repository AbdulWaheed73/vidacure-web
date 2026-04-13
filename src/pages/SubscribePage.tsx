import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';
import { SubscriptionCard } from '@/components/subscription/SubscriptionCard';
import { MeetingRequired } from '@/components/subscription/MeetingRequired';
import { HypnotherapistCard } from '@/components/subscription/HypnotherapistCard';

export const SubscribePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <MeetingRequired>
      <div className="px-4 py-6 sm:px-6 sm:py-8 md:p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Sparkles className="size-6 sm:size-8 text-teal-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-sora">
              {t('subscribe.title', 'Choose Your Plan')}
            </h1>
          </div>
          <p className="text-base sm:text-lg text-gray-600 font-manrope max-w-2xl mx-auto">
            {t(
              'subscribe.description',
              'Select a subscription plan to unlock all features and get access to your personal healthcare team.'
            )}
          </p>
        </div>

        {/* Plan Cards */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center items-stretch">
          <SubscriptionCard planType="lifestyle" />
          <SubscriptionCard planType="medical" />
        </div>

        {/* Hypnotherapist Program */}
        <div className="mt-8 sm:mt-10">
          <HypnotherapistCard mode="checkout" layout="horizontal" />
        </div>

        {/* Additional Info */}
        <div className="mt-8 sm:mt-12 text-center">
          <p className="text-sm text-gray-500 font-manrope">
            {t(
              'subscribe.cancelAnytime',
              'Cancel anytime. No long-term commitments.'
            )}
          </p>
        </div>
      </div>
    </MeetingRequired>
  );
};

export default SubscribePage;
