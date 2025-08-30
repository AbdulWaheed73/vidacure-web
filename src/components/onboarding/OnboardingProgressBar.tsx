import { Progress } from "@/components/ui/progress";
import type { OnboardingProgressBarProps } from '../../types';


export const OnboardingProgressBar = ({ currentStep }: OnboardingProgressBarProps) => {
  const steps = [
    { number: 1, label: "Your Info" },
    { number: 2, label: "Physical Details" },
    { number: 3, label: "Goals & Lifestyle" },
    { number: 4, label: "Medical History" },
  ];

  const progressValue = (currentStep / 4) * 100;

  return (
    <div className="flex flex-col gap-2.5 items-center justify-center p-8 w-full">
      <div className="relative w-full">
        {/* Using shadcn Progress component */}
        <Progress 
          value={progressValue} 
          className="w-full h-1.5 bg-[#b0b0b0]"
        />

        {/* Step indicators */}
        {steps.map((step, index) => (
          <div
            key={step.number}
            className="absolute flex flex-col gap-2 items-center justify-start w-12"
            style={{
              left: `${(index / 3) * 100}%`,
              transform: "translateX(-50%)",
              top: "-13px",
            }}
          >
            <div
              className={`w-[30px] h-[30px] rounded-full flex items-center justify-center border-2 ${
                currentStep >= step.number
                  ? "bg-[#00a38a] border-[#00a38a] text-white"
                  : "bg-white border-[#b0b0b0] text-[#b0b0b0]"
              }`}
            >
              <span className="font-sora font-semibold text-[14px]">
                {step.number}
              </span>
            </div>
            <span
              className={`font-sora font-semibold text-[14px] text-center whitespace-nowrap ${
                currentStep >= step.number ? "text-[#00a38a]" : "text-[#b0b0b0]"
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};