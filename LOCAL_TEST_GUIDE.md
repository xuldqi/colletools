# ColleTools 本地测试指南

## 本地环境已准备就绪 ✅

### 已完成的准备工作

1. **修复所有配置问题**
   - ✅ 端口配置统一为3000
   - ✅ 环境变量配置完成
   - ✅ nginx配置已生成
   - ✅ 健康检查端点已添加

2. **创建了冲突检查工具**
   - `check-conflicts.sh` - 检查端口和容器冲突
   - `deploy-safe.sh` - 安全部署脚本

3. **创建了多种部署配置**
   - `docker-compose.yml` - 标准生产配置
   - `docker-compose.safe.yml` - 防冲突配置
   - `docker-compose.local.yml` - 本地测试配置

## 本地测试方法

### 方法一：使用npm开发模式（最简单）
```bash
# 同时启动前端和后端
npm run dev

# 访问地址
# 前端: http://localhost:5173
# 后端API: http://localhost:3000
```

### 方法二：分别启动前端和后端
```bash
# 终端1 - 启动后端
npm run server:dev

# 终端2 - 启动前端
npm run client:dev
```

### 方法三：使用Docker（需要网络正常）
```bash
# 使用本地配置
docker-compose -f docker-compose.local.yml up -d

# 访问地址
# http://localhost:8081
```

## 测试检查项

### 1. 基础功能测试
- [ ] 访问首页是否正常显示
- [ ] API健康检查: `curl http://localhost:3000/health`
- [ ] 工具列表是否加载
- [ ] 文件上传功能是否正常

### 2. 部署前检查
- [ ] 运行 `./check-conflicts.sh` 确认无冲突
- [ ] 确认 `.env` 文件配置正确
- [ ] 确认防火墙端口已开放

## 准备上传到服务器

### 1. 修改配置为生产环境
```bash
# 编辑 .env 文件
PRIMARY_DOMAIN=colletools.com
SECONDARY_DOMAIN=dropshare.com
NODE_ENV=production
```

### 2. 生成nginx配置
```bash
./generate-nginx-config.sh
```

### 3. 选择部署方式

**选项A：标准部署（需要80/443端口）**
```bash
sudo ./deploy.sh production
```

**选项B：安全部署（自动避免冲突）**
```bash
sudo ./deploy-safe.sh
```

## 服务器部署建议

1. **如果服务器已有其他网站**
   - 使用 `deploy-safe.sh`
   - 选择备用端口（8080/8443）
   - 或配置反向代理

2. **如果服务器是空的**
   - 使用标准配置
   - 占用80/443端口

3. **SSL证书**
   - 首次部署后申请证书
   - 运行 `./setup-auto-renewal.sh` 设置自动续期

## 故障排查

如果本地测试有问题：

1. 检查端口是否被占用
```bash
lsof -i :3000
lsof -i :5173
```

2. 清理并重新安装依赖
```bash
rm -rf node_modules
npm install
```

3. 查看错误日志
```bash
npm run dev 2>&1 | tee debug.log
```

## 总结

✅ **本地环境已准备就绪**
✅ **所有配置文件已修复**
✅ **冲突检查工具已创建**
✅ **多种部署方案可选**

现在可以安全地上传到服务器部署了！