import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { ArrowLeft, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import whatIsObesityImg from '@/assets/what-is-obesity.jpg';
import treatingObesityImg from '@/assets/Treating-Obesity.jpg';
import girlsImg from '@/assets/girls.jpg';

export default function Article() {
  const { articleId } = useParams<{ articleId: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();

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
      content: t('journal.articles.article1.content'),
      authorName: t('journal.authors.author1.name'),
      authorCredentials: t('journal.authors.author1.credentials'),
      authorAvatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: t('journal.articles.article2.id'),
      title: t('journal.articles.article2.title'),
      readTime: t('journal.articles.article2.readTime'),
      content: t('journal.articles.article2.content'),
      authorName: t('journal.authors.author2.name'),
      authorCredentials: t('journal.authors.author2.credentials'),
      authorAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: t('journal.articles.article3.id'),
      title: t('journal.articles.article3.title'),
      readTime: t('journal.articles.article3.readTime'),
      content: t('journal.articles.article3.content'),
      authorName: t('journal.authors.author3.name'),
      authorCredentials: t('journal.authors.author3.credentials'),
      authorAvatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face"
    }
  ];

  const article = articles.find(a => a.id === articleId);

  if (!article) {
    return (
      <div className="min-h-screen bg-[#E6F9F6] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold font-sora text-zinc-800 mb-4">Article Not Found</h1>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back Home
          </button>
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
    <div className="min-h-screen bg-[#E6F9F6]">
      <div className="w-full px-4 sm:px-8 md:px-14 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-8 font-semibold font-sora transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>

          {/* Article Card */}
          <Card className="bg-white rounded-3xl shadow-lg border-0">
            <CardContent className="p-8 sm:p-12">
              {/* Author Info */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  <img
                    className="w-full h-full object-cover"
                    src={article.authorAvatar}
                    alt={article.authorName}
                  />
                </div>
                <div>
                  <h3 className="text-zinc-800 text-lg font-bold font-manrope">
                    {article.authorName}
                  </h3>
                  <p className="text-zinc-600 text-base font-normal font-manrope">
                    {article.authorCredentials}
                  </p>
                </div>
              </div>

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
  );
}
