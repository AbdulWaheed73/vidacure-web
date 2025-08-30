// User-related types for authentication and user management

export type User = {
  name: string;
  given_name: string;
  family_name: string;
  role: string;
  userId: string;
  lastLogin?: string;
  hasCompletedOnboarding?: boolean;
}

export type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  csrfToken: string | null;
  isLoading: boolean;
  error: string | null;
}

export type AuthActions = {
  checkAuthStatus: () => Promise<void>;
  setAuthData: (response: { authenticated: boolean; user?: User; csrfToken?: string }) => void;
  logout: () => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export type AuthStore = AuthState & AuthActions;

export type UserProfile = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    language: string;
  };
}

export type UserState = {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

export type UserActions = {
  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updatePreferences: (preferences: Partial<UserProfile['preferences']>) => void;
  clearUserData: () => void;
  setLoading: (loading: boolean) => void;
}

export type UserStore = UserState & UserActions;

export type ClientType = 'web' | 'mobile' | 'app';