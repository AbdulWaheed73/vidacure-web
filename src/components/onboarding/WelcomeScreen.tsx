import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "./Button";
import { OnboardingContext } from "./types";

export const WelcomeScreen = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const context = useContext(OnboardingContext);
  if (!context) return null;

  const { setCurrentStep } = context;

  return (
    <div className="flex flex-col gap-8 items-center text-center">
      <div className="flex flex-col gap-4">
        <h1 className="font-sora font-bold text-[24px] sm:text-[30px] md:text-[36px] text-[#282828] leading-[1.2]">
          {t('onboarding.welcomeTitle')}
        </h1>
        <p className="font-manrope text-[16px] text-[#282828] leading-[1.4]">
          {t('onboarding.welcomeDescription')}
        </p>
      </div>

      <div className="w-full h-px bg-[#b0b0b0] rounded-[1000px]" />

      <Button onClick={() => setCurrentStep(1)}>
        {t('onboarding.getStarted')}
        <span>→</span>
      </Button>

      <p className="font-manrope text-[12px] text-black text-center max-w-[302px] leading-[1.2]">
        * {t('onboarding.termsAgreement')}{" "}
        <span className="font-bold underline cursor-pointer" onClick={() => navigate('/privacy')}>{t('onboarding.termsOfService')}</span> {t('onboarding.and')}{" "}
        <span className="font-bold underline cursor-pointer" onClick={() => navigate('/privacy')}>{t('onboarding.privacyPolicy')}</span>.
      </p>
    </div>
  );
};
