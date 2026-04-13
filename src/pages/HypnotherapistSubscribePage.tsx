import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';
import { HypnotherapistCard } from '@/components/subscription/HypnotherapistCard';

const HypnotherapistSubscribePage = () => {
  const { t } = useTranslation();

  useEffect(() => {
    localStorage.removeItem('vidacure_hypno_intent');
  }, []);

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <Sparkles className="size-6 sm:size-8 text-teal-600" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-sora">
            {t('hypnotherapist.pageTitle')}
          </h1>
        </div>
        <p className="text-base sm:text-lg text-gray-600 font-manrope max-w-xl mx-auto">
          {t('hypnotherapist.pageDescription')}
        </p>
      </div>

      {/* Card */}
      <HypnotherapistCard mode="checkout" layout="horizontal" />
    </div>
  );
};

export default HypnotherapistSubscribePage;
