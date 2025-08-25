import { Card, CardContent } from '@/components/ui/card';
import Injections from "../../assets/image13.png";
// Placeholder image - replace with your actual image import
// const Injections = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop&crop=center";

export const Obesity = () => {
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
                      Understanding obesity:{" "}
                    </span>
                    <span className="text-teal-600 text-4xl font-bold font-['Sora'] leading-10">
                      It's a complex medical condition, not a choice.
                    </span>
                  </div>
                  <div className="justify-start text-zinc-800 text-base font-normal font-['Manrope'] leading-snug">
                    For too long, the story around weight has been about willpower.
                    But modern medicine shows that obesity is a complex disease,
                    deeply influenced by your genetics, hormones, and environment.
                    We now understand the biology behind the struggle, and with that
                    understanding comes new, effective medical treatments that can
                    finally help.
                  </div>
                </div>
                
                <div className="flex justify-start items-start gap-8 w-full">
                  <Card className="flex-1 border-none shadow-none bg-transparent">
                    <CardContent className="p-0 flex flex-col justify-center items-start gap-4">
                      <div className="justify-start text-zinc-800 text-xl font-bold font-['Sora'] leading-relaxed">
                        Your Body's Biology
                      </div>
                      <div className="justify-start text-zinc-800 text-base font-normal font-['Manrope'] leading-snug">
                        Your body's natural "set point" is controlled by hormones.
                        When you diet, your body often fights back by increasing
                        hunger and slowing your metabolism, making lasting results
                        difficult on your own.
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="flex-1 border-none shadow-none bg-transparent">
                    <CardContent className="p-0 flex flex-col justify-center items-start gap-4">
                      <div className="justify-start text-zinc-800 text-xl font-bold font-['Sora'] leading-relaxed">
                        How Modern Medicine Helps
                      </div>
                      <div className="justify-start text-zinc-800 text-base font-normal font-['Manrope'] leading-snug">
                        Clinically-proven medications like GLP-1s work with your
                        body's biology. Under a doctor's guidance, they help adjust
                        your set point and reduce hunger signals, making sustainable
                        health possible.
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
                      Understanding obesity:{" "}
                    </span>
                    <span className="text-teal-600 text-2xl font-bold font-['Sora'] leading-loose">
                      It's a complex medical condition, not a choice.
                    </span>
                  </div>
                  <div className="justify-start text-zinc-800 text-base font-normal font-['Manrope'] leading-snug">
                    For too long, the story around weight has been about willpower. 
                    But modern medicine shows that obesity is a complex disease, 
                    deeply influenced by your genetics, hormones, and environment. 
                    We now understand the biology behind the struggle, and with that 
                    understanding comes new, effective medical treatments that can 
                    finally help.
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
                      Your Body's Biology
                    </div>
                    <div className="justify-start text-zinc-800 text-base font-normal font-['Manrope'] leading-snug">
                      Your body's natural "set point" is controlled by hormones. 
                      When you diet, your body often fights back by increasing 
                      hunger and slowing your metabolism, making lasting results 
                      difficult on your own.
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="w-full border-none shadow-none bg-transparent">
                  <CardContent className="p-0 flex flex-col justify-center items-start gap-4">
                    <div className="justify-start text-zinc-800 text-xl font-bold font-['Sora'] leading-relaxed">
                      How Modern Medicine Helps
                    </div>
                    <div className="justify-start text-zinc-800 text-base font-normal font-['Manrope'] leading-snug">
                      Clinically-proven medications like GLP-1s work with your 
                      body's biology. Under a doctor's guidance, they help adjust 
                      your set point and reduce hunger signals, making sustainable 
                      health possible.
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