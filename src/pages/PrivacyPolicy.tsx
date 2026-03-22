import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, FileText, Users, Clock, Globe, UserCheck, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { SEOHead } from '@/components/seo/SEOHead';
import Navbar from '@/components/layout/Navbar';

type PrivacyPolicyProps = {
  embedded?: boolean;
};

export default function PrivacyPolicy({ embedded = false }: PrivacyPolicyProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEOHead
        title={t('privacyPolicy.seoTitle')}
        description={t('privacyPolicy.seoDescription')}
      />
      {!embedded && (
        <div className="w-full shadow-2xs fixed z-50">
          <Navbar />
        </div>
      )}
      <div className={`min-h-screen ${embedded ? 'bg-[#F0F7F4]' : 'bg-[#E6F9F6] pt-16'}`}>
        <div className="w-full px-4 sm:px-8 md:px-14 py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            {/* Back button */}
            {embedded && (
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-[#005044] font-sora font-semibold text-sm mb-6 hover:opacity-80 transition-opacity"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('notFound.goBack', 'Go Back')}
              </button>
            )}

            {/* Header */}
            <div className="text-center space-y-4 mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 mb-4">
                <Shield className="w-8 h-8 text-teal-600" />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Sora'] text-teal-600">
                {t('privacyPolicy.title')}
              </h1>
              <p className="text-zinc-500 text-sm font-['Manrope']">
                {t('privacyPolicy.lastUpdated')}
              </p>
            </div>

            {/* Introduction */}
            <Card className="bg-white rounded-3xl shadow-lg border-0 mb-8">
              <CardContent className="p-6 sm:p-10">
                <p className="text-zinc-700 text-sm sm:text-base font-normal font-['Manrope'] leading-relaxed">
                  {t('privacyPolicy.intro')}
                </p>
                <div className="mt-6 p-4 bg-teal-50 rounded-xl border border-teal-100">
                  <p className="text-zinc-700 text-sm font-['Manrope'] leading-relaxed">
                    <span className="font-semibold text-teal-700">{t('privacyPolicy.dpoTitle')}</span>{' '}
                    {t('privacyPolicy.dpoText')}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section 1 - What data we process */}
            <Card className="bg-white rounded-3xl shadow-lg border-0 mb-8">
              <CardContent className="p-6 sm:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-teal-600" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-['Sora'] text-zinc-800">
                    {t('privacyPolicy.section1.title')}
                  </h2>
                </div>
                <p className="text-zinc-700 text-sm sm:text-base font-['Manrope'] leading-relaxed mb-4">
                  {t('privacyPolicy.section1.intro')}
                </p>
                <ul className="space-y-2 mb-6">
                  {(t('privacyPolicy.section1.examples', { returnObjects: true }) as string[]).map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-zinc-700 text-sm sm:text-base font-['Manrope']">
                      <span className="text-teal-500 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-zinc-700 text-sm sm:text-base font-['Manrope'] leading-relaxed mb-4">
                  {t('privacyPolicy.section1.processingDef')}
                </p>
                <p className="text-zinc-700 text-sm sm:text-base font-['Manrope'] leading-relaxed mb-2">
                  {t('privacyPolicy.section1.legalBasisIntro')}
                </p>
                <ul className="space-y-2 mb-4">
                  {(t('privacyPolicy.section1.legalBases', { returnObjects: true }) as string[]).map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-zinc-700 text-sm sm:text-base font-['Manrope']">
                      <span className="text-teal-500 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-zinc-600 text-sm font-['Manrope'] leading-relaxed italic">
                  {t('privacyPolicy.section1.sensitiveNote')}
                </p>
              </CardContent>
            </Card>

            {/* Section 2 - How we process data */}
            <Card className="bg-white rounded-3xl shadow-lg border-0 mb-8">
              <CardContent className="p-6 sm:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-teal-600" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-['Sora'] text-zinc-800">
                    {t('privacyPolicy.section2.title')}
                  </h2>
                </div>

                {(t('privacyPolicy.section2.subsections', { returnObjects: true }) as Array<{
                  title: string;
                  examples: string;
                  processing: string[];
                  purpose?: string;
                  legalBasis: string;
                  recipients?: string;
                }>).map((sub, i) => (
                  <div key={i} className={`${i > 0 ? 'mt-8 pt-8 border-t border-zinc-100' : ''}`}>
                    <h3 className="text-base sm:text-lg font-semibold font-['Sora'] text-teal-600 mb-3">
                      {sub.title}
                    </h3>
                    <p className="text-zinc-500 text-sm font-['Manrope'] mb-2">
                      <span className="font-semibold text-zinc-600">{t('privacyPolicy.section2.examplesLabel')}</span> {sub.examples}
                    </p>
                    <p className="text-zinc-600 text-sm font-semibold font-['Manrope'] mt-3 mb-1">{t('privacyPolicy.section2.processingLabel')}</p>
                    <ul className="space-y-1 mb-3">
                      {sub.processing.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-zinc-700 text-sm font-['Manrope']">
                          <span className="text-teal-500 mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    {sub.purpose && (
                      <p className="text-zinc-700 text-sm font-['Manrope']">
                        <span className="font-semibold text-zinc-600">{t('privacyPolicy.section2.purposeLabel')}</span> {sub.purpose}
                      </p>
                    )}
                    <p className="text-zinc-700 text-sm font-['Manrope'] mt-1">
                      <span className="font-semibold text-zinc-600">{t('privacyPolicy.section2.legalBasisLabel')}</span> {sub.legalBasis}
                    </p>
                    {sub.recipients && (
                      <p className="text-zinc-700 text-sm font-['Manrope'] mt-1">
                        <span className="font-semibold text-zinc-600">{t('privacyPolicy.section2.recipientsLabel')}</span> {sub.recipients}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Section 3 - Sharing */}
            <Card className="bg-white rounded-3xl shadow-lg border-0 mb-8">
              <CardContent className="p-6 sm:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-teal-600" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-['Sora'] text-zinc-800">
                    {t('privacyPolicy.section3.title')}
                  </h2>
                </div>
                {(t('privacyPolicy.section3.items', { returnObjects: true }) as Array<{ title: string; text: string }>).map((item, i) => (
                  <div key={i} className={`${i > 0 ? 'mt-6 pt-6 border-t border-zinc-100' : ''}`}>
                    <h3 className="text-base font-semibold font-['Sora'] text-teal-600 mb-2">{item.title}</h3>
                    <p className="text-zinc-700 text-sm sm:text-base font-['Manrope'] leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Section 4 - Retention */}
            <Card className="bg-white rounded-3xl shadow-lg border-0 mb-8">
              <CardContent className="p-6 sm:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-teal-600" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-['Sora'] text-zinc-800">
                    {t('privacyPolicy.section4.title')}
                  </h2>
                </div>
                <ul className="space-y-3">
                  {(t('privacyPolicy.section4.items', { returnObjects: true }) as string[]).map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-zinc-700 text-sm sm:text-base font-['Manrope']">
                      <span className="text-teal-500 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Section 5 - Where data is processed */}
            <Card className="bg-white rounded-3xl shadow-lg border-0 mb-8">
              <CardContent className="p-6 sm:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5 text-teal-600" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-['Sora'] text-zinc-800">
                    {t('privacyPolicy.section5.title')}
                  </h2>
                </div>
                <p className="text-zinc-700 text-sm sm:text-base font-['Manrope'] leading-relaxed">
                  {t('privacyPolicy.section5.text')}
                </p>
              </CardContent>
            </Card>

            {/* Section 6 - Your rights */}
            <Card className="bg-white rounded-3xl shadow-lg border-0 mb-8">
              <CardContent className="p-6 sm:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                    <UserCheck className="w-5 h-5 text-teal-600" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-['Sora'] text-zinc-800">
                    {t('privacyPolicy.section6.title')}
                  </h2>
                </div>
                <p className="text-zinc-700 text-sm sm:text-base font-['Manrope'] leading-relaxed mb-4">
                  {t('privacyPolicy.section6.intro')}
                </p>
                <ul className="space-y-2 mb-6">
                  {(t('privacyPolicy.section6.rights', { returnObjects: true }) as string[]).map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-zinc-700 text-sm sm:text-base font-['Manrope']">
                      <span className="text-teal-500 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-zinc-700 text-sm sm:text-base font-['Manrope'] leading-relaxed">
                  {t('privacyPolicy.section6.contact')}
                </p>
                <p className="text-zinc-700 text-sm sm:text-base font-['Manrope'] leading-relaxed mt-2">
                  {t('privacyPolicy.section6.complaint')}
                </p>
              </CardContent>
            </Card>

            {/* Footer note */}
            <div className="text-center text-zinc-500 text-sm font-['Manrope'] pb-8">
              <p>© 2026 Albafides Care AB (Vidacure)</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
