import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

export default function StatisticsComponent() {
  const { t } = useTranslation();
  
  const statistics = [
    {
      number: "1",
      unit: "in",
      number2: "2",
      description: t('know.statistics.stat1')
    },
    {
      number: "95",
      unit: "%",
      description: t('know.statistics.stat2')
    },
    {
      number: "15",
      unit: "%", 
      description: t('know.statistics.stat3')
    }
  ];

  return (
    <div className="w-full px-4 sm:px-8 lg:px-14 pb-12 sm:pb-16 lg:pb-20 bg-white">
      <div className="max-w-7xl mx-auto">
        <Card className="rounded-3xl border-0 shadow-none bg-transparent overflow-hidden">
          <CardContent className="p-6 sm:p-10 lg:p-14">
            <div className="flex flex-col justify-center items-center gap-8 lg:gap-16">
              {/* Title */}
              <h2 className="text-zinc-800 text-3xl sm:text-4xl font-bold font-['Sora'] leading-10 text-center">
                {t('know.title')}
              </h2>

              {/* Desktop Layout */}
              <div className="hidden lg:flex w-full justify-start items-start gap-8">
                {statistics.map((stat, index) => (
                  <div key={index} className="flex-1 flex flex-col justify-center items-start gap-4">
                    <div className="flex items-baseline">
                      <span className="text-teal-600 text-8xl font-bold font-['Sora'] leading-[112.80px]">
                        {stat.number}
                      </span>
                      <span className="text-teal-600 text-5xl font-bold font-['Sora'] leading-[56.40px]">
                        {stat.unit}
                      </span>
                      {stat.number2 && (
                        <span className="text-teal-600 text-8xl font-bold font-['Sora'] leading-[112.80px]">
                          {stat.number2}
                        </span>
                      )}
                    </div>
                    <p className="text-zinc-800 text-xl font-normal font-['Sora'] leading-relaxed">
                      {stat.description}
                    </p>
                    {index < statistics.length - 1 && (
                      <div className="absolute right-0 top-0 w-1.5 h-full bg-stone-50 rounded-full" />
                    )}
                  </div>
                ))}
              </div>

              {/* Mobile Layout */}
              <div className="lg:hidden w-full px-4 flex flex-col gap-6">
                {statistics.map((stat, index) => (
                  <div key={index}>
                    <div className="flex flex-col justify-center items-start gap-4">
                      <div className="flex items-baseline">
                        <span className="text-teal-600 text-5xl font-bold font-['Sora'] leading-[56.40px]">
                          {stat.number}
                        </span>
                        <span className="text-teal-600 text-2xl font-bold font-['Sora'] leading-loose">
                          {stat.unit}
                        </span>
                        {stat.number2 && (
                          <span className="text-teal-600 text-5xl font-bold font-['Sora'] leading-[56.40px]">
                            {stat.number2}
                          </span>
                        )}
                      </div>
                      <p className="text-zinc-800 text-xl font-normal font-['Sora'] leading-relaxed">
                        {stat.description}
                      </p>
                    </div>
                    {index < statistics.length - 1 && (
                      <div className="w-full h-1.5 bg-stone-50 mt-6" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}