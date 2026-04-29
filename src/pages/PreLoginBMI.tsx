import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ROUTES } from "@/constants";
import { Button } from "@/components/onboarding";
import { NumericInput, FormField } from "@/components/onboarding";
import { useAuthStore } from "@/stores/authStore";
import { buildBmiResult, BMI_DEBOUNCE_MS, type BmiResult } from "@/lib/bmi";
import {
  ArrowLeft,
  UserPlus,
  ClipboardList,
  Stethoscope,
  Sparkles,
  Info,
  Loader2,
} from "lucide-react";

type StepCardProps = {
  number: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  badge?: string;
  highlighted?: boolean;
};

const StepCard = ({
  number,
  icon: Icon,
  title,
  description,
  badge,
  highlighted,
}: StepCardProps) => (
  <div
    className={`relative rounded-[14px] p-3 sm:p-4 border transition-colors flex flex-col gap-2.5 ${
      highlighted
        ? "bg-amber-50 border-amber-300"
        : "bg-[#F7F9F9] border-[#E8EDEC]"
    }`}
  >
    {/* Top row: icon circle + (optional) free badge */}
    <div className="flex items-center justify-between gap-2">
      <div className="relative shrink-0">
        <div
          className={`flex items-center justify-center w-9 h-9 rounded-full ${
            highlighted
              ? "bg-amber-500 text-white"
              : "bg-[#005044] text-white"
          }`}
        >
          <Icon className="w-4 h-4" />
        </div>
        <div className="absolute -top-1 -right-1 bg-white border border-[#E8EDEC] rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
          <span className="font-sora font-bold text-[10px] text-[#282828]">
            {number}
          </span>
        </div>
      </div>
      {badge && (
        <span className="bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap shrink-0">
          {badge}
        </span>
      )}
    </div>

    {/* Body: title + description */}
    <div>
      <h3 className="font-sora font-semibold text-[13px] text-[#282828] leading-tight mb-1">
        {title}
      </h3>
      <p className="font-manrope text-[11px] text-[#666] leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);

const PreLoginBMI = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((s) => !!s.user);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState<BmiResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Debounced BMI calc. Without the debounce, every keystroke flips the
  // eligibility verdict — typing "100" briefly registers as weight=1, which
  // computes BMI=0.3 and swaps the Continue button for "Return Home".
  // After 700ms of no further keystrokes we trust the value and evaluate.
  useEffect(() => {
    if (!height || !weight) {
      setResult(null);
      setIsCalculating(false);
      return;
    }
    setIsCalculating(true);
    const timer = setTimeout(() => {
      setResult(buildBmiResult(parseFloat(height), parseFloat(weight)));
      setIsCalculating(false);
    }, BMI_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [height, weight]);

  const handleContinue = () => {
    if (!result || result.tier === "notEligible") return;

    localStorage.setItem(
      "vidacure_pending_bmi",
      JSON.stringify({
        height: parseFloat(height),
        weight: parseFloat(weight),
        bmi: result.value,
      })
    );
    if (isAuthenticated) {
      window.location.href = ROUTES.ONBOARDING;
    } else {
      navigate(ROUTES.LOGIN);
    }
  };

  const handleReturnHome = () => {
    if (isAuthenticated) {
      useAuthStore.getState().logout();
    }
    navigate(ROUTES.HOME);
  };

  // Hide the eligibility panel during the debounce window — otherwise the
  // verdict flickers as the user types.
  const showEligibility = result !== null && !isCalculating;
  const isEligible =
    result?.tier === "eligible" || result?.tier === "conditional";

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(81.35% 88.61% at 51.94% 50%, #008D77 0%, #005044 100%)",
      }}
    >
      {/* Simple Header */}
      <div className="p-4 sm:p-6">
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-manrope">{t("preLoginBMI.backToHome")}</span>
        </Link>
      </div>

      <div className="flex items-center justify-center px-4 pb-8">
        <div className="bg-white rounded-[24px] shadow-xl max-w-[600px] md:max-w-[760px] lg:max-w-[920px] w-full p-6 sm:p-10 lg:p-12">
          <div className="flex flex-col gap-7 items-center">
            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="font-sora font-bold text-[32px] sm:text-[40px] text-[#282828] leading-[1.2]">
                {t("preLoginBMI.title")}
              </h1>
              <p className="font-manrope text-[16px] text-[#666] leading-[1.6] max-w-[450px]">
                {t("preLoginBMI.description")}
              </p>
            </div>

            {/* Upfront eligibility hint — sets expectations before the user
                enters any data. No BMI number is shown back later, but the
                criterion is stated here so users aren't surprised if they
                turn out not to qualify. */}
            <div className="w-full max-w-[500px] flex items-start gap-2.5 rounded-[12px] border border-[#E8EDEC] bg-[#F7F9F9] px-3.5 py-2.5">
              <Info className="size-4 shrink-0 text-[#005044] mt-0.5" />
              <p className="font-manrope text-[13px] text-[#555] leading-relaxed">
                {t("preLoginBMI.eligibilityHint")}
              </p>
            </div>

            {/* Two-column layout from md+ : inputs/result/CTA on the left,
                journey preview on the right. Keeps the Continue button
                inside the viewport on a typical desktop screen. Stacks on
                mobile. */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
              {/* Left column: form + eligibility verdict + action button */}
              <div className="flex flex-col items-center gap-5">
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label={t("preLoginBMI.height")}>
                    <div className="flex items-center gap-3">
                      <NumericInput
                        placeholder={t("preLoginBMI.heightPlaceholder")}
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="flex-1 min-w-0"
                        min={0}
                        max={300}
                      />
                      <span className="font-manrope text-[16px] text-[#282828] font-medium shrink-0">
                        {t("preLoginBMI.heightUnit")}
                      </span>
                    </div>
                  </FormField>

                  <FormField label={t("preLoginBMI.currentWeight")}>
                    <div className="flex items-center gap-3">
                      <NumericInput
                        placeholder={t("preLoginBMI.weightPlaceholder")}
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="flex-1 min-w-0"
                        min={0}
                        max={500}
                        step={0.1}
                      />
                      <span className="font-manrope text-[16px] text-[#282828] font-medium shrink-0">
                        {t("preLoginBMI.weightUnit")}
                      </span>
                    </div>
                  </FormField>
                </div>

                {/* Eligibility feedback — inline, shown as soon as BMI can be
                    computed. */}
                {showEligibility && result !== null && (
              <div
                className={`w-full rounded-[16px] p-5 border text-center space-y-2 ${
                  result?.tier === "eligible"
                    ? "bg-emerald-50 border-emerald-200"
                    : result?.tier === "conditional"
                    ? "bg-sky-50 border-sky-200"
                    : "bg-amber-50 border-amber-200"
                }`}
              >
                <div
                  className={`flex flex-col items-center gap-1 pb-3 mb-1 border-b ${
                    result?.tier === "eligible"
                      ? "border-emerald-200"
                      : result?.tier === "conditional"
                      ? "border-sky-200"
                      : "border-amber-200"
                  }`}
                >
                  <span
                    className={`font-manrope text-[12px] sm:text-[13px] uppercase tracking-[0.12em] font-semibold ${
                      result?.tier === "eligible"
                        ? "text-emerald-700"
                        : result?.tier === "conditional"
                        ? "text-sky-700"
                        : "text-amber-800"
                    }`}
                  >
                    {t("preLoginBMI.yourBmi").replace(":", "")}
                  </span>
                  <span
                    className={`font-sora font-bold text-[40px] sm:text-[48px] leading-none ${
                      result?.tier === "eligible"
                        ? "text-emerald-800"
                        : result?.tier === "conditional"
                        ? "text-sky-800"
                        : "text-amber-900"
                    }`}
                  >
                    {result.display}
                  </span>
                </div>
                <h3
                  className={`font-sora font-semibold text-[16px] sm:text-[18px] ${
                    result?.tier === "eligible"
                      ? "text-emerald-800"
                      : result?.tier === "conditional"
                      ? "text-sky-800"
                      : "text-amber-900"
                  }`}
                >
                  {result?.tier === "eligible"
                    ? t("preLoginBMI.eligible.title")
                    : result?.tier === "conditional"
                    ? t("preLoginBMI.conditional.title")
                    : t("preLoginBMI.notEligible.title")}
                </h3>
                <p
                  className={`font-manrope text-[13px] sm:text-[14px] leading-relaxed ${
                    result?.tier === "eligible"
                      ? "text-emerald-700"
                      : result?.tier === "conditional"
                      ? "text-sky-700"
                      : "text-amber-800"
                  }`}
                >
                  {result?.tier === "eligible"
                    ? t("preLoginBMI.eligible.description")
                    : result?.tier === "conditional"
                    ? t("preLoginBMI.conditional.description")
                    : t("preLoginBMI.notEligibleSoft")}
                </p>
              </div>
            )}

                {/* Action button — Continue for eligible/conditional users,
                    Return to Home for ineligible ones. */}
                <div className="w-full">
                  {showEligibility && !isEligible ? (
                    <Button
                      variant="outline"
                      onClick={handleReturnHome}
                      className="w-full justify-center"
                    >
                      {t("preLoginBMI.buttons.returnHome")}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleContinue}
                      disabled={!result || isCalculating}
                      className="w-full justify-center"
                    >
                      {isCalculating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        t("preLoginBMI.buttons.continue", "Continue")
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {/* Right column: journey preview */}
              <div className="w-full">
                <div className="text-center mb-4">
                  <h2 className="font-sora font-semibold text-[18px] sm:text-[20px] text-[#282828]">
                    {t("preLoginBMI.whatHappensNext.title")}
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <StepCard
                    number={1}
                    icon={UserPlus}
                    title={t("preLoginBMI.whatHappensNext.step1.title")}
                    description={t("preLoginBMI.whatHappensNext.step1.description")}
                  />
                  <StepCard
                    number={2}
                    icon={ClipboardList}
                    title={t("preLoginBMI.whatHappensNext.step2.title")}
                    description={t("preLoginBMI.whatHappensNext.step2.description")}
                  />
                  <StepCard
                    number={3}
                    icon={Stethoscope}
                    title={t("preLoginBMI.whatHappensNext.step3.title")}
                    description={t("preLoginBMI.whatHappensNext.step3.description")}
                    badge={t("preLoginBMI.whatHappensNext.step3.freeBadge")}
                    highlighted
                  />
                  <StepCard
                    number={4}
                    icon={Sparkles}
                    title={t("preLoginBMI.whatHappensNext.step4.title")}
                    description={t("preLoginBMI.whatHappensNext.step4.description")}
                  />
                </div>
              </div>
            </div>

            {/* Returning patient link — hide if already authenticated */}
            {!isAuthenticated && (
              <Link
                to={ROUTES.LOGIN}
                className="font-manrope text-[13px] text-[#005044] underline hover:text-[#003d33] transition-colors"
              >
                {t(
                  "preLoginBMI.alreadyPatient",
                  "Already a patient? Log in directly"
                )}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreLoginBMI;
