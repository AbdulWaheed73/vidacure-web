import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export const LanguageCard = () => {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-4 md:p-6 col-span-1 lg:col-span-3">
      <div className="flex items-center gap-2 mb-5">
        <Globe className="size-5 text-[#005044]" />
        <h3 className="text-lg font-semibold text-gray-800 font-sora">
          {t('account.language')}
        </h3>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => handleLanguageChange('en')}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl border font-manrope text-sm font-medium transition-colors ${
            i18n.language === 'en'
              ? 'border-[#005044] bg-[#f0f7f4] text-[#005044]'
              : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          🇬🇧 English
        </button>
        <button
          onClick={() => handleLanguageChange('sv')}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl border font-manrope text-sm font-medium transition-colors ${
            i18n.language === 'sv'
              ? 'border-[#005044] bg-[#f0f7f4] text-[#005044]'
              : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          🇸🇪 Svenska
        </button>
      </div>
    </div>
  );
};
