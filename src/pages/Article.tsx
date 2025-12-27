import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { ArrowLeft, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import whatIsObesityImg from '@/assets/what-is-obesity.jpg';
import treatingObesityImg from '@/assets/Treating-Obesity.jpg';
import girlsImg from '@/assets/girls.jpg';
import { SEOHead } from '@/components/seo/SEOHead';
import { createArticleSchema } from '@/utils/structuredData';

export default function Article() {
  const { articleId } = useParams<{ articleId: string }>();
  const { t } = useTranslation();

  // Scroll to top when component mounts or articleId changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [articleId]);

  // Article image mapping
  const articleImages: Record<string, string> = {
    'what-is-obesity': whatIsObesityImg,
    'treating-obesity': treatingObesityImg,
    'women-health-obesity': girlsImg
  };

  // Find the article data
  const articles = [
    {
      id: t('journal.articles.article1.id'),
      title: t('journal.articles.article1.title'),
      readTime: t('journal.articles.article1.readTime'),
      content: t('journal.articles.article1.content')
    },
    {
      id: t('journal.articles.article2.id'),
      title: t('journal.articles.article2.title'),
      readTime: t('journal.articles.article2.readTime'),
      content: t('journal.articles.article2.content')
    },
    {
      id: t('journal.articles.article3.id'),
      title: t('journal.articles.article3.title'),
      readTime: t('journal.articles.article3.readTime'),
      content: t('journal.articles.article3.content')
    }
  ];

  const article = articles.find(a => a.id === articleId);

  // Get SEO title and description based on article ID
  const getSEOData = () => {
    if (articleId === 'what-is-obesity') {
      return {
        title: t('seo.articles.whatIsObesity.title'),
        description: t('seo.articles.whatIsObesity.description')
      };
    } else if (articleId === 'treating-obesity') {
      return {
        title: t('seo.articles.treatingObesity.title'),
        description: t('seo.articles.treatingObesity.description')
      };
    } else if (articleId === 'women-health-obesity') {
      return {
        title: t('seo.articles.womenHealth.title'),
        description: t('seo.articles.womenHealth.description')
      };
    }
    return { title: '', description: '' };
  };

  const seoData = getSEOData();

  // Article schema
  const articleSchema = article && articleId ? createArticleSchema(
    article.title,
    seoData.description || article.content.substring(0, 160),
    `https://vidacure.se${articleImages[articleId]}`,
    new Date().toISOString()
  ) : undefined;

  if (!article) {
    return (
      <div className="min-h-screen bg-[#E6F9F6] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold font-sora text-zinc-800 mb-4">Article Not Found</h1>
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  // Helper function to render markdown-like content
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactElement[] = [];

    lines.forEach((line, index) => {
      // Headers
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={index} className="text-xl font-bold font-sora text-zinc-800 mt-6 mb-3">
            {line.replace('### ', '')}
          </h3>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={index} className="text-2xl font-bold font-sora text-teal-600 mt-8 mb-4">
            {line.replace('## ', '')}
          </h2>
        );
      }
      // Bullet points
      else if (line.trim().startsWith('• **')) {
        const match = line.match(/• \*\*(.*?)\*\*:? ?(.*)/);
        if (match) {
          elements.push(
            <div key={index} className="flex gap-3 items-start ml-4 mb-2">
              <span className="text-teal-600 flex-shrink-0 mt-1">•</span>
              <p className="text-zinc-800 text-base font-normal font-manrope leading-relaxed">
                <strong>{match[1]}:</strong> {match[2]}
              </p>
            </div>
          );
        }
      } else if (line.trim().startsWith('• ')) {
        elements.push(
          <div key={index} className="flex gap-3 items-start ml-4 mb-2">
            <span className="text-teal-600 flex-shrink-0 mt-1">•</span>
            <p className="text-zinc-800 text-base font-normal font-manrope leading-relaxed">
              {line.trim().substring(2)}
            </p>
          </div>
        );
      }
      // Bold text with asterisks
      else if (line.includes('**')) {
        const parts = line.split(/(\*\*.*?\*\*)/);
        elements.push(
          <p key={index} className="text-zinc-800 text-base font-normal font-manrope leading-relaxed mb-4">
            {parts.map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i}>{part.slice(2, -2)}</strong>;
              }
              return <span key={i}>{part}</span>;
            })}
          </p>
        );
      }
      // Regular paragraphs
      else if (line.trim() && !line.startsWith('#')) {
        elements.push(
          <p key={index} className="text-zinc-800 text-base font-normal font-manrope leading-relaxed mb-4">
            {line}
          </p>
        );
      }
      // Empty lines
      else if (!line.trim()) {
        elements.push(<div key={index} className="h-2" />);
      }
    });

    return elements;
  };

  return (
    <>
      {article && articleId && (
        <SEOHead
          title={seoData.title || article.title}
          description={seoData.description || article.content.substring(0, 160)}
          keywords={t('seo.defaultKeywords')}
          ogImage={`https://vidacure.se${articleImages[articleId]}`}
          structuredData={articleSchema}
        />
      )}
      <div className="min-h-screen bg-[#E6F9F6]">
      <div className="w-full px-4 sm:px-8 md:px-14 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-8 font-semibold font-sora transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>

          {/* Article Card */}
          <Card className="bg-white rounded-3xl shadow-lg border-0">
            <CardContent className="p-8 sm:p-12">
              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-sora text-zinc-800 leading-tight mb-6">
                {article.title}
              </h1>

              {/* Read Time */}
              <div className="flex items-center gap-2 mb-8">
                <Clock className="w-5 h-5 text-zinc-600" />
                <span className="text-zinc-600 text-base font-normal font-manrope">
                  {article.readTime}
                </span>
              </div>

              {/* Article Image */}
              {articleId && articleImages[articleId] && (
                <div className="w-full h-64 sm:h-96 rounded-2xl mb-8 overflow-hidden">
                  <img
                    src={articleImages[articleId]}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Article Content */}
              <div className="prose prose-lg max-w-none">
                {renderContent(article.content)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </>
  );
}
