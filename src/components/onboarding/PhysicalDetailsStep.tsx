import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FormField } from "./FormField";
import { NumericInput } from "./NumericInput";
import { OnboardingContext, type PhysicalDetails } from "./types";

export const PhysicalDetailsStep = () => {
  const { t } = useTranslation();
  const context = useContext(OnboardingContext);
  if (!context) return null;

  const { data, updateData } = context;
  const { physicalDetails } = data;

  const handleChange = (field: keyof PhysicalDetails, value: string) => {
    updateData("physicalDetails", { ...physicalDetails, [field]: value });
  };

  // Auto-compute BMI from height + current weight. BMI is a pure function of
  // the two; asking the user to enter it manually is redundant and error-prone.
  useEffect(() => {
    const heightCm = parseFloat(physicalDetails.height);
    const weightKg = parseFloat(physicalDetails.currentWeight);
    if (heightCm > 0 && weightKg > 0) {
      const heightM = heightCm / 100;
      const computed = weightKg / (heightM * heightM);
      const rounded = (Math.round(computed * 10) / 10).toString();
      if (physicalDetails.bmi !== rounded) {
        updateData("physicalDetails", { ...physicalDetails, bmi: rounded });
      }
    } else if (physicalDetails.bmi !== "") {
      updateData("physicalDetails", { ...physicalDetails, bmi: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [physicalDetails.height, physicalDetails.currentWeight]);

  return (
    <div className="flex flex-col gap-5 sm:gap-8 w-full">
      <FormField label={t('onboarding.physicalDetails.height')}>
        <div className="flex gap-2.5 items-center">
          <NumericInput
            placeholder={t('onboarding.physicalDetails.heightPlaceholder')}
            value={physicalDetails.height}
            onChange={(e) => handleChange("height", e.target.value)}
            className="flex-1"
            min={0}
            max={300}
            allowDecimal={false}
          />
          <span className="font-manrope text-[16px] text-[#282828]">{t('onboarding.physicalDetails.cm')}</span>
        </div>
      </FormField>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
        <FormField label={t('onboarding.physicalDetails.currentWeight')} className="flex-1">
          <div className="flex gap-2.5 items-center">
            <NumericInput
              placeholder={t('onboarding.physicalDetails.currentWeightPlaceholder')}
              value={physicalDetails.currentWeight}
              onChange={(e) => handleChange("currentWeight", e.target.value)}
              className="flex-1"
              min={0}
              max={500}
              allowDecimal={true}
            />
            <span className="font-manrope text-[16px] text-[#282828]">{t('onboarding.physicalDetails.kg')}</span>
          </div>
        </FormField>

        <FormField label={t('onboarding.physicalDetails.goalWeight')} className="flex-1">
          <div className="flex gap-2.5 items-center">
            <NumericInput
              placeholder={t('onboarding.physicalDetails.goalWeightPlaceholder')}
              value={physicalDetails.goalWeight}
              onChange={(e) => handleChange("goalWeight", e.target.value)}
              className="flex-1"
              min={0}
              max={500}
              allowDecimal={true}
            />
            <span className="font-manrope text-[16px] text-[#282828]">{t('onboarding.physicalDetails.kg')}</span>
          </div>
        </FormField>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
        <FormField label={t('onboarding.physicalDetails.lowestWeight')} className="flex-1">
          <div className="flex gap-2.5 items-center">
            <NumericInput
              placeholder={t('onboarding.physicalDetails.lowestWeightPlaceholder')}
              value={physicalDetails.lowestWeight}
              onChange={(e) => handleChange("lowestWeight", e.target.value)}
              className="flex-1"
              min={0}
              max={500}
              allowDecimal={true}
            />
            <span className="font-manrope text-[16px] text-[#282828]">{t('onboarding.physicalDetails.kg')}</span>
          </div>
        </FormField>

        <FormField label={t('onboarding.physicalDetails.highestWeight')} className="flex-1">
          <div className="flex gap-2.5 items-center">
            <NumericInput
              placeholder={t('onboarding.physicalDetails.highestWeightPlaceholder')}
              value={physicalDetails.highestWeight}
              onChange={(e) => handleChange("highestWeight", e.target.value)}
              className="flex-1"
              min={0}
              max={500}
              allowDecimal={true}
            />
            <span className="font-manrope text-[16px] text-[#282828]">{t('onboarding.physicalDetails.kg')}</span>
          </div>
        </FormField>
      </div>

      <FormField label={t('onboarding.physicalDetails.expectedWeightLoss')}>
        <div className="flex gap-2.5 items-center">
          <NumericInput
            placeholder={t('onboarding.physicalDetails.expectedWeightLossPlaceholder')}
            value={physicalDetails.expectedWeightLoss}
            onChange={(e) => handleChange("expectedWeightLoss", e.target.value)}
            className="flex-1"
            min={0}
            max={100}
            allowDecimal={true}
          />
          <span className="font-manrope text-[16px] text-[#282828]">{t('onboarding.physicalDetails.kg')}</span>
        </div>
      </FormField>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
        <FormField label={t('onboarding.physicalDetails.bmi')} className="flex-1">
          {/* Auto-calculated from height + current weight above — read-only
              so users can't enter a conflicting value. */}
          <input
            type="text"
            readOnly
            value={physicalDetails.bmi}
            placeholder={t('onboarding.physicalDetails.bmiPlaceholder')}
            aria-label={t('onboarding.physicalDetails.bmi')}
            className="w-full p-3 sm:p-4 border border-[#b0b0b0] rounded-[12px] font-manrope text-[14px] sm:text-[16px] bg-[#F7F9F9] text-[#666] cursor-not-allowed focus:outline-none"
          />
          <p className="mt-1.5 font-manrope text-[11px] text-[#888] leading-relaxed">
            {t('onboarding.physicalDetails.bmiAutoHint', 'Auto-calculated from your height and current weight.')}
          </p>
        </FormField>
      </div>
    </div>
  );
};
