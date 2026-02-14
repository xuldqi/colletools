# Colletools 部署指南

## 问题诊断

根据您的终端截图，主要问题是：

1. **缺少 .env 文件** - Docker Compose 需要环境变量配置
2. **目录结构不完整** - 缺少必要的目录
3. **域名配置混乱** - colletools 可能连接到了 dropshare 的配置

## 解决方案

### 1. 在服务器上执行以下命令

```bash
# 进入项目目录
cd /var/www/colletools

# 给部署脚本执行权限
chmod +x deploy.sh

# 运行部署脚本
./deploy.sh
```

### 2. 手动创建 .env 文件（如果脚本失败）

```bash
# 复制环境变量模板
cp env.template .env

# 编辑 .env 文件
nano .env
```

### 3. 配置 .env 文件

确保 `.env` 文件包含以下内容：

```env
# 域名配置
PRIMARY_DOMAIN=colletools.com
SECONDARY_DOMAIN=dropshare.com

# SSL 证书邮箱（替换为您的邮箱）
SSL_EMAIL=your-email@example.com

# 应用配置
NODE_ENV=production
PORT=3000
```

### 4. 启动服务

```bash
# 停止现有容器
docker-compose down

# 创建必要目录
mkdir -p uploads logs logs-secondary ssl

# 启动服务
docker-compose up -d --build
```

### 5. 检查服务状态

```bash
# 查看容器状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

## 域名配置说明

- **PRIMARY_DOMAIN=colletools.com** - 主域名，运行在端口 3000
- **SECONDARY_DOMAIN=dropshare.com** - 第二域名，运行在端口 3001

两个域名将分别指向不同的容器，互不干扰。

## 故障排除

### 如果仍然无法启动

1. **检查 Docker 是否运行**
   ```bash
   docker --version
   docker-compose --version
   ```

2. **检查端口占用**
   ```bash
   netstat -tulpn | grep :80
   netstat -tulpn | grep :443
   ```

3. **查看详细错误日志**
   ```bash
   docker-compose logs -f colletools-app
   docker-compose logs -f nginx
   ```

### 如果需要清理重新开始

```bash
# 停止并删除所有容器
docker-compose down -v

# 删除所有镜像
docker system prune -a

# 重新开始
./deploy.sh
```

## SSL 证书

首次启动后，SSL 证书会自动申请。确保：

1. 域名 DNS 已正确指向服务器
2. 80 和 443 端口已开放
3. SSL_EMAIL 配置正确

## 联系支持

如果遇到问题，请提供以下信息：
- `docker-compose ps` 输出
- `docker-compose logs` 输出
- 服务器操作系统版本
- Docker 版本
