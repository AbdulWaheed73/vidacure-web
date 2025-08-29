import { useContext } from "react";
import { FormField } from "./FormField";
import { NumericInput } from "./NumericInput";
import { OnboardingContext, type PhysicalDetails } from "./types";

export const PhysicalDetailsStep = () => {
  const context = useContext(OnboardingContext);
  if (!context) return null;

  const { data, updateData } = context;
  const { physicalDetails } = data;

  const handleChange = (field: keyof PhysicalDetails, value: string) => {
    updateData("physicalDetails", { ...physicalDetails, [field]: value });
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <FormField label="Height">
        <div className="flex gap-2.5 items-center">
          <NumericInput
            placeholder="e.g. 175"
            value={physicalDetails.height}
            onChange={(e) => handleChange("height", e.target.value)}
            className="flex-1"
            min={0}
            max={300}
            allowDecimal={false}
          />
          <span className="font-manrope text-[16px] text-[#282828]">cm</span>
        </div>
      </FormField>

      <div className="flex gap-8">
        <FormField label="Current Weight" className="flex-1">
          <div className="flex gap-2.5 items-center">
            <NumericInput
              placeholder="e.g. 70"
              value={physicalDetails.currentWeight}
              onChange={(e) => handleChange("currentWeight", e.target.value)}
              className="flex-1"
              min={0}
              max={500}
              allowDecimal={true}
            />
            <span className="font-manrope text-[16px] text-[#282828]">kg</span>
          </div>
        </FormField>

        <FormField label="Goal Weight" className="flex-1">
          <div className="flex gap-2.5 items-center">
            <NumericInput
              placeholder="e.g. 65"
              value={physicalDetails.goalWeight}
              onChange={(e) => handleChange("goalWeight", e.target.value)}
              className="flex-1"
              min={0}
              max={500}
              allowDecimal={true}
            />
            <span className="font-manrope text-[16px] text-[#282828]">kg</span>
          </div>
        </FormField>
      </div>

      <div className="flex gap-8">
        <FormField label="Lowest weight in the past" className="flex-1">
          <div className="flex gap-2.5 items-center">
            <NumericInput
              placeholder="e.g. 60"
              value={physicalDetails.lowestWeight}
              onChange={(e) => handleChange("lowestWeight", e.target.value)}
              className="flex-1"
              min={0}
              max={500}
              allowDecimal={true}
            />
            <span className="font-manrope text-[16px] text-[#282828]">kg</span>
          </div>
        </FormField>

        <FormField label="Highest weight in the past" className="flex-1">
          <div className="flex gap-2.5 items-center">
            <NumericInput
              placeholder="e.g. 80"
              value={physicalDetails.highestWeight}
              onChange={(e) => handleChange("highestWeight", e.target.value)}
              className="flex-1"
              min={0}
              max={500}
              allowDecimal={true}
            />
            <span className="font-manrope text-[16px] text-[#282828]">kg</span>
          </div>
        </FormField>
      </div>

      <FormField label="Expected weight loss with treatment">
        <div className="flex gap-2.5 items-center">
          <NumericInput
            placeholder="e.g. 10"
            value={physicalDetails.expectedWeightLoss}
            onChange={(e) => handleChange("expectedWeightLoss", e.target.value)}
            className="flex-1"
            min={0}
            max={100}
            allowDecimal={true}
          />
          <span className="font-manrope text-[16px] text-[#282828]">kg</span>
        </div>
      </FormField>

      <div className="flex gap-8">
        <FormField label="Waist circumference" className="flex-1">
          <div className="flex gap-2.5 items-center">
            <NumericInput
              placeholder="e.g. 90"
              value={physicalDetails.waistCircumference}
              onChange={(e) =>
                handleChange("waistCircumference", e.target.value)
              }
              className="flex-1"
              min={0}
              max={300}
              allowDecimal={false}
            />
            <span className="font-manrope text-[16px] text-[#282828]">cm</span>
          </div>
        </FormField>

        <FormField label="BMI" className="flex-1">
          <NumericInput
            placeholder="e.g. 24.5"
            value={physicalDetails.bmi}
            onChange={(e) => handleChange("bmi", e.target.value)}
            min={0}
            max={100}
            allowDecimal={true}
          />
        </FormField>
      </div>
    </div>
  );
};