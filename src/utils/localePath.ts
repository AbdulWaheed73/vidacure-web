import { useTranslation } from 'react-i18next';

/**
 * URL-based locale routing for the PUBLIC marketing pages.
 *
 * Swedish (the site default) lives at the root paths it always has — `/`,
 * `/aboutus`, `/privacy`, `/article/:id` — so existing URLs/SEO are preserved.
 * English is served under an `/en` prefix — `/en`, `/en/aboutus`, etc.
 *
 * These helpers translate between the canonical (Swedish, unprefixed) in-app
 * path and the locale-prefixed URL, and are reused by every public-page link,
 * the language toggle, and <LocaleSync>.
 */

export const SUPPORTED_LOCALES = ['sv', 'en'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'sv';

/** Normalize an i18next language code (e.g. 'en-US') to a supported Locale. */
export const toLocale = (lang: string | undefined): Locale =>
  String(lang ?? '').startsWith('en') ? 'en' : 'sv';

/** Which locale does a given pathname represent? */
export const localeFromPath = (pathname: string): Locale =>
  pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'sv';

/** Remove the `/en` prefix, returning the canonical (Swedish) in-app path. */
export const stripLocale = (pathname: string): string => {
  if (pathname === '/en') return '/';
  if (pathname.startsWith('/en/')) return pathname.slice(3); // drop '/en'
  return pathname;
};

/**
 * Build a locale-aware URL from a canonical in-app path.
 * `localePath('/aboutus', 'en')` -> '/en/aboutus'
 * `localePath('/aboutus', 'sv')` -> '/aboutus'
 * Hash fragments are preserved: `localePath('/#pricing', 'en')` -> '/en#pricing'
 */
export const localePath = (path: string, lang: string | Locale): string => {
  if (toLocale(lang) !== 'en') return path;
  const [rawPath, hash] = path.split('#');
  const p = rawPath || '/';
  const base = p === '/' ? '/en' : `/en${p.startsWith('/') ? p : `/${p}`}`;
  return hash ? `${base}#${hash}` : base;
};

/** True for the routes that participate in locale routing. */
export const isPublicLocalePath = (pathname: string): boolean => {
  const p = stripLocale(pathname);
  return p === '/' || p === '/aboutus' || p === '/privacy' || p === '/faqs' || p.startsWith('/article');
};

/** Hook returning the current locale derived from the active i18next language. */
export const useLocale = (): Locale => {
  const { i18n } = useTranslation();
  return toLocale(i18n.language);
};