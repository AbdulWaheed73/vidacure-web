// Environment configuration utility

type Environment = 'development' | 'production';

const getEnvironment = (): Environment => {
  // Check Vite's mode first, fallback to NODE_ENV, then default to development
  return (import.meta.env.MODE as Environment) ||
         (import.meta.env.VITE_NODE_ENV as Environment) ||
         'development';
};

const isProduction = (): boolean => {
  return getEnvironment() === 'production';
};

export const config = {
  environment: getEnvironment(),
  isProduction: isProduction(),

  // Dynamic URL selection based on environment
  serverUrl: isProduction()
    ? import.meta.env.VITE_PROD_SERVER_URL
    : import.meta.env.VITE_DEV_SERVER_URL,

  frontendUrl: isProduction()
    ? import.meta.env.VITE_PROD_FRONTEND_URL
    : import.meta.env.VITE_DEV_FRONTEND_URL,

  // Other config
  streamApiKey: import.meta.env.VITE_STREAM_API_KEY,
  appName: import.meta.env.VITE_APP_NAME,
  appVersion: import.meta.env.VITE_APP_VERSION,
};

// Log current configuration (only in development)
if (!isProduction()) {
  console.log('🏗️ Environment Configuration:', {
    environment: config.environment,
    serverUrl: config.serverUrl,
    frontendUrl: config.frontendUrl,
  });
}

export default config;