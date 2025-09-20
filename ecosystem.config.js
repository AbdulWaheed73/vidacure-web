export const apps = [{
  name: 'vidacure-web',
  script: 'npm',
  args: 'run preview',
  env_production: {
    NODE_ENV: 'production'
  }
}];