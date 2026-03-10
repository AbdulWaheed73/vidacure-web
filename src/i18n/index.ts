import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslations from './locales/en.json';
import svTranslations from './locales/sv.json';

const resources = {
  en: {
    translation: enTranslations,
  },
  sv: {
    translation: svTranslations,
  },
};

// Default to Swedish; only override if user explicitly chose a language before
const savedLng = localStorage.getItem('i18nextLng');

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLng || 'sv',
    fallbackLng: 'sv',
    debug: import.meta.env.DEV,

    interpolation: {
      escapeValue: false, // React already does escaping
    },
  });

// Persist language choice on change
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18nextLng', lng);
});

export default i18n;

