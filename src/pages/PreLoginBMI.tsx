import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ROUTES } from "@/constants";
import { Button } from "@/components/onboarding";
import { NumericInput, FormField } from "@/components/onboarding";
import { pendingSessionService } from "@/services/pendingSessionService";
import { ArrowLeft, Loader2 } from "lucide-react";

const PreLoginBMI = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [eligibilityStatus, setEligibilityStatus] = useState<'not_eligible' | 'conditional' | 'eligible'>('not_eligible');
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

        if (calculatedBmi >= 30) {
          setEligibilityStatus('eligible');
        } else if (calculatedBmi >= 27) {
          setEligibilityStatus('conditional');
        } else {
          setEligibilityStatus('not_eligible');
        }
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
    if (eligibilityStatus === 'not_eligible' || !bmi) return;

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
        setError(t('preLoginBMI.errors.sessionFailed'));
      }
    } catch (err: unknown) {
      console.error("Error creating pending session:", err);

      // Extract actual error message from axios error response
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { error?: string }, status?: number } };
        const serverError = axiosError.response?.data?.error;
        const status = axiosError.response?.status;

        if (status === 429) {
          setError(t('preLoginBMI.errors.rateLimited', 'Too many requests. Please wait a few minutes and try again.'));
        } else if (serverError) {
          setError(serverError);
        } else {
          setError(t('preLoginBMI.errors.genericError'));
        }
      } else {
        setError(t('preLoginBMI.errors.genericError'));
      }
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
          <span className="font-manrope">{t('preLoginBMI.backToHome')}</span>
        </Link>
      </div>

      <div className="flex items-center justify-center px-4 pb-8">
        <div className="bg-white rounded-[24px] shadow-xl max-w-[600px] w-full p-8 sm:p-12">
          <div className="flex flex-col gap-8 items-center">
            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="font-sora font-bold text-[32px] sm:text-[40px] text-[#282828] leading-[1.2]">
                {t('preLoginBMI.title')}
              </h1>
              <p className="font-manrope text-[16px] text-[#666] leading-[1.6] max-w-[450px]">
                {t('preLoginBMI.description')}
              </p>
            </div>

            {/* BMI Form */}
            <div className="w-full space-y-6 max-w-[400px]">
              <FormField label={t('preLoginBMI.height')}>
                <div className="flex items-center gap-3">
                  <NumericInput
                    placeholder={t('preLoginBMI.heightPlaceholder')}
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="flex-1"
                    min={0}
                    max={300}
                  />
                  <span className="font-manrope text-[16px] text-[#282828] font-medium">{t('preLoginBMI.heightUnit')}</span>
                </div>
              </FormField>

              <FormField label={t('preLoginBMI.currentWeight')}>
                <div className="flex items-center gap-3">
                  <NumericInput
                    placeholder={t('preLoginBMI.weightPlaceholder')}
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="flex-1"
                    min={0}
                    max={500}
                    step={0.1}
                  />
                  <span className="font-manrope text-[16px] text-[#282828] font-medium">{t('preLoginBMI.weightUnit')}</span>
                </div>
              </FormField>

              {/* BMI Result */}
              {showResult && bmi !== null && (
                <div className={`rounded-[16px] p-6 text-center space-y-3 ${
                  eligibilityStatus === 'eligible'
                    ? 'bg-green-50 border-2 border-green-200'
                    : eligibilityStatus === 'conditional'
                    ? 'bg-blue-50 border-2 border-blue-200'
                    : 'bg-amber-50 border-2 border-amber-200'
                }`}>
                  <h3 className="font-sora font-bold text-[24px] text-[#282828]">
                    {t('preLoginBMI.yourBmi')} {bmi}
                  </h3>

                  {eligibilityStatus === 'eligible' ? (
                    <div className="space-y-2">
                      <p className="font-manrope text-[16px] font-semibold text-green-700">
                        {t('preLoginBMI.eligible.title')}
                      </p>
                      <p className="font-manrope text-[14px] text-green-600">
                        {t('preLoginBMI.eligible.description')}
                      </p>
                    </div>
                  ) : eligibilityStatus === 'conditional' ? (
                    <div className="space-y-2">
                      <p className="font-manrope text-[16px] font-semibold text-blue-700">
                        {t('preLoginBMI.conditional.title')}
                      </p>
                      <p className="font-manrope text-[14px] text-blue-600">
                        {t('preLoginBMI.conditional.description')}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="font-manrope text-[16px] font-semibold text-amber-700">
                        {t('preLoginBMI.notEligible.title')}
                      </p>
                      <p className="font-manrope text-[14px] text-amber-600">
                        {t('preLoginBMI.notEligible.description')}
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
                {eligibilityStatus !== 'not_eligible' ? (
                  <Button
                    onClick={handleContinue}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {t('preLoginBMI.buttons.pleaseWait')}
                      </span>
                    ) : (
                      t('preLoginBMI.buttons.bookConsultation')
                    )}
                  </Button>
                ) : (
                  <Link to={ROUTES.HOME}>
                    <Button variant="outline" className="w-full">
                      {t('preLoginBMI.buttons.returnHome')}
                    </Button>
                  </Link>
                )}
              </div>
            )}

            {/* Info Text */}
            <p className="font-manrope text-[12px] text-[#999] text-center max-w-[400px] leading-[1.5]">
              {t('preLoginBMI.infoText')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreLoginBMI;
