import { useContext } from "react";
import { FormField } from "./FormField";
import { Input } from "./Input";
import { DatePicker } from "./DatePicker";
import { RadioGroup, RadioItem } from "./RadioGroup";
import { OnboardingContext, type PersonalInfo } from "./types";

export const PersonalInfoStep = () => {
  const context = useContext(OnboardingContext);
  if (!context) return null;

  const { data, updateData, user } = context;
  const { personalInfo } = data;

  const handleChange = (field: keyof PersonalInfo, value: string) => {
    // Prevent changing fullName if it comes from BankID
    if (field === "fullName" && user?.name && personalInfo.fullName === user.name) {
      return;
    }
    updateData("personalInfo", { ...personalInfo, [field]: value });
  };

  // Check if the name comes from BankID (readonly)
  const isNameFromBankID = user?.name && personalInfo.fullName === user.name;

  return (
    <div className="flex flex-col gap-8 w-full">
      <FormField 
        label="Full Name" 
        required
        helperText={isNameFromBankID ? "Verified with BankID" : undefined}
      >
        <Input
          placeholder="Thomas Kosmala"
          value={personalInfo.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          readOnly={!!isNameFromBankID}
          className={isNameFromBankID ? "bg-gray-50 cursor-not-allowed" : ""}
        />
      </FormField>

      <div className="flex gap-8">
        <FormField label="Date of birth" required className="flex-1">
          <DatePicker
            placeholder="Select your date of birth"
            value={personalInfo.dateOfBirth}
            onChange={(date) => handleChange("dateOfBirth", date)}
            maxDate={new Date()}
            minDate={new Date(1900, 0, 1)}
          />
        </FormField>

        <FormField label="Gender" required className="flex-1">
          <div className="p-4 border border-[#b0b0b0] rounded-[12px]">
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
                Male
              </RadioItem>
              <RadioItem
                value="female"
                id="female"
                checked={personalInfo.gender === "female"}
                onChange={(value) => handleChange("gender", value)}
              >
                Female
              </RadioItem>
            </RadioGroup>
          </div>
        </FormField>
      </div>

      <FormField label="Email" required>
        <Input
          type="email"
          placeholder="your.email@example.com"
          value={personalInfo.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
      </FormField>
    </div>
  );
};