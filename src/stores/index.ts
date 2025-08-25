export { useAuthStore } from './authStore';
export { useUserStore } from './userStore';
export { useAppStore } from './appStore';

// Re-export types if needed
export type { AuthStore } from './authStore';
export type { UserStore } from './userStore';
export type { AppStore } from './appStore';

// Custom hooks for common patterns
export const useAuth = () => {
  const { isAuthenticated, user, token } = useAuthStore();
  return { isAuthenticated, user, token };
};

export const useTheme = () => {
  const { theme, setTheme } = useAppStore();
  return { theme, setTheme };
};