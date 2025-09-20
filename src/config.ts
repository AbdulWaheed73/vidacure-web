// Configuration for different environments
const config = {

  
  // Helper function to get server URL
  getServerUrl: () => `${import.meta.env.VITE_NODE_ENV === "development" ? import.meta.env.VITE_DEV_SERVER_URL: import.meta.env.VITE_PROD_SERVER_URL}`,
  
  // Helper function to get frontend URL
  getFrontendUrl: () => `${import.meta.env.VITE_NODE_ENV === "development" ? import.meta.env.VITE_DEV_FRONTEND_URL: import.meta.env.VITE_PROD_FRONTEND_URL}`,

};

export default config;
