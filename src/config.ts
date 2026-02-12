// Configuration for different environments
const config = {
  getServerUrl: () => import.meta.env.VITE_SERVER_URL,
  getFrontendUrl: () => import.meta.env.VITE_FRONTEND_URL,
};

export default config;
