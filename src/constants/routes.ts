export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  // Pre-login onboarding flow
  PRE_LOGIN_BMI: '/get-started',
  PRE_LOGIN_BOOKING: '/book-consultation',
  DASHBOARD: '/dashboard',
  // Admin Dashboard Routes
  ADMIN_DASHBOARD: '/admin',
  // Doctor Dashboard Routes
  DOCTOR_DASHBOARD: '/dashboard/doctor',
  DOCTOR_APPOINTMENTS: '/dashboard/doctor/appointments',
  DOCTOR_PRESCRIPTIONS: '/dashboard/doctor/prescriptions',
  DOCTOR_PATIENTS: '/dashboard/doctor/patients',
  DOCTOR_ACCOUNT: '/dashboard/doctor/account',
  DOCTOR_CHAT: '/supabase-chat',
  // Patient Dashboard Routes (existing routes)
  PATIENT_DASHBOARD: '/dashboard/patient',
  PATIENT_HOME: '/dashboard',
  PATIENT_APPOINTMENTS: '/appointments',
  PATIENT_PRESCRIPTIONS: '/prescriptions',
  PATIENT_PROGRESS: '/progress',
  PATIENT_LAB_TESTS: '/lab-tests',
  PATIENT_CHAT: '/supabase-chat',
  PATIENT_CONSENT: '/consent',
  // Add more routes as needed
  PROFILE: '/profile',
  SETTINGS: '/settings',
  ABOUT: '/about',
  ABOUT_US: '/aboutus',
  PRIVACY_POLICY: '/privacy',
  CONTACT: '/contact',
  ONBOARDING: '/onboarding',
  SUBSCRIPTION_SUCCESS: '/subscription/success',
  SUBSCRIPTION_CANCELED: '/subscription/canceled',
  SUBSCRIBE: '/subscribe',
  LAB_TEST_PAYMENT_SUCCESS: '/lab-tests/payment-success',
  LAB_TEST_PAYMENT_CANCELED: '/lab-tests/payment-canceled'
} as const;

export type RouteKeys = keyof typeof ROUTES;
export type RouteValues = typeof ROUTES[RouteKeys];
