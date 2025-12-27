import { Card, CardContent } from '@/components/ui/card';
import { Clock, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import img from "@/assets/injections.svg";
import TestimonialSection from './Testimonial';

const HealthJournalSection = () => {
  const { t } = useTranslation();

  const articles = [
    {
      id: t('journal.articles.article1.id'),
      title: t('journal.articles.article1.title'),
      readTime: t('journal.articles.article1.readTime')
    },
    {
      id: t('journal.articles.article2.id'),
      title: t('journal.articles.article2.title'),
      readTime: t('journal.articles.article2.readTime')
    },
    {
      id: t('journal.articles.article3.id'),
      title: t('journal.articles.article3.title'),
      readTime: t('journal.articles.article3.readTime')
    }
  ];

  const ArticleCard = ({ article, className = "" }: { article: any; className?: string }) => (
    <Link to={`/article/${article.id}`} className="block">
      <Card
        className={`bg-white rounded-[20px] shadow-md hover:shadow-lg transition-all duration-300 group ${className}`}
      >
        <CardContent className="p-0 h-full flex flex-col">
          {/* Title Section */}
          <div className="p-6 flex-1 flex items-center">
            <h2 className="text-black text-lg lg:text-xl font-bold font-sora leading-snug group-hover:text-teal-600 transition-colors duration-300 line-clamp-4">
              {article.title}
            </h2>
          </div>

          {/* Footer Section */}
          <div className="p-6 pt-0 flex justify-between items-center">
            <div className="px-3 py-1 bg-emerald-50 rounded-full flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-zinc-600" />
              <span className="text-zinc-800 text-base font-normal font-manrope leading-snug">
                {article.readTime}
              </span>
            </div>
            <div className="w-6 h-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <ArrowUpRight className="w-4 h-4 text-black group-hover:text-teal-600 transition-colors duration-300" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <div className="py-16 sm:px-6 lg:px-14">
      <div className="max-w-7xl mx-auto">
        <div className="p-6 sm:p-8 lg:p-10 rounded-3xl">

          {/* Header */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-sora leading-tight lg:leading-[56.40px]">
              <span className="text-zinc-800">{t('journal.title')} </span>
              <span className="text-teal-600">{t('journal.titleHighlight')}</span>
            </h1>
          </div>

          {/* Understanding Obesity Section */}
          <div className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold font-sora leading-tight mb-4">
                    <span className="text-zinc-800">{t('obesity.title')} </span>
                    <span className="text-teal-600">{t('obesity.titleHighlight')}</span>
                  </h2>
                  <p className="text-zinc-800 text-base font-normal font-manrope leading-relaxed">
                    {t('obesity.description')}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-bold font-sora text-zinc-800 mb-3">
                      {t('obesity.bodyBiologyTitle')}
                    </h3>
                    <p className="text-zinc-800 text-base font-normal font-manrope leading-relaxed">
                      {t('obesity.bodyBiologyDescription')}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold font-sora text-zinc-800 mb-3">
                      {t('obesity.modernMedicineTitle')}
                    </h3>
                    <p className="text-zinc-800 text-base font-normal font-manrope leading-relaxed">
                      {t('obesity.modernMedicineDescription')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Image */}
              <div className="flex justify-center">
                <img
                  src={img}
                  alt="Healthcare professional with measuring tape"
                  className="rounded-3xl shadow-lg max-w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* Desktop Layout - 3 columns */}
          <div className="hidden lg:grid grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                className="h-80"
              />
            ))}
          </div>

          {/* Tablet Layout - 2 columns */}
          <div className="hidden sm:grid lg:hidden grid-cols-2 gap-6 mb-6">
            {articles.slice(0, 2).map((article) => (
              <ArticleCard 
                key={article.id} 
                article={article}
                className="h-72"
              />
            ))}
          </div>
          <div className="hidden sm:block lg:hidden">
            <ArticleCard 
              article={articles[2]} 
              className="h-72 max-w-md mx-auto"
            />
          </div>

          {/* Mobile Layout - 1 column */}
          <div className="sm:hidden flex flex-col gap-6">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                className="min-h-[280px]"
              />
            ))}
          </div>

          {/* Testimonials Section */}
          <div className="mt-16">
            <TestimonialSection />
          </div>

        </div>
      </div>
    </div>
  );
};

export default HealthJournalSection;