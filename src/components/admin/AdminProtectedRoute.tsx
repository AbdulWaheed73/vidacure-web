import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuthStore } from '@/stores/adminAuthStore';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

type AdminProtectedRouteProps = {
  children: React.ReactNode;
};

/**
 * Admin Protected Route Component
 * Ensures only authenticated admins can access admin routes
 * Regular user tokens (app_token) will NOT work
 */
export const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const { isAdminAuthenticated, isLoading, checkAdminAuth } = useAdminAuthStore();

  useEffect(() => {
    // Check admin authentication on mount
    checkAdminAuth();
  }, [checkAdminAuth]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <LoadingSpinner />
      </div>
    );
  }

  // Redirect to admin login if not authenticated
  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Render children if authenticated
  return <>{children}</>;
};
