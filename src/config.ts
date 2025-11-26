// Configuration for different environments
const config = {
  // Helper function to get server URL
  getServerUrl: () => {
    const isDevelopment = import.meta.env.VITE_NODE_ENV === "development";
    const serverUrl = isDevelopment
      ? import.meta.env.VITE_DEV_SERVER_URL
      : import.meta.env.VITE_PROD_SERVER_URL;

    if (!serverUrl) {
      console.error('Server URL is undefined. Check your .env file for VITE_DEV_SERVER_URL or VITE_PROD_SERVER_URL');
    }

    return serverUrl;
  },

  // Helper function to get frontend URL
  getFrontendUrl: () => {
    const isDevelopment = import.meta.env.VITE_NODE_ENV === "development";
    const frontendUrl = isDevelopment
      ? import.meta.env.VITE_DEV_FRONTEND_URL
      : import.meta.env.VITE_PROD_FRONTEND_URL;

    if (!frontendUrl) {
      console.error('Frontend URL is undefined. Check your .env file for VITE_DEV_FRONTEND_URL or VITE_PROD_FRONTEND_URL');
    }

    return frontendUrl;
  },
};

export default config;
