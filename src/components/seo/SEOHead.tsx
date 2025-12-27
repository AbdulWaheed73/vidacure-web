import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

type SEOHeadProps = {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
  structuredData?: object | object[];
  noindex?: boolean;
};

export const SEOHead = ({
  title,
  description,
  keywords,
  ogImage,
  canonicalUrl,
  structuredData,
  noindex = false
}: SEOHeadProps) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  // Build full title with site name
  const fullTitle = title
    ? `${title} | Vidacure`
    : t('seo.defaultTitle');

  // Default values
  const finalDescription = description || t('seo.defaultDescription');
  const finalKeywords = keywords || t('seo.defaultKeywords');
  const baseUrl = 'https://vidacure.se';
  const finalCanonical = canonicalUrl || `${baseUrl}${typeof window !== 'undefined' ? window.location.pathname : ''}`;
  const finalOgImage = ogImage || `${baseUrl}/og-image.png`;

  // Handle multiple structured data objects
  const structuredDataArray = Array.isArray(structuredData) ? structuredData : structuredData ? [structuredData] : [];

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={currentLang} />
      <title>{fullTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />

      {/* Canonical URL */}
      <link rel="canonical" href={finalCanonical} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={currentLang === 'sv' ? 'sv_SE' : 'en_US'} />
      <meta property="og:site_name" content="Vidacure" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalOgImage} />

      {/* Noindex for protected routes */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Structured Data */}
      {structuredDataArray.map((data, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
};
