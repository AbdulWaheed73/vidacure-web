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
} from "./pages";
import OnboardingFlow from "./pages/OnBoarding";
import DashboardRouter from "./pages/dashboard/DashboardRouter";
import { SidebarProvider, SidebarInset } from "./components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import { TopBar } from "./components/TopBar";

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

  // Layout wrapper for authenticated routes with sidebar
  const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
    const handleBookAppointment = () => {
      // TODO: Implement appointment booking
      console.log('Book appointment clicked');
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
                <Navigate to={ROUTES.ONBOARDING as string} replace />
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
            !isAuthenticated ? (
              <LoginPage onLogin={login} loading={loading} />
            ) : (
              user?.role === 'doctor' ? (
                <Navigate to={ROUTES.DASHBOARD as string} replace />
              ) : user?.hasCompletedOnboarding ? (
                <Navigate to={ROUTES.DASHBOARD as string} replace />
              ) : (
                <Navigate to={ROUTES.ONBOARDING as string} replace />
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

        {/* 404 Not Found Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
