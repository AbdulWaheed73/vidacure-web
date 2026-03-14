import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { BookOpen, TestTubes, Lightbulb, FileText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { patientResources } from '@/data/patient-resources';

const iconMap: Record<string, React.ElementType> = {
  TestTubes,
  Lightbulb,
  FileText,
};

export const ResourcesPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const openedFromParam = searchParams.get('article');
  const [selectedId, setSelectedId] = useState<string | null>(openedFromParam);
  const isSv = i18n.language?.startsWith('sv');

  useEffect(() => {
    const article = searchParams.get('article');
    if (article && patientResources.some((r) => r.id === article)) {
      setSelectedId(article);
    }
  }, [searchParams]);

  const selectedArticle = patientResources.find((r) => r.id === selectedId);

  if (selectedArticle) {
    const content = isSv ? selectedArticle.contentSv : selectedArticle.contentEn;
    const title = isSv ? selectedArticle.titleSv : selectedArticle.titleEn;

    return (
      <div className="p-8 bg-[#f0f7f4] min-h-full">
        <div className="max-w-3xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => {
              if (openedFromParam) {
                navigate('/lab-tests');
              } else {
                setSelectedId(null);
                setSearchParams({});
              }
            }}
            className="mb-6 text-[#009689] hover:text-[#005044] hover:bg-[#E6F7F5] font-manrope"
          >
            <ArrowLeft className="size-4 mr-2" />
            {openedFromParam ? t('labTests.backToLabTests', 'Back to Lab Tests') : t('resources.backToResources')}
          </Button>

          <article className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h1 className="text-3xl font-bold text-[#009689] font-manrope mb-8">
              {title}
            </h1>

            {content.map((section, idx) => (
              <div key={idx} className="mb-6">
                {section.heading && (
                  <h2 className="text-xl font-bold text-[#009689] font-manrope mb-3">
                    {section.heading}
                  </h2>
                )}
                {section.body && (
                  <div className="text-gray-700 font-manrope leading-relaxed mb-3 whitespace-pre-line">
                    {section.body}
                  </div>
                )}
                {section.bullets && section.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-6 space-y-2 text-gray-700 font-manrope leading-relaxed">
                    {section.bullets.map((bullet, bIdx) => (
                      <li key={bIdx}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#f0f7f4] min-h-full">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="size-8 text-[#009689]" />
          <h1 className="text-3xl font-bold text-gray-800 font-manrope">
            {t('resources.title')}
          </h1>
        </div>
        <p className="text-lg text-gray-600 font-manrope">
          {t('resources.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patientResources.map((resource) => {
          const Icon = iconMap[resource.icon] || FileText;
          const title = isSv ? resource.titleSv : resource.titleEn;
          const description = isSv ? resource.descriptionSv : resource.descriptionEn;

          return (
            <div
              key={resource.id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 cursor-pointer flex flex-col"
              onClick={() => setSelectedId(resource.id)}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-[#E6F7F5] rounded-xl">
                  <Icon className="size-6 text-[#009689]" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 font-manrope">
                  {title}
                </h2>
              </div>
              <p className="text-gray-600 font-manrope leading-relaxed flex-1 mb-4">
                {description}
              </p>
              <Button
                className="w-full bg-[#009689] hover:bg-[#005044] text-white font-manrope"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedId(resource.id);
                }}
              >
                {t('resources.readMore')}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
