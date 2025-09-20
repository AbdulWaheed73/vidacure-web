export const apps = [{
  name: 'vidacure-web',
  script: 'serve',
  args: '-s dist -p 5173',
  instances: 1,
  autorestart: true,
  watch: false,
  max_memory_restart: '500M',
  env: {
    NODE_ENV: 'development',
    PORT: 5173
  },
  env_production: {
    NODE_ENV: 'production',
    PORT: 5173
  },
  error_file: './logs/err.log',
  out_file: './logs/out.log',
  log_file: './logs/combined.log',
  time: true
}];