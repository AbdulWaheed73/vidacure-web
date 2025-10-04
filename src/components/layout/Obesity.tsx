import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import Injections from "../../assets/injections.svg";
// Placeholder image - replace with your actual image import
// const Injections = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop&crop=center";

export const Obesity = () => {
  const { t } = useTranslation();
  
  return (
    <div className="w-full px-4 sm:px-8 lg:px-14 py-12 lg:py-20 flex flex-col justify-start items-center">
      <div className="w-full max-w-7xl">
        <Card className="border-none shadow-none bg-transparent">
          <CardContent className="p-0">
            {/* Desktop Layout */}
            <div className="hidden lg:flex justify-start items-center gap-12">
              {/* Text Content */}
              <div className="flex-1 py-4 flex flex-col justify-between items-start min-h-[550px]">
                <div className="flex flex-col justify-center items-start gap-4 mb-8">
                  <div className="justify-start">
                    <span className="text-zinc-800 text-4xl font-bold font-['Sora'] leading-10">
                      {t('obesity.title')}{" "}
                    </span>
                    <span className="text-teal-600 text-4xl font-bold font-['Sora'] leading-10">
                      {t('obesity.titleHighlight')}
                    </span>
                  </div>
                  <div className="justify-start text-zinc-800 text-base font-normal font-['Manrope'] leading-snug">
                    {t('obesity.description')}
                  </div>
                </div>
                
                <div className="flex justify-start items-start gap-8 w-full">
                  <Card className="flex-1 border-none shadow-none bg-transparent">
                    <CardContent className="p-0 flex flex-col justify-center items-start gap-4">
                      <div className="justify-start text-zinc-800 text-xl font-bold font-['Sora'] leading-relaxed">
                        {t('obesity.bodyBiologyTitle')}
                      </div>
                      <div className="justify-start text-zinc-800 text-base font-normal font-['Manrope'] leading-snug">
                        {t('obesity.bodyBiologyDescription')}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="flex-1 border-none shadow-none bg-transparent">
                    <CardContent className="p-0 flex flex-col justify-center items-start gap-4">
                      <div className="justify-start text-zinc-800 text-xl font-bold font-['Sora'] leading-relaxed">
                        {t('obesity.modernMedicineTitle')}
                      </div>
                      <div className="justify-start text-zinc-800 text-base font-normal font-['Manrope'] leading-snug">
                        {t('obesity.modernMedicineDescription')}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {/* Image */}
              <div className="flex-1">
                <img
                  className="w-full h-auto max-h-[550px] rounded-3xl object-cover"
                  src={Injections}
                  alt="Medical injections"
                />
              </div>
            </div>

            {/* Mobile/Tablet Layout */}
            <div className="lg:hidden py-4 flex flex-col justify-start items-start gap-8">
              <Card className="w-full border-none shadow-none bg-transparent">
                <CardContent className="p-0 flex flex-col justify-center items-start gap-4">
                  <div className="justify-start">
                    <span className="text-zinc-800 text-2xl font-bold font-['Sora'] leading-loose">
                      {t('obesity.title')}{" "}
                    </span>
                    <span className="text-teal-600 text-2xl font-bold font-['Sora'] leading-loose">
                      {t('obesity.titleHighlight')}
                    </span>
                  </div>
                  <div className="justify-start text-zinc-800 text-base font-normal font-['Manrope'] leading-snug">
                    {t('obesity.description')}
                  </div>
                </CardContent>
              </Card>
              
              <img 
                className="w-full h-96 rounded-3xl object-cover" 
                src={Injections} 
                alt="Medical injections"
              />
              
              <div className="w-full flex flex-col justify-start items-start gap-8">
                <Card className="w-full border-none shadow-none bg-transparent">
                  <CardContent className="p-0 flex flex-col justify-center items-start gap-4">
                    <div className="justify-start text-zinc-800 text-xl font-bold font-['Sora'] leading-relaxed">
                      {t('obesity.bodyBiologyTitle')}
                    </div>
                    <div className="justify-start text-zinc-800 text-base font-normal font-['Manrope'] leading-snug">
                      {t('obesity.bodyBiologyDescription')}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="w-full border-none shadow-none bg-transparent">
                  <CardContent className="p-0 flex flex-col justify-center items-start gap-4">
                    <div className="justify-start text-zinc-800 text-xl font-bold font-['Sora'] leading-relaxed">
                      {t('obesity.modernMedicineTitle')}
                    </div>
                    <div className="justify-start text-zinc-800 text-base font-normal font-['Manrope'] leading-snug">
                      {t('obesity.modernMedicineDescription')}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};