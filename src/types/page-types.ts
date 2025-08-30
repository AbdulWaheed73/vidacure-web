// Page component prop types

// Page component prop types
import type { User } from './user-types';

export type DashboardPageProps = {
  user: User | null;
  onLogout: () => void;
  loading: boolean;
}

export type LoginPageProps = {
  onLogin: () => void;
  loading: boolean;
}