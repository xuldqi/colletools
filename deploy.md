# ColleTools 多域名部署指南

本指南将帮助您在自己的服务器上部署 ColleTools 项目，支持多个域名独立运行。

## 📋 部署前准备

### 1. 服务器要求
- Ubuntu 20.04+ 或 CentOS 8+
- 至少 2GB RAM
- 至少 20GB 存储空间
- 已安装 Docker 和 Docker Compose
- 已配置防火墙开放 80 和 443 端口

### 2. 域名要求
- 两个已备案的域名（例如：colletools.com 和 toolbox.com）
- 域名 DNS 已指向服务器 IP 地址
- 包括 www 子域名的解析

### 3. 必要软件安装

```bash
# 安装 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 重新登录以应用 Docker 组权限
logout
```

## 🚀 部署步骤

### 步骤 1: 克隆项目

```bash
# 克隆项目到服务器
git clone https://github.com/xuldqi/colletools.git
cd colletools

# 创建必要的目录
mkdir -p logs logs-secondary ssl logs/nginx
```

### 步骤 2: 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑环境变量
nano .env
```

在 `.env` 文件中配置以下关键变量：

```bash
# 域名配置
PRIMARY_DOMAIN=colletools.com
SECONDARY_DOMAIN=toolbox.com

# SSL 邮箱
SSL_EMAIL=your-email@example.com

# Firebase 配置（从 Firebase 控制台获取）
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
# ... 其他 Firebase 配置
```

### 步骤 3: 配置 GitHub Actions 自动部署

在 GitHub 仓库的 Settings > Secrets and variables > Actions 中添加以下密钥：

| 密钥名称 | 描述 | 示例值 |
|---------|------|--------|
| `SERVER_HOST` | 服务器 IP 地址 | `123.456.789.0` |
| `SERVER_USER` | 服务器用户名 | `ubuntu` |
| `SERVER_SSH_KEY` | SSH 私钥 | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `SERVER_PATH` | 项目部署路径 | `/home/ubuntu/colletools` |

#### 生成 SSH 密钥对：

```bash
# 在本地生成 SSH 密钥对
ssh-keygen -t rsa -b 4096 -C "your-email@example.com" -f ~/.ssh/deploy_key

# 将公钥添加到服务器
ssh-copy-id -i ~/.ssh/deploy_key.pub user@your-server-ip

# 将私钥内容复制到 GitHub Secrets
cat ~/.ssh/deploy_key
```

### 步骤 4: 首次部署

#### 方法 1: 使用 GitHub Actions（推荐）

1. 推送代码到 GitHub 的 `main` 分支
2. GitHub Actions 将自动触发部署流程
3. 在 GitHub 仓库的 Actions 标签页查看部署状态

#### 方法 2: 手动部署

```bash
# 在服务器上手动部署
cd /path/to/colletools

# 构建并启动服务
docker-compose up -d --build

# 查看服务状态
docker-compose ps
```

### 步骤 5: SSL 证书配置

```bash
# 为主域名申请 SSL 证书
docker-compose run --rm certbot-primary

# 为第二域名申请 SSL 证书
docker-compose run --rm certbot-secondary

# 重启 Nginx 以加载证书
docker-compose restart nginx
```

### 步骤 6: 设置 SSL 证书自动续期

```bash
# 创建续期脚本
sudo nano /etc/cron.d/certbot-renew
```

添加以下内容：

```bash
# 每月 1 号凌晨 2 点自动续期证书
0 2 1 * * root cd /path/to/colletools && docker-compose run --rm certbot-primary renew && docker-compose run --rm certbot-secondary renew && docker-compose restart nginx
```

## 🔧 配置说明

### Nginx 配置特点

- **多域名支持**: 每个域名独立配置，互不干扰
- **自动 HTTPS 重定向**: HTTP 请求自动跳转到 HTTPS
- **安全头设置**: 包含 HSTS、XSS 保护等安全配置
- **静态文件缓存**: 优化静态资源加载速度
- **速率限制**: 防止 API 滥用

### Docker Compose 架构

```
┌─────────────────┐    ┌─────────────────┐
│   Primary App   │    │  Secondary App  │
│   (Port 3000)   │    │   (Port 3001)   │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────────┬───────────┘
                     │
            ┌─────────────────┐
            │      Nginx      │
            │   (80 & 443)    │
            └─────────────────┘
                     │
            ┌─────────────────┐
            │    Internet     │
            └─────────────────┘
```

## 🔍 故障排除

### 常见问题

#### 1. 容器启动失败

```bash
# 查看容器日志
docker-compose logs colletools-app
docker-compose logs colletools-app-secondary
docker-compose logs nginx

# 检查容器状态
docker-compose ps
```

#### 2. SSL 证书申请失败

```bash
# 检查域名解析
nslookup your-domain.com

# 检查防火墙
sudo ufw status

# 手动申请证书（调试模式）
docker-compose run --rm certbot-primary certonly --webroot --webroot-path=/var/www/certbot --email your-email@example.com --agree-tos --no-eff-email --staging -d your-domain.com
```

#### 3. Nginx 配置错误

```bash
# 测试 Nginx 配置
docker-compose exec nginx nginx -t

# 重新加载 Nginx 配置
docker-compose exec nginx nginx -s reload
```

#### 4. 应用无法访问

```bash
# 检查应用健康状态
curl http://localhost:3000/health
curl http://localhost:3001/health

# 检查网络连接
docker network ls
docker network inspect colletools_colletools-network
```

### 日志查看

```bash
# 查看应用日志
tail -f logs/app.log
tail -f logs-secondary/app.log

# 查看 Nginx 日志
tail -f logs/nginx/access.log
tail -f logs/nginx/error.log

# 查看 Docker 容器日志
docker-compose logs -f
```

## 🔄 更新部署

### 自动更新（GitHub Actions）

1. 推送代码到 `main` 分支
2. GitHub Actions 自动构建和部署
3. 零停机时间更新

### 手动更新

```bash
# 拉取最新代码
git pull origin main

# 重新构建并部署
docker-compose down
docker-compose up -d --build

# 清理未使用的镜像
docker image prune -f
```

## 📊 监控和维护

### 性能监控

```bash
# 查看资源使用情况
docker stats

# 查看磁盘使用
df -h
du -sh logs/
```

### 备份策略

```bash
# 备份配置文件
tar -czf backup-$(date +%Y%m%d).tar.gz .env nginx.conf docker-compose.yml

# 备份 SSL 证书
tar -czf ssl-backup-$(date +%Y%m%d).tar.gz ssl/
```

### 日志轮转

```bash
# 配置日志轮转
sudo nano /etc/logrotate.d/colletools
```

添加以下内容：

```
/path/to/colletools/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    copytruncate
}
```

## 🔐 安全建议

1. **定期更新**: 保持系统和 Docker 镜像更新
2. **防火墙配置**: 只开放必要端口（80, 443, 22）
3. **SSH 安全**: 禁用密码登录，只使用密钥认证
4. **SSL 配置**: 使用强加密套件和 HSTS
5. **监控日志**: 定期检查访问日志和错误日志
6. **备份策略**: 定期备份配置和数据

## 📞 技术支持

如果在部署过程中遇到问题，请：

1. 查看本文档的故障排除部分
2. 检查 GitHub Issues
3. 提交新的 Issue 并附上详细的错误信息和日志

---

**祝您部署成功！** 🎉