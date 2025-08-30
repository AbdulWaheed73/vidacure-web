import { useContext } from "react";
import { FormField } from "./FormField";
import { Textarea } from "./Textarea";
import { Checkbox } from "./Checkbox";
import { OnboardingContext, type MedicalHistory } from "./types";

export const MedicalHistoryStep = () => {
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
    "Diabetes / Pre-diabetes",
    "High Blood Pressure",
    "High Cholesterol",
    "Thyroid Issues",
    "PCOS (Polycystic Ovary Syndrome)",
    "None of the above",
  ];

  const familyConditions = [
    "Diabetes",
    "Heart Disease",
    "High Blood Pressure",
    "Obesity",
    "Cancer",
    "None of the above",
  ];

  return (
    <div className="flex flex-col gap-8 w-full">
      <FormField label="Please list your previous or current illnesses">
        <Textarea
          placeholder="Please list all illnesses you have"
          value={medicalHistory.illnesses}
          onChange={(e) => handleChange("illnesses", e.target.value)}
        />
      </FormField>

      <FormField label="Are you currently taking any medications?">
        <Textarea
          placeholder="Please list all medications and dosages, e.g., Metformin 500mg"
          value={medicalHistory.medications}
          onChange={(e) => handleChange("medications", e.target.value)}
        />
      </FormField>

      <FormField label="Do you have any of the following conditions? (Select all that apply)">
        <div className="border border-[#b0b0b0] rounded-[12px] p-6">
          <div className="flex flex-col gap-3.5">
            {conditions.map((condition) => (
              <Checkbox
                key={condition}
                id={condition}
                checked={
                  medicalHistory.conditions?.includes(condition) || false
                }
                onCheckedChange={(checked) =>
                  handleConditionChange(condition, checked)
                }
              >
                {condition}
              </Checkbox>
            ))}
          </div>
        </div>
      </FormField>

      <FormField label="Do any of your close family members have">
        <div className="border border-[#b0b0b0] rounded-[12px] p-6">
          <div className="flex flex-col gap-3.5">
            {familyConditions.map((condition) => (
              <Checkbox
                key={condition}
                id={`family-${condition}`}
                checked={
                  medicalHistory.familyHistory?.includes(condition) || false
                }
                onCheckedChange={(checked) =>
                  handleFamilyHistoryChange(condition, checked)
                }
              >
                {condition}
              </Checkbox>
            ))}
          </div>
        </div>
      </FormField>
    </div>
  );
};