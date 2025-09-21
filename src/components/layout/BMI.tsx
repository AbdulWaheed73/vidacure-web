import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Minus, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants";

export const BMI = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [age, setAge] = useState(28);
  const [weight, setWeight] = useState(175);
  const [height, setHeight] = useState(182);

  // Calculate BMI
  const calculateBMI = () => {
    const heightInMeters = height / 100;
    const bmi = (weight * 0.453592) / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return t("bmi.categories.underweight");
    if (bmi < 25) return t("bmi.categories.normal");
    if (bmi < 30) return t("bmi.categories.overweight");
    return t("bmi.categories.obese");
  };

  const bmi = calculateBMI();
  const category = getBMICategory(parseFloat(bmi));

  const adjustValue = (type: string, operation: string) => {
    if (type === "age") {
      setAge((prev) =>
        operation === "increment" ? prev + 1 : Math.max(1, prev - 1)
      );
    } else if (type === "weight") {
      setWeight((prev) =>
        operation === "increment" ? prev + 1 : Math.max(1, prev - 1)
      );
    }
  };

  //   const heightPercentage = Math.min((height - 100) / 150 * 100, 100);

  return (
    <div className="w-full px-4 sm:px-8 lg:px-14 py-12 lg:py-20 bg-gradient-to-br from-teal-600 to-teal-900 flex flex-col justify-start items-center">
      <div className="w-full max-w-6xl">
        <Card className="p-6 sm:p-8 lg:p-14 rounded-3xl bg-transparent border-none shadow-none">
          <CardContent className="p-0 flex flex-col justify-center items-center gap-8">
            {/* Title */}
            <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold font-['Sora'] text-center leading-tight">
              {t('bmi.title')}
            </h1>

            {/* Desktop Layout */}
            <div className="hidden lg:flex w-full justify-start items-center gap-10">
              {/* {t('bmi.age')} and {t('bmi.weight')} Cards */}
              <div className="flex-1 flex justify-start items-center gap-10">
                {/* {t('bmi.age')} Card */}
                <Card className="flex-1 bg-white rounded-3xl border-none">
                  <CardContent className="p-8 flex flex-col justify-center items-center gap-8">
                    <h3 className="text-zinc-800 text-xl font-bold font-['Sora']">
                      {t('bmi.age')}
                    </h3>
                    <div className="relative flex justify-center items-center gap-4">
                      <span className="text-teal-700 text-4xl font-bold font-['Sora']">
                        {age}
                      </span>
                      <span className="absolute left-full ml-2 top-3 text-teal-700 text-sm font-semibold font-['Sora']">
                        {t('bmi.ageUnit')}
                      </span>
                    </div>
                    <div className="flex justify-center items-center gap-8">
                      <button
                        onClick={() => adjustValue("age", "decrement")}
                        className="w-8 h-8 bg-teal-700 rounded-full flex items-center justify-center hover:bg-teal-800 transition-colors"
                      >
                        <Minus className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={() => adjustValue("age", "increment")}
                        className="w-8 h-8 bg-teal-700 rounded-full flex items-center justify-center hover:bg-teal-800 transition-colors"
                      >
                        <Plus className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </CardContent>
                </Card>

                {/* {t('bmi.weight')} Card */}
                <Card className="flex-1 bg-white rounded-3xl border-none">
                  <CardContent className="p-8 flex flex-col justify-center items-center gap-8">
                    <h3 className="text-zinc-800 text-xl font-bold font-['Sora']">
                      {t('bmi.weight')}
                    </h3>
                    <div className="relative flex justify-center items-center gap-4">
                      <span className="text-teal-700 text-4xl font-bold font-['Sora']">
                        {weight}
                      </span>
                      <span className="absolute left-full ml-2 top-3 text-teal-700 text-sm font-semibold font-['Sora']">
                        {t('bmi.weightUnit')}
                      </span>
                    </div>
                    <div className="flex justify-center items-center gap-8">
                      <button
                        onClick={() => adjustValue("weight", "decrement")}
                        className="w-8 h-8 bg-teal-700 rounded-full flex items-center justify-center hover:bg-teal-800 transition-colors"
                      >
                        <Minus className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={() => adjustValue("weight", "increment")}
                        className="w-8 h-8 bg-teal-700 rounded-full flex items-center justify-center hover:bg-teal-800 transition-colors"
                      >
                        <Plus className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* {t('bmi.height')} Card */}
              <Card className="flex-1 bg-white rounded-3xl border-none">
                <CardContent className="p-8 flex flex-col justify-center items-center gap-8">
                  <h3 className="text-zinc-800 text-xl font-bold font-['Sora']">
                    {t('bmi.height')}
                  </h3>
                  <div className="relative flex justify-center items-center gap-4">
                    <span className="text-teal-700 text-4xl font-bold font-['Sora']">
                      {height}
                    </span>
                    <span className="absolute left-full ml-2 top-3 text-teal-700 text-sm font-semibold font-['Sora']">
                      {t('bmi.heightUnit')}
                    </span>
                  </div>
                  <div className="w-full px-2">
                    <Slider
                      value={[height]}
                      onValueChange={(value) => setHeight(value[0])}
                      min={100}
                      max={250}
                      step={1}
                      className="
      [&_[data-slot=slider-track]]:bg-[#FBF7F4]
      [&_[data-slot=slider]]:h-3.5
      [&_[data-slot=slider-range]]:bg-teal-800
      [&_[data-slot=slider-range]]:h-7
      [&_[data-slot=slider-thumb]]:bg-[#00A38A]
      [&_[data-slot=slider-thumb]]:border-0

      [&_[data-slot=slider-thumb]]:size-6
      transition-all
    "
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden w-full max-w-sm flex flex-col justify-center items-start gap-4">
              {/* {t('bmi.age')} and {t('bmi.weight')} Row */}
              <div className="w-full flex justify-start items-center gap-4">
                {/* {t('bmi.age')} Card */}
                <Card className="flex-1 bg-white rounded-3xl border-none">
                  <CardContent className="p-6 flex flex-col justify-center items-center gap-6">
                    <h3 className="text-zinc-800 text-xl font-bold font-['Sora']">
                      {t('bmi.age')}
                    </h3>
                    <div className="w-full flex justify-center items-start gap-2">
                      <div className="flex-1 flex justify-end items-center">
                        <span className="text-teal-700 text-4xl font-bold font-['Sora']">
                          {age}
                        </span>
                      </div>
                      <div className="w-10 flex justify-start items-center">
                        <span className="text-teal-700 text-sm font-semibold font-['Sora']">
                          {t('bmi.ageUnit')}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-center items-center gap-8">
                      <button
                        onClick={() => adjustValue("age", "decrement")}
                        className="w-8 h-8 bg-teal-700 rounded-full flex items-center justify-center hover:bg-teal-800 transition-colors"
                      >
                        <Minus className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={() => adjustValue("age", "increment")}
                        className="w-8 h-8 bg-teal-700 rounded-full flex items-center justify-center hover:bg-teal-800 transition-colors"
                      >
                        <Plus className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </CardContent>
                </Card>

                {/* {t('bmi.weight')} Card */}
                <Card className="flex-1 bg-white rounded-3xl border-none">
                  <CardContent className="p-6 flex flex-col justify-center items-center gap-6">
                    <h3 className="text-zinc-800 text-xl font-bold font-['Sora']">
                      {t('bmi.weight')}
                    </h3>
                    <div className="w-full flex justify-center items-start gap-2">
                      <div className="flex-1 flex justify-end items-center">
                        <span className="text-teal-700 text-4xl font-bold font-['Sora']">
                          {weight}
                        </span>
                      </div>
                      <div className="w-10 flex justify-start items-center">
                        <span className="text-teal-700 text-sm font-semibold font-['Sora']">
                          {t('bmi.weightUnit')}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-center items-center gap-8">
                      <button
                        onClick={() => adjustValue("weight", "decrement")}
                        className="w-8 h-8 bg-teal-700 rounded-full flex items-center justify-center hover:bg-teal-800 transition-colors"
                      >
                        <Minus className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={() => adjustValue("weight", "increment")}
                        className="w-8 h-8 bg-teal-700 rounded-full flex items-center justify-center hover:bg-teal-800 transition-colors"
                      >
                        <Plus className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* {t('bmi.height')} Card */}
              <Card className="w-full bg-white rounded-3xl border-none">
                <CardContent className="p-6 flex flex-col justify-center items-center gap-6">
                  <h3 className="text-zinc-800 text-xl font-bold font-['Sora']">
                    {t('bmi.height')}
                  </h3>
                  <div className="relative flex justify-center items-center gap-4">
                    <span className="text-teal-700 text-4xl font-bold font-['Sora']">
                      {height}
                    </span>
                    <span className="absolute left-full ml-2 top-3 text-teal-700 text-sm font-semibold font-['Sora']">
                      {t('bmi.heightUnit')}
                    </span>
                  </div>
                  <div className="w-full px-2">
                    <Slider
                      value={[height]}
                      onValueChange={(value) => setHeight(value[0])}
                      min={100}
                      max={250}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* BMI Result */}
            <div className="pt-4 flex flex-col justify-start items-center gap-4">
              <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold font-['Sora'] text-center">
                {t('bmi.result')} {bmi} ({category})
              </h2>
              <div className="max-w-2xl text-center">
                <span className="text-emerald-50 text-base font-normal font-['Manrope'] leading-snug">
                  {t('bmi.disclaimer')}{" "}
                </span>
                <button
                  onClick={() => navigate(ROUTES.LOGIN)}
                  className="text-emerald-50 text-base font-bold font-['Manrope'] underline leading-snug hover:text-white transition-colors"
                >
                  {t('bmi.ctaButton')}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BMI;
