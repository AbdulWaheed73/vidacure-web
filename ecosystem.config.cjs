module.exports = {
  apps: [{
    name: 'vidacure-web',
    script: 'serve',
    args: '-s dist -l tcp://0.0.0.0:5173',
    env_production: {
      NODE_ENV: 'production'
    },
    time: true
  }]
};
