import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants";
import { Button } from "@/components/onboarding";
import { NumericInput, FormField, Header } from "@/components/onboarding";
import { useAuthStore } from "@/stores/authStore";

const BMICheck = () => {
  const navigate = useNavigate();
  const { setAuthData } = useAuthStore();
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isEligible, setIsEligible] = useState(false);

  // Calculate BMI when height and weight are provided
  useEffect(() => {
    if (height && weight) {
      const heightInMeters = parseFloat(height) / 100; // convert cm to meters
      const weightInKg = parseFloat(weight);

      if (heightInMeters > 0 && weightInKg > 0) {
        const calculatedBmi = weightInKg / (heightInMeters * heightInMeters);
        setBmi(Math.round(calculatedBmi * 10) / 10); // round to 1 decimal place
        setIsEligible(calculatedBmi >= 27);
        setShowResult(true);
      } else {
        setBmi(null);
        setShowResult(false);
      }
    } else {
      setBmi(null);
      setShowResult(false);
    }
  }, [height, weight]);

  const handleContinue = () => {
    if (isEligible) {
      navigate(ROUTES.ONBOARDING);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      // Clear auth and redirect to login
      setAuthData({ authenticated: false });
      navigate(ROUTES.LOGIN);
    }
  };

  return (
    <div className="min-h-screen bg-[#e6f9f6]">
      <Header />

      <div className="flex items-center justify-center p-8">
        <div className="bg-white rounded-[16px] shadow-lg max-w-[600px] w-full p-12">
          <div className="flex flex-col gap-8 items-center">
            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="font-sora font-bold text-[36px] text-[#282828] leading-[1.2]">
                BMI Check
              </h1>
              <p className="font-manrope text-[16px] text-[#282828] leading-[1.5] max-w-[500px]">
                To determine your eligibility for our weight management program,
                please provide your current height and weight.
              </p>
            </div>

            {/* BMI Form */}
            <div className="w-full space-y-6 max-w-[400px]">
              <FormField label="Height">
                <div className="flex items-center gap-3">
                  <NumericInput
                    placeholder="e.g. 175"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="flex-1"
                    min={0}
                    max={300}
                  />
                  <span className="font-manrope text-[16px] text-[#282828]">cm</span>
                </div>
              </FormField>

              <FormField label="Current Weight">
                <div className="flex items-center gap-3">
                  <NumericInput
                    placeholder="e.g. 70"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="flex-1"
                    min={0}
                    max={500}
                    step={0.1}
                  />
                  <span className="font-manrope text-[16px] text-[#282828]">kg</span>
                </div>
              </FormField>

              {/* BMI Result */}
              {showResult && bmi !== null && (
                <div className={`rounded-[12px] p-6 text-center space-y-3 ${
                  isEligible
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <h3 className="font-sora font-semibold text-[20px] text-[#282828]">
                    Your BMI: {bmi}
                  </h3>

                  {isEligible ? (
                    <p className={`font-manrope text-[16px] font-medium text-green-800`}>
                      ✓ You meet the criteria for medical treatment.
                      You can continue to complete your health assessment.
                    </p>
                  ) : (
                    <p className={`font-manrope text-[16px] font-medium text-red-800`}>
                      You don't meet the criteria for medical treatment.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {showResult && (
              <div className="flex justify-center gap-4">
                {isEligible ? (
                  <Button onClick={handleContinue}>
                    Continue to Questionnaire
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                )}
              </div>
            )}

            {/* Info Text */}
            <p className="font-manrope text-[12px] text-[#666] text-center max-w-[400px] leading-[1.4]">
              BMI (Body Mass Index) is calculated as weight in kilograms
              divided by height in meters squared. A BMI of 27 or higher
              is required for our medical weight management program.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BMICheck;