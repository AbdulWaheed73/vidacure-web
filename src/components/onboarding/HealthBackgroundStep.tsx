import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { FormField } from "./FormField";
import { Textarea } from "./Textarea";
import { RadioGroup, RadioItem } from "./RadioGroup";
import { ActivityLevelButton } from "./ActivityLevelButton";
import { OnboardingContext, type HealthBackground } from "./types";

export const HealthBackgroundStep = () => {
  const { t } = useTranslation();
  const context = useContext(OnboardingContext);
  if (!context) return null;

  const { data, updateData } = context;
  const { healthBackground } = data;

  const handleChange = (field: keyof HealthBackground, value: string) => {
    updateData("healthBackground", { ...healthBackground, [field]: value });
  };

  // const intakeLevels = [
  //   { value: "low", label: t('onboarding.healthBackground.low') },
  //   { value: "moderate", label: t('onboarding.healthBackground.moderate') },
  //   { value: "high", label: t('onboarding.healthBackground.high') },
  // ];

  return (
    <div className="flex flex-col gap-5 sm:gap-8 w-full">
      <div className="flex flex-col gap-4">
        <label className="font-manrope font-bold text-[16px] text-[#282828]">
          {t('onboarding.healthBackground.smokingQuestion')}
        </label>
        <RadioGroup
          value={healthBackground.smokingStatus}
          onValueChange={(value) => handleChange("smokingStatus", value)}
        >
          <RadioItem
            value="yes"
            id="smoking-yes"
            checked={healthBackground.smokingStatus === "yes"}
            onChange={(value) => handleChange("smokingStatus", value)}
          >
            {t('onboarding.healthBackground.yes')}
          </RadioItem>
          <RadioItem
            value="no"
            id="smoking-no"
            checked={healthBackground.smokingStatus === "no"}
            onChange={(value) => handleChange("smokingStatus", value)}
          >
            {t('onboarding.healthBackground.no')}
          </RadioItem>
        </RadioGroup>
      </div>

      <FormField label={t('onboarding.healthBackground.smokingAlcohol')}>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-wrap">
          {[
            { value: "no", label: t('onboarding.healthBackground.no') },
            { value: "daily", label: t('onboarding.healthBackground.alcoholDaily') },
            { value: "weekly", label: t('onboarding.healthBackground.alcoholWeekly') },
            { value: "social", label: t('onboarding.healthBackground.alcoholSocialOccasional') },
          ].map((opt) => (
            <ActivityLevelButton
              key={opt.value}
              value={opt.value}
              label={opt.label}
              isSelected={healthBackground.smokingAlcoholDetails === opt.value}
              onClick={() => handleChange("smokingAlcoholDetails", opt.value)}
            />
          ))}
        </div>
      </FormField>

      <FormField label={t('onboarding.healthBackground.activityLevel')}>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <ActivityLevelButton
            value="sedentary"
            label={t('onboarding.healthBackground.sedentary')}
            isSelected={healthBackground.activityLevel === "sedentary"}
            onClick={() => handleChange("activityLevel", "sedentary")}
          />
          <ActivityLevelButton
            value="active"
            label={t('onboarding.healthBackground.active')}
            isSelected={healthBackground.activityLevel === "active"}
            onClick={() => handleChange("activityLevel", "active")}
          />
          <ActivityLevelButton
            value="very-active"
            label={t('onboarding.healthBackground.veryActive')}
            isSelected={healthBackground.activityLevel === "very-active"}
            onClick={() => handleChange("activityLevel", "very-active")}
          />
        </div>
      </FormField>

      <FormField label={t('onboarding.healthBackground.eatingHabits')}>
        <Textarea
          placeholder={t('onboarding.healthBackground.eatingHabitsPlaceholder')}
          value={healthBackground.eatingHabits}
          onChange={(e) => handleChange("eatingHabits", e.target.value)}
        />
      </FormField>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
        <FormField label={t('onboarding.healthBackground.previousWeightLoss')} className="flex-1">
          <Textarea
            placeholder={t('onboarding.healthBackground.previousWeightLossPlaceholder')}
            value={healthBackground.previousWeightLoss}
            onChange={(e) => handleChange("previousWeightLoss", e.target.value)}
          />
        </FormField>

        <FormField label={t('onboarding.healthBackground.weightLossDuration')} className="flex-1">
          <Textarea
            placeholder={t('onboarding.healthBackground.weightLossDurationPlaceholder')}
            value={healthBackground.weightLossDuration}
            onChange={(e) => handleChange("weightLossDuration", e.target.value)}
          />
        </FormField>
      </div>
    </div>
  );
};
