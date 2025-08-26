export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  // Add more routes as needed
  PROFILE: '/profile',
  SETTINGS: '/settings',
  ABOUT: '/about',
  CONTACT: '/contact',
} as const;

export type RouteKeys = keyof typeof ROUTES;
export type RouteValues = typeof ROUTES[RouteKeys];
