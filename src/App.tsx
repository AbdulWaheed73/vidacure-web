import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./hooks";
// import { getClientType } from "./utils";
import { ROUTES } from "./constants";
import { LoginPage, DashboardPage, LandingPage, NotFoundPage } from "./pages";

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


  // const clientType = getClientType();

  return (
    <Router>
      <Routes>
        {/* Landing Page Route */}
        <Route path={ROUTES.HOME} element={<LandingPage />} />

        {/* Login Route */}
        <Route
          path={ROUTES.LOGIN}
          element={
            !isAuthenticated ? (
              <LoginPage onLogin={login} loading={loading} />
            ) : (
              <Navigate to={ROUTES.DASHBOARD} replace />
            )
          }
        />

        {/* Dashboard Route - Protected */}
        <Route
          path={ROUTES.DASHBOARD}
          element={
            isAuthenticated ? (
              <DashboardPage user={user} onLogout={logout} loading={loading} />
            ) : (
              <Navigate to={ROUTES.LOGIN} replace />
            )
          }
        />

        {/* 404 Not Found Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
