export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  // Doctor Dashboard Routes
  DOCTOR_DASHBOARD: '/dashboard/doctor',
  DOCTOR_PRESCRIPTIONS: '/dashboard/doctor/prescriptions',
  DOCTOR_INBOX: '/dashboard/doctor/inbox',
  DOCTOR_ACCOUNT: '/dashboard/doctor/account',
  DOCTOR_CHAT: '/chat',
  // Patient Dashboard Routes (existing routes)
  PATIENT_DASHBOARD: '/dashboard/patient',
  PATIENT_HOME: '/dashboard',
  PATIENT_APPOINTMENTS: '/appointments',
  PATIENT_PRESCRIPTIONS: '/prescriptions',
  PATIENT_PROGRESS: '/progress',
  PATIENT_CHAT: '/chat',
  // Add more routes as needed
  PROFILE: '/profile',
  SETTINGS: '/settings',
  ABOUT: '/about',
  CONTACT: '/contact',
  BMI_CHECK: '/bmi-check',
  ONBOARDING: '/onboarding',
  SUBSCRIPTION_SUCCESS: '/subscription/success'
} as const;

export type RouteKeys = keyof typeof ROUTES;
export type RouteValues = typeof ROUTES[RouteKeys];
