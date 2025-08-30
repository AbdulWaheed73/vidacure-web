// Generic and shared types used across the application

// Common utility types
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Loading and error states
export type LoadingState = {
  isLoading: boolean;
  error: string | null;
}

// Theme and UI types
export type Theme = 'light' | 'dark';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export type Notification = {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: Date;
}

// Form and validation types
export type FormValidationError = {
  field: string;
  message: string;
}

export type ValidationState = {
  isValid: boolean;
  errors: FormValidationError[];
}

// API endpoints and HTTP types
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type RequestConfig = {
  method: HttpMethod;
  url: string;
  data?: any;
  headers?: Record<string, string>;
  params?: Record<string, any>;
}