import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { FaqItem } from '@/types/faq-types';

type FaqAccordionProps = {
  items: FaqItem[];
  /** Unique prefix so accordion item values don't collide across sections. */
  idPrefix?: string;
};

/**
 * Renders a list of Q&A pairs as a single-collapse accordion. Shared by the
 * dedicated FAQ page and the per-article FAQ block so the visible content
 * always matches the FAQPage JSON-LD emitted alongside it.
 */
export const FaqAccordion = ({ items, idPrefix = 'faq' }: FaqAccordionProps) => (
  <Accordion type="single" collapsible className="w-full divide-y divide-zinc-100">
    {items.map((item) => (
      <AccordionItem key={item.id} value={`${idPrefix}-${item.id}`} className="border-0">
        <AccordionTrigger className="text-left text-zinc-800 text-base font-semibold font-sora leading-snug hover:text-teal-600 hover:no-underline [&[data-state=open]>svg]:rotate-180 py-4">
          {item.q}
        </AccordionTrigger>
        <AccordionContent className="text-zinc-600 text-sm font-normal font-manrope leading-relaxed pb-4">
          {item.a}
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
);
