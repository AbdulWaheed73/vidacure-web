import {
  BrowserRouter,
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
  // const [auth, setAuth] = useState<boolean>(isAuthenticated);

  // console.log("is authnticated: ", isAuthenticated);
  // const clientType = getClientType();

  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page Route */}
        <Route path={ROUTES.HOME} element={
            !isAuthenticated ? (
              <LandingPage />
            ) : (
              <Navigate to={ROUTES.DASHBOARD as string} replace />
            )
          } />

        {/* Login Route */}
        <Route
          path={ROUTES.LOGIN}
          element={
            !isAuthenticated ? (
              <LoginPage onLogin={login} loading={loading} />
            ) : (
              <Navigate to={ROUTES.DASHBOARD as string} replace />
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

        {/* 404 Not Found Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
