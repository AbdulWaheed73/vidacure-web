import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const faqCategories = [
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
        {
          question: t('faq.questions.aboutMedication.commonSideEffects.question'),
          answer: t('faq.questions.aboutMedication.commonSideEffects.answer'),
        },
        {
          question: t('faq.questions.aboutMedication.lesserCommonSideEffects.question'),
          answer: t('faq.questions.aboutMedication.lesserCommonSideEffects.answer'),
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

  // Helper function to render answer with bullet points
  const renderAnswer = (answer: string) => {
    if (answer.includes('•')) {
      return (
        <div className="space-y-2">
          {answer.split('\n').map((line, idx) => {
            if (line.trim().startsWith('•')) {
              return (
                <div key={idx} className="flex gap-2">
                  <span className="flex-shrink-0">•</span>
                  <span>{line.trim().substring(1).trim()}</span>
                </div>
              );
            } else if (line.trim()) {
              return <p key={idx}>{line}</p>;
            } else {
              return <div key={idx} className="h-2" />;
            }
          })}
        </div>
      );
    }
    return answer;
  };

  return (
    <div className=" py-8 px-4 sm:py-12 sm:px-6 lg:py-20 lg:px-14">
      <div className="max-w-7xl mx-auto">
        {/* Desktop Layout */}
        <div className="hidden lg:block">
          {/* Header */}
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <h1 className="text-zinc-800 text-5xl font-bold font-sora leading-[56.40px] mb-4">
              {t('faq.title')}
            </h1>
            <p className="text-zinc-800 text-base font-normal font-manrope leading-snug mb-8">
              {t('faq.introduction')}
            </p>
            <button
              onClick={() => navigate(ROUTES.LOGIN)}
              className="h-11 px-6 py-2.5 bg-zinc-800 rounded-full inline-flex justify-center items-center gap-2.5 hover:bg-zinc-700 transition-colors duration-200 group"
            >
              <span className="text-white text-sm font-semibold font-sora leading-tight">
                {t('faq.helpButton')}
              </span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>

          {/* FAQ Items - 2 Column Grid */}
          <div className="space-y-8">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h3 className="text-teal-600 text-lg font-semibold font-sora mb-4">
                  {category.title}
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {category.questions.map((item, questionIndex) => (
                    <Card key={`${categoryIndex}-${questionIndex}`} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value={`item-${categoryIndex}-${questionIndex}`} className="border-0">
                            <AccordionTrigger className="text-black text-base font-semibold font-manrope leading-snug hover:text-teal-600 [&[data-state=open]>svg]:rotate-180 hover:no-underline pb-3">
                              {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-600 text-sm font-normal font-manrope leading-relaxed pt-2">
                              {renderAnswer(item.answer)}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
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
                <p className="text-zinc-800 text-base font-normal font-manrope leading-snug text-center">
                  {t('faq.introduction')}
                </p>
              </div>
              <button
                onClick={() => navigate(ROUTES.LOGIN)}
                className="h-11 px-6 py-2.5 bg-zinc-800 rounded-full flex justify-center items-center gap-2.5 hover:bg-zinc-700 transition-colors duration-200 group self-center"
              >
                <span className="text-white text-sm font-semibold font-sora leading-tight">
                  {t('faq.helpButton')}
                </span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>

            {/* FAQ Categories */}
            <div className="space-y-6">
              {faqCategories.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h3 className="text-teal-600 text-lg font-semibold font-sora mb-4">
                    {category.title}
                  </h3>
                  <div className="space-y-3">
                    {category.questions.map((item, questionIndex) => (
                      <Card key={`${categoryIndex}-${questionIndex}`} className="bg-white rounded-2xl shadow-sm border border-gray-100">
                        <CardContent className="p-4">
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value={`item-${categoryIndex}-${questionIndex}`} className="border-0">
                              <AccordionTrigger className="text-black text-sm font-semibold font-manrope leading-snug hover:text-teal-600 [&[data-state=open]>svg]:rotate-180 hover:no-underline pb-2">
                                {item.question}
                              </AccordionTrigger>
                              <AccordionContent className="text-gray-600 text-sm font-normal font-manrope leading-relaxed pt-2">
                                {renderAnswer(item.answer)}
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
