import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ROUTES } from "@/constants";
import { Button } from "@/components/onboarding";
import { NumericInput, FormField } from "@/components/onboarding";
import { pendingSessionService } from "@/services/pendingSessionService";
import { ArrowLeft, Loader2 } from "lucide-react";

const PreLoginBMI = () => {
  const navigate = useNavigate();
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate BMI when height and weight are provided
  useEffect(() => {
    if (height && weight) {
      const heightInMeters = parseFloat(height) / 100;
      const weightInKg = parseFloat(weight);

      if (heightInMeters > 0 && weightInKg > 0) {
        const calculatedBmi = weightInKg / (heightInMeters * heightInMeters);
        setBmi(Math.round(calculatedBmi * 10) / 10);
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

  const handleContinue = async () => {
    if (!isEligible || !bmi) return;

    setIsLoading(true);
    setError(null);

    try {
      const bmiData = {
        height: parseFloat(height),
        weight: parseFloat(weight),
        bmi: bmi,
      };

      // Create pending session on server
      const response = await pendingSessionService.createPendingSession(bmiData);

      if (response.success) {
        // Store token and BMI data locally
        pendingSessionService.storeToken(response.token);
        pendingSessionService.storeBmiData(bmiData);

        // Navigate to booking page with token
        navigate(ROUTES.PRE_LOGIN_BOOKING, {
          state: { token: response.token }
        });
      } else {
        setError("Failed to create session. Please try again.");
      }
    } catch (err) {
      console.error("Error creating pending session:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'radial-gradient(81.35% 88.61% at 51.94% 50%, #008D77 0%, #005044 100%)' }}>
      {/* Simple Header */}
      <div className="p-4 sm:p-6">
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-manrope">Back to Home</span>
        </Link>
      </div>

      <div className="flex items-center justify-center px-4 pb-8">
        <div className="bg-white rounded-[24px] shadow-xl max-w-[600px] w-full p-8 sm:p-12">
          <div className="flex flex-col gap-8 items-center">
            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="font-sora font-bold text-[32px] sm:text-[40px] text-[#282828] leading-[1.2]">
                Check Your Eligibility
              </h1>
              <p className="font-manrope text-[16px] text-[#666] leading-[1.6] max-w-[450px]">
                Enter your height and weight to see if you qualify for our medical weight management program.
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
                  <span className="font-manrope text-[16px] text-[#282828] font-medium">cm</span>
                </div>
              </FormField>

              <FormField label="Current Weight">
                <div className="flex items-center gap-3">
                  <NumericInput
                    placeholder="e.g. 85"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="flex-1"
                    min={0}
                    max={500}
                    step={0.1}
                  />
                  <span className="font-manrope text-[16px] text-[#282828] font-medium">kg</span>
                </div>
              </FormField>

              {/* BMI Result */}
              {showResult && bmi !== null && (
                <div className={`rounded-[16px] p-6 text-center space-y-3 ${
                  isEligible
                    ? 'bg-green-50 border-2 border-green-200'
                    : 'bg-amber-50 border-2 border-amber-200'
                }`}>
                  <h3 className="font-sora font-bold text-[24px] text-[#282828]">
                    Your BMI: {bmi}
                  </h3>

                  {isEligible ? (
                    <div className="space-y-2">
                      <p className="font-manrope text-[16px] font-semibold text-green-700">
                        You qualify for our program!
                      </p>
                      <p className="font-manrope text-[14px] text-green-600">
                        Book a consultation with our doctors to get started.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="font-manrope text-[16px] font-semibold text-amber-700">
                        You don't meet the criteria yet.
                      </p>
                      <p className="font-manrope text-[14px] text-amber-600">
                        Our medical program requires a BMI of 27 or higher.
                        Consider consulting your regular doctor for advice.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="rounded-[12px] p-4 bg-red-50 border border-red-200">
                  <p className="font-manrope text-[14px] text-red-700 text-center">
                    {error}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {showResult && (
              <div className="flex flex-col gap-3 w-full max-w-[400px]">
                {isEligible ? (
                  <Button
                    onClick={handleContinue}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Please wait...
                      </span>
                    ) : (
                      "Book Your Consultation"
                    )}
                  </Button>
                ) : (
                  <Link to={ROUTES.HOME}>
                    <Button variant="outline" className="w-full">
                      Return to Home
                    </Button>
                  </Link>
                )}
              </div>
            )}

            {/* Info Text */}
            <p className="font-manrope text-[12px] text-[#999] text-center max-w-[400px] leading-[1.5]">
              BMI (Body Mass Index) is calculated as weight (kg) divided by height (m) squared.
              A BMI of 27 or higher is required for our medical weight management program.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreLoginBMI;
