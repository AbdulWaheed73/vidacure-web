// FAQ content shared between the FAQ UI (FAQ.tsx) and the LandingPage's
// FAQPage JSON-LD, so both render from a single source.

export type FaqQuestion = { question: string; answer: string };
export type FaqCategory = { title: string; questions: FaqQuestion[] };

export const buildFaqCategories = (t: (key: string) => string): FaqCategory[] => [
  {
    title: t('faq.questions.aboutProgram.title'),
    questions: [
      {
        question: t('faq.questions.aboutProgram.different.question'),
        answer: t('faq.questions.aboutProgram.different.answer'),
      },
      {
        question: t('faq.questions.aboutProgram.dietExercise.question'),
        answer: t('faq.questions.aboutProgram.dietExercise.answer'),
      },
      {
        question: t('faq.questions.aboutProgram.meetingFrequency.question'),
        answer: t('faq.questions.aboutProgram.meetingFrequency.answer'),
      },
    ],
  },
  {
    title: t('faq.questions.aboutMedication.title'),
    questions: [
      {
        question: t('faq.questions.aboutMedication.why.question'),
        answer: t('faq.questions.aboutMedication.why.answer'),
      },
      {
        question: t('faq.questions.aboutMedication.forever.question'),
        answer: t('faq.questions.aboutMedication.forever.answer'),
      },
      {
        question: t('faq.questions.aboutMedication.whoCanTake.question'),
        answer: t('faq.questions.aboutMedication.whoCanTake.answer'),
      },
      {
        question: t('faq.questions.aboutMedication.safe.question'),
        answer: t('faq.questions.aboutMedication.safe.answer'),
      },
      {
        question: t('faq.questions.aboutMedication.alcohol.question'),
        answer: t('faq.questions.aboutMedication.alcohol.answer'),
      },
    ],
  },
  {
    title: t('faq.questions.results.title'),
    questions: [
      {
        question: t('faq.questions.results.expectations.question'),
        answer: t('faq.questions.results.expectations.answer'),
      },
      {
        question: t('faq.questions.results.howSoon.question'),
        answer: t('faq.questions.results.howSoon.answer'),
      },
      {
        question: t('faq.questions.results.regain.question'),
        answer: t('faq.questions.results.regain.answer'),
      },
      {
        question: t('faq.questions.results.surgery.question'),
        answer: t('faq.questions.results.surgery.answer'),
      },
      {
        question: t('faq.questions.results.noWeightLoss.question'),
        answer: t('faq.questions.results.noWeightLoss.answer'),
      },
    ],
  },
];
