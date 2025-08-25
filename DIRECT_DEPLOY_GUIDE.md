# 🚀 ColleTools 直接部署完整指南

## 📋 部署前准备

### 1. 服务器要求
- Ubuntu 18.04+ 或类似Linux系统
- 至少 2GB 内存
- Node.js 18+ 支持
- 有sudo权限

### 2. 域名准备
确保以下域名已解析到服务器IP：
- colletools.com → 服务器IP
- www.colletools.com → 服务器IP
- dropshare.com → 服务器IP（可选）
- www.dropshare.com → 服务器IP（可选）

## 🚀 一键部署

### 方式1：使用部署脚本（推荐）
```bash
# 1. 上传项目到服务器
# 2. 进入项目目录
cd /path/to/colletools

# 3. 运行部署脚本
sudo chmod +x deploy-direct.sh
sudo ./deploy-direct.sh
```

### 方式2：手动部署
```bash
# 1. 安装依赖软件
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs nginx
sudo npm install -g pm2

# 2. 设置项目
sudo mkdir -p /var/www/colletools
sudo cp -r * /var/www/colletools/
cd /var/www/colletools

# 3. 安装和构建
npm install
npm run build

# 4. 启动应用
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# 5. 配置nginx
sudo cp nginx.direct.conf /etc/nginx/sites-available/colletools
sudo ln -s /etc/nginx/sites-available/colletools /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 6. 配置防火墙
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

## 🔐 SSL 配置（推荐）

```bash
# 运行SSL配置脚本
sudo chmod +x setup-ssl-direct.sh
sudo ./setup-ssl-direct.sh
```

## 📊 多项目管理

### 当前项目端口分配建议：
- **现有项目**: localhost:3001
- **ColleTools**: localhost:3002
- **将来项目**: localhost:3003, 3004...

### Nginx 主配置示例：
```nginx
# /etc/nginx/sites-available/default

# 现有项目
server {
    listen 80;
    server_name existing-project.com;
    location / {
        proxy_pass http://localhost:3001;
    }
}

# ColleTools
server {
    listen 80;
    server_name colletools.com;
    location / {
        proxy_pass http://localhost:3002;
    }
}

# 将来的项目
server {
    listen 80;
    server_name future-project.com;
    location / {
        proxy_pass http://localhost:3003;
    }
}
```

## 🔧 管理命令

### PM2 应用管理
```bash
# 查看所有应用
pm2 list

# 查看特定应用状态
pm2 show colletools

# 查看日志
pm2 logs colletools

# 重启应用
pm2 restart colletools

# 停止应用
pm2 stop colletools
```

### 系统管理
```bash
# 重启nginx
sudo systemctl restart nginx

# 查看nginx状态
sudo systemctl status nginx

# 查看端口占用
sudo netstat -tulpn | grep -E "80|443|300[0-9]"
```

## 🔄 更新流程

```bash
cd /var/www/colletools

# 1. 备份（可选）
cp -r uploads uploads.backup

# 2. 更新代码
git pull  # 或重新上传文件

# 3. 安装新依赖
npm install

# 4. 重新构建
npm run build

# 5. 重启应用
pm2 restart colletools

# 6. 检查状态
pm2 status
```

## 🩺 故障排查

### 1. 应用无法启动
```bash
# 查看PM2日志
pm2 logs colletools --err

# 检查端口占用
sudo lsof -i :3002

# 手动测试启动
cd /var/www/colletools
node api/server.js
```

### 2. 网站无法访问
```bash
# 检查nginx状态
sudo systemctl status nginx

# 检查nginx配置
sudo nginx -t

# 查看nginx错误日志
sudo tail -f /var/log/nginx/error.log
```

### 3. SSL问题
```bash
# 查看证书状态
sudo certbot certificates

# 测试SSL连接
curl -I https://colletools.com

# 手动续期测试
sudo certbot renew --dry-run
```

## 📈 监控建议

### 1. 设置日志轮转
```bash
# 创建 PM2 日志轮转配置
sudo nano /etc/logrotate.d/pm2
```

### 2. 监控磁盘空间
```bash
# 添加到定时任务
echo "0 6 * * * df -h > /var/log/disk-usage.log" | sudo crontab -
```

## 🎯 性能优化（可选）

### 1. 启用Gzip压缩
在nginx配置中添加：
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

### 2. 配置缓存
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## ✅ 完成检查

部署完成后，确认以下项目：

- [ ] PM2 显示应用状态为 "online"
- [ ] 可以访问 http://your-domain.com
- [ ] API 端点正常：http://your-domain.com/health
- [ ] SSL 配置正确（如果配置了）
- [ ] 日志正常写入
- [ ] 开机自启设置完成

---

**🎉 现在你的ColleTools应用可以与现有项目和平共存了！**