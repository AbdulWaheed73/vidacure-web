module.exports = {
  apps: [{
    name: 'vidacure-web',
    script: 'serve',
    args: '-s dist -l 5173',
    env_production: {
      NODE_ENV: 'production'
    },
    time: true
  }]
};
