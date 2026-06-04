import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isPublicLocalePath, localeFromPath, toLocale } from '@/utils/localePath';

/**
 * Makes the URL the source of truth for language on PUBLIC pages.
 *
 * On a public route (`/`, `/aboutus`, `/privacy`, `/article/*` and their `/en`
 * variants) the i18next language is synced to the path's locale prefix — so a
 * crawler (or a deep link) hitting `/en/aboutus` renders English and `/aboutus`
 * renders Swedish, regardless of any previously persisted preference.
 *
 * On non-public routes (login, dashboard, onboarding…) this is a no-op, leaving
 * the dashboard's own localStorage-based language switching untouched.
 */
export const LocaleSync = () => {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (!isPublicLocalePath(pathname)) return;
    const want = localeFromPath(pathname);
    if (toLocale(i18n.language) !== want) {
      i18n.changeLanguage(want);
    }
  }, [pathname, i18n]);

  return null;
};

export default LocaleSync;