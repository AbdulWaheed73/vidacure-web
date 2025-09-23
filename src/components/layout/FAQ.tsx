import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const { t } = useTranslation();

  const faqItems = [
    {
      question: t('faq.questions.safety.question'),
      answer: t('faq.questions.safety.answer'),
    },
    {
      question: t('faq.questions.sideEffects.question'),
      answer: t('faq.questions.sideEffects.answer'),
    },
    {
      question: t('faq.questions.foodRestrictions.question'),
      answer: t('faq.questions.foodRestrictions.answer'),
    },
    {
      question: t('faq.questions.treatmentDuration.question'),
      answer: t('faq.questions.treatmentDuration.answer'),
    },
    {
      question: t('faq.questions.financing.question'),
      answer: t('faq.questions.financing.answer'),
    },
  ];

  return (
    <div className=" py-8 px-4 sm:py-12 sm:px-6 lg:py-20 lg:px-14">
      <div className="max-w-7xl mx-auto">
        {/* Desktop Layout */}
        <div className="hidden lg:flex justify-start items-start max-w-6xl mx-auto">
          {/* Left Side - Header */}
          <div className="flex-1 h-[614.61px] flex flex-col justify-start items-start">
            <div className="flex-1 py-8 flex flex-col justify-start items-start gap-12">
              <div className="flex flex-col justify-start items-start gap-4">
                <h1 className="text-zinc-800 text-5xl font-bold font-sora leading-[56.40px]">
                  {t('faq.title')}
                </h1>
              </div>
              <button className="h-11 px-6 py-2.5 bg-zinc-800 rounded-full flex justify-center items-center gap-2.5 hover:bg-zinc-700 transition-colors duration-200 group">
                <span className="text-white text-sm font-semibold font-sora leading-tight">
                  {t('faq.helpButton')}
                </span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>

          {/* Right Side - FAQ Items */}
          <div className="flex-1">
            <Card className="bg-white rounded-3xl shadow-lg border-0">
              <CardContent className="px-8 py-12">
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-black text-base font-normal font-manrope leading-snug hover:text-teal-600 [&[data-state=open]>svg]:rotate-180">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 text-base font-normal font-manrope leading-relaxed">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden max-w-md mx-auto">
          <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <h1 className="text-zinc-800 text-3xl sm:text-4xl font-bold font-sora leading-10 text-center">
                  {t('faq.title')}
                </h1>
              </div>
              <button className="h-11 px-6 py-2.5 bg-zinc-800 rounded-full flex justify-center items-center gap-2.5 hover:bg-zinc-700 transition-colors duration-200 group self-center">
                <span className="text-white text-sm font-semibold font-sora leading-tight">
                  {t('faq.helpButton')}
                </span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>

            {/* FAQ Card */}
            <Card className="bg-white rounded-3xl shadow-lg border-0">
              <CardContent className="px-5 py-8">
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-black text-base font-normal font-manrope leading-snug hover:text-teal-600 [&[data-state=open]>svg]:rotate-180">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 text-base font-normal font-manrope leading-relaxed">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
