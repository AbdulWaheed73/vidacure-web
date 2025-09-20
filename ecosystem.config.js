// ecosystem.config.js
export const apps = [{
  name: 'vidacure-web',
  script: 'serve',
  args: '-s dist -l 5173',
  env_production: {
    NODE_ENV: 'production'
  }
}];