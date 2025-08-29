import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Button } from "@/components/ui/Button";

import { ArrowRight, Scale, Pill, Calendar, Smile } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Marquee } from "@/components/magicui/marquee";
import Img1 from "../../assets/first.png";
import Img2 from "../../assets/second.png";
import Img3 from "../../assets/third.png";
import Img4 from "../../assets/fourth.png";
import Img5 from "../../assets/fifth.png";
import Img6 from "../../assets/sixth.png";

const ImageCardWeb = ({ src }: { src: string }) => {
  return (
    <>
      {/* <img
        className="w-48 h-72 rounded-3xl shadow-[0px_4px_8px_0px_rgba(0,0,0,0.16)] self-stretch"
        src={src}
        alt=""
      /> */}
      <img
        className="self-stretch h-72 rounded-3xl shadow-[0px_4px_8px_0px_rgba(0,0,0,0.16)]"
        src={src}
      />
    </>
  );
};
const ImageCardApp = ({ src }: { src: string }) => {
  return (
    <>
      {/* <img
        className="w-52 h-52 rounded-3xl shadow-[0px_4px_8px_0px_rgba(0,0,0,0.16)] self-stretch"
        src={src}
        alt=""
      /> */}
      <img
        className="self-stretch h-56 rounded-[19.60px] shadow-[0px_2.799999952316284px_5.599999904632568px_0px_rgba(0,0,0,0.16)]"
        src={src}
      />
    </>
  );
};

export const HeroSection = () => {
  const { t } = useTranslation();
  
  // const images = [
  //   Img1,
  //   Img2,
  //   Img3,
  //   "https://placehold.co/200x300",
  //   "https://placehold.co/200x300",
  //   "https://placehold.co/200x300",
  // ];

  // const firstRow = images.slice(0, images.length / 2);
  // const secondRow = images.slice(images.length / 2);

  return (
    <>
      <div className="self-stretch mx-auto px-14 py-20  flex-col justify-start items-center gap-36">
        <div className="w-full max-w-[1280px] mx-auto lg:px-10 md:p-8 bg-white rounded-3xl shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] border-none">
          {/* Mobile & Tablet Layout */}
          <div className="lg:hidden flex flex-col gap-8 p-2 ">
            {/* Header Section */}
            <Card className="flex flex-col gap-8 border-none shadow-none">
              <CardHeader className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                  <CardDescription className="text-teal-700 text-base font-medium font-['Manrope'] uppercase leading-tight">
                    {t('hero.newWay')}
                  </CardDescription>
                  <CardTitle className="text-zinc-800 text-3xl md:text-4xl font-bold font-['Sora'] leading-tight md:leading-10">
                    {t('hero.title')}
                  </CardTitle>
                </div>
                <CardDescription className="text-teal-700 text-base font-normal font-['Manrope'] leading-snug">
                  {t('hero.description')}
                </CardDescription>
                <CardAction>
                  <button className="h-10 px-6 py-2.5 bg-gradient-to-r from-teal-600 to-teal-600 rounded-full inline-flex justify-center items-center gap-2.5 self-start hover:from-teal-700 hover:to-teal-700 transition-colors">
                    <span className="text-white text-sm font-semibold font-['Sora'] leading-tight">
                      {t('hero.getStarted')}
                    </span>
                  </button>
                </CardAction>
              </CardHeader>

              {/* Features Section */}
              <CardContent className="flex flex-col gap-6">
                <div className="flex flex-col gap-6">
                  <div className="flex gap-3">
                    <Scale size={32} className="text-teal-700" />
                    <div className="flex-1 text-teal-700 text-base font-normal font-['Manrope'] leading-snug">
                      {t('hero.feature1')}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Pill size={32} className="text-teal-700" />
                    <div className="flex-1 text-teal-700 text-base font-normal font-['Manrope'] leading-snug">
                      {t('hero.feature2')}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-6">
                  <div className="flex gap-3">
                    <Calendar size={32} className="text-teal-700" />
                    <div className="flex-1 text-teal-700 text-base font-normal font-['Manrope'] leading-snug">
                      {t('hero.feature3')}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Smile size={32} className="text-teal-700" />
                    <div className="flex-1 text-teal-700 text-base font-normal font-['Manrope'] leading-snug">
                      {t('hero.feature4')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Image Gallery */}
            <Card className="h-[300px] md:h-[470px]  relative flex justify-center items-center gap-4 overflow-hidden flex-row border-none shadow-none">
              <Marquee vertical className="[--duration:20s]">
                <ImageCardApp src={Img1} />
                <ImageCardApp src={Img2} />
                <ImageCardApp src={Img3} />
              </Marquee>
              <Marquee reverse vertical className="[--duration:20s]">
                <ImageCardApp src={Img4} />
                <ImageCardApp src={Img5} />
                <ImageCardApp src={Img6} />
              </Marquee>
              <div className="w-full h-20 left-0 top-0 absolute bg-gradient-to-b from-white to-white/0" />
              <div className="w-full h-20 left-0 bottom-0 absolute bg-gradient-to-b from-white/0 to-white" />
            </Card>
          </div>

          {/* Desktop Layout */}
          <Card className="hidden lg:flex lg:flex-row justify-evenly items-center h-[640px] border-none shadow-none ">
            {/* Left Content */}
            <Card className="flex-1 flex flex-col justify-between border-none shadow-none">
              <CardHeader className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                  <CardDescription className="text-teal-700 text-base font-medium font-['Manrope'] uppercase leading-tight">
                    {t('hero.newWay')}
                  </CardDescription>
                  <CardTitle className="text-zinc-800 text-5xl font-bold font-['Sora'] leading-[56.40px]">
                    {t('hero.title')}
                  </CardTitle>
                </div>
                <CardDescription className="text-teal-700 text-base font-normal font-['Manrope'] leading-snug">
                  {t('hero.description')}
                </CardDescription>
                <CardAction>
                  <button className="h-11 px-6 py-2.5 bg-gradient-to-r from-teal-600 to-teal-600 rounded-full inline-flex justify-center items-center gap-2.5 self-start hover:from-teal-700 hover:to-teal-700 transition-colors">
                    <span className="text-white text-sm font-semibold font-['Sora'] leading-tight">
                      {t('hero.getStarted')}
                    </span>
                    <ArrowRight size={16} className="text-white" />
                  </button>
                </CardAction>
              </CardHeader>

              {/* Features Grid */}
              <CardContent className="flex gap-8">
                <div className="flex-1 flex flex-col gap-14">
                  <div className="flex items-center gap-3">
                    <Scale size={32} className="text-teal-700" />
                    <div className="flex-1 text-teal-700 text-base font-normal font-['Manrope'] leading-snug">
                      {t('hero.feature1')}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Pill size={32} className="text-teal-700" />
                    <div className="flex-1 text-teal-700 text-base font-normal font-['Manrope'] leading-snug">
                      {t('hero.feature2')}
                    </div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-12">
                  <div className="flex items-center gap-3">
                    <Calendar size={32} className="text-teal-700" />
                    <div className="flex-1 text-teal-700 text-base font-normal font-['Manrope'] leading-snug">
                      {t('hero.feature3')}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Smile size={32} className="text-teal-700" />
                    <div className="flex-1 text-teal-700 text-base font-normal font-['Manrope'] leading-snug">
                      {t('hero.feature4')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right Side - Image Gallery */}
            <Card className="relative flex h-[640px] w-fit flex-row items-center justify-center overflow-hidden border-none shadow-none">
              <Marquee vertical className="[--duration:20s]">
                <ImageCardWeb src={Img1} />
                <ImageCardWeb src={Img2} />
                <ImageCardWeb src={Img3} />
              </Marquee>
              <Marquee reverse vertical className="[--duration:20s]">
                <ImageCardWeb src={Img4} />
                <ImageCardWeb src={Img5} />
                <ImageCardWeb src={Img6} />
              </Marquee>
              <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white to-white/0"></div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-white/0 to-white"></div>
            </Card>
          </Card>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
