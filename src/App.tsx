import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./hooks";
import { ROUTES } from "./constants";
import { lazy, Suspense, useState } from "react";
import { SidebarProvider, SidebarInset } from "./components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import { TopBar } from "./components/TopBar";
import { CookieBanner } from "./components/cookie/CookieBanner";
import { ConsentModal } from "./components/ConsentModal";
import { useCookieConsentStore } from "./stores/cookieConsentStore";
import { useAdminAuthStore } from "./stores/adminAuthStore";
import { AdminTopBar } from "./components/admin/AdminTopBar";
import { AdminProtectedRoute } from "./components/admin/AdminProtectedRoute";
import { setNavigateRef } from "./lib/navigation";
import i18n from "./i18n";

// Lazy load all pages for code splitting
const LoginPage = lazy(() => import("./pages/LoginPage").then(m => ({ default: m.LoginPage })));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Article = lazy(() => import("./pages/Article"));
const PreLoginBMI = lazy(() => import("./pages/PreLoginBMI"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const PreLoginBooking = lazy(() => import("./pages/PreLoginBooking"));
const SubscriptionSuccess = lazy(() => import("./pages/SubscriptionSuccess").then(m => ({ default: m.SubscriptionSuccess })));
const SubscriptionCancel = lazy(() => import("./pages/SubscriptionCancel").then(m => ({ default: m.SubscriptionCancel })));
const LabTestPaymentSuccess = lazy(() => import("./pages/LabTestPaymentSuccess").then(m => ({ default: m.LabTestPaymentSuccess })));
const LabTestPaymentCancel = lazy(() => import("./pages/LabTestPaymentCancel").then(m => ({ default: m.LabTestPaymentCancel })));

// Patient/Protected routes
const AppointmentsPage = lazy(() => import("./pages/AppointmentsPage").then(m => ({ default: m.AppointmentsPage })));
const PrescriptionsPage = lazy(() => import("./pages/PrescriptionsPage").then(m => ({ default: m.PrescriptionsPage })));
const LabTestsPage = lazy(() => import("./pages/LabTestsPage").then(m => ({ default: m.LabTestsPage })));
const ProgressPage = lazy(() => import("./pages/ProgressPage").then(m => ({ default: m.ProgressPage })));
const ResourcesPage = lazy(() => import("./pages/ResourcesPage").then(m => ({ default: m.ResourcesPage })));
const AccountPage = lazy(() => import("./pages/AccountPage").then(m => ({ default: m.AccountPage })));
const SupabaseChatPage = lazy(() => import("./pages/SupabaseChatPage"));
const SubscribePage = lazy(() => import("./pages/SubscribePage"));
const OnboardingFlow = lazy(() => import("./pages/OnBoarding"));
const DashboardRouter = lazy(() => import("./pages/dashboard/DashboardRouter"));
const ConsentManagement = lazy(() => import("./pages/ConsentManagement").then(m => ({ default: m.ConsentManagement })));
// Admin routes
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));

// Lazy load react-calendly (heavy library)
const PopupModal = lazy(() => import("react-calendly").then(m => ({ default: m.PopupModal })));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#F0F7F4]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
      <span className="text-gray-600 text-sm">{i18n.t('common.loading')}</span>
    </div>
  </div>
);

function NavigateRefSetter() {
  const navigate = useNavigate();
  setNavigateRef(navigate);
  return null;
}

function App() {
  const {
    isAuthenticated,
    user,
    loading,
    // error,
    // showSuccessMessage,
    login,
    logout,
    // clearError,
    // checkAuthAndHideSuccess,
  } = useAuth();

  // const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [schedulingLink, setSchedulingLink] = useState<string | null>(null);
  const { consent } = useCookieConsentStore();
  const hasFunctionalConsent = consent?.functional ?? false;

  // Check if new patient has completed BMI check — server state first, localStorage fallback for pre-login flow
  const hasCompletedBMICheck = () => user?.hasCompletedBMICheck || !!localStorage.getItem('vidacure_pending_bmi');

  // Layout wrapper for authenticated routes with sidebar
  const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const handleBookAppointment = () => {
      navigate(ROUTES.PATIENT_APPOINTMENTS);
    };

    const handleProfileClick = () => {
      navigate('/account');
    };

    const handleLogout = () => {
      logout();
    };

    return (
      <SidebarProvider>
        <AppSidebar user={user} />
        <SidebarInset className="bg-[#F0F7F4] h-screen overflow-hidden">
          <TopBar
            user={user}
            onBookAppointment={handleBookAppointment}
            onProfileClick={handleProfileClick}
            onLogout={handleLogout}
          />
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="max-w-[1440px] mx-auto">
              {children}
            </div>
          </div>
        </SidebarInset>
        {/* Global Calendly Popup Modal - Only show if functional cookies accepted */}
        {hasFunctionalConsent && schedulingLink && (
          <Suspense fallback={null}>
            <PopupModal
              url={schedulingLink}
              open={!!schedulingLink}
              onModalClose={() => {
                setSchedulingLink(null);
              }}
              rootElement={document.getElementById("root")!}
            />
          </Suspense>
        )}
      </SidebarProvider>
    );
  };

  // Admin Layout wrapper for admin routes with admin sidebar
  const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const { logoutAdmin } = useAdminAuthStore();

    const handleLogout = () => {
      logoutAdmin();
    };

    return (
      <SidebarProvider>
        <SidebarInset className="bg-[#F0F7F4] ml-64 w-[calc(100vw-16rem)] overflow-x-hidden">
          <AdminTopBar onLogout={handleLogout} />
          <div className="overflow-x-auto">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  };

  // Guard: requires authentication + onboarding completion for patients (doctors skip onboarding)
  const requireOnboarding = (children: React.ReactNode) => {
    if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;
    if (user?.role === "doctor" || user?.hasCompletedOnboarding) {
      return <SidebarLayout>{children}</SidebarLayout>;
    }
    if (hasCompletedBMICheck()) return <Navigate to={ROUTES.ONBOARDING as string} replace />;
    return <Navigate to={ROUTES.PRE_LOGIN_BMI as string} replace />;
  };

  return (
    <BrowserRouter>
      <NavigateRefSetter />
      {/* Cookie Consent Banner */}
      <CookieBanner />
      {/* Privacy Policy Consent Modal (GDPR) */}
      <ConsentModal />

      <Suspense fallback={<PageLoader />}>
        <Routes>
        {/* Admin Routes - Must be FIRST to prevent regular auth interference */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path={ROUTES.ADMIN_DASHBOARD}
          element={
            <AdminProtectedRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </AdminProtectedRoute>
          }
        />

        {/* Pre-Login BMI Check - Public route, also accessible by new patients who skipped BMI */}
        <Route
          path={ROUTES.PRE_LOGIN_BMI}
          element={
            isAuthenticated ? (
              user?.role === "doctor" ? (
                <Navigate to={ROUTES.DASHBOARD as string} replace />
              ) : user?.hasCompletedOnboarding ? (
                <Navigate to={ROUTES.DASHBOARD as string} replace />
              ) : hasCompletedBMICheck() ? (
                <Navigate to={ROUTES.ONBOARDING as string} replace />
              ) : (
                <PreLoginBMI />
              )
            ) : (
              <PreLoginBMI />
            )
          }
        />

        {/* Pre-Login Booking - Public route, also accessible by new patients */}
        <Route
          path={ROUTES.PRE_LOGIN_BOOKING}
          element={
            isAuthenticated ? (
              user?.role === "doctor" ? (
                <Navigate to={ROUTES.DASHBOARD as string} replace />
              ) : user?.hasCompletedOnboarding ? (
                <Navigate to={ROUTES.DASHBOARD as string} replace />
              ) : hasCompletedBMICheck() || user?.hasScheduledMeeting ? (
                <Navigate to={ROUTES.ONBOARDING as string} replace />
              ) : (
                <PreLoginBooking />
              )
            ) : (
              <PreLoginBooking />
            )
          }
        />

        {/* Landing Page Route - Always accessible (Supabase-style) */}
        <Route path={ROUTES.HOME} element={<LandingPage />} />

        {/* Login Route */}
        <Route
          path={ROUTES.LOGIN}
          element={
            loading ? (
              <LoginPage onLogin={login} loading={loading} />
            ) : !isAuthenticated ? (
              <LoginPage onLogin={login} loading={loading} />
            ) : user?.role === "doctor" ? (
              <Navigate to={ROUTES.DASHBOARD as string} replace />
            ) : user?.hasCompletedOnboarding ? (
              <Navigate to={ROUTES.DASHBOARD as string} replace />
            ) : hasCompletedBMICheck() ? (
              <Navigate to={ROUTES.ONBOARDING as string} replace />
            ) : (
              <Navigate to={ROUTES.PRE_LOGIN_BMI as string} replace />
            )
          }
        />

        {/* Dashboard Routes - Protected with Sidebar + onboarding guard */}
        <Route
          path="/dashboard/*"
          element={requireOnboarding(
            <DashboardRouter
              user={user}
              onLogout={logout}
              loading={loading}
            />
          )}
        />

        {/* Healthcare Routes - Protected with Sidebar + onboarding guard */}
        <Route path="/appointments" element={requireOnboarding(<AppointmentsPage />)} />
        <Route path="/prescriptions" element={requireOnboarding(<PrescriptionsPage />)} />
        <Route path="/lab-tests" element={requireOnboarding(<LabTestsPage />)} />
        <Route path="/progress" element={requireOnboarding(<ProgressPage />)} />
        <Route path="/resources" element={requireOnboarding(<ResourcesPage />)} />

        <Route
          path="/account"
          element={
            isAuthenticated ? (
              <SidebarLayout>
                <AccountPage user={user} onLogout={logout} />
              </SidebarLayout>
            ) : (
              <Navigate to={ROUTES.LOGIN} replace />
            )
          }
        />

        <Route
          path="/consent"
          element={
            isAuthenticated ? (
              <SidebarLayout>
                <ConsentManagement />
              </SidebarLayout>
            ) : (
              <Navigate to={ROUTES.LOGIN} replace />
            )
          }
        />

        {/* Redirect old /chat route to new Supabase chat */}
        <Route
          path="/chat"
          element={<Navigate to="/supabase-chat" replace />}
        />

        {/* Supabase Chat Route - Main chat implementation */}
        <Route path="/supabase-chat" element={requireOnboarding(<SupabaseChatPage />)} />

        {/* Subscribe Route - Protected with Sidebar + onboarding guard */}
        <Route path={ROUTES.SUBSCRIBE} element={requireOnboarding(<SubscribePage />)} />

        {/* Onboarding Route - Protected, requires BMI check first */}
        <Route
          path={ROUTES.ONBOARDING}
          element={
            isAuthenticated ? (
              user?.role === "doctor" ? (
                <Navigate to={ROUTES.DASHBOARD as string} replace />
              ) : user?.hasCompletedOnboarding ? (
                <Navigate to={ROUTES.DASHBOARD as string} replace />
              ) : hasCompletedBMICheck() ? (
                <OnboardingFlow user={user} />
              ) : (
                <Navigate to={ROUTES.PRE_LOGIN_BMI as string} replace />
              )
            ) : (
              <Navigate to={ROUTES.LOGIN} replace />
            )
          }
        />

        {/* Subscription Success Route */}
        <Route
          path={ROUTES.SUBSCRIPTION_SUCCESS}
          element={<SubscriptionSuccess />}
        />

        {/* Subscription Canceled Route */}
        <Route
          path={ROUTES.SUBSCRIPTION_CANCELED}
          element={<SubscriptionCancel />}
        />

        {/* Lab Test Payment Routes */}
        <Route
          path={ROUTES.LAB_TEST_PAYMENT_SUCCESS}
          element={<LabTestPaymentSuccess />}
        />
        <Route
          path={ROUTES.LAB_TEST_PAYMENT_CANCELED}
          element={
            isAuthenticated ? (
              <SidebarLayout>
                <LabTestPaymentCancel />
              </SidebarLayout>
            ) : (
              <Navigate to={ROUTES.LOGIN} replace />
            )
          }
        />

        {/* About Us Route - Public */}
        <Route path={ROUTES.ABOUT_US} element={<AboutUs />} />

        {/* Privacy Policy Route - Public page, no navbar when authenticated */}
        <Route
          path="/privacy"
          element={<PrivacyPolicy embedded={isAuthenticated} />}
        />

        {/* Article Route - Public */}
        <Route path="/article/:articleId" element={<Article />} />

        {/* 404 Not Found Page */}
        <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
