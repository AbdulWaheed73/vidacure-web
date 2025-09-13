// Configuration for different environments
const config = {

  
  // Helper function to get server URL
  getServerUrl: () => `${import.meta.env.VITE_SERVER_URL}`,
  
  // Helper function to get frontend URL
  getFrontendUrl: () => `${import.meta.env.VITE_FRONTEND_URL}`,

};

export default config;
