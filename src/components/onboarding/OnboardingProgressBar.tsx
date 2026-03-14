import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { OnboardingProgressBarProps } from "../../types";

export const OnboardingProgressBar = ({
  currentStep,
}: OnboardingProgressBarProps) => {
  const steps = [
    { number: 1, label: "Your Info" },
    { number: 2, label: "Physical Details" },
    { number: 3, label: "Goals & Lifestyle" },
    { number: 4, label: "Medical History" },
  ];

  const progressPercent = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="w-full py-2">
      <div className="relative flex items-start justify-between">
        {/* Background track — vertically centered on circles */}
        <div className="absolute left-0 right-0 top-[16px] sm:top-[18px] h-[3px] bg-[#e0e0e0] rounded-full" />

        {/* Animated fill track */}
        <motion.div
          className="absolute left-0 top-[16px] sm:top-[18px] h-[3px] bg-[#00a38a] rounded-full origin-left"
          initial={false}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {/* Each step: circle + label as one unit */}
        {steps.map((step) => {
          const isCompleted = currentStep > step.number;
          const isActive = currentStep === step.number;

          return (
            <div
              key={step.number}
              className="relative z-10 flex flex-col items-center w-16 sm:w-20"
            >
              <motion.div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                  isCompleted
                    ? "bg-[#00a38a] border-[#00a38a] text-white"
                    : isActive
                    ? "bg-[#00a38a] border-[#00a38a] text-white shadow-[0_0_0_4px_rgba(0,163,138,0.15)]"
                    : "bg-white border-[#d0d0d0] text-[#b0b0b0]"
                }`}
                initial={false}
                animate={{ scale: isActive ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <Check className="w-4 h-4" strokeWidth={3} />
                  </motion.div>
                ) : (
                  <span className="font-sora font-semibold text-[12px] sm:text-[13px]">
                    {step.number}
                  </span>
                )}
              </motion.div>

              <span
                className={`mt-1.5 sm:mt-2 font-sora text-[10px] sm:text-[11px] text-center leading-tight ${
                  currentStep >= step.number
                    ? "font-semibold text-[#00a38a]"
                    : "font-medium text-[#b0b0b0]"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
