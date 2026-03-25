import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { FormField } from "./FormField";
import { Textarea } from "./Textarea";
import { Checkbox } from "./Checkbox";
import { OnboardingContext, type MedicalHistory } from "./types";

export const MedicalHistoryStep = () => {
  const { t } = useTranslation();
  const context = useContext(OnboardingContext);
  if (!context) return null;

  const { data, updateData } = context;
  const { medicalHistory } = data;

  const handleChange = (
    field: keyof MedicalHistory,
    value: string | string[]
  ) => {
    updateData("medicalHistory", { ...medicalHistory, [field]: value });
  };

  const handleConditionChange = (condition: string, checked: boolean) => {
    const currentConditions = medicalHistory.conditions || [];
    if (checked) {
      handleChange("conditions", [...currentConditions, condition]);
    } else {
      handleChange(
        "conditions",
        currentConditions.filter((c) => c !== condition)
      );
    }
  };

  const handleFamilyHistoryChange = (condition: string, checked: boolean) => {
    const currentHistory = medicalHistory.familyHistory || [];
    if (checked) {
      handleChange("familyHistory", [...currentHistory, condition]);
    } else {
      handleChange(
        "familyHistory",
        currentHistory.filter((c) => c !== condition)
      );
    }
  };

  const conditions = [
    { key: "diabetes", label: t('onboarding.medicalHistory.conditions.diabetes') },
    { key: "highBloodPressure", label: t('onboarding.medicalHistory.conditions.highBloodPressure') },
    { key: "highCholesterol", label: t('onboarding.medicalHistory.conditions.highCholesterol') },
    { key: "thyroid", label: t('onboarding.medicalHistory.conditions.thyroid') },
    { key: "pcos", label: t('onboarding.medicalHistory.conditions.pcos') },
    { key: "none", label: t('onboarding.medicalHistory.conditions.none') },
  ];

  const familyConditions = [
    { key: "diabetes", label: t('onboarding.medicalHistory.familyConditions.diabetes') },
    { key: "heartDisease", label: t('onboarding.medicalHistory.familyConditions.heartDisease') },
    { key: "highBloodPressure", label: t('onboarding.medicalHistory.familyConditions.highBloodPressure') },
    { key: "obesity", label: t('onboarding.medicalHistory.familyConditions.obesity') },
    { key: "cancer", label: t('onboarding.medicalHistory.familyConditions.cancer') },
    { key: "none", label: t('onboarding.medicalHistory.familyConditions.none') },
  ];

  return (
    <div className="flex flex-col gap-5 sm:gap-8 w-full">
      <FormField label={t('onboarding.medicalHistory.illnesses')}>
        <Textarea
          placeholder={t('onboarding.medicalHistory.illnessesPlaceholder')}
          value={medicalHistory.illnesses}
          onChange={(e) => handleChange("illnesses", e.target.value)}
        />
      </FormField>

      <FormField label={t('onboarding.medicalHistory.medications')}>
        <Textarea
          placeholder={t('onboarding.medicalHistory.medicationsPlaceholder')}
          value={medicalHistory.medications}
          onChange={(e) => handleChange("medications", e.target.value)}
        />
      </FormField>

      <FormField label={t('onboarding.medicalHistory.conditionsLabel')}>
        <div className="border border-[#b0b0b0] rounded-[12px] p-4 sm:p-6">
          <div className="flex flex-col gap-3.5">
            {conditions.map((condition) => (
              <Checkbox
                key={condition.key}
                id={condition.key}
                checked={
                  medicalHistory.conditions?.includes(condition.key) || false
                }
                onCheckedChange={(checked) =>
                  handleConditionChange(condition.key, checked)
                }
              >
                {condition.label}
              </Checkbox>
            ))}
          </div>
        </div>
      </FormField>

      <FormField label={t('onboarding.medicalHistory.familyHistoryLabel')}>
        <div className="border border-[#b0b0b0] rounded-[12px] p-4 sm:p-6">
          <div className="flex flex-col gap-3.5">
            {familyConditions.map((condition) => (
              <Checkbox
                key={condition.key}
                id={`family-${condition.key}`}
                checked={
                  medicalHistory.familyHistory?.includes(condition.key) || false
                }
                onCheckedChange={(checked) =>
                  handleFamilyHistoryChange(condition.key, checked)
                }
              >
                {condition.label}
              </Checkbox>
            ))}
          </div>
        </div>
      </FormField>
    </div>
  );
};
