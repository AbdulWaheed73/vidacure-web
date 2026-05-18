import { useTranslation } from 'react-i18next';
import { Lightbulb } from 'lucide-react';
import { SuggestionForm } from '@/components/suggestions/SuggestionForm';

const DoctorSuggestions: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-3 mb-2 md:mb-4">
          <Lightbulb className="size-6 md:size-8 text-teal-action" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 font-manrope">
            {t('suggestions.pageTitle')}
          </h1>
        </div>
        <p className="text-sm md:text-lg text-gray-600 font-manrope">
          {t('suggestions.pageSubtitle')}
        </p>
      </div>

      <SuggestionForm role="doctor" />
    </div>
  );
};

export default DoctorSuggestions;
