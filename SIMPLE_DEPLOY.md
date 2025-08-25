# 🚀 ColleTools 简单部署指南（无 Docker）

## 服务器准备

### 1. 安装必要软件
```bash
# 安装 Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 PM2
sudo npm install -g pm2

# 安装 Nginx（如果没有）
sudo apt-get install nginx
```

### 2. 上传项目
```bash
# 方式1：Git clone
cd /var/www
git clone [你的仓库地址] colletools

# 方式2：直接上传
# 将项目文件夹上传到 /var/www/colletools
```

### 3. 安装依赖和构建
```bash
cd /var/www/colletools
npm install
npm run build
```

### 4. 创建生产环境配置
```bash
# 创建 .env 文件
cat > .env << EOF
NODE_ENV=production
PORT=3002
PRIMARY_DOMAIN=colletools.com
SECONDARY_DOMAIN=dropshare.com
EOF
```

### 5. 使用 PM2 启动应用
```bash
# 启动应用
pm2 start api/server.js --name colletools \
  --env production \
  -- --port 3002

# 保存 PM2 配置
pm2 save

# 设置开机自启
pm2 startup
# 按照提示执行命令
```

### 6. 配置 Nginx
```bash
# 创建 nginx 配置
sudo nano /etc/nginx/sites-available/colletools

# 添加以下内容：
```

```nginx
server {
    listen 80;
    server_name colletools.com www.colletools.com;
    
    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    client_max_body_size 100M;
}

# 如果有第二个域名
server {
    listen 80;
    server_name dropshare.com www.dropshare.com;
    
    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    client_max_body_size 100M;
}
```

```bash
# 启用配置
sudo ln -s /etc/nginx/sites-available/colletools /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 7. 配置 SSL（可选但推荐）
```bash
# 安装 Certbot
sudo apt-get install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d colletools.com -d www.colletools.com
sudo certbot --nginx -d dropshare.com -d www.dropshare.com
```

## 管理命令

### 查看状态
```bash
# 查看应用状态
pm2 status

# 查看日志
pm2 logs colletools

# 实时日志
pm2 logs colletools --lines 100 -f
```

### 重启/停止
```bash
# 重启
pm2 restart colletools

# 停止
pm2 stop colletools

# 删除
pm2 delete colletools
```

### 更新代码
```bash
cd /var/www/colletools
git pull
npm install
npm run build
pm2 restart colletools
```

## 故障排查

### 1. 检查端口
```bash
# 查看端口占用
sudo lsof -i :3002
sudo netstat -tulpn | grep 3002
```

### 2. 检查 Nginx
```bash
# 测试配置
sudo nginx -t

# 查看错误日志
sudo tail -f /var/log/nginx/error.log
```

### 3. 检查应用日志
```bash
pm2 logs colletools --err
```

## 防火墙配置
```bash
# 开放端口
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

## 完成！🎉

现在你的应用应该可以通过以下方式访问：
- http://colletools.com
- http://dropshare.com

如果配置了 SSL：
- https://colletools.com
- https://dropshare.com

## 优势总结

✅ **部署简单** - 10分钟完成  
✅ **维护方便** - PM2 提供完善的管理功能  
✅ **资源占用少** - 没有 Docker 开销  
✅ **调试直接** - 可以直接查看文件和日志  
✅ **适合小项目** - 2-5个项目的最佳选择