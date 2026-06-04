// JSON-LD (schema.org) builders for GEO / AI-search + traditional SEO.
// Healthcare content is YMYL, so we emit MedicalOrganization, named/credentialed
// authors (Person + reviewedBy), MedicalWebPage and FAQPage where applicable.

const BASE_URL = 'https://vidacure.se';
const LOGO_URL = `${BASE_URL}/v_black.png`;

// Public social profiles (strengthens entity "sameAs" signal for AI engines).
const SAME_AS = [
  'https://www.instagram.com/vidacure.se/',
];

type Person = {
  '@type': 'Person';
  name: string;
  jobTitle?: string;
  worksFor?: { '@type': 'Organization'; name: string };
};

type Organization = {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  logo: string;
  description: string;
  email?: string;
  address?: {
    '@type': string;
    addressCountry: string;
  };
  areaServed?: string;
  availableLanguage?: string[];
  medicalSpecialty?: string | string[];
  sameAs?: string[];
};

type Article = {
  '@context': string;
  '@type': string;
  headline: string;
  description: string;
  image: string;
  inLanguage?: string;
  mainEntityOfPage?: string;
  author: Person;
  reviewedBy?: Person;
  publisher: {
    '@type': string;
    name: string;
    logo: { '@type': string; url: string };
  };
  datePublished?: string;
  dateModified?: string;
};

type MedicalWebPage = {
  '@context': string;
  '@type': 'MedicalWebPage';
  name: string;
  description: string;
  url: string;
  inLanguage?: string;
  lastReviewed?: string;
  reviewedBy?: Person;
  about?: { '@type': 'MedicalCondition'; name: string };
};

type WebPage = {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url: string;
  inLanguage?: string;
};

type FAQ = {
  '@type': string;
  name: string;
  acceptedAnswer: { '@type': string; text: string };
};

type FAQPage = {
  '@context': string;
  '@type': string;
  mainEntity: FAQ[];
};

const vidacurePublisher = {
  '@type': 'Organization',
  name: 'Vidacure',
  logo: { '@type': 'ImageObject', url: LOGO_URL },
};

export const createOrganizationSchema = (description: string): Organization => ({
  '@context': 'https://schema.org',
  '@type': 'MedicalOrganization',
  name: 'Vidacure',
  url: BASE_URL,
  logo: LOGO_URL,
  description,
  email: 'info@vidacure.se',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'SE',
  },
  areaServed: 'SE',
  availableLanguage: ['sv', 'en'],
  medicalSpecialty: [
    'Endocrine',        // metabolic / obesity — official schema.org enum
    'DietNutrition',    // nutrition coaching — official schema.org enum
    'PrimaryCare',      // Dr. Selma, family medicine — official schema.org enum
    'Obesity Medicine', // descriptive, for AI/LLM matching
    'Weight Management', // descriptive, for AI/LLM matching
  ],
  sameAs: SAME_AS,
});

type ArticleSchemaInput = {
  title: string;
  description: string;
  imageUrl: string;
  url: string;
  lang: string;
  author: { name: string; jobTitle?: string };
  datePublished: string;
  dateModified: string;
};

export const createArticleSchema = ({
  title,
  description,
  imageUrl,
  url,
  lang,
  author,
  datePublished,
  dateModified,
}: ArticleSchemaInput): Article => {
  const person: Person = {
    '@type': 'Person',
    name: author.name,
    jobTitle: author.jobTitle,
    worksFor: { '@type': 'Organization', name: 'Vidacure' },
  };
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalScholarlyArticle',
    headline: title,
    description,
    image: imageUrl,
    inLanguage: lang,
    mainEntityOfPage: url,
    author: person,
    reviewedBy: person,
    publisher: vidacurePublisher,
    datePublished,
    dateModified,
  };
};

type MedicalWebPageInput = {
  name: string;
  description: string;
  url: string;
  lang: string;
  conditionName?: string;
  lastReviewed: string;
  reviewer: { name: string; jobTitle?: string };
};

export const createMedicalWebPageSchema = ({
  name,
  description,
  url,
  lang,
  conditionName,
  lastReviewed,
  reviewer,
}: MedicalWebPageInput): MedicalWebPage => ({
  '@context': 'https://schema.org',
  '@type': 'MedicalWebPage',
  name,
  description,
  url,
  inLanguage: lang,
  lastReviewed,
  reviewedBy: {
    '@type': 'Person',
    name: reviewer.name,
    jobTitle: reviewer.jobTitle,
    worksFor: { '@type': 'Organization', name: 'Vidacure' },
  },
  ...(conditionName
    ? { about: { '@type': 'MedicalCondition' as const, name: conditionName } }
    : {}),
});

export const createWebPageSchema = (
  name: string,
  description: string,
  url: string,
  lang?: string
): WebPage => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name,
  description,
  url,
  ...(lang ? { inLanguage: lang } : {}),
});

export const createFAQSchema = (
  faqs: Array<{ question: string; answer: string }>
): FAQPage => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
});
