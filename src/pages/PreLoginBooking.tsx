import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ROUTES } from "@/constants";
import { Button } from "@/components/onboarding";
import { pendingSessionService } from "@/services/pendingSessionService";
import { useCookieConsentStore } from "@/stores/cookieConsentStore";
import { PopupModal } from "react-calendly";
import { ArrowLeft, Calendar, CheckCircle, AlertCircle } from "lucide-react";

// Calendly URL for free consultations (update this with your actual Calendly link)
const CALENDLY_FREE_CONSULTATION_URL = "https://calendly.com/mesudh044/meeting-for-paid-users";

const PreLoginBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { consent, openPreferences } = useCookieConsentStore();
  const hasFunctionalConsent = consent?.functional ?? false;

  const [token, setToken] = useState<string | null>(null);
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get token from location state or localStorage
  useEffect(() => {
    const stateToken = (location.state as { token?: string })?.token;
    const storedToken = pendingSessionService.getStoredToken();

    if (stateToken) {
      setToken(stateToken);
    } else if (storedToken) {
      setToken(storedToken);
    } else {
      // No token found - redirect to BMI check
      setError("Session expired. Please start over.");
    }
  }, [location.state]);

  // Listen for Calendly events
  useEffect(() => {
    const handleCalendlyEvent = (e: MessageEvent) => {
      if (e.data?.event === "calendly.event_scheduled") {
        console.log("Calendly booking completed:", e.data);

        // Store booking info in localStorage as backup
        const bookingData = {
          eventUri: e.data.payload?.event?.uri,
          inviteeUri: e.data.payload?.invitee?.uri,
          token: token,
          bookedAt: new Date().toISOString(),
        };
        localStorage.setItem("vidacure_pending_calendly_booking", JSON.stringify(bookingData));

        setBookingComplete(true);
        setIsCalendlyOpen(false);
      }
    };

    window.addEventListener("message", handleCalendlyEvent);
    return () => window.removeEventListener("message", handleCalendlyEvent);
  }, [token]);

  const handleOpenCalendly = () => {
    if (!hasFunctionalConsent) {
      openPreferences();
      return;
    }
    setIsCalendlyOpen(true);
  };

  const handleProceedToLogin = () => {
    navigate(ROUTES.LOGIN);
  };

  const handleStartOver = () => {
    pendingSessionService.clearStoredToken();
    navigate(ROUTES.PRE_LOGIN_BMI);
  };

  // Calendly URL (UTM params passed via utm prop, not URL)
  const calendlyUrl = CALENDLY_FREE_CONSULTATION_URL;

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: 'radial-gradient(81.35% 88.61% at 51.94% 50%, #008D77 0%, #005044 100%)' }}
      >
        <div className="bg-white rounded-[24px] shadow-xl max-w-[500px] w-full p-8 text-center">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h1 className="font-sora font-bold text-[24px] text-[#282828] mb-4">
            Session Expired
          </h1>
          <p className="font-manrope text-[16px] text-[#666] mb-6">
            {error}
          </p>
          <Button onClick={handleStartOver} className="w-full">
            Start Over
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: 'radial-gradient(81.35% 88.61% at 51.94% 50%, #008D77 0%, #005044 100%)' }}
    >
      {/* Header */}
      <div className="p-4 sm:p-6">
        <Link
          to={ROUTES.PRE_LOGIN_BMI}
          className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-manrope">Back</span>
        </Link>
      </div>

      <div className="flex items-center justify-center px-4 pb-8">
        <div className="bg-white rounded-[24px] shadow-xl max-w-[600px] w-full p-8 sm:p-12">
          {!bookingComplete ? (
            // Booking State
            <div className="flex flex-col gap-8 items-center">
              <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center">
                <Calendar className="w-10 h-10 text-teal-700" />
              </div>

              <div className="text-center space-y-4">
                <h1 className="font-sora font-bold text-[32px] sm:text-[40px] text-[#282828] leading-[1.2]">
                  Book Your Consultation
                </h1>
                <p className="font-manrope text-[16px] text-[#666] leading-[1.6] max-w-[450px]">
                  You're eligible for our medical weight management program!
                  Book a free consultation with one of our doctors to get started.
                </p>
              </div>

              <div className="w-full max-w-[400px] space-y-4">
                {!hasFunctionalConsent && (
                  <div className="rounded-[12px] p-4 bg-amber-50 border border-amber-200 text-center">
                    <p className="font-manrope text-[14px] text-amber-700">
                      Cookie consent is required to use the booking system.
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleOpenCalendly}
                  className="w-full"
                >
                  {hasFunctionalConsent ? "Choose a Time" : "Enable Cookies to Book"}
                </Button>
              </div>

              <div className="text-center space-y-2">
                <p className="font-manrope text-[14px] text-[#666]">
                  Already have an account?
                </p>
                <Link
                  to={ROUTES.LOGIN}
                  className="font-manrope text-[14px] text-teal-700 hover:text-teal-800 font-medium underline"
                >
                  Login here
                </Link>
              </div>

              <p className="font-manrope text-[12px] text-[#999] text-center max-w-[400px] leading-[1.5]">
                The consultation is free and takes about 15 minutes.
                Our doctors will discuss your health goals and recommend a personalized treatment plan.
              </p>
            </div>
          ) : (
            // Booking Complete State
            <div className="flex flex-col gap-8 items-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>

              <div className="text-center space-y-4">
                <h1 className="font-sora font-bold text-[32px] sm:text-[40px] text-[#282828] leading-[1.2]">
                  Booking Confirmed!
                </h1>
                <p className="font-manrope text-[16px] text-[#666] leading-[1.6] max-w-[450px]">
                  Your consultation has been scheduled. You'll receive a confirmation email shortly.
                </p>
              </div>

              <div className="w-full max-w-[400px] rounded-[16px] p-6 bg-teal-50 border border-teal-200">
                <h3 className="font-sora font-semibold text-[18px] text-teal-800 mb-3">
                  Next Steps:
                </h3>
                <ol className="space-y-2 text-left">
                  <li className="font-manrope text-[14px] text-teal-700 flex gap-2">
                    <span className="font-bold">1.</span>
                    <span>Login with BankID to create your account</span>
                  </li>
                  <li className="font-manrope text-[14px] text-teal-700 flex gap-2">
                    <span className="font-bold">2.</span>
                    <span>Complete your health questionnaire</span>
                  </li>
                  <li className="font-manrope text-[14px] text-teal-700 flex gap-2">
                    <span className="font-bold">3.</span>
                    <span>Attend your scheduled consultation</span>
                  </li>
                  <li className="font-manrope text-[14px] text-teal-700 flex gap-2">
                    <span className="font-bold">4.</span>
                    <span>Choose a subscription plan after your consultation</span>
                  </li>
                </ol>
              </div>

              <Button
                onClick={handleProceedToLogin}
                className="w-full max-w-[400px]"
              >
                Continue to Login
              </Button>

              <p className="font-manrope text-[12px] text-[#999] text-center max-w-[400px] leading-[1.5]">
                Make sure to login with the same BankID to link your booking automatically.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Calendly Popup Modal */}
      {hasFunctionalConsent && (
        <PopupModal
          url={calendlyUrl}
          open={isCalendlyOpen}
          onModalClose={() => setIsCalendlyOpen(false)}
          rootElement={document.getElementById("root")!}
          utm={token ? { utmTerm: token } : undefined}
        />
      )}
    </div>
  );
};

export default PreLoginBooking;
