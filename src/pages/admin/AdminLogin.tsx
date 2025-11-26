import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { useAdminAuthStore } from '@/stores/adminAuthStore';
import { Shield, AlertCircle } from 'lucide-react';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAdminAuthenticated, loginAdmin, checkAdminAuth, isLoading } = useAdminAuthStore();

  const error = searchParams.get('error');
  const message = searchParams.get('message');
  const authSuccess = searchParams.get('auth');

  useEffect(() => {
    // Check if already authenticated
    checkAdminAuth();
  }, [checkAdminAuth]);

  useEffect(() => {
    // If authenticated and login was successful, redirect to admin dashboard
    if (isAdminAuthenticated && authSuccess === 'success') {
      navigate('/admin');
    }
  }, [isAdminAuthenticated, authSuccess, navigate]);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
          <CardDescription>
            Secure access for Vidacure administrators
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive" title="Authentication Error">
              <AlertCircle className="h-4 w-4" />
              <span className="ml-2">{getErrorMessage(error)}</span>
            </Alert>
          )}

          {authSuccess === 'success' && !error && (
            <Alert variant="default" title="Success">
              <span className="ml-2">Login successful! Redirecting...</span>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="text-sm text-muted-foreground text-center">
              <p className="mb-2">This portal is restricted to authorized administrators only.</p>
              <p>Please authenticate using BankID.</p>
            </div>

            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              size="lg"
            >
              {isLoading ? 'Loading...' : 'Login with BankID'}
            </Button>

            <div className="text-xs text-center text-muted-foreground">
              <p>Admins must be registered in the system.</p>
              <p>Regular user accounts cannot access this portal.</p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="w-full"
            >
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
