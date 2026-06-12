import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { ArrowLeft, Clock, Stethoscope } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import { localePath, useLocale } from '@/utils/localePath';
import { articleCovers } from '@/constants/articleImages';
import { SEOHead } from '@/components/seo/SEOHead';
import { createArticleSchema, createMedicalWebPageSchema } from '@/utils/structuredData';

// Static per-article publication metadata (no CMS; edited in code).
// Fixed dates keep prerendered JSON-LD deterministic across builds.
const ARTICLE_META: Record<string, { published: string; modified: string }> = {
  'what-is-obesity': { published: '2025-02-01', modified: '2026-05-01' },
  'treating-obesity': { published: '2025-02-15', modified: '2026-05-01' },
  'women-health-obesity': { published: '2025-03-01', modified: '2026-05-01' },
  'nutrition-obesity': { published: '2026-06-01', modified: '2026-06-01' },
  'exercise-obesity': { published: '2026-06-01', modified: '2026-06-01' },
  'semaglutide-vs-tirzepatide': { published: '2026-06-12', modified: '2026-06-12' },
};

export default function Article() {
  const { articleId } = useParams<{ articleId: string }>();
  const { t } = useTranslation();
  const locale = useLocale();

  // Scroll to top when component mounts or articleId changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [articleId]);

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
    },
    {
      id: t('journal.articles.article4.id'),
      title: t('journal.articles.article4.title'),
      readTime: t('journal.articles.article4.readTime'),
      content: t('journal.articles.article4.content')
    },
    {
      id: t('journal.articles.article5.id'),
      title: t('journal.articles.article5.title'),
      readTime: t('journal.articles.article5.readTime'),
      content: t('journal.articles.article5.content')
    },
    {
      id: t('journal.articles.article6.id'),
      title: t('journal.articles.article6.title'),
      readTime: t('journal.articles.article6.readTime'),
      content: t('journal.articles.article6.content')
    }
  ];

  const article = articles.find(a => a.id === articleId);

  // Get SEO title/description/keywords based on article ID
  const seoKeyByArticle: Record<string, string> = {
    'what-is-obesity': 'whatIsObesity',
    'treating-obesity': 'treatingObesity',
    'women-health-obesity': 'womenHealth',
    'nutrition-obesity': 'nutrition',
    'exercise-obesity': 'exercise',
    'semaglutide-vs-tirzepatide': 'glp1',
  };

  const getSEOData = () => {
    const key = articleId ? seoKeyByArticle[articleId] : undefined;
    if (!key) return { title: '', description: '', keywords: '' };
    return {
      title: t(`seo.articles.${key}.title`),
      description: t(`seo.articles.${key}.description`),
      keywords: t(`seo.articles.${key}.keywords`),
    };
  };

  const seoData = getSEOData();

  // Named, credentialed medical author/reviewer (E-E-A-T for YMYL content).
  const author = {
    name: t('partner.teamMembers.selma.name'),
    jobTitle: t('partner.teamMembers.selma.title'),
  };

  // Structured data: MedicalScholarlyArticle + MedicalWebPage
  const structuredData = article && articleId ? (() => {
    const meta = ARTICLE_META[articleId] ?? { published: '2025-02-01', modified: '2026-05-01' };
    const description = seoData.description || article.content.substring(0, 160);
    const pageUrl = `https://vidacure.se${localePath(`/article/${articleId}`, locale)}`;
    return [
      createArticleSchema({
        title: article.title,
        description,
        imageUrl: `https://vidacure.se${articleCovers[articleId]?.jpg ?? ''}`,
        url: pageUrl,
        lang: locale,
        author,
        datePublished: meta.published,
        dateModified: meta.modified,
      }),
      createMedicalWebPageSchema({
        name: article.title,
        description,
        url: pageUrl,
        lang: locale,
        conditionName: 'Obesity',
        lastReviewed: meta.modified,
        reviewer: author,
      }),
    ];
  })() : undefined;

  if (!article) {
    return (
      <div className="min-h-screen bg-[#E6F9F6] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold font-sora text-zinc-800 mb-4">{t('notFound.title')}</h1>
          <Link
            to={localePath(ROUTES.HOME, locale)}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('notFound.goBack')}
          </Link>
        </div>
      </div>
    );
  }

  // Render inline markdown: **bold** and [label](url) links.
  const renderInline = (text: string): React.ReactNode[] => {
    const nodes: React.ReactNode[] = [];
    let key = 0;
    const pushText = (s: string) => {
      if (!s) return;
      s.split(/(\*\*[^*]+\*\*)/).forEach((part) => {
        if (!part) return;
        if (part.startsWith('**') && part.endsWith('**')) {
          nodes.push(<strong key={key++}>{part.slice(2, -2)}</strong>);
        } else {
          nodes.push(<span key={key++}>{part}</span>);
        }
      });
    };
    const linkRe = /\[([^\]]+)\]\(([^)]+)\)/g;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = linkRe.exec(text)) !== null) {
      pushText(text.slice(last, m.index));
      nodes.push(
        <a
          key={key++}
          href={m[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-teal-600 underline hover:text-teal-700"
        >
          {m[1]}
        </a>
      );
      last = linkRe.lastIndex;
    }
    pushText(text.slice(last));
    return nodes;
  };

  // Render a pipe-delimited markdown table block (first row = header).
  const renderTable = (rows: string[], key: number) => {
    const cells = (row: string) =>
      row.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map((c) => c.trim());
    const [header, ...body] = rows;
    return (
      <div key={key} className="my-6 overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-teal-50">
              {cells(header).map((cell, i) => (
                <th
                  key={i}
                  className="border border-teal-100 px-4 py-3 text-zinc-800 text-sm font-bold font-sora"
                >
                  {renderInline(cell)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, r) => (
              <tr key={r} className={r % 2 === 0 ? 'bg-white' : 'bg-zinc-50/60'}>
                {cells(row).map((cell, c) => (
                  <td
                    key={c}
                    className="border border-teal-100 px-4 py-3 text-zinc-800 text-sm font-normal font-manrope leading-relaxed align-top"
                  >
                    {renderInline(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Helper function to render markdown-like content
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactElement[] = [];

    for (let index = 0; index < lines.length; index++) {
      const line = lines[index];

      // Table block: consecutive lines starting with "|". Skips the --- separator row.
      if (line.trim().startsWith('|')) {
        const rows: string[] = [];
        while (index < lines.length && lines[index].trim().startsWith('|')) {
          if (!/^\s*\|[\s|:-]+\|?\s*$/.test(lines[index])) rows.push(lines[index]);
          index++;
        }
        index--; // step back; for-loop will advance past the last table line
        if (rows.length) elements.push(renderTable(rows, index));
        continue;
      }

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
                <strong>{match[1]}:</strong> {renderInline(match[2])}
              </p>
            </div>
          );
        }
      } else if (line.trim().startsWith('• ')) {
        elements.push(
          <div key={index} className="flex gap-3 items-start ml-4 mb-2">
            <span className="text-teal-600 flex-shrink-0 mt-1">•</span>
            <p className="text-zinc-800 text-base font-normal font-manrope leading-relaxed">
              {renderInline(line.trim().substring(2))}
            </p>
          </div>
        );
      }
      // Paragraph with inline bold/links
      else if (line.includes('**') || line.includes('](')) {
        elements.push(
          <p key={index} className="text-zinc-800 text-base font-normal font-manrope leading-relaxed mb-4">
            {renderInline(line)}
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
    }

    return elements;
  };

  return (
    <>
      {article && articleId && (
        <SEOHead
          title={seoData.title || article.title}
          description={seoData.description || article.content.substring(0, 160)}
          keywords={seoData.keywords || t('seo.defaultKeywords')}
          ogImage={`https://vidacure.se${articleCovers[articleId]?.jpg ?? ''}`}
          structuredData={structuredData}
        />
      )}
      <div className="min-h-screen bg-[#E6F9F6]">
      <div className="w-full px-4 sm:px-8 md:px-14 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            to={localePath(ROUTES.HOME, locale)}
            className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-8 font-semibold font-sora transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('article.backToHome', 'Back to Home')}
          </Link>

          {/* Article Card */}
          <Card className="bg-white rounded-3xl shadow-lg border-0">
            <CardContent className="p-8 sm:p-12">
              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-sora text-zinc-800 leading-tight mb-6">
                {article.title}
              </h1>

              {/* Read Time */}
              <div className="flex items-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-zinc-600" />
                <span className="text-zinc-600 text-base font-normal font-manrope">
                  {article.readTime}
                </span>
              </div>

              {/* Medical reviewer byline (E-E-A-T signal for YMYL content) */}
              <div className="flex items-center gap-3 mb-8 p-4 bg-teal-50/70 rounded-2xl">
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

              {/* Article Image */}
              {articleId && articleCovers[articleId] && (
                <div className="w-full h-64 sm:h-96 rounded-2xl mb-8 overflow-hidden">
                  <picture>
                    <source srcSet={articleCovers[articleId].webp} type="image/webp" />
                    <img
                      src={articleCovers[articleId].jpg}
                      alt={article.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </picture>
                </div>
              )}

              {/* Article Content */}
              <div className="prose prose-lg max-w-none">
                {renderContent(article.content)}
              </div>

              {/* Author bio (E-E-A-T: named, credentialed clinician) */}
              <div className="mt-10 pt-8 border-t border-zinc-100 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                  <Stethoscope className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-500 font-manrope mb-1">
                    {t('article.aboutAuthorTitle', 'About the author')}
                  </p>
                  <h3 className="text-lg font-bold font-sora text-teal-700">
                    {t('partner.teamMembers.selma.name')}
                  </h3>
                  <p className="text-sm text-zinc-500 font-medium font-manrope mb-2">
                    {t('partner.teamMembers.selma.title')}
                  </p>
                  <p className="text-sm text-zinc-700 font-normal font-manrope leading-relaxed">
                    {t('partner.teamMembers.selma.description')}
                  </p>
                  <Link
                    to={localePath('/aboutus#team', locale)}
                    className="inline-block mt-3 text-sm font-semibold text-teal-600 hover:underline"
                  >
                    {t('article.moreAboutTeam', 'Meet our medical team')}
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </>
  );
}
