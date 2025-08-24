# 使用官方 Node.js 20 镜像作为基础镜像
FROM node:20-alpine AS builder

# 安装构建依赖（包括 Python）
RUN apk add --no-cache python3 make g++

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖（包含开发依赖用于构建）
RUN npm ci

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 生产阶段
FROM node:20-alpine AS production

# 安装 curl 用于健康检查和 Python 用于可能的运行时依赖
RUN apk add --no-cache curl python3

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S colletools -u 1001

# 设置工作目录
WORKDIR /app

# 复制构建产物和依赖
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/api ./api

# 创建必要的目录
RUN mkdir -p uploads logs
RUN chown -R colletools:nodejs /app

# 切换到非 root 用户
USER colletools

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# 启动应用
CMD ["node", "api/index.js"]