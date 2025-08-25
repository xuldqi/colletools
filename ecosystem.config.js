module.exports = {
  apps: [{
    name: 'colletools',
    script: 'api/server.js',
    cwd: '/var/www/colletools',
    args: '--port 3002',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: '3002'
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_file: './logs/pm2-combined.log',
    time: true,
    max_memory_restart: '1G',
    restart_delay: 1000,
    watch: false,
    ignore_watch: ['node_modules', 'uploads', 'logs']
  }]
};