import { useAuthStore as authHook } from './authStore';
import { useAppStore as appHook } from './appStore';

export { useAuthStore } from './authStore';
export { useUserStore } from './userStore';
export { useAppStore } from './appStore';

// Re-export types from the centralized types folder
export type { AuthStore, User } from '../types/user-types';
export type { UserStore } from '../types/user-types';
export type { AppStore } from '../types/app-types';

// Custom hooks for common patterns
export const useAuth = () => {
  const authStore = authHook();
  return { isAuthenticated: authStore.isAuthenticated, user: authStore.user, csrfToken: authStore.csrfToken };
};

export const useTheme = () => {
  const appStore = appHook();
  return { theme: appStore.theme, setTheme: appStore.setTheme };
};