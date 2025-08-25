import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

export default function WeightLossSteps() {
  const steps = [
    {
      title: "Your Free Online Consult",
      description: "Tell us about your health history in a short online form. You'll then have a private consultation with a board-certified doctor to see if you're a candidate.",
      image: "https://placehold.co/624x500"
    },
    {
      title: "Get Your Custom Plan", 
      description: "Your doctor reviews your health profile to design a personalized treatment plan. This plan is tailored to your unique biology and weight loss goals.",
      image: "https://placehold.co/624x500"
    },
    {
      title: "Receive Treatment & Support",
      description: "Your medication is delivered discreetly to your home. From there, your dedicated care team provides ongoing support to guide you, adjust your plan, and celebrate your success.",
      image: "https://placehold.co/624x500"
    }
  ];

  return (
    <div className="w-full px-4 sm:px-8 lg:px-14 py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col justify-center items-center gap-8 lg:gap-16 mb-12 lg:mb-36">
          <div className="flex flex-col justify-center items-center gap-4">
            <div className="text-dark-teal text-base font-medium font-['Manrope'] uppercase leading-tight">
              How It Works
            </div>
            <div className="text-center">
              <span className="text-teal-600 text-3xl sm:text-4xl lg:text-5xl font-bold font-['Sora'] leading-tight lg:leading-[56.40px]">
                3 Steps to your<br className="sm:hidden" />
              </span>
              <span className="text-zinc-800 text-3xl sm:text-4xl lg:text-5xl font-bold font-['Sora'] leading-tight lg:leading-[56.40px]">
                {" "}weight loss{" "}
              </span>
              <span className="text-teal-600 text-3xl sm:text-4xl lg:text-5xl font-bold font-['Sora'] leading-tight lg:leading-[56.40px]">
                journey
              </span>
            </div>
          </div>
        </div>

        {/* Steps Section - Desktop Layout */}
        <div className="hidden lg:flex flex-col gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="bg-emerald-50 rounded-3xl border-0 overflow-hidden p-0">
              <CardContent className="p-0">
                <div className={`h-[500px] flex ${index === 1 ? 'flex-row-reverse' : 'flex-row'} gap-8`}>
                  <div className="flex-1">
                    <img 
                      className="w-full h-full object-cover rounded-3xl" 
                      src={step.image}
                      alt={step.title}
                    />
                  </div>
                  <div className="flex-1 px-8 py-16 flex flex-col justify-start gap-4">
                    <div className="pb-[0.59px]">
                      <h3 className="text-zinc-800 text-4xl font-bold font-['Sora'] leading-10">
                        {step.title}
                      </h3>
                    </div>
                    <div className="pr-6">
                      <p className="text-zinc-800 text-base font-normal font-['Manrope'] leading-snug">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Steps Section - Mobile Layout */}
        <div className="lg:hidden flex flex-col gap-6">
          {steps.map((step, index) => (
            <Card key={index} className="bg-emerald-50 rounded-3xl border-0 overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col">
                  <img 
                    className="w-full h-64 object-cover rounded-3xl" 
                    src={step.image.replace('624x500', '400x250')}
                    alt={step.title}
                  />
                  <div className="px-5 py-8 flex flex-col gap-4">
                    <div className="pb-[0.59px]">
                      <h3 className="text-zinc-800 text-2xl font-bold font-['Sora'] leading-loose">
                        {step.title}
                      </h3>
                    </div>
                    <div className="pr-6">
                      <p className="text-zinc-800 text-base font-normal font-['Manrope'] leading-snug">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mt-12 lg:mt-16">
          <button className="h-11 px-6 py-2.5 bg-zinc-800 rounded-full flex justify-center items-center gap-2.5 hover:bg-zinc-700 transition-colors">
            <span className="text-white text-sm font-semibold font-['Sora'] leading-tight">
              See if you qualify
            </span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}