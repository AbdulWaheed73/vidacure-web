import React, { useState } from 'react';
import { PaymentService } from '../../services';
import { ArrowRight, Check } from 'lucide-react';

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
  
  if (isLifestyle) {
    return (
      <div className="flex-1 self-stretch p-8 bg-white rounded-2xl shadow-[0px_2px_3px_0px_rgba(0,0,0,0.17)] shadow-[0px_0px_3px_0px_rgba(0,0,0,0.08)] inline-flex flex-col justify-start items-start gap-16 relative">
        {isCurrentPlan && (
          <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
            Current Plan
          </div>
        )}
        
        <div className="self-stretch flex-1 flex flex-col justify-start items-start gap-8">
          <div className="self-stretch pb-4 border-b border-zinc-400 flex flex-col justify-start items-start gap-2.5">
            <div className="px-3 py-1 rounded-full outline outline-1 outline-offset-[-1px] outline-zinc-400 flex flex-col justify-start items-start">
              <div className="justify-center text-zinc-800 text-sm font-semibold font-['Sora'] leading-tight">{planDetails.name}</div>
            </div>
          </div>
          
          <div className="self-stretch flex flex-col justify-start items-start gap-8">
            <div className="justify-center">
              <span className="text-zinc-800 text-5xl font-bold font-['Sora'] leading-[56.40px]">{planDetails.price} </span>
              <span className="text-zinc-800 text-2xl font-bold font-['Sora'] leading-loose">{planDetails.currency}/mo</span>
            </div>
            <div className="self-stretch justify-center text-zinc-800 text-xl font-bold font-['Sora'] leading-relaxed">{planDetails.description}</div>
          </div>
          
          <div className="self-stretch flex flex-col justify-start items-start gap-4">
            <div className="self-stretch justify-center text-zinc-800 text-base font-bold font-['Manrope'] leading-snug">Includes:</div>
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              {planDetails.features.map((feature, index) => (
                <div key={index} className="self-stretch inline-flex justify-start items-center gap-6">
                  <div className="size-6 relative overflow-hidden">
                    <Check className="size-5 absolute left-[2px] top-[2px] text-zinc-400" />
                  </div>
                  <div className="flex-1 justify-center text-zinc-800 text-base font-normal font-['Manrope'] leading-snug">{feature}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <button
          onClick={handleSubscribe}
          disabled={disabled || isLoading || isCurrentPlan}
          className="h-11 px-6 py-2.5 bg-emerald-50 rounded-full inline-flex justify-center items-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-100 transition-colors"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-zinc-800 border-t-transparent"></div>
              <div className="justify-center text-zinc-800 text-sm font-semibold font-['Sora'] leading-tight">Processing...</div>
            </>
          ) : isCurrentPlan ? (
            <div className="justify-center text-zinc-800 text-sm font-semibold font-['Sora'] leading-tight">Current Plan</div>
          ) : (
            <>
              <div className="justify-center text-zinc-800 text-sm font-semibold font-['Sora'] leading-tight">Get Started</div>
              <ArrowRight className="size-4 text-zinc-800" />
            </>
          )}
        </button>
      </div>
    );
  } else {
    return (
      <div className="w-[474.50px] p-8 rounded-2xl shadow-[0px_2px_3px_0px_rgba(0,0,0,0.17)] inline-flex flex-col justify-start items-start gap-16 relative" style={{ backgroundColor: '#005044' }}>
        {isCurrentPlan && (
          <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
            Current Plan
          </div>
        )}
        
        <div className="self-stretch flex flex-col justify-start items-start gap-8">
          <div className="self-stretch pb-4 border-b border-stone-50 flex flex-col justify-start items-start gap-2.5">
            <div className="px-3 py-1 bg-gradient-to-r from-teal-600 to-teal-600 rounded-full flex flex-col justify-start items-start">
              <div className="justify-center text-emerald-50 text-sm font-semibold font-['Sora'] leading-tight">{planDetails.name}</div>
            </div>
          </div>
          
          <div className="self-stretch flex flex-col justify-start items-start gap-8">
            <div className="justify-center">
              <span className="text-white text-5xl font-bold font-['Sora'] leading-[56.40px]">{planDetails.price} </span>
              <span className="text-white text-2xl font-bold font-['Sora'] leading-loose">{planDetails.currency}/mo</span>
            </div>
            <div className="self-stretch justify-center text-white text-xl font-bold font-['Sora'] leading-relaxed">{planDetails.description}</div>
          </div>
          
          <div className="self-stretch flex flex-col justify-start items-start gap-4">
            <div className="self-stretch justify-center text-emerald-50 text-base font-bold font-['Manrope'] leading-snug">Includes:</div>
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              {planDetails.features.map((feature, index) => (
                <div key={index} className="self-stretch inline-flex justify-start items-center gap-6">
                  <div className="size-6 relative overflow-hidden">
                    <Check className="size-5 absolute left-[2px] top-[2px] text-emerald-50" />
                  </div>
                  <div className="flex-1 justify-center text-emerald-50 text-base font-normal font-['Manrope'] leading-snug">{feature}</div>
                </div>
              ))}
            </div>
          </div>
          
          <button
            onClick={handleSubscribe}
            disabled={disabled || isLoading || isCurrentPlan}
            className="h-11 px-6 py-2.5 bg-gradient-to-r from-teal-600 to-teal-600 rounded-full inline-flex justify-center items-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed hover:from-teal-700 hover:to-teal-700 transition-colors"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <div className="justify-center text-white text-sm font-semibold font-['Sora'] leading-tight">Processing...</div>
              </>
            ) : isCurrentPlan ? (
              <div className="justify-center text-white text-sm font-semibold font-['Sora'] leading-tight">Current Plan</div>
            ) : (
              <>
                <div className="justify-center text-white text-sm font-semibold font-['Sora'] leading-tight">Get Started</div>
                <ArrowRight className="size-4 text-white" />
              </>
            )}
          </button>
        </div>
      </div>
    );
  }
};