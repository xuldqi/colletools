# 部署指南

## 🚀 简单部署方式（推荐）

如果您已经有构建好的镜像，可以直接使用简单部署：

```bash
# 1. 进入项目目录
cd /var/www/colletools

# 2. 运行简单部署脚本
chmod +x simple-deploy.sh
./simple-deploy.sh
```

这种方式会：
- ✅ 直接启动现有镜像
- ✅ 不重新构建（快速）
- ✅ 适合日常更新

## 🔨 完整构建部署

如果需要重新构建镜像（比如代码有重大更新）：

```bash
# 1. 进入项目目录
cd /var/www/colletools

# 2. 运行完整构建脚本
chmod +x start-compose.sh
./start-compose.sh
```

这种方式会：
- ✅ 重新构建 Docker 镜像
- ✅ 安装所有依赖
- ✅ 适合首次部署或重大更新

## 📋 手动部署（最原始方式）

如果您喜欢手动操作：

```bash
# 1. 停止现有服务
docker-compose down

# 2. 启动服务（不重新构建）
docker-compose up -d

# 3. 如果需要重新构建
docker-compose up -d --build
```

## 🔍 检查部署状态

```bash
# 查看容器状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 检查端口
netstat -tulpn | grep -E ":80|:443"
```

## 🌐 访问网站

部署成功后，访问：
- **HTTP**: http://colletools.com
- **HTTPS**: https://colletools.com

## 🔧 常用命令

```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 查看状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 重新构建并启动
docker-compose up -d --build
```

## ⚡ 快速更新流程

1. **上传文件到服务器**
2. **运行简单部署**：`./simple-deploy.sh`
3. **检查状态**：`docker-compose ps`
4. **访问网站**：https://colletools.com

就是这么简单！🎉
