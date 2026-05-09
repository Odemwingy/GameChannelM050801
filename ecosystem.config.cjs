module.exports = {
  apps: [
    {
      name: 'game-channel-server',
      script: 'server/index.js',
      env: {
        NODE_ENV: 'production',
        API_PORT: '3000',
        WS_PORT: '3001',
      },
    },
    {
      name: 'nginx',
      script: 'nginx',
      args: '-g "daemon off;"',
      autorestart: false,
    },
  ],
}
