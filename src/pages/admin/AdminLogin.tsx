import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { useAdminAuthStore } from '@/stores/adminAuthStore';
import { AlertCircle } from 'lucide-react';
import VidacureLogo from '@/assets/vidacure_png.png';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAdminAuthenticated, loginAdmin, checkAdminAuth, isLoading } = useAdminAuthStore();

  const error = searchParams.get('error');
  const message = searchParams.get('message');
  const authSuccess = searchParams.get('auth');

  useEffect(() => {
    checkAdminAuth();
  }, [checkAdminAuth]);

  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/admin');
    }
  }, [isAdminAuthenticated, navigate]);

  const handleLogin = () => {
    loginAdmin();
  };

  const getErrorMessage = (errorCode: string | null): string => {
    switch (errorCode) {
      case 'not_admin':
        return 'Access denied. Admin credentials required.';
      case 'invalid_state':
        return 'Invalid session. Please try again.';
      case 'token_exchange_failed':
        return 'Authentication failed. Please try again.';
      case 'authentication_failed':
        return 'Admin authentication failed. Please try again.';
      case 'no_code':
        return 'No authorization code received. Please try again.';
      default:
        return message || 'An error occurred during login.';
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-teal-600 p-12 flex-col justify-between">
        <div>
          <img src={VidacureLogo} alt="Vidacure" className="h-8 brightness-0 invert" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Admin Portal
          </h1>
          <p className="text-teal-100 text-lg">
            Manage patients, doctors, and subscriptions from one place.
          </p>
        </div>
        <p className="text-teal-200 text-sm">
          © {new Date().getFullYear()} Vidacure. All rights reserved.
        </p>
      </div>

      {/* Right side - Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <img src={VidacureLogo} alt="Vidacure" className="h-6" />
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-2">
              Sign in
            </h2>
            <p className="text-zinc-500 text-sm">
              Use your BankID to access the admin dashboard
            </p>
          </div>

          {error && (
            <div className="mb-6">
              <Alert variant="destructive" title="Error">
                <AlertCircle className="h-4 w-4" />
                <span className="ml-2">{getErrorMessage(error)}</span>
              </Alert>
            </div>
          )}

          {authSuccess === 'success' && !error && (
            <div className="mb-6 p-3 bg-teal-50 border border-teal-200 rounded-lg">
              <p className="text-teal-700 text-sm">Login successful! Redirecting...</p>
            </div>
          )}

          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium"
            size="lg"
          >
            {isLoading ? 'Connecting...' : 'Continue with BankID'}
          </Button>

          <p className="mt-6 text-xs text-zinc-400 text-center">
            Only registered administrators can access this portal.
          </p>

          <div className="mt-8 pt-6 border-t border-zinc-100">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-zinc-500 hover:text-zinc-700"
            >
              ← Back to website
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
