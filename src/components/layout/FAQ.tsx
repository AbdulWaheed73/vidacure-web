import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, ArrowRight } from "lucide-react";

const FAQSection = () => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const faqItems = [
    {
      question: "Is this program safe?",
      answer:
        "Yes, our program is completely safe. All treatments are overseen by board-certified physicians who specialize in weight management. We conduct thorough medical evaluations before starting any treatment and provide ongoing monitoring throughout your journey.",
    },
    {
      question: "What are the side effects of the medication?",
      answer:
        "Common side effects may include mild nausea, decreased appetite, and occasional digestive discomfort, especially during the initial weeks. These effects typically diminish as your body adjusts. Our medical team closely monitors all patients and adjusts treatment plans as needed to minimize any discomfort.",
    },
    {
      question: "Do I have to stop eating the foods I love?",
      answer:
        "Not at all! Our approach focuses on sustainable lifestyle changes rather than restrictive dieting. You'll learn to enjoy your favorite foods in moderation while developing healthier eating patterns. Our nutrition coaching helps you make informed choices without feeling deprived.",
    },
    {
      question: "How long is the treatment?",
      answer:
        "Treatment duration varies by individual, but most patients see significant results within 3-6 months. Some continue treatment for 12-18 months for optimal results. Your doctor will work with you to determine the right timeline based on your goals, progress, and medical needs.",
    },
    {
      question: "Are there any financing options available?",
      answer:
        "Yes, we offer flexible payment plans to make our program accessible. We work with several financing partners to provide monthly payment options that fit your budget. Contact our team to discuss the best financing solution for your situation.",
    },
  ];

  const FAQItem = ({ item, index, isOpen, onToggle }) => (
    <div className="py-4 border-b-2 border-stone-50 last:border-b-0">
      <button
        onClick={() => onToggle(index)}
        className="w-full flex justify-between items-center text-left hover:text-teal-600 transition-colors duration-200"
        aria-expanded={isOpen}
      >
        <span className="text-black text-base font-normal font-manrope leading-snug pr-4">
          {item.question}
        </span>
        <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-teal-700 transition-transform duration-200" />
          ) : (
            <ChevronDown className="w-4 h-4 text-teal-700 transition-transform duration-200" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="mt-4 pr-10 animate-in slide-in-from-top-1 duration-200">
          <p className="text-gray-600 text-base font-normal font-manrope leading-relaxed">
            {item.answer}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-emerald-50 py-8 px-4 sm:py-12 sm:px-6 lg:py-20 lg:px-14">
      <div className="max-w-7xl mx-auto">
        {/* Desktop Layout */}
        <div className="hidden lg:flex justify-start items-start max-w-6xl mx-auto">
          {/* Left Side - Header */}
          <div className="flex-1 h-[614.61px] flex flex-col justify-start items-start">
            <div className="flex-1 py-8 flex flex-col justify-start items-start gap-12">
              <div className="flex flex-col justify-start items-start gap-4">
                <h1 className="text-zinc-800 text-5xl font-bold font-sora leading-[56.40px]">
                  Frequently Asked Questions
                </h1>
              </div>
              <button className="h-11 px-6 py-2.5 bg-zinc-800 rounded-full flex justify-center items-center gap-2.5 hover:bg-zinc-700 transition-colors duration-200 group">
                <span className="text-white text-sm font-semibold font-sora leading-tight">
                  Still need help? Get in touch
                </span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>

          {/* Right Side - FAQ Items */}
          <div className="flex-1">
            <Card className="bg-white rounded-3xl shadow-lg border-0">
              <CardContent className="px-8 py-12">
                <div className="space-y-0">
                  {faqItems.map((item, index) => (
                    <FAQItem
                      key={index}
                      item={item}
                      index={index}
                      isOpen={openItems[index]}
                      onToggle={toggleItem}
                    />
                  ))}
                </div>
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
                  Frequently Asked Questions
                </h1>
              </div>
              <button className="h-11 px-6 py-2.5 bg-zinc-800 rounded-full flex justify-center items-center gap-2.5 hover:bg-zinc-700 transition-colors duration-200 group self-center">
                <span className="text-white text-sm font-semibold font-sora leading-tight">
                  Still need help? Get in touch
                </span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>

            {/* FAQ Card */}
            <Card className="bg-white rounded-3xl shadow-lg border-0">
              <CardContent className="px-5 py-8">
                <div className="space-y-0">
                  {faqItems.map((item, index) => (
                    <FAQItem
                      key={index}
                      item={item}
                      index={index}
                      isOpen={openItems[index]}
                      onToggle={toggleItem}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
