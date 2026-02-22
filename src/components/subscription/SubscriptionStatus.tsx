import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import { Badge } from '../ui/badge';
import { PaymentService } from '../../services';
import type { SubscriptionStatus } from '../../types/payment-types';

type SubscriptionStatusProps = {
  onStatusChange?: () => void;
}

export const SubscriptionStatusComponent: React.FC<SubscriptionStatusProps> = ({
  onStatusChange
}) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      const subscriptionStatus = await PaymentService.getSubscriptionStatus();
      setStatus(subscriptionStatus);
    } catch (error) {
      console.error('Error fetching subscription status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? This action cannot be undone.')) {
      return;
    }

    setIsActionLoading(true);
    try {
      await PaymentService.cancelSubscription();
      await fetchSubscriptionStatus();
      onStatusChange?.();
      alert('Subscription canceled successfully.');
    } catch (error) {
      console.error('Error canceling subscription:', error);
      alert('Failed to cancel subscription. Please try again.');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setIsActionLoading(true);
    try {
      const { url } = await PaymentService.createPortalSession();
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error opening customer portal:', error);
      alert('Failed to open billing management. Please try again.');
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#f0f7f4] rounded-2xl p-5">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/5"></div>
        </div>
      </div>
    );
  }

  if (!status || !status.hasSubscription) {
    return null;
  }

  const getStatusBadge = (subscriptionStatus: string) => {
    switch (subscriptionStatus) {
      case 'active':
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100 font-manrope">{t('account.billing.active')}</Badge>;
      case 'canceled':
        return <Badge variant="destructive" className="font-manrope">{t('account.billing.canceled')}</Badge>;
      case 'past_due':
        return <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100 font-manrope">{t('account.billing.pastDue')}</Badge>;
      default:
        return <Badge variant="secondary" className="font-manrope">{subscriptionStatus}</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('sv-SE');
  };

  return (
    <div className="bg-[#f0f7f4] rounded-2xl p-5">
      <div className="space-y-3 mb-5">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 font-manrope">{t('account.billing.planLabel')}</span>
          <span className="font-semibold text-gray-800 font-manrope">
            {status.planType === 'lifestyle' ? t('account.billing.lifestyle') : t('account.billing.medical')}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 font-manrope">{t('account.billing.statusLabel')}</span>
          {getStatusBadge(status.subscriptionStatus || '')}
        </div>

        {status.subscription && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 font-manrope">{t('account.billing.period')}</span>
              <span className="text-sm text-gray-700 font-manrope">
                {formatDate(status.subscription.currentPeriodStart)} - {formatDate(status.subscription.currentPeriodEnd)}
              </span>
            </div>

            {status.subscription.cancelAtPeriodEnd && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-2">
                <p className="text-amber-800 text-sm font-manrope">
                  {t('account.billing.cancelNotice', { date: formatDate(status.subscription.currentPeriodEnd) })}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          onClick={handleManageBilling}
          disabled={isActionLoading}
          variant="outline"
          size="sm"
          className="font-manrope bg-white"
        >
          {isActionLoading ? t('account.billing.loading') : t('account.billing.manageBilling')}
        </Button>

        {status.subscriptionStatus === 'active' && !status.subscription?.cancelAtPeriodEnd && (
          <Button
            onClick={handleCancelSubscription}
            disabled={isActionLoading}
            variant="outline"
            size="sm"
            className="font-manrope text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
          >
            {isActionLoading ? t('account.billing.loading') : t('account.billing.cancelSubscription')}
          </Button>
        )}
      </div>
    </div>
  );
};
