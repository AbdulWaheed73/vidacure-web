import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./hooks";
// import { getClientType } from "./utils";
import { ROUTES } from "./constants";
import { LoginPage, DashboardPage, LandingPage, NotFoundPage, SubscriptionSuccess } from "./pages";
import OnboardingFlow from "./pages/OnBoarding";


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
  // const [auth, setAuth] = useState<boolean>(isAuthenticated);

  // console.log("is authnticated: ", isAuthenticated);
  // const clientType = getClientType();

  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page Route - Redirect if authenticated */}
        <Route 
          path={ROUTES.HOME} 
          element={
            isAuthenticated ? (
              user?.hasCompletedOnboarding ? (
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
              <Navigate to={ROUTES.ONBOARDING as string} replace />
            )
          }
        />

        {/* Dashboard Route - Protected */}
        <Route
          path={ROUTES.DASHBOARD as string}
          element={
            isAuthenticated ? (
              <DashboardPage user={user} onLogout={logout} loading={loading} />
            ) : (
              <Navigate to={ROUTES.LOGIN} replace />
            )
          }
        />

        {/* Onboarding Route - Protected */}
        <Route 
          path={ROUTES.ONBOARDING} 
          element={
            isAuthenticated ? (
              user?.hasCompletedOnboarding ? (
                <Navigate to={ROUTES.DASHBOARD as string} replace />
              ) : (
                <OnboardingFlow />
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
