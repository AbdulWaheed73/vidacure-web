import { Card, CardContent } from '@/components/ui/card';
import { Smartphone, ArrowRight } from 'lucide-react';
import Phones from "../../assets/phones.svg";

export default function Partner() {
  return (
    <div className="w-full px-4 sm:px-8 md:px-14 py-12 md:py-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-16 xl:gap-36">
          {/* Content Section */}
          <div className="flex-1 max-w-2xl lg:max-w-none">
            <Card className="border-0 shadow-none bg-transparent">
              <CardContent className="p-0 space-y-6 md:space-y-8">
                {/* Heading */}
                <div className="space-y-4">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Sora'] leading-tight">
                    <span className="text-zinc-800">Your</span>
                    <span className="text-teal-600"> Swedish Health Partner</span>
                  </h1>
                </div>
                
                {/* Description */}
                <div className="max-w-lg lg:max-w-[510px]">
                  <p className="text-zinc-800 text-sm sm:text-base font-normal font-['Manrope'] leading-relaxed">
                    We were founded in Stockholm by a team of dedicated doctors and
                    specialists who saw a need for a more modern, accessible, and
                    empathetic approach to obesity care. Our mission is simple: to
                    provide safe, effective, and science-backed medical treatment to
                    help our patients live healthier, fuller lives. Your health and
                    privacy are our highest priorities.
                  </p>
                </div>
                
                {/* CTA Button */}
                <button className="inline-flex items-center gap-2.5 px-6 py-2.5 bg-gradient-to-r from-teal-600 to-teal-600 rounded-full transition-all duration-200 hover:from-teal-700 hover:to-teal-700 hover:scale-105">
                  <span className="text-white text-sm font-semibold font-['Sora'] leading-tight">
                    Find Out More
                  </span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </CardContent>
            </Card>
          </div>
          
          {/* Image Section */}
          <div className="flex-1 max-w-md lg:max-w-[576px] w-full">
            <Card className="bg-transparent border-none shadow-none">
              <CardContent className="p-8 md:p-16 flex flex-col items-center justify-center space-y-8">
                <img src={Phones} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}