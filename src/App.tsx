import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks";
// import { getClientType } from "./utils";
import { ROUTES } from "./constants";
import {
  LoginPage,
  AppointmentsPage,
  PrescriptionsPage,
  ProgressPage,
  ResourcesPage,
  AccountPage,
  LandingPage,
  NotFoundPage,
  SubscriptionSuccess,
  ChatPage,
  BMICheck,
  AboutUs,
  Article,
} from "./pages";
import OnboardingFlow from "./pages/OnBoarding";
import DashboardRouter from "./pages/dashboard/DashboardRouter";
import { SidebarProvider, SidebarInset } from "./components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import { TopBar } from "./components/TopBar";
import { PopupModal } from 'react-calendly';
import { useState } from "react";
import { calendlyService } from "./services/calendlyService";

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

  const handleDirectBooking = async () => {
    // setIsBookingLoading(true);

    try {
      // First get available event types
      const eventTypesResponse = await calendlyService.getAvailableEventTypes();

      if (eventTypesResponse.success && eventTypesResponse.eventType) {
        // Then create booking link
        const bookingResponse = await calendlyService.createPatientBookingLink(eventTypesResponse.eventType.type);

        if (bookingResponse.success) {
          setSchedulingLink(bookingResponse.schedulingLink);
        }
      }
    } catch (err) {
      console.error('Booking error:', err);
    } finally {
      // setIsBookingLoading(false);
    }
  };

  // Layout wrapper for authenticated routes with sidebar
  const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
    const handleBookAppointment = () => {
      handleDirectBooking();
    };

    const handleProfileClick = () => {
      // TODO: Navigate to profile page
      console.log('Profile clicked');
    };

    const handleAccountClick = () => {
      // TODO: Navigate to account settings
      console.log('Account clicked');
    };

    const handleLogout = () => {
      logout();
    };

    return (
      <SidebarProvider>
        <AppSidebar user={user} />
        <SidebarInset className="bg-[#F0F7F4] ml-64">
          <TopBar
            user={user}
            onBookAppointment={handleBookAppointment}
            onProfileClick={handleProfileClick}
            onAccountClick={handleAccountClick}
            onLogout={handleLogout}
          />
          {children}
        </SidebarInset>
        {/* Global Calendly Popup Modal */}
        <PopupModal
          url={schedulingLink || ''}
          open={!!schedulingLink}
          onModalClose={() => {
            setSchedulingLink(null);
          }}
          rootElement={document.getElementById('root')!}
        />
      </SidebarProvider>
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page Route - Redirect if authenticated */}
        <Route
          path={ROUTES.HOME}
          element={
            isAuthenticated ? (
              user?.role === 'doctor' ? (
                <Navigate to={ROUTES.DASHBOARD as string} replace />
              ) : user?.hasCompletedOnboarding ? (
                <Navigate to={ROUTES.DASHBOARD as string} replace />
              ) : (
                <Navigate to={ROUTES.BMI_CHECK as string} replace />
              )
            ) : (
              <LandingPage />
            )
          }
        />

        {/* Login Route */}
        <Route
          path={ROUTES.LOGIN}
          element={
            loading ? (
              <LoginPage onLogin={login} loading={loading} />
            ) : !isAuthenticated ? (
              <LoginPage onLogin={login} loading={loading} />
            ) : (
              user?.role === 'doctor' ? (
                <Navigate to={ROUTES.DASHBOARD as string} replace />
              ) : user?.hasCompletedOnboarding ? (
                <Navigate to={ROUTES.DASHBOARD as string} replace />
              ) : (
                <Navigate to={ROUTES.BMI_CHECK as string} replace />
              )
            )
          }
        />

        {/* Dashboard Routes - Protected with Sidebar */}
        <Route
          path="/dashboard/*"
          element={
            isAuthenticated ? (
              <SidebarLayout>
                <DashboardRouter 
                  user={user} 
                  onLogout={logout} 
                  loading={loading} 
                />
              </SidebarLayout>
            ) : (
              <Navigate to={ROUTES.LOGIN} replace />
            )
          }
        />

        {/* Healthcare Routes - Protected with Sidebar */}
        <Route
          path="/appointments"
          element={
            isAuthenticated ? (
              <SidebarLayout>
                <AppointmentsPage />
              </SidebarLayout>
            ) : (
              <Navigate to={ROUTES.LOGIN} replace />
            )
          }
        />

        <Route
          path="/prescriptions"
          element={
            isAuthenticated ? (
              <SidebarLayout>
                <PrescriptionsPage />
              </SidebarLayout>
            ) : (
              <Navigate to={ROUTES.LOGIN} replace />
            )
          }
        />

        <Route
          path="/progress"
          element={
            isAuthenticated ? (
              <SidebarLayout>
                <ProgressPage />
              </SidebarLayout>
            ) : (
              <Navigate to={ROUTES.LOGIN} replace />
            )
          }
        />

        <Route
          path="/resources"
          element={
            isAuthenticated ? (
              <SidebarLayout>
                <ResourcesPage />
              </SidebarLayout>
            ) : (
              <Navigate to={ROUTES.LOGIN} replace />
            )
          }
        />

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
          path="/chat"
          element={
            isAuthenticated ? (
              <SidebarLayout>
                <ChatPage />
              </SidebarLayout>
            ) : (
              <Navigate to={ROUTES.LOGIN} replace />
            )
          }
        />

        {/* BMI Check Route - Protected (without sidebar) */}
        <Route
          path={ROUTES.BMI_CHECK}
          element={
            isAuthenticated ? (
              user?.role === 'doctor' ? (
                <Navigate to={ROUTES.DASHBOARD as string} replace />
              ) : user?.hasCompletedOnboarding ? (
                <Navigate to={ROUTES.DASHBOARD as string} replace />
              ) : (
                <BMICheck />
              )
            ) : (
              <Navigate to={ROUTES.LOGIN} replace />
            )
          }
        />

        {/* Onboarding Route - Protected (without sidebar) */}
        <Route
          path={ROUTES.ONBOARDING}
          element={
            isAuthenticated ? (
              user?.role === 'doctor' ? (
                <Navigate to={ROUTES.DASHBOARD as string} replace />
              ) : user?.hasCompletedOnboarding ? (
                <Navigate to={ROUTES.DASHBOARD as string} replace />
              ) : (
                <OnboardingFlow user={user} />
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

        {/* About Us Route - Public */}
        <Route
          path={ROUTES.ABOUT_US}
          element={<AboutUs />}
        />

        {/* Article Route - Public */}
        <Route
          path="/article/:articleId"
          element={<Article />}
        />

        {/* 404 Not Found Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
