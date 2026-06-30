import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, Stethoscope } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import { localePath, useLocale } from '@/utils/localePath';
import { SEOHead } from '@/components/seo/SEOHead';
import { FaqAccordion } from '@/components/faq/FaqAccordion';
import { faqContent } from '@/constants/faqContent';
import { createFAQSchema } from '@/utils/structuredData';

/**
 * Dedicated, AI-crawlable FAQ hub. Renders Dr. Selma's full clinician-authored
 * knowledge base (all categories) with one FAQPage JSON-LD covering every Q&A —
 * the highest-citation-rate structured-data type for ChatGPT/Perplexity/Google
 * AI Overviews in 2026.
 */
export default function Faqs() {
  const { t } = useTranslation();
  const locale = useLocale();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Prefer returning to where the user came from (restores scroll position);
  // fall back to Home only on a direct/first-entry load (e.g. from search).
  const handleBack = (e: React.MouseEvent) => {
    if (location.key !== 'default') {
      e.preventDefault();
      navigate(-1);
    }
  };

  const categories = faqContent[locale];

  // One FAQPage schema covering every question on the page (matches visible content).
  const allItems = categories.flatMap((c) => c.items);
  const faqSchema = createFAQSchema(
    allItems.map((i) => ({ question: i.q, answer: i.a }))
  );

  return (
    <>
      <SEOHead
        title={t('seo.faqs.title')}
        description={t('seo.faqs.description')}
        keywords={t('seo.faqs.keywords')}
        structuredData={faqSchema}
      />
      <div className="min-h-screen bg-[#E6F9F6]">
        <div className="w-full px-4 sm:px-8 md:px-14 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Link
              to={localePath(ROUTES.HOME, locale)}
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-8 font-semibold font-sora transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              {t('article.back', 'Back')}
            </Link>

            {/* Header */}
            <div className="mb-10">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-sora text-zinc-800 leading-tight mb-4">
                {t('faqsPage.title')}
              </h1>
              <p className="text-zinc-600 text-base sm:text-lg font-normal font-manrope leading-relaxed mb-6">
                {t('faqsPage.intro')}
              </p>

              {/* Clinician byline (E-E-A-T for YMYL content) */}
              <div className="flex items-center gap-3 p-4 bg-teal-50/70 rounded-2xl">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                  <Stethoscope className="w-5 h-5 text-teal-700" />
                </div>
                <p className="text-sm text-zinc-700 font-manrope leading-snug">
                  {t('article.reviewedBy', 'Medically reviewed by')}{' '}
                  <Link
                    to={localePath('/aboutus#team', locale)}
                    className="font-semibold text-teal-700 hover:underline"
                  >
                    {t('partner.teamMembers.selma.name')}
                  </Link>
                  {' · '}
                  {t('partner.teamMembers.selma.title')}
                </p>
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-8">
              {categories.map((category) => (
                <Card key={category.id} className="bg-white rounded-3xl shadow-sm border-0">
                  <CardContent className="p-6 sm:p-8">
                    <h2 className="text-xl sm:text-2xl font-bold font-sora text-teal-600 mb-2">
                      {category.title}
                    </h2>
                    <FaqAccordion items={category.items} idPrefix={category.id} />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-10 flex justify-center">
              <Link
                to={ROUTES.PRE_LOGIN_BMI}
                className="h-11 px-6 py-2.5 bg-teal-600 rounded-full inline-flex justify-center items-center gap-2.5 hover:bg-teal-700 transition-colors duration-200 group"
              >
                <span className="text-white text-sm font-semibold font-sora leading-tight">
                  {t('faqsPage.cta')}
                </span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>

            {/* Medical disclaimer */}
            <p className="mt-8 text-xs text-zinc-500 font-manrope leading-relaxed text-center max-w-2xl mx-auto">
              {t('faqsPage.disclaimer')}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
