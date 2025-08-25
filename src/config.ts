// Configuration for different environments
const config = {
  // Change this to your computer's IP address when testing on mobile
  // Use 'localhost' for local development, 'localhost' for mobile testing
  SERVER_HOST: 'localhost', // Your computer's IP address
  SERVER_PORT: '3000',
  FRONTEND_HOST: 'localhost', // Your computer's IP address
  FRONTEND_PORT: '5173',
  
  // Helper function to get server URL
  getServerUrl: () => `http://${config.SERVER_HOST}:${config.SERVER_PORT}`,
  
  // Helper function to get frontend URL
  getFrontendUrl: () => `http://${config.FRONTEND_HOST}:${config.FRONTEND_PORT}`,
  
  // Helper function to check if we're using IP address
  isUsingIP: () => config.SERVER_HOST !== 'localhost'
};

export default config;
