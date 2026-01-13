import { ArrowRight, Stethoscope, FlaskConical, UserCheck, TrendingUp, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ROUTES } from '@/constants';
import { Card, CardContent } from '@/components/ui/card';
import { SEOHead } from '@/components/seo/SEOHead';
import { createOrganizationSchema } from '@/utils/structuredData';
import Navbar from '@/components/layout/Navbar';

export default function AboutUs() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const reasons = [
    { text: t('partner.reasons.medical'), icon: Stethoscope },
    { text: t('partner.reasons.science'), icon: FlaskConical },
    { text: t('partner.reasons.personalized'), icon: UserCheck },
    { text: t('partner.reasons.longTerm'), icon: TrendingUp }
  ];

  // Organization schema for about page
  const organizationSchema = createOrganizationSchema(t('seo.aboutUs.description'));

  return (
    <>
      <SEOHead
        title={t('seo.aboutUs.title')}
        description={t('seo.aboutUs.description')}
        keywords={t('seo.defaultKeywords')}
        structuredData={organizationSchema}
      />
      <div className="w-full shadow-2xs fixed z-50">
        <Navbar />
      </div>
      <div className="min-h-screen bg-[#E6F9F6] pt-16">
      <div className="w-full px-4 sm:px-8 md:px-14 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Sora'] leading-tight">
              <span className="text-teal-600">{t('partner.titleHighlight')}</span>
            </h1>
            <p className="text-zinc-800 text-lg font-semibold font-['Manrope']">
              {t('partner.subtitle')}
            </p>
            <p className="text-zinc-700 text-base font-normal font-['Manrope'] leading-relaxed max-w-2xl mx-auto">
              {t('partner.intro')}
            </p>
          </div>

          {/* Main Content Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Why Choose Us Card */}
            <Card className="bg-white rounded-3xl shadow-lg border-0 transition-all duration-200 hover:shadow-xl">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold font-['Sora'] text-teal-600 mb-6">
                  {t('partner.whyChooseTitle')}
                </h2>
                <div className="space-y-5">
                  {reasons.map((reason, index) => {
                    const Icon = reason.icon;
                    return (
                      <div key={index} className="flex gap-4 items-start">
                        <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                          <Icon size={20} className="text-teal-700" />
                        </div>
                        <p className="text-zinc-700 text-base font-normal font-['Manrope'] leading-relaxed pt-2">
                          {reason.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Promise Card */}
            <Card className="bg-white rounded-3xl shadow-lg border-0 transition-all duration-200 hover:shadow-xl">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold font-['Sora'] text-teal-600 mb-6">
                  {t('partner.promiseTitle')}
                </h2>
                <div className="text-zinc-700 text-base font-normal font-['Manrope'] leading-relaxed whitespace-pre-line">
                  {t('partner.promiseText')}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Team Section Header */}
          <div id="team" className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold font-['Sora'] text-teal-600">
              {t('partner.title', 'Vårt Team')}
            </h2>
            <p className="text-zinc-600 text-base font-['Manrope'] mt-2">
              {t('partner.teamSubtitle', 'Meet the experts behind Vidacure')}
            </p>
          </div>

          {/* Team Member Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            {/* Selma Card */}
            <Card className="bg-white rounded-3xl shadow-lg border-0 overflow-hidden transition-all duration-200 hover:shadow-xl">
              <div className="h-1 bg-gradient-to-r from-teal-500 to-teal-600" />
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                    <Stethoscope size={24} className="text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold font-['Sora'] text-teal-600">
                      {t('partner.teamMembers.selma.name')}
                    </h3>
                    <p className="text-zinc-500 text-sm font-medium font-['Manrope']">
                      {t('partner.teamMembers.selma.title')}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-zinc-700 text-sm sm:text-base font-normal font-['Manrope'] leading-relaxed">
                    {t('partner.teamMembers.selma.description')}
                  </p>
                  <p className="text-zinc-700 text-sm sm:text-base font-normal font-['Manrope'] leading-relaxed">
                    {t('partner.teamMembers.selma.description2')}
                  </p>

                  {/* Medical Program Section */}
                  <div className="pt-4 mt-4 border-t border-zinc-100">
                    <p className="text-zinc-700 text-sm sm:text-base font-normal font-['Manrope'] leading-relaxed whitespace-pre-line">
                      {t('partner.teamMembers.selma.programDescription')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Marcus Card */}
            <Card className="bg-white rounded-3xl shadow-lg border-0 overflow-hidden transition-all duration-200 hover:shadow-xl">
              <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <Heart size={24} className="text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold font-['Sora'] text-teal-600">
                      {t('partner.teamMembers.marcus.name')}
                    </h3>
                    <p className="text-zinc-500 text-sm font-medium font-['Manrope']">
                      {t('partner.teamMembers.marcus.title')}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-zinc-700 text-sm sm:text-base font-normal font-['Manrope'] leading-relaxed">
                    {t('partner.teamMembers.marcus.description')}
                  </p>
                  <p className="text-zinc-700 text-sm sm:text-base font-normal font-['Manrope'] leading-relaxed">
                    {t('partner.teamMembers.marcus.description2')}
                  </p>

                  {/* Coaching Section */}
                  <div className="pt-4 mt-4 border-t border-zinc-100">
                    <h4 className="text-base sm:text-lg font-semibold font-['Sora'] text-teal-600 mb-2">
                      {t('partner.teamMembers.marcus.coachingTitle')}
                    </h4>
                    <p className="text-zinc-700 text-sm sm:text-base font-normal font-['Manrope'] leading-relaxed">
                      {t('partner.teamMembers.marcus.coachingDescription')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-12 py-8 px-6 bg-white rounded-3xl shadow-lg">
            <p className="text-zinc-600 text-lg font-['Manrope'] mb-4">
              {t('partner.ctaText', 'Ready to start your health journey?')}
            </p>
            <button
              onClick={() => navigate(ROUTES.PRE_LOGIN_BMI)}
              className="group inline-flex items-center gap-2.5 px-8 py-3 bg-gradient-to-r from-teal-600 to-teal-600 rounded-full transition-all duration-200 hover:from-teal-700 hover:to-teal-700 hover:scale-105"
            >
              <span className="text-white text-base font-semibold font-['Sora'] leading-tight">
                {t('navbar.getStarted')}
              </span>
              <ArrowRight className="w-5 h-5 text-white transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
