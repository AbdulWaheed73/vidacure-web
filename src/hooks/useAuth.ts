import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { AuthService } from '../services';

export const useAuth = () => {
  const {
    isAuthenticated,
    user,
    csrfToken,
    isLoading,
    error,
    checkAuthStatus,
    logout,
    clearError,
    setLoading,
    setAuthData
  } = useAuthStore();

  // Handle login
  const login = async () => {
    try {
      clearError();
      setLoading(true);
      AuthService.initiateLogin();
    } catch {
      setLoading(false);
    }
  };

  // Handle logout from store
  const handleLogout = async () => {
    try {
      clearError();
      setLoading(true);
      
      await AuthService.logout();
      logout(); // Call store logout
      
      // Clear stored data
      AuthService.clearUserData();
      
    } catch {
      setLoading(false);
    }
  };

  // Handle authentication callback
  const handleAuthCallback = async () => {
    try {
      clearError();
      setLoading(true);
      
      // The backend will handle the callback and set cookies
      // We just need to wait a moment and then check auth status
      setTimeout(async () => {
        try {
          const response = await AuthService.checkAuthStatus();
        console.log("response in sucess 2 : ", response);
          
          if (response.authenticated) {
            setAuthData(response);
            
            // Store user data locally
            if (response.user) {
              AuthService.storeUserData(response.user, response.csrfToken);
            }
            
            // Clear URL parameters
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } catch (err) {
          console.log('Auth check failed:', err instanceof Error ? err.message : 'Unknown error');
        } finally {
          setLoading(false);
        }
      }, 1000); // Wait 1 second for backend to process
      
    } catch {
      setLoading(false);
    }
  };

  // Handle successful auth redirect
  const handleSuccessfulAuth = async () => {
    clearError();
    
    // Clear URL parameters
    window.history.replaceState({}, document.title, window.location.pathname);
    
    // Check auth status after a short delay
    setTimeout(async () => {
      try {
        const response = await AuthService.checkAuthStatus();
        console.log("response in sucess: ", response);
        if (response.authenticated) {
          setAuthData(response);
          
          // Store user data locally (like in handleAuthCallback)
          if (response.user) {
            AuthService.storeUserData(response.user, response.csrfToken);
          }
        }
      } catch (err) {
        console.log('Auth check failed:', err instanceof Error ? err.message : 'Unknown error');
      }
    }, 500);
  };

  // Only check auth status once on app startup, and handle URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const auth = urlParams.get('auth');
    
    if (code && state) {
      // User just came back from authentication with code/state
      console.log("Handling auth callback with code/state");
      handleAuthCallback();
    } else if (auth === 'success') {
      // User was redirected back from successful authentication
      console.log("Handling successful auth redirect");
      handleSuccessfulAuth();
    } else {
      // Normal app startup - check auth status once
      console.log("App startup - checking auth status");
      checkAuthStatus();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount

  return {
    isAuthenticated,
    user,
    csrfToken,
    loading: isLoading,
    error,
    login,
    logout: handleLogout,
    checkAuthStatus,
    clearError,
  };
};
