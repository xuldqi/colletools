#!/bin/bash
cd /var/www/colletools
cp app.ts.simple api/app.ts
pm2 restart colletools
cat > /etc/nginx/sites-available/colletools << 'EOF'
server {
    listen 443 ssl http2;
    server_name colletools.com www.colletools.com;
    ssl_certificate /etc/letsencrypt/live/colletools.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/colletools.com/privkey.pem;
    root /var/www/colletools/dist;
    index index.html;
    location /api/ { proxy_pass http://localhost:3002; }
    location /health { proxy_pass http://localhost:3002/health; }
    location / { try_files $uri $uri/ /index.html; }
}
server {
    listen 80;
    server_name colletools.com www.colletools.com;
    return 301 https://$host$request_uri;
}
EOF
nginx -t && systemctl reload nginx