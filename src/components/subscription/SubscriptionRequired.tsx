import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock } from 'lucide-react';
import { PaymentService } from '@/services';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants';
import { Skeleton } from '@/components/ui/skeleton';
import { GateOverlay } from './GateOverlay';

type SubscriptionRequiredProps = {
  children: React.ReactNode;
  featureName?: string;
};

export const SubscriptionRequired: React.FC<SubscriptionRequiredProps> = ({
  children,
  featureName = 'this feature',
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const subStatus = await PaymentService.getSubscriptionStatus();
        setHasActiveSubscription(subStatus.hasSubscription);
      } catch (error) {
        console.error('Error checking status:', error);
        setHasActiveSubscription(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex flex-col p-4 bg-[#F0F7F4]">
        <div className="flex-1 min-h-0 bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="border-t border-border" />
          <div className="flex-1 px-6 py-4 space-y-5">
            <div className="flex flex-col items-start"><Skeleton className="h-11 w-[40%] rounded-2xl" /></div>
            <div className="flex flex-col items-end"><Skeleton className="h-11 w-[30%] rounded-2xl" /></div>
            <div className="flex flex-col items-start"><Skeleton className="h-16 w-[50%] rounded-2xl" /></div>
            <div className="flex flex-col items-end"><Skeleton className="h-11 w-[35%] rounded-2xl" /></div>
            <div className="flex flex-col items-start"><Skeleton className="h-11 w-[25%] rounded-2xl" /></div>
          </div>
          <div className="px-6 py-4">
            <Skeleton className="h-12 w-full rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (hasActiveSubscription) {
    return <>{children}</>;
  }

  return (
    <GateOverlay blurredContent={children}>
      <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Lock className="w-8 h-8 text-teal-600" />
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-3 font-sora">
        {t('gate.subscriptionRequired')}
      </h2>

      <p className="text-gray-600 mb-6 font-manrope">
        {t('gate.subscriptionRequiredMessage', { featureName })}
      </p>

      <Button
        onClick={() => navigate(ROUTES.SUBSCRIBE)}
        className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-full font-semibold"
      >
        {t('gate.subscribeNow')}
      </Button>

      {localStorage.getItem('vidacure_hypno_intent') && (
        <button
          onClick={() => navigate(ROUTES.SUBSCRIBE_HYPNOTHERAPIST)}
          className="mt-3 text-sm text-teal-600 hover:text-teal-700 font-medium font-manrope underline underline-offset-2"
        >
          {t('gate.hypnotherapyCTA')}
        </button>
      )}
    </GateOverlay>
  );
};