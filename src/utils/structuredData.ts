type Organization = {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  logo: string;
  description: string;
  address?: {
    "@type": string;
    addressCountry: string;
  };
  medicalSpecialty?: string | string[];
  sameAs?: string[];
};

type Article = {
  "@context": string;
  "@type": string;
  headline: string;
  description: string;
  image: string;
  author: {
    "@type": string;
    name: string;
  };
  publisher: {
    "@type": string;
    name: string;
    logo: {
      "@type": string;
      url: string;
    };
  };
  datePublished?: string;
  dateModified?: string;
};

type WebPage = {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  url: string;
};

type FAQ = {
  "@type": string;
  name: string;
  acceptedAnswer: {
    "@type": string;
    text: string;
  };
};

type FAQPage = {
  "@context": string;
  "@type": string;
  mainEntity: FAQ[];
};

export const createOrganizationSchema = (description: string): Organization => ({
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "name": "Vidacure",
  "url": "https://vidacure.se",
  "logo": "https://vidacure.se/v_black.png",
  "description": description,
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "SE"
  },
  "medicalSpecialty": ["Obesity Medicine", "Weight Management"]
});

export const createArticleSchema = (
  title: string,
  description: string,
  imageUrl: string,
  datePublished?: string
): Article => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": title,
  "description": description,
  "image": imageUrl,
  "author": {
    "@type": "Organization",
    "name": "Vidacure"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Vidacure",
    "logo": {
      "@type": "ImageObject",
      "url": "https://vidacure.se/v_black.png"
    }
  },
  "datePublished": datePublished || new Date().toISOString(),
  "dateModified": new Date().toISOString()
});

export const createWebPageSchema = (
  name: string,
  description: string,
  url: string
): WebPage => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": name,
  "description": description,
  "url": url
});

export const createFAQSchema = (faqs: Array<{ question: string; answer: string }>): FAQPage => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});
