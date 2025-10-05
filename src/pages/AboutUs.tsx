import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { Card, CardContent } from '@/components/ui/card';

export default function AboutUs() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const reasons = [
    t('partner.reasons.medical'),
    t('partner.reasons.science'),
    t('partner.reasons.personalized'),
    t('partner.reasons.longTerm')
  ];

  return (
    <div className="min-h-screen bg-[#E6F9F6]">
      <div className="w-full px-4 sm:px-8 md:px-14 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-3 mb-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Sora'] leading-tight">
              <span className="text-teal-600">{t('partner.titleHighlight')}</span>
            </h1>
            <p className="text-zinc-800 text-lg font-semibold font-['Manrope']">
              {t('partner.subtitle')}
            </p>
            <p className="text-zinc-800 text-base font-normal font-['Manrope'] leading-relaxed max-w-3xl mx-auto">
              {t('partner.intro')}
            </p>
          </div>

          {/* Main Content Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Why Choose Us Card */}
            <Card className="bg-white rounded-3xl shadow-lg border-0">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold font-['Sora'] text-teal-600 mb-6">
                  {t('partner.whyChooseTitle')}
                </h2>
                <div className="space-y-4">
                  {reasons.map((reason, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <span className="text-teal-600 flex-shrink-0 mt-1">•</span>
                      <p className="text-zinc-800 text-base font-normal font-['Manrope'] leading-relaxed">
                        {reason}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Promise Card */}
            <Card className="bg-white rounded-3xl shadow-lg border-0">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold font-['Sora'] text-teal-600 mb-6">
                  {t('partner.promiseTitle')}
                </h2>
                <div className="text-zinc-800 text-base font-normal font-['Manrope'] leading-relaxed whitespace-pre-line">
                  {t('partner.promiseText')}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Team Members */}
          <div className="flex justify-center gap-12 mb-8">
            <div className="text-center">
              <p className="text-teal-600 text-lg font-bold font-['Sora']">
                {t('partner.teamMembers.selma.name')}
              </p>
              <p className="text-zinc-800 text-sm font-normal font-['Manrope']">
                {t('partner.teamMembers.selma.title')}
              </p>
            </div>
            <div className="text-center">
              <p className="text-teal-600 text-lg font-bold font-['Sora']">
                {t('partner.teamMembers.marcus.name')}
              </p>
              <p className="text-zinc-800 text-sm font-normal font-['Manrope']">
                {t('partner.teamMembers.marcus.title')}
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <button
              onClick={() => navigate(ROUTES.LOGIN)}
              className="inline-flex items-center gap-2.5 px-6 py-2.5 bg-gradient-to-r from-teal-600 to-teal-600 rounded-full transition-all duration-200 hover:from-teal-700 hover:to-teal-700 hover:scale-105"
            >
              <span className="text-white text-sm font-semibold font-['Sora'] leading-tight">
                Get Started
              </span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
