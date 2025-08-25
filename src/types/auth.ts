export interface User {
  name: string;
  role: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string;
  csrfToken: string;
  showSuccessMessage: boolean;
}

export type ClientType = 'web' | 'mobile' | 'app';
