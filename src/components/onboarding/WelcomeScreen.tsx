import React, { useContext } from "react";
import { Button } from "./Button";
import { OnboardingContext } from "./types";

export const WelcomeScreen = () => {
  const context = useContext(OnboardingContext);
  if (!context) return null;

  const { setCurrentStep } = context;

  return (
    <div className="flex flex-col gap-8 items-center text-center">
      <div className="flex flex-col gap-4">
        <h1 className="font-sora font-bold text-[36px] text-[#282828] leading-[1.2]">
          Let's get to know you
        </h1>
        <p className="font-manrope text-[16px] text-[#282828] leading-[1.4]">
          To create your personalized weight loss plan, we need to ask a few
          questions about your goals, lifestyle, and medical history. Your
          privacy is our top priority.
        </p>
      </div>

      <div className="w-full h-px bg-[#b0b0b0] rounded-[1000px]" />

      <Button onClick={() => setCurrentStep(1)}>
        Get Started
        <span>→</span>
      </Button>

      <p className="font-manrope text-[12px] text-black text-center max-w-[302px] leading-[1.2]">
        * By continuing, you agree to our{" "}
        <span className="font-bold underline">Terms of Service</span> and{" "}
        <span className="font-bold underline">Privacy Policy</span>.
      </p>
    </div>
  );
};