import { useContext } from "react";
import { FormField } from "./FormField";
import { Textarea } from "./Textarea";
import { RadioGroup, RadioItem } from "./RadioGroup";
import { ActivityLevelButton } from "./ActivityLevelButton";
import { OnboardingContext, type HealthBackground } from "./types";

export const HealthBackgroundStep = () => {
  const context = useContext(OnboardingContext);
  if (!context) return null;

  const { data, updateData } = context;
  const { healthBackground } = data;

  const handleChange = (field: keyof HealthBackground, value: string) => {
    updateData("healthBackground", { ...healthBackground, [field]: value });
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-col gap-4">
        <label className="font-manrope font-bold text-[16px] text-[#282828]">
          Do you smoke or have you smoked previously?
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
            Yes
          </RadioItem>
          <RadioItem
            value="no"
            id="smoking-no"
            checked={healthBackground.smokingStatus === "no"}
            onChange={(value) => handleChange("smokingStatus", value)}
          >
            No
          </RadioItem>
        </RadioGroup>
      </div>

      <FormField label="Smoking / Alcohol Intake">
        <Textarea
          placeholder="I don't smoke or drink, I smoke occasionally, etc."
          value={healthBackground.smokingAlcoholDetails}
          onChange={(e) =>
            handleChange("smokingAlcoholDetails", e.target.value)
          }
        />
      </FormField>

      <FormField label="Physical activity">
        <Textarea
          placeholder="What activities do you do? walking etc"
          value={healthBackground.physicalActivity}
          onChange={(e) => handleChange("physicalActivity", e.target.value)}
        />
      </FormField>

      <FormField label="Activity level">
        <div className="flex gap-4">
          <ActivityLevelButton
            value="sedentary"
            label="Sedentary (little or no exercise)"
            isSelected={healthBackground.activityLevel === "sedentary"}
            onClick={() => handleChange("activityLevel", "sedentary")}
          />
          <ActivityLevelButton
            value="active"
            label="Active (light exercise 2-4 days/week)"
            isSelected={healthBackground.activityLevel === "active"}
            onClick={() => handleChange("activityLevel", "active")}
          />
          <ActivityLevelButton
            value="very-active"
            label="Very Active (hard exercise 6-7 days a week)"
            isSelected={healthBackground.activityLevel === "very-active"}
            onClick={() => handleChange("activityLevel", "very-active")}
          />
        </div>
      </FormField>

      <FormField label="Eating habits">
        <Textarea
          placeholder="Dine out everyday, fresh homemade food etc."
          value={healthBackground.eatingHabits}
          onChange={(e) => handleChange("eatingHabits", e.target.value)}
        />
      </FormField>

      <FormField label="Daily sugar intake?">
        <div className="flex gap-4">
          {["low", "moderate", "high"].map((level) => (
            <ActivityLevelButton
              key={level}
              value={level}
              label={level.charAt(0).toUpperCase() + level.slice(1)}
              isSelected={healthBackground.sugarIntake === level}
              onClick={() => handleChange("sugarIntake", level)}
            />
          ))}
        </div>
      </FormField>

      <FormField label="Carbohydrate intake?">
        <div className="flex gap-4">
          {["low", "moderate", "high"].map((level) => (
            <ActivityLevelButton
              key={level}
              value={level}
              label={level.charAt(0).toUpperCase() + level.slice(1)}
              isSelected={healthBackground.carbohydrateIntake === level}
              onClick={() => handleChange("carbohydrateIntake", level)}
            />
          ))}
        </div>
      </FormField>

      <FormField label="Processed food intake?">
        <div className="flex gap-4">
          {["low", "moderate", "high"].map((level) => (
            <ActivityLevelButton
              key={level}
              value={level}
              label={level.charAt(0).toUpperCase() + level.slice(1)}
              isSelected={healthBackground.processedFoodIntake === level}
              onClick={() => handleChange("processedFoodIntake", level)}
            />
          ))}
        </div>
      </FormField>

      <div className="flex gap-8">
        <FormField label="Previous weight loss attempts" className="flex-1">
          <Textarea
            placeholder="Results"
            value={healthBackground.previousWeightLoss}
            onChange={(e) => handleChange("previousWeightLoss", e.target.value)}
          />
        </FormField>

        <FormField label="" className="flex-1">
          <Textarea
            placeholder="How long did the results last?"
            value={healthBackground.weightLossDuration}
            onChange={(e) => handleChange("weightLossDuration", e.target.value)}
          />
        </FormField>
      </div>
    </div>
  );
};