import { Card, CardContent } from '@/components/ui/card';
import { Clock, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import img from "@/assets/injections.svg";
import TestimonialSection from './Testimonial';

const HealthJournalSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const articles = [
    {
      id: t('journal.articles.article1.id'),
      author: {
        name: t('journal.authors.author1.name'),
        credentials: t('journal.authors.author1.credentials'),
        avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face"
      },
      title: t('journal.articles.article1.title'),
      readTime: t('journal.articles.article1.readTime')
    },
    {
      id: t('journal.articles.article2.id'),
      author: {
        name: t('journal.authors.author2.name'),
        credentials: t('journal.authors.author2.credentials'),
        avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face"
      },
      title: t('journal.articles.article2.title'),
      readTime: t('journal.articles.article2.readTime')
    },
    {
      id: t('journal.articles.article3.id'),
      author: {
        name: t('journal.authors.author3.name'),
        credentials: t('journal.authors.author3.credentials'),
        avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face"
      },
      title: t('journal.articles.article3.title'),
      readTime: t('journal.articles.article3.readTime')
    }
  ];

  const ArticleCard = ({ article, className = "" }: { article: any; className?: string }) => (
    <Card
      onClick={() => navigate(`/article/${article.id}`)}
      className={`bg-white rounded-[20px] shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group ${className}`}
    >
      <CardContent className="p-0 h-full flex flex-col">
        {/* Author Section */}
        <div className="p-6 flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            <img 
              className="w-full h-full object-cover" 
              src={article.author.avatar}
              alt={article.author.name}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-black text-base font-bold font-manrope leading-snug truncate">
              {article.author.name}
            </h3>
            <p className="text-zinc-800 text-base font-normal font-manrope leading-snug truncate">
              {article.author.credentials}
            </p>
          </div>
        </div>

        {/* Title Section */}
        <div className="px-6 py-3 flex-1 flex items-center">
          <h2 className="text-black text-xl lg:text-2xl font-bold font-sora leading-relaxed lg:leading-loose group-hover:text-teal-600 transition-colors duration-300 line-clamp-3">
            {article.title}
          </h2>
        </div>

        {/* Footer Section */}
        <div className="p-6 flex justify-between items-center">
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
  );

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-14">
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
                    <span className="text-zinc-800">Understanding obesity: </span>
                    <span className="text-teal-600">It's a complex medical condition, not a choice.</span>
                  </h2>
                  <p className="text-zinc-800 text-base font-normal font-manrope leading-relaxed">
                    For too long, the story around weight has been about willpower. But modern medicine shows that obesity is a complex disease, deeply influenced by your genetics, hormones, and environment. We now understand the biology behind the struggle, and with that understanding comes new, effective medical treatments that can finally help.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-bold font-sora text-zinc-800 mb-3">
                      Your Body's Biology
                    </h3>
                    <p className="text-zinc-800 text-base font-normal font-manrope leading-relaxed">
                      Your body's natural "set point" is controlled by hormones. When you diet, your body often fights back by increasing hunger and slowing your metabolism, making lasting results difficult on your own.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold font-sora text-zinc-800 mb-3">
                      How Modern Medicine Helps
                    </h3>
                    <p className="text-zinc-800 text-base font-normal font-manrope leading-relaxed">
                      Clinically-proven medications like GLP-1s work with your body's biology. Under a doctor's guidance, they help adjust your set point and reduce hunger signals, making sustainable health possible.
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
          <div className="hidden lg:flex justify-start items-start gap-8">
            {articles.map((article) => (
              <ArticleCard 
                key={article.id} 
                article={article} 
                className="flex-1 h-80"
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