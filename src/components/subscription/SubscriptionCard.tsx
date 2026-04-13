import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PaymentService } from '../../services';
import { ArrowRight, Check, Copy } from 'lucide-react';
import { toast } from 'sonner';

type SubscriptionCardProps = {
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
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const promoCode = 'PLAN200';
  const promoDiscount = '200 SEK';

  const isLifestyle = planType === 'lifestyle';
  const prefix = isLifestyle ? 'lifestyle' : 'medical';

  const badge = t(`pricing.${prefix}Badge`);
  const price = t(`pricing.${prefix}Price`);
  const originalPrice = t(`pricing.${prefix}OriginalPrice`);
  const currency = t(`pricing.${prefix}Currency`);
  const description = t(`pricing.${prefix}Description`);

  const features = isLifestyle
    ? [
        t('pricing.features.initialAssessment'),
        t('pricing.features.personalizedPlan'),
        t('pricing.features.personalizedLifestylePlan'),
        t('pricing.features.medicalCheckins'),
        t('pricing.features.unlimitedMessaging'),
        t('pricing.features.progressTracking'),
        t('pricing.features.labTestingAndMiniCheck'),
      ]
    : [
        t('pricing.features.doctorConsultation'),
        t('pricing.features.nutritionCoaching'),
        t('pricing.features.treatmentPlan'),
        t('pricing.features.medicalCheckins'),
        t('pricing.features.glp1Medication'),
        t('pricing.features.unlimitedMessaging'),
        t('pricing.features.progressTracking'),
        t('pricing.features.labTestingAndMiniCheck'),
      ];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(promoCode);
    toast.success(t('promo.codeCopied'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
    } catch (error: unknown) {
      console.error('Error creating checkout session:', error);
      const err = error as { response?: { data?: { error?: string; message?: string } } };
      const serverMessage = err?.response?.data?.message || err?.response?.data?.error;
      toast.error(serverMessage || t('subscribeCard.checkoutError', 'Failed to start checkout. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  const isPrimary = !isLifestyle;

  return (
    <div className={`flex-1 w-full md:w-auto self-stretch p-5 sm:p-8 rounded-2xl shadow-[0px_2px_3px_0px_rgba(0,0,0,0.17)] inline-flex flex-col justify-start items-start gap-8 sm:gap-16 relative ${
      isPrimary ? '' : 'bg-white shadow-[0px_0px_3px_0px_rgba(0,0,0,0.08)]'
    }`} style={isPrimary ? { backgroundColor: '#005044' } : undefined}>
      {isCurrentPlan && (
        <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
          {t('subscribeCard.currentPlan')}
        </div>
      )}

      <div className="self-stretch flex-1 flex flex-col justify-start items-start gap-6 sm:gap-8">
        {/* Badge */}
        <div className={`self-stretch pb-4 border-b flex flex-col justify-start items-start gap-2.5 ${
          isPrimary ? 'border-stone-50' : 'border-zinc-400'
        }`}>
          <div className={`px-3 py-1 rounded-full flex flex-col justify-start items-start ${
            isPrimary
              ? 'bg-gradient-to-r from-teal-600 to-teal-600'
              : 'outline outline-1 outline-offset-[-1px] outline-zinc-400'
          }`}>
            <div className={`justify-center text-sm font-semibold font-sora leading-tight ${
              isPrimary ? 'text-emerald-50' : 'text-zinc-800'
            }`}>{badge}</div>
          </div>
        </div>

        {/* Pricing */}
        <div className="self-stretch flex flex-col justify-start items-start gap-4 sm:gap-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className={`text-xl font-semibold font-sora line-through decoration-2 decoration-red-400/70 ${
                isPrimary ? 'text-white/40' : 'text-zinc-400'
              }`}>
                {originalPrice} {currency}
              </span>
              <span className={`text-xs font-bold font-manrope px-2 py-1 rounded-full ${
                isPrimary ? 'bg-emerald-400 text-teal-900' : 'bg-teal-100 text-teal-700'
              }`}>
                -200 SEK
              </span>
            </div>
            <div className="justify-center">
              <span className={`text-4xl sm:text-5xl font-bold font-sora leading-tight sm:leading-[56.40px] ${
                isPrimary ? 'text-white' : 'text-zinc-800'
              }`}>{price} </span>
              <span className={`text-xl sm:text-2xl font-bold font-sora leading-loose ${
                isPrimary ? 'text-white' : 'text-zinc-800'
              }`}>{currency}</span>
            </div>
          </div>
          <div className={`self-stretch justify-center text-lg sm:text-xl font-bold font-sora leading-relaxed ${
            isPrimary ? 'text-white' : 'text-zinc-800'
          }`}>{description}</div>
        </div>

        {/* Features */}
        <div className="self-stretch flex flex-col justify-start items-start gap-3 sm:gap-4">
          <div className={`self-stretch justify-center text-base font-bold font-manrope leading-snug ${
            isPrimary ? 'text-emerald-50' : 'text-zinc-800'
          }`}>{t('pricing.includes')}</div>
          <div className="self-stretch flex flex-col justify-start items-start gap-3 sm:gap-4">
            {features.map((feature, index) => (
              <div key={index} className="self-stretch inline-flex justify-start items-center gap-3 sm:gap-6">
                <div className="size-6 relative overflow-hidden shrink-0">
                  <Check className={`size-5 absolute left-[2px] top-[2px] ${
                    isPrimary ? 'text-emerald-50' : 'text-zinc-400'
                  }`} />
                </div>
                <div className={`flex-1 justify-center text-sm sm:text-base font-normal font-manrope leading-snug ${
                  isPrimary ? 'text-emerald-50' : 'text-zinc-800'
                }`}>{feature}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Promo Code */}
        <div className={`self-stretch rounded-xl p-4 relative overflow-hidden ${
          isPrimary
            ? 'bg-gradient-to-r from-emerald-600 to-teal-400'
            : 'bg-gradient-to-r from-teal-600 to-teal-500'
        }`}>
          <div className="absolute -right-3 -top-3 w-20 h-20 rounded-full bg-white/10" />
          <div className="absolute -right-1 -bottom-4 w-14 h-14 rounded-full bg-white/5" />
          <div className="flex items-center justify-between relative">
            <div className="flex flex-col gap-1">
              <span className="text-white/80 text-xs font-manrope font-medium uppercase tracking-wide">
                {t('pricing.promoLabel', { discount: promoDiscount })}
              </span>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="font-mono font-bold tracking-widest text-lg text-white">{promoCode}</span>
                <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase whitespace-nowrap shrink-0">
                  {t('pricing.promoSave', { discount: promoDiscount })}
                </span>
              </div>
            </div>
            <button onClick={handleCopyCode} className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={handleSubscribe}
        disabled={disabled || isLoading || isCurrentPlan}
        className={`h-11 px-6 py-2.5 rounded-full inline-flex justify-center items-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
          isPrimary
            ? 'bg-gradient-to-r from-teal-600 to-teal-600 hover:from-teal-700 hover:to-teal-700'
            : 'bg-emerald-50 hover:bg-emerald-100'
        }`}
      >
        {isLoading ? (
          <>
            <div className={`animate-spin rounded-full h-4 w-4 border-2 border-t-transparent ${
              isPrimary ? 'border-white' : 'border-zinc-800'
            }`} />
            <div className={`justify-center text-sm font-semibold font-sora leading-tight ${
              isPrimary ? 'text-white' : 'text-zinc-800'
            }`}>{t('subscribeCard.processing')}</div>
          </>
        ) : isCurrentPlan ? (
          <div className={`justify-center text-sm font-semibold font-sora leading-tight ${
            isPrimary ? 'text-white' : 'text-zinc-800'
          }`}>{t('subscribeCard.currentPlan')}</div>
        ) : (
          <>
            <div className={`justify-center text-sm font-semibold font-sora leading-tight ${
              isPrimary ? 'text-white' : 'text-zinc-800'
            }`}>{t('subscribeCard.getStarted')}</div>
            <ArrowRight className={`size-4 ${isPrimary ? 'text-white' : 'text-zinc-800'}`} />
          </>
        )}
      </button>
    </div>
  );
};
