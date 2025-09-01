import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { PaymentService, type SubscriptionStatus } from '../../services';

interface SubscriptionStatusProps {
  onStatusChange?: () => void;
}

export const SubscriptionStatusComponent: React.FC<SubscriptionStatusProps> = ({
  onStatusChange
}) => {
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
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!status || !status.hasSubscription) {
    return null;
  }

  const getStatusColor = (subscriptionStatus: string) => {
    switch (subscriptionStatus) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'canceled':
        return 'text-red-600 bg-red-100';
      case 'past_due':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('sv-SE');
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Subscription</h3>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Plan:</span>
          <span className="font-medium">
            {status.planType === 'lifestyle' ? 'Lifestyle Program' : 'Medical Program'}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Status:</span>
          <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(status.subscriptionStatus || '')}`}>
            {status.subscriptionStatus}
          </span>
        </div>

        {status.subscription && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Current period:</span>
              <span className="text-sm">
                {formatDate(status.subscription.currentPeriodStart)} - {formatDate(status.subscription.currentPeriodEnd)}
              </span>
            </div>

            {status.subscription.cancelAtPeriodEnd && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-yellow-800 text-sm">
                  ⚠️ Your subscription will end on {formatDate(status.subscription.currentPeriodEnd)}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleManageBilling}
          disabled={isActionLoading}
          variant="outline"
          className="flex-1"
        >
          {isActionLoading ? 'Loading...' : 'Manage Billing'}
        </Button>

        {status.subscriptionStatus === 'active' && !status.subscription?.cancelAtPeriodEnd && (
          <Button
            onClick={handleCancelSubscription}
            disabled={isActionLoading}
            variant="destructive"
            className="flex-1"
          >
            {isActionLoading ? 'Loading...' : 'Cancel Subscription'}
          </Button>
        )}
      </div>
    </div>
  );
};