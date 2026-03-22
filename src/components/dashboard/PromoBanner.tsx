import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TestTube, Sparkles, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Marquee } from '../magicui/marquee';

const CouponCode: React.FC<{ code: string; dark?: boolean }> = ({ code, dark }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast.success(t('promo.codeCopied'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-2 rounded-lg border border-dashed px-3 py-1.5 font-mono text-sm cursor-pointer transition-colors ${
        dark
          ? 'border-white/30 bg-white/10 text-white hover:bg-white/20'
          : 'border-gray-300 bg-gray-50 text-gray-800 hover:bg-gray-100'
      }`}
    >
      <span className={dark ? 'text-emerald-200 text-xs' : 'text-gray-500 text-xs'}>{t('promo.useCode')}</span>
      <span className="font-bold tracking-wider">{code}</span>
      {copied ? (
        <Check className="w-3.5 h-3.5 text-green-400" />
      ) : (
        <Copy className={`w-3.5 h-3.5 ${dark ? 'text-white/60' : 'text-gray-400'}`} />
      )}
    </button>
  );
};

export const PromoBanner: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="mb-0 overflow-hidden rounded-xl max-w-[1440px] mx-auto">
      <Marquee pauseOnHover repeat={3}>
        {/* Blood Test Card (light) */}
        <div className="min-w-[320px] md:min-w-[380px] bg-white rounded-xl shadow-sm border-l-4 border-[#00A38A] p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
            <TestTube className="w-6 h-6 text-[#00A38A]" />
          </div>
          <div className="flex flex-col gap-1.5">
            <div>
              <p className="font-sora font-bold text-[#005044] text-lg leading-tight">
                {t('promo.bloodTestTitle')}
              </p>
              <p className="font-manrope text-gray-600 text-sm">
                {t('promo.bloodTestSubtitle')}
              </p>
            </div>
            <CouponCode code="BLOD200" />
          </div>
        </div>

        {/* Subscription Card (dark) */}
        <div className="min-w-[320px] md:min-w-[380px] bg-[#005044] rounded-xl shadow-sm p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-teal-700/50 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-emerald-200" />
          </div>
          <div className="flex flex-col gap-1.5">
            <div>
              <p className="font-sora font-bold text-white text-lg leading-tight">
                {t('promo.subscriptionTitle')}
              </p>
              <p className="font-manrope text-emerald-50 text-sm">
                {t('promo.subscriptionSubtitle')}
              </p>
            </div>
            <CouponCode code="PLAN300" dark />
          </div>
        </div>
      </Marquee>
    </div>
  );
};
