import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { Globe } from 'lucide-react';
import { isPublicLocalePath, localePath, stripLocale, toLocale } from '@/utils/localePath';

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleLanguage = () => {
    const newLang = toLocale(i18n.language) === 'en' ? 'sv' : 'en';
    i18n.changeLanguage(newLang);

    // On public pages the URL encodes the language, so reflect the switch there.
    // (Dashboard togglers use other components and never reach this branch.)
    if (isPublicLocalePath(location.pathname)) {
      const canonical = stripLocale(location.pathname);
      navigate(`${localePath(canonical, newLang)}${location.search}${location.hash}`);
    }
  };

  const currentLang = toLocale(i18n.language) === 'sv' ? 'SV' : 'EN';

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