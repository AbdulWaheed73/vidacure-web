import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ROUTES } from "@/constants";
import { Button } from "@/components/onboarding";
import { NumericInput, FormField } from "@/components/onboarding";
import { useAuthStore } from "@/stores/authStore";
import {
  ArrowLeft,
  UserPlus,
  ClipboardList,
  Stethoscope,
  Sparkles,
  Info,
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
  const [bmi, setBmi] = useState<number | null>(null);
  const [eligibilityStatus, setEligibilityStatus] = useState<
    "not_eligible" | "conditional" | "eligible"
  >("not_eligible");

  // Calculate BMI when height and weight are provided. The number itself is
  // used only for gating — it is never displayed back to the user on this
  // page. The eligibility verdict IS displayed, so the user knows whether
  // they qualify, without being confronted with a raw medical number.
  useEffect(() => {
    if (height && weight) {
      const heightInMeters = parseFloat(height) / 100;
      const weightInKg = parseFloat(weight);

      if (heightInMeters > 0 && weightInKg > 0) {
        const calculatedBmi = weightInKg / (heightInMeters * heightInMeters);
        setBmi(Math.round(calculatedBmi * 10) / 10);

        if (calculatedBmi >= 30) {
          setEligibilityStatus("eligible");
        } else if (calculatedBmi >= 27) {
          setEligibilityStatus("conditional");
        } else {
          setEligibilityStatus("not_eligible");
        }
      } else {
        setBmi(null);
      }
    } else {
      setBmi(null);
    }
  }, [height, weight]);

  const handleContinue = () => {
    if (!bmi || eligibilityStatus === "not_eligible") return;

    localStorage.setItem(
      "vidacure_pending_bmi",
      JSON.stringify({
        height: parseFloat(height),
        weight: parseFloat(weight),
        bmi,
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

  const showEligibility = bmi !== null;
  const isEligible =
    eligibilityStatus === "eligible" || eligibilityStatus === "conditional";

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

            {/* BMI Form — two columns on tablet+ so the inputs sit side by
                side rather than stacking. Stays stacked on mobile. */}
            <div className="w-full max-w-[400px] md:max-w-[560px] grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
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

            {/* What Happens Next — journey preview. Replaces the old BMI
                result box. Shown always (once the user has scrolled the
                form into view) so that the journey is visible before they
                decide whether to hit Continue. */}
            <div className="w-full">
              <div className="text-center mb-4">
                <h2 className="font-sora font-semibold text-[18px] sm:text-[20px] text-[#282828]">
                  {t("preLoginBMI.whatHappensNext.title")}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <StepCard
                  number={1}
                  icon={UserPlus}
                  title={t("preLoginBMI.whatHappensNext.step1.title")}
                  description={t(
                    "preLoginBMI.whatHappensNext.step1.description"
                  )}
                />
                <StepCard
                  number={2}
                  icon={ClipboardList}
                  title={t("preLoginBMI.whatHappensNext.step2.title")}
                  description={t(
                    "preLoginBMI.whatHappensNext.step2.description"
                  )}
                />
                <StepCard
                  number={3}
                  icon={Stethoscope}
                  title={t("preLoginBMI.whatHappensNext.step3.title")}
                  description={t(
                    "preLoginBMI.whatHappensNext.step3.description"
                  )}
                  badge={t("preLoginBMI.whatHappensNext.step3.freeBadge")}
                  highlighted
                />
                <StepCard
                  number={4}
                  icon={Sparkles}
                  title={t("preLoginBMI.whatHappensNext.step4.title")}
                  description={t(
                    "preLoginBMI.whatHappensNext.step4.description"
                  )}
                />
              </div>
            </div>

            {/* Eligibility feedback — inline, shown as soon as BMI can be
                computed. No number is shown; only the verdict + guidance.
                This way the user always knows whether they qualify. */}
            {showEligibility && (
              <div
                className={`w-full max-w-[500px] rounded-[16px] p-5 border text-center space-y-2 ${
                  eligibilityStatus === "eligible"
                    ? "bg-emerald-50 border-emerald-200"
                    : eligibilityStatus === "conditional"
                    ? "bg-sky-50 border-sky-200"
                    : "bg-amber-50 border-amber-200"
                }`}
              >
                <h3
                  className={`font-sora font-semibold text-[16px] sm:text-[18px] ${
                    eligibilityStatus === "eligible"
                      ? "text-emerald-800"
                      : eligibilityStatus === "conditional"
                      ? "text-sky-800"
                      : "text-amber-900"
                  }`}
                >
                  {eligibilityStatus === "eligible"
                    ? t("preLoginBMI.eligible.title")
                    : eligibilityStatus === "conditional"
                    ? t("preLoginBMI.conditional.title")
                    : t("preLoginBMI.notEligible.title")}
                </h3>
                <p
                  className={`font-manrope text-[13px] sm:text-[14px] leading-relaxed ${
                    eligibilityStatus === "eligible"
                      ? "text-emerald-700"
                      : eligibilityStatus === "conditional"
                      ? "text-sky-700"
                      : "text-amber-800"
                  }`}
                >
                  {eligibilityStatus === "eligible"
                    ? t("preLoginBMI.eligible.description")
                    : eligibilityStatus === "conditional"
                    ? t("preLoginBMI.conditional.description")
                    : t("preLoginBMI.notEligibleSoft")}
                </p>
              </div>
            )}

            {/* Action button — Continue for eligible/conditional users,
                Return to Home for ineligible ones. Disabled until BMI can
                be computed at all. */}
            <div className="w-full max-w-[400px]">
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
                  disabled={!bmi}
                  className="w-full justify-center"
                >
                  {t("preLoginBMI.buttons.continue", "Continue")}
                </Button>
              )}
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
