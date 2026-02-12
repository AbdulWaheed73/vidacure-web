// Environment configuration utility

export const config = {
  environment: import.meta.env.MODE,
  isProduction: import.meta.env.MODE === 'production',
  serverUrl: import.meta.env.VITE_SERVER_URL,
  frontendUrl: import.meta.env.VITE_FRONTEND_URL,
  streamApiKey: import.meta.env.VITE_STREAM_API_KEY,
  appName: import.meta.env.VITE_APP_NAME,
  appVersion: import.meta.env.VITE_APP_VERSION,
};

// Log current configuration (only in development)
if (!config.isProduction) {
  console.log('🏗️ Environment Configuration:', {
    environment: config.environment,
    serverUrl: config.serverUrl,
    frontendUrl: config.frontendUrl,
  });
}

export default config;
