import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { FormField } from "./FormField";
import { Input } from "./Input";
import { DatePicker } from "./DatePicker";
import { RadioGroup, RadioItem } from "./RadioGroup";
import { OnboardingContext, type PersonalInfo } from "./types";

export const PersonalInfoStep = () => {
  const { t } = useTranslation();
  const context = useContext(OnboardingContext);
  if (!context) return null;

  const { data, updateData, user } = context;
  const { personalInfo } = data;

  const handleChange = (field: keyof PersonalInfo, value: string) => {
    if (field === "fullName" && user?.name && personalInfo.fullName === user.name) {
      return;
    }
    updateData("personalInfo", { ...personalInfo, [field]: value });
  };

  const isNameFromBankID = user?.name && personalInfo.fullName === user.name;

  return (
    <div className="flex flex-col gap-5 sm:gap-8 w-full">
      <FormField
        label={t('onboarding.personalInfo.fullName')}
        required
        helperText={isNameFromBankID ? t('onboarding.personalInfo.verifiedWithBankID') : undefined}
      >
        <Input
          placeholder={t('onboarding.personalInfo.fullNamePlaceholder')}
          value={personalInfo.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          readOnly={!!isNameFromBankID}
          className={isNameFromBankID ? "bg-gray-50 cursor-not-allowed" : ""}
        />
      </FormField>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
        <FormField label={t('onboarding.personalInfo.dateOfBirth')} required className="flex-1">
          <DatePicker
            placeholder={t('onboarding.personalInfo.dateOfBirthPlaceholder')}
            value={personalInfo.dateOfBirth}
            onChange={(date) => handleChange("dateOfBirth", date)}
            maxDate={new Date()}
            minDate={new Date(1900, 0, 1)}
          />
        </FormField>

        <FormField label={t('onboarding.personalInfo.gender')} required className="flex-1">
          <div className="p-3 sm:p-4 border border-[#b0b0b0] rounded-[12px]">
            <RadioGroup
              value={personalInfo.gender}
              onValueChange={(value) => handleChange("gender", value)}
            >
              <RadioItem
                value="male"
                id="male"
                checked={personalInfo.gender === "male"}
                onChange={(value) => handleChange("gender", value)}
              >
                {t('onboarding.personalInfo.male')}
              </RadioItem>
              <RadioItem
                value="female"
                id="female"
                checked={personalInfo.gender === "female"}
                onChange={(value) => handleChange("gender", value)}
              >
                {t('onboarding.personalInfo.female')}
              </RadioItem>
            </RadioGroup>
          </div>
        </FormField>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
        <FormField label={t('onboarding.personalInfo.email')} required className="flex-1">
          <Input
            type="email"
            placeholder={t('onboarding.personalInfo.emailPlaceholder')}
            value={personalInfo.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </FormField>

        <FormField label={t('onboarding.personalInfo.phone')} required className="flex-1">
          <Input
            type="tel"
            placeholder={t('onboarding.personalInfo.phonePlaceholder')}
            value={personalInfo.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </FormField>
      </div>
    </div>
  );
};
