import { useTranslation } from 'react-i18next';
import { Button } from './Button';
import { Globe } from 'lucide-react';

const LanguageToggle = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    // Use startsWith to handle locale codes like 'en-US' or 'sv-SE'
    const isEnglish = i18n.language.startsWith('en');
    const newLang = isEnglish ? 'sv' : 'en';
    i18n.changeLanguage(newLang);
  };

  const currentLang = i18n.language.startsWith('sv') ? 'SV' : 'EN';

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 text-teal-700 hover:text-teal-900 font-medium"
    >
      <Globe size={16} />
      <span className="text-sm font-semibold">{currentLang}</span>
    </Button>
  );
};

export default LanguageToggle;

