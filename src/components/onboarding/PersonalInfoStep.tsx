import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FormField } from "./FormField";
import { Input } from "./Input";
import { RadioGroup, RadioItem } from "./RadioGroup";
import { OnboardingContext, type PersonalInfo } from "./types";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "w-full p-3 sm:p-4 border border-[#b0b0b0] rounded-[12px] font-manrope text-[14px] sm:text-[16px] bg-white text-left flex items-center justify-between gap-2 focus:outline-none focus:ring-2 focus:ring-[#005044]",
                  !personalInfo.dateOfBirth && "text-[#999]"
                )}
              >
                <span>
                  {personalInfo.dateOfBirth
                    ? format(new Date(personalInfo.dateOfBirth), "yyyy-MM-dd")
                    : t('onboarding.personalInfo.dateOfBirthPlaceholder')}
                </span>
                <CalendarIcon className="h-4 w-4 shrink-0 text-[#666]" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={personalInfo.dateOfBirth ? new Date(personalInfo.dateOfBirth) : undefined}
                onSelect={(date) =>
                  handleChange("dateOfBirth", date ? format(date, "yyyy-MM-dd") : "")
                }
                captionLayout="dropdown"
                disabled={(date) => date > new Date() || date < new Date(1900, 0, 1)}
                defaultMonth={personalInfo.dateOfBirth ? new Date(personalInfo.dateOfBirth) : new Date(2000, 0, 1)}
                startMonth={new Date(1900, 0, 1)}
                endMonth={new Date()}
              />
            </PopoverContent>
          </Popover>
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
