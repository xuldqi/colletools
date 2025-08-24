# 实用解决方案

## 🎯 **问题分析**

您的项目依赖了需要编译的包（canvas、puppeteer、sharp 等），导致 Docker 构建失败。

## 🚀 **解决方案 1：简化依赖（推荐）**

### 步骤 1：修复依赖
```bash
# 在本地运行
chmod +x fix-dependencies.sh
./fix-dependencies.sh
```

这会：
- ✅ 移除需要编译的依赖
- ✅ 保留核心功能
- ✅ 生成可部署的静态文件

### 步骤 2：部署到服务器
```bash
# 在服务器上运行
chmod +x ultra-simple-deploy.sh
./ultra-simple-deploy.sh
```

## 🔧 **解决方案 2：使用预构建镜像**

如果您需要完整功能，可以使用预构建的镜像：

```bash
# 使用预构建的 Node.js 镜像
docker run -d \
  --name colletools-app \
  -p 3000:3000 \
  -v $(pwd):/app \
  node:20-alpine \
  sh -c "cd /app && npm install && npm start"
```

## 🌐 **解决方案 3：分离前端和后端**

### 前端（静态文件）
```bash
# 构建前端
npm run build

# 使用 nginx 部署
docker run -d \
  --name nginx-frontend \
  -p 80:80 \
  -v $(pwd)/dist:/usr/share/nginx/html \
  nginx:alpine
```

### 后端（API 服务）
```bash
# 使用轻量级 Node.js 镜像
docker run -d \
  --name colletools-api \
  -p 3000:3000 \
  -v $(pwd)/api:/app \
  node:20-alpine \
  sh -c "cd /app && npm install && node index.js"
```

## 📋 **快速部署命令**

```bash
# 1. 修复依赖（本地）
./fix-dependencies.sh

# 2. 上传文件到服务器
scp -r dist package.json.simple docker-compose.ultra-simple.yml ultra-simple-deploy.sh user@server:/var/www/colletools/

# 3. 在服务器上部署
cd /var/www/colletools
./ultra-simple-deploy.sh
```

## 🔍 **检查部署状态**

```bash
# 查看容器状态
docker-compose ps

# 查看日志
docker-compose logs

# 测试访问
curl http://colletools.com
```

## ⚡ **最简部署流程**

1. **本地构建**：`npm run build`
2. **上传 dist 目录**到服务器
3. **运行**：`docker-compose up -d`
4. **访问**：https://colletools.com

就是这么简单！🎉
