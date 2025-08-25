import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./hooks";
import { getClientType } from "./utils";
import { MainLayout, LoadingSpinner, Alert } from "./components";
import { LoginPage, DashboardPage } from "./pages";
import LandingPage from "./pages/LandingPage";

function App() {
  const {
    isAuthenticated,
    user,
    loading,
    error,
    showSuccessMessage,
    login,
    logout,
    clearError,
    checkAuthAndHideSuccess,
  } = useAuth();
  console.log("object: ", isAuthenticated);

  const clientType = getClientType();

  return (
    <Router>
      <Routes>
        {/* Landing Page Route */}
        <Route path="/" element={<LandingPage />} />

        {/* Login Route */}
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              // <MainLayout>
              //   {error && (
              //     <Alert
              //       type="error"
              //       message={error}
              //       onClose={clearError}
              //     />
              //   )}
              <LoginPage onLogin={login} loading={loading} />
            ) : (
              // </MainLayout>
              <Navigate to="/dashboard" replace />
            )
          }
        />

        {/* Dashboard Route - Protected */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <DashboardPage user={user} onLogout={logout} loading={loading} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Catch all route - redirect to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
