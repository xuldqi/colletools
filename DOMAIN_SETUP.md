# Colletools.com 域名绑定指南

## 🌐 域名绑定原理

您的项目使用 Docker Compose 和 Nginx 来管理多域名：

- **colletools.com** → 端口 3000（主应用）
- **dropshare.com** → 端口 3001（第二应用）

## 🔧 当前配置

### Docker Compose 配置
```yaml
# 主域名应用容器
colletools-app:
  environment:
    - DOMAIN=${PRIMARY_DOMAIN}  # colletools.com
    - PORT=3000

# 第二域名应用容器  
colletools-app-secondary:
  environment:
    - DOMAIN=${SECONDARY_DOMAIN}  # dropshare.com
    - PORT=3001
```

### Nginx 配置
- **colletools.com** 和 **www.colletools.com** → 代理到 `colletools-app:3000`
- **dropshare.com** 和 **www.dropshare.com** → 代理到 `colletools-app-secondary:3001`

## 🚀 部署步骤

### 1. 在服务器上克隆项目
```bash
cd /var/www
git clone https://github.com/xuldqi/colletools.git
cd colletools
```

### 2. 配置环境变量
```bash
# 复制 colletools 专用配置
cp colletools-only.env .env

# 编辑配置文件
nano .env
```

确保 `.env` 文件内容：
```env
PRIMARY_DOMAIN=colletools.com
SECONDARY_DOMAIN=colletools.com
SSL_EMAIL=your-email@example.com
```

### 3. 运行部署脚本
```bash
# 给脚本执行权限
chmod +x deploy-colletools.sh

# 运行部署
./deploy-colletools.sh
```

### 4. 检查服务状态
```bash
# 查看容器状态
docker-compose ps

# 查看日志
docker-compose logs -f colletools-app
```

## 🔍 域名验证

### 1. DNS 设置
确保您的域名 DNS 记录指向服务器 IP：
```
colletools.com     A     YOUR_SERVER_IP
www.colletools.com CNAME colletools.com
```

### 2. 端口检查
确保服务器防火墙开放端口：
```bash
# 检查端口状态
netstat -tulpn | grep :80
netstat -tulpn | grep :443
```

### 3. SSL 证书
首次启动后，系统会自动申请 Let's Encrypt SSL 证书：
```bash
# 查看证书状态
docker-compose logs certbot-primary
```

## 🛠️ 故障排除

### 如果域名无法访问

1. **检查 DNS 解析**
   ```bash
   nslookup colletools.com
   ```

2. **检查容器状态**
   ```bash
   docker-compose ps
   docker-compose logs nginx
   ```

3. **检查端口占用**
   ```bash
   netstat -tulpn | grep :80
   netstat -tulpn | grep :443
   ```

### 如果 SSL 证书申请失败

1. **检查域名解析**
   ```bash
   dig colletools.com
   ```

2. **检查防火墙设置**
   ```bash
   ufw status
   ```

3. **手动申请证书**
   ```bash
   docker-compose run --rm certbot-primary certonly --webroot --webroot-path=/var/www/certbot --email your-email@example.com --agree-tos --no-eff-email -d colletools.com -d www.colletools.com
   ```

## 📋 常用命令

```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 查看日志
docker-compose logs -f

# 更新代码后重启
git pull origin main
docker-compose down
docker-compose up -d --build
```

## 🌟 成功标志

部署成功后，您应该能够：
- ✅ 访问 https://colletools.com
- ✅ 访问 https://www.colletools.com
- ✅ 看到 SSL 证书锁图标
- ✅ 所有功能正常工作
