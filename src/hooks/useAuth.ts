import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../stores/authStore";
import { AuthService } from "../services";
import { api, updateCsrfToken } from "../services/api";
import { useConsentStore } from "../stores/consentStore";
import type { User } from "../types";

type AuthMeResponse = {
  authenticated: boolean;
  user: User | null;
  csrfToken: string | null;
  consentStatus?: {
    hasAcceptedLatest: boolean;
    currentVersion: string;
  };
};

// Fetch auth status from /api/me
const fetchAuthStatus = async (): Promise<AuthMeResponse> => {
  try {
    const response = await api.get<AuthMeResponse>("/api/me");
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as { response?: { status?: number } };
    // 401 is expected for unauthenticated users — return unauthenticated state
    if (axiosError.response?.status === 401) {
      return { authenticated: false, user: null, csrfToken: null };
    }
    throw error;
  }
};


export const useAuth = () => {
  const queryClient = useQueryClient();
  const {
    isAuthenticated,
    user,
    csrfToken,
    isLoading: storeLoading,
    error,
    logout: storeLogout,
    clearError,
    setLoading,
    setAuthData,
  } = useAuthStore();

  // Capture auth callback flags ONCE on mount via ref — prevents them from
  // flipping to false after URL params are stripped, which would enable
  // React Query and cause a race condition with the manual auth handler.
  const urlParams = new URLSearchParams(window.location.search);
  const [isAuthCallback] = useState(() => !!(urlParams.get("code") && urlParams.get("state")));
  const [isAuthSuccess] = useState(() => urlParams.get("auth") === "success");
  const isAdminRoute = window.location.pathname.startsWith("/admin");

  // React Query for /api/me — single source of truth for auth checking
  const { data: authData, isLoading: queryLoading } = useQuery<AuthMeResponse>({
    queryKey: ["auth", "me"],
    queryFn: fetchAuthStatus,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
    refetchOnWindowFocus: true,
    enabled: !isAuthCallback && !isAuthSuccess && !isAdminRoute,
  });

  // Sync React Query data to Zustand store
  useEffect(() => {
    if (!authData) return;

    if (authData.authenticated && authData.user && authData.csrfToken) {
      localStorage.setItem("csrfToken", authData.csrfToken);
      updateCsrfToken(authData.csrfToken);
      useAuthStore.setState({
        isAuthenticated: true,
        user: authData.user,
        csrfToken: authData.csrfToken,
        isLoading: false,
      });

      if (authData.consentStatus) {
        useConsentStore.getState().setConsentFromAuth(authData.consentStatus);
      }

    } else {
      useAuthStore.setState({
        isAuthenticated: false,
        user: null,
        csrfToken: null,
        isLoading: false,
      });
    }
  }, [authData]);

  // Handle login — initiates BankID flow
  const login = async () => {
    try {
      clearError();
      setLoading(true);
      AuthService.initiateLogin();
    } catch {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      clearError();
      setLoading(true);
      await AuthService.logout();
      storeLogout();
      AuthService.clearUserData();
      queryClient.setQueryData<AuthMeResponse>(["auth", "me"], {
        authenticated: false,
        user: null,
        csrfToken: null,
      });
    } catch {
      // ignore logout errors
    } finally {
      setLoading(false);
    }
  };

  // Process a successful auth response (shared by callback and success redirect)
  const processAuthResponse = async (response: AuthMeResponse) => {
    if (!response.authenticated || !response.user) return;

    let user = response.user;

    if (user.role === "patient" && response.csrfToken) {
      updateCsrfToken(response.csrfToken);
    }

    const updatedResponse = { ...response, user };

    setAuthData({
      authenticated: response.authenticated,
      user,
      csrfToken: response.csrfToken ?? undefined,
      consentStatus: response.consentStatus,
    });
    queryClient.setQueryData<AuthMeResponse>(["auth", "me"], updatedResponse);

    AuthService.storeUserData(user, response.csrfToken ?? undefined);
  };

  // Handle authentication callback (BankID return with code/state)
  const handleAuthCallback = async () => {
    try {
      clearError();
      setLoading(true);
      const response = await AuthService.checkAuthStatus();
      await processAuthResponse(response);
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname,
      );
    } catch (err) {
      console.log(
        "Auth check failed:",
        err instanceof Error ? err.message : "Unknown error",
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle successful auth redirect (?auth=success)
  const handleSuccessfulAuth = async () => {
    clearError();
    setLoading(true);
    try {
      const response = await AuthService.checkAuthStatus();
      await processAuthResponse(response);
    } catch (err) {
      console.log(
        "Auth check failed:",
        err instanceof Error ? err.message : "Unknown error",
      );
    } finally {
      window.history.replaceState({}, document.title, window.location.pathname);
      setLoading(false);
    }
  };

  // Handle BankID callbacks on mount
  useEffect(() => {
    if (isAdminRoute) return;

    if (isAuthCallback) {
      handleAuthCallback();
    } else if (isAuthSuccess) {
      handleSuccessfulAuth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isAuthenticated,
    user,
    csrfToken,
    loading: storeLoading || queryLoading,
    error,
    login,
    logout: handleLogout,
    clearError,
  };
};
