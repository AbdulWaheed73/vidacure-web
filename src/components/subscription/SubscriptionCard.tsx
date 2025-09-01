import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { PaymentService } from '../../services';

interface SubscriptionCardProps {
  planType: 'lifestyle' | 'medical';
  onSubscribeClick?: (planType: 'lifestyle' | 'medical') => void;
  disabled?: boolean;
  isCurrentPlan?: boolean;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  planType,
  onSubscribeClick,
  disabled = false,
  isCurrentPlan = false
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const planDetails = PaymentService.getPlanDetails(planType);

  const handleSubscribe = async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    try {
      if (onSubscribeClick) {
        onSubscribeClick(planType);
      } else {
        const { url } = await PaymentService.createCheckoutSession(planType);
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isLifestyle = planType === 'lifestyle';
  const cardBgClass = isLifestyle ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200';
  const headerBgClass = isLifestyle ? 'bg-green-100' : 'bg-blue-100';
  const buttonVariant = isLifestyle ? 'default' : 'default';
  const accentColor = isLifestyle ? 'text-green-600' : 'text-blue-600';
  const buttonBgClass = isLifestyle ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700';

  return (
    <div className={`rounded-xl border-2 ${cardBgClass} p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 ${isCurrentPlan ? 'ring-2 ring-yellow-400' : ''} relative`}>
      {isCurrentPlan && (
        <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
          Current Plan
        </div>
      )}
      
      <div className={`${headerBgClass} -mx-6 -mt-6 mb-4 p-4 rounded-t-xl`}>
        <h3 className={`text-xl font-bold ${accentColor}`}>
          {planDetails.name}
        </h3>
        <div className="flex items-baseline mt-2">
          <span className={`text-3xl font-bold ${accentColor}`}>
            {PaymentService.formatPrice(planDetails.price, planDetails.currency)}
          </span>
          <span className="text-gray-600 ml-2">/{planDetails.interval}</span>
        </div>
      </div>

      <p className="text-gray-700 mb-4">{planDetails.description}</p>

      <ul className="space-y-2 mb-6">
        {planDetails.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <span className={`${accentColor} mr-2 mt-0.5`}>✓</span>
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        onClick={handleSubscribe}
        disabled={disabled || isLoading || isCurrentPlan}
        className={`w-full ${buttonBgClass} text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200`}
        size="lg"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
            Processing...
          </div>
        ) : isCurrentPlan ? (
          'Current Plan'
        ) : (
          `Subscribe to ${planDetails.name}`
        )}
      </Button>
    </div>
  );
};