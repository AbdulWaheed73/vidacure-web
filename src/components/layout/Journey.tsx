import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';
import JourneyStep1 from "../../assets/journey-step1.svg";
import JourneyStep2 from "../../assets/journey-step2.svg";
import JourneyStep3 from "../../assets/journey-step3.svg";

export default function WeightLossSteps() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const steps = [
    {
      title: t('journey.step1.title'),
      description: t('journey.step1.description'),
      image: JourneyStep1
    },
    {
      title: t('journey.step2.title'),
      description: t('journey.step2.description'),
      image: JourneyStep2
    },
    {
      title: t('journey.step3.title'),
      description: t('journey.step3.description'),
      image: JourneyStep3
    }
  ];

  return (
    <div className="w-full px-4 sm:px-8 lg:px-14 py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col justify-center items-center gap-8 lg:gap-16 mb-12 lg:mb-36">
          <div className="flex flex-col justify-center items-center gap-4">
            <div className="text-dark-teal text-base font-medium font-['Manrope'] uppercase leading-tight">
              {t('journey.subtitle')}
            </div>
            <div className="text-center">
              <span className="text-teal-600 text-3xl sm:text-4xl lg:text-5xl font-bold font-['Sora'] leading-tight lg:leading-[56.40px]">
                {t('journey.title')}<br className="sm:hidden" />
              </span>
              <span className="text-zinc-800 text-3xl sm:text-4xl lg:text-5xl font-bold font-['Sora'] leading-tight lg:leading-[56.40px]">
                {" "}{t('journey.titleWeight')}{" "}
              </span>
              <span className="text-teal-600 text-3xl sm:text-4xl lg:text-5xl font-bold font-['Sora'] leading-tight lg:leading-[56.40px]">
                {t('journey.titleJourney')}
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
                      {step.description.includes('•') ? (
                        <div className="text-zinc-800 text-base font-normal font-['Manrope'] leading-snug">
                          {step.description.split('\n').map((line, idx) => (
                            line.trim().startsWith('•') ? (
                              <div key={idx} className="flex gap-2 mt-2">
                                <span className="flex-shrink-0">•</span>
                                <span>{line.trim().substring(1).trim()}</span>
                              </div>
                            ) : (
                              <p key={idx} className={line.trim() ? '' : 'h-2'}>{line}</p>
                            )
                          ))}
                        </div>
                      ) : (
                        <p className="text-zinc-800 text-base font-normal font-['Manrope'] leading-snug whitespace-pre-line">
                          {step.description}
                        </p>
                      )}
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
                    src={step.image}
                    alt={step.title}
                  />
                  <div className="px-5 py-8 flex flex-col gap-4">
                    <div className="pb-[0.59px]">
                      <h3 className="text-zinc-800 text-2xl font-bold font-['Sora'] leading-loose">
                        {step.title}
                      </h3>
                    </div>
                    <div className="pr-6">
                      {step.description.includes('•') ? (
                        <div className="text-zinc-800 text-base font-normal font-['Manrope'] leading-snug">
                          {step.description.split('\n').map((line, idx) => (
                            line.trim().startsWith('•') ? (
                              <div key={idx} className="flex gap-2 mt-2">
                                <span className="flex-shrink-0">•</span>
                                <span>{line.trim().substring(1).trim()}</span>
                              </div>
                            ) : (
                              <p key={idx} className={line.trim() ? '' : 'h-2'}>{line}</p>
                            )
                          ))}
                        </div>
                      ) : (
                        <p className="text-zinc-800 text-base font-normal font-['Manrope'] leading-snug whitespace-pre-line">
                          {step.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mt-12 lg:mt-16">
          <button
            onClick={() => navigate(ROUTES.LOGIN)}
            className="h-11 px-6 py-2.5 bg-zinc-800 rounded-full flex justify-center items-center gap-2.5 hover:bg-zinc-700 transition-colors"
          >
            <span className="text-white text-sm font-semibold font-['Sora'] leading-tight">
              {t('journey.ctaButton')}
            </span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}