import type { Locale } from '@/utils/localePath';

/** A single question/answer pair. `id` is stable across locales. */
export type FaqItem = {
  id: string;
  q: string;
  a: string;
};

/** A titled group of FAQ items (rendered as one section on the FAQ page). */
export type FaqCategory = {
  id: string;
  title: string;
  items: FaqItem[];
};

/** Clinician-authored FAQ content, one ordered category list per locale. */
export type FaqContent = Record<Locale, FaqCategory[]>;
