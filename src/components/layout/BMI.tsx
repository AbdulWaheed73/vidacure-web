import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Minus, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ROUTES } from "@/constants/routes";
import { buildBmiResult, BMI_DEBOUNCE_MS } from "@/lib/bmi";

export const BMI = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [age, setAge] = useState(28);
  const [weight, setWeight] = useState(100);
  const [height, setHeight] = useState(182);
  const [result, setResult] = useState(() => buildBmiResult(182, 100));

  // Debounce the calc so dragging the height slider or holding the +/-
  // buttons doesn't recompute on every event. Same window as PreLoginBMI.
  useEffect(() => {
    const timer = setTimeout(() => {
      setResult(buildBmiResult(height, weight));
    }, BMI_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [height, weight]);

  const handleGetStarted = () => {
    navigate(ROUTES.PRE_LOGIN_BMI);
  };

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
    <div
      className="w-full px-4 sm:px-8 lg:px-14 py-12 lg:py-20 flex flex-col justify-start items-center"
      style={{ background: 'radial-gradient(81.35% 88.61% at 51.94% 50%, #008D77 0%, #005044 100%)' }}
    >
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
                    <div className="flex justify-center items-baseline gap-1">
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(Math.max(1, parseInt(e.target.value) || 1))}
                        className="text-teal-700 text-4xl font-bold font-['Sora'] bg-transparent border-none outline-none w-16 text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="text-teal-700 text-sm font-semibold font-['Sora']">
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
                    <div className="flex justify-center items-baseline gap-1">
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(Math.max(1, parseInt(e.target.value) || 1))}
                        className="text-teal-700 text-4xl font-bold font-['Sora'] bg-transparent border-none outline-none w-20 text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="text-teal-700 text-sm font-semibold font-['Sora']">
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
                  <div className="flex justify-center items-baseline gap-1">
                    <span className="text-teal-700 text-4xl font-bold font-['Sora']">
                      {height}
                    </span>
                    <span className="text-teal-700 text-sm font-semibold font-['Sora']">
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
            <div className="lg:hidden w-full flex flex-col justify-center items-center gap-4">
              {/* {t('bmi.age')} and {t('bmi.weight')} Row */}
              <div className="w-full grid grid-cols-2 gap-4">
                {/* {t('bmi.age')} Card */}
                <Card className="bg-white rounded-3xl border-none">
                  <CardContent className="p-4 sm:p-6 flex flex-col justify-center items-center gap-4 sm:gap-6">
                    <h3 className="text-zinc-800 text-lg sm:text-xl font-bold font-['Sora']">
                      {t('bmi.age')}
                    </h3>
                    <div className="flex justify-center items-baseline gap-1">
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(Math.max(1, parseInt(e.target.value) || 1))}
                        className="text-teal-700 text-3xl sm:text-4xl font-bold font-['Sora'] bg-transparent border-none outline-none w-12 sm:w-16 text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="text-teal-700 text-sm font-semibold font-['Sora']">
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
                <Card className="bg-white rounded-3xl border-none">
                  <CardContent className="p-4 sm:p-6 flex flex-col justify-center items-center gap-4 sm:gap-6">
                    <h3 className="text-zinc-800 text-lg sm:text-xl font-bold font-['Sora']">
                      {t('bmi.weight')}
                    </h3>
                    <div className="flex justify-center items-baseline gap-1">
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(Math.max(1, parseInt(e.target.value) || 1))}
                        className="text-teal-700 text-3xl sm:text-4xl font-bold font-['Sora'] bg-transparent border-none outline-none w-14 sm:w-20 text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="text-teal-700 text-sm font-semibold font-['Sora']">
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
              <Card className="w-full bg-white rounded-3xl border-none">
                <CardContent className="p-6 flex flex-col justify-center items-center gap-6">
                  <h3 className="text-zinc-800 text-xl font-bold font-['Sora']">
                    {t('bmi.height')}
                  </h3>
                  <div className="flex justify-center items-baseline gap-1">
                    <span className="text-teal-700 text-4xl font-bold font-['Sora']">
                      {height}
                    </span>
                    <span className="text-teal-700 text-sm font-semibold font-['Sora']">
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
              {result && (
                <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold font-['Sora'] text-center">
                  {t('bmi.result')} {result.display} ({t(`bmi.categories.${result.category}`)})
                </h2>
              )}
              {!result && (
                <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold font-['Sora'] text-center">
                  {t('bmi.result')}
                </h2>
              )}

              {/* Tier-based messaging — only when BMI is in a valid range. */}
              {result && (
                <p className="text-emerald-100 text-lg font-medium font-['Manrope'] text-center max-w-xl">
                  {t(`bmi.tiers.${result.tier}`)}
                </p>
              )}

              <div className="max-w-2xl text-center">
                <span className="text-emerald-50 text-base font-normal font-['Manrope'] leading-snug">
                  {t('bmi.disclaimer')}{" "}
                </span>
                <button
                  onClick={handleGetStarted}
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
