import { useState, useEffect } from 'react';
import type { AuthState } from '../types';
import { AuthService, updateCsrfToken } from '../services';
import { getCookie, clearCookie } from '../utils';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: '',
    csrfToken: '',
    showSuccessMessage: false,
  });

  // Check authentication status
  const checkAuthStatus = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: '' }));
      
      // Get stored CSRF token from localStorage or cookie
      let storedCsrfToken = AuthService.getStoredCsrfToken();
      if (!storedCsrfToken) {
        storedCsrfToken = getCookie('csrf_token');
        if (storedCsrfToken) {
          setAuthState(prev => ({ ...prev, csrfToken: storedCsrfToken! }));
          localStorage.setItem('csrfToken', storedCsrfToken);
        }
      } else {
        setAuthState(prev => ({ ...prev, csrfToken: storedCsrfToken! }));
      }
      
      const response = await AuthService.checkAuthStatus();
      
      if (response.authenticated) {
        setAuthState(prev => ({ ...prev, isAuthenticated: true }));
        // Try to get user info from localStorage if available
        const storedUser = AuthService.getStoredUser();
        if (storedUser) {
          setAuthState(prev => ({ ...prev, user: storedUser }));
        }
      } else {
        setAuthState(prev => ({ ...prev, isAuthenticated: false, user: null }));
      }
    } catch (err: any) {
      console.log('Not authenticated or error:', err.message);
      setAuthState(prev => ({ ...prev, isAuthenticated: false, user: null }));
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  // Handle login
  const login = async () => {
    try {
      setAuthState(prev => ({ ...prev, error: '', loading: true }));
      AuthService.initiateLogin();
    } catch (err: any) {
      setAuthState(prev => ({ ...prev, error: 'Login failed: ' + err.message, loading: false }));
    }
  };

  // Handle logout
  const logout = async () => {
    try {
      setAuthState(prev => ({ ...prev, error: '', loading: true }));
      
      await AuthService.logout();
      
      // Clear local state
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: '',
        csrfToken: '',
        showSuccessMessage: false,
      });
      
      // Clear stored data
      AuthService.clearUserData();
      
      // Clear CSRF cookie
      clearCookie('csrf_token');
      
    } catch (err: any) {
      setAuthState(prev => ({ ...prev, error: 'Logout failed: ' + err.message, loading: false }));
    }
  };

  // Handle authentication callback
  const handleAuthCallback = async (_code: string, _state: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: '' }));
      
      // The backend will handle the callback and set cookies
      // We just need to wait a moment and then check auth status
      setTimeout(async () => {
        try {
          const response = await AuthService.checkAuthStatus();
          
          if (response.authenticated) {
            setAuthState(prev => ({ 
              ...prev, 
              isAuthenticated: true, 
              showSuccessMessage: true 
            }));
            
            // Get user info and CSRF token from the response
            if (response.user) {
              setAuthState(prev => ({ ...prev, user: response.user }));
              AuthService.storeUserData(response.user);
            }
            if (response.csrfToken) {
              setAuthState(prev => ({ ...prev, csrfToken: response.csrfToken }));
              localStorage.setItem('csrfToken', response.csrfToken);
              updateCsrfToken(response.csrfToken);
            }
            
            // Clear URL parameters
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } catch (err: any) {
          console.log('Auth check failed:', err.message);
        } finally {
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      }, 1000); // Wait 1 second for backend to process
      
    } catch (err: any) {
      setAuthState(prev => ({ 
        ...prev, 
        error: 'Authentication callback failed: ' + err.message, 
        loading: false 
      }));
    }
  };

  // Clear error
  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: '' }));
  };

  // Handle successful auth redirect
  const handleSuccessfulAuth = () => {
    setAuthState(prev => ({ ...prev, showSuccessMessage: true, error: '' }));
    
    // Get CSRF token from cookie
    const csrfToken = getCookie('csrf_token');
    if (csrfToken) {
      setAuthState(prev => ({ ...prev, csrfToken }));
      localStorage.setItem('csrfToken', csrfToken);
      updateCsrfToken(csrfToken);
      console.log('CSRF token stored:', csrfToken);
    }
    
    // Clear URL parameters
    window.history.replaceState({}, document.title, window.location.pathname);
    
    // Check auth status after a short delay
    setTimeout(() => {
      checkAuthStatus();
    }, 500);
  };

  // Check auth and hide success message
  const checkAuthAndHideSuccess = async () => {
    await checkAuthStatus();
    setAuthState(prev => ({ ...prev, showSuccessMessage: false }));
  };

  // Effect to check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Effect to handle URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const auth = urlParams.get('auth');
    
    if (code && state) {
      // User just came back from authentication with code/state
      handleAuthCallback(code, state);
    } else if (auth === 'success') {
      // User was redirected back from successful authentication
      handleSuccessfulAuth();
    }
  }, []);

  return {
    ...authState,
    login,
    logout,
    checkAuthStatus,
    clearError,
    checkAuthAndHideSuccess,
  };
};
