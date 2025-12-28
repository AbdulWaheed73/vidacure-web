import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { PaymentService } from '@/services';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

type SubscriptionRequiredProps = {
  children: React.ReactNode;
  featureName?: string;
};

export const SubscriptionRequired: React.FC<SubscriptionRequiredProps> = ({
  children,
  featureName = 'this feature',
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const status = await PaymentService.getSubscriptionStatus();
        setHasActiveSubscription(
          status.hasSubscription && status.subscriptionStatus === 'active'
        );
      } catch (error) {
        console.error('Error checking subscription status:', error);
        setHasActiveSubscription(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSubscription();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (hasActiveSubscription) {
    return <>{children}</>;
  }

  return (
    <div className="relative h-full min-h-[400px]">
      {/* Blurred content */}
      <div className="blur-sm pointer-events-none select-none">
        {children}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-[#F0F7F4]/80 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4 text-center">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-teal-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3 font-sora">
            Subscription Required
          </h2>

          <p className="text-gray-600 mb-6 font-manrope">
            Subscribe to a plan to unlock {featureName} and connect with your healthcare provider.
          </p>

          <Button
            onClick={() => navigate(ROUTES.SUBSCRIBE)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-full font-semibold"
          >
            Subscribe Now
          </Button>
        </div>
      </div>
    </div>
  );
};
