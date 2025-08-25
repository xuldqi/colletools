# ColleTools 部署问题修复说明

## 已修复的问题

### 1. ✅ 端口配置不匹配
- **问题**: `api/server.ts` 默认端口3001与nginx期望的3000不一致
- **修复**: 统一改为端口3000

### 2. ✅ SSL自动续期
- **问题**: 缺少SSL证书自动续期脚本
- **修复**: 
  - 创建了 `ssl-renew.sh` - SSL续期脚本
  - 创建了 `setup-auto-renewal.sh` - 自动续期配置脚本
  - 创建了 `ssl-status.sh` - SSL状态检查脚本

### 3. ✅ 环境变量配置
- **问题**: nginx配置使用了未定义的环境变量
- **修复**: 
  - 更新了 `.env` 文件，包含所有必要配置
  - 创建了 `generate-nginx-config.sh` 自动生成nginx配置

### 4. ✅ 配置文件冲突
- **问题**: 部署脚本会覆盖主配置文件
- **修复**: 创建了统一的 `deploy.sh` 脚本，支持生产和测试环境

### 5. ✅ 健康检查端点
- **问题**: nginx健康检查路径与应用不匹配
- **修复**: 在 `api/app.ts` 添加了 `/health` 端点

## 部署步骤

### 1. 准备工作
```bash
# 确保有正确的环境变量
vi .env
# 修改 SSL_EMAIL 为您的邮箱
```

### 2. 生产环境部署
```bash
# 赋予执行权限
chmod +x deploy.sh

# 部署生产环境
sudo ./deploy.sh production
```

### 3. 测试环境部署
```bash
# 部署测试环境（端口8080）
sudo ./deploy.sh test
```

### 4. SSL证书配置
```bash
# 首次申请证书
docker-compose run --rm certbot-primary
docker-compose run --rm certbot-secondary

# 设置自动续期
sudo ./setup-auto-renewal.sh

# 检查SSL状态
./ssl-status.sh
```

## 常用管理命令

### 查看状态
```bash
# 完整状态检查
./deployment-status.sh

# 查看容器状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

### 重启服务
```bash
# 重启所有服务
docker-compose restart

# 重启nginx
docker-compose restart nginx
```

### 故障排查
```bash
# 测试nginx配置
docker-compose exec nginx nginx -t

# 检查端口监听
sudo netstat -tulpn | grep -E "80|443"

# 测试本地访问
curl -I http://localhost
curl -I https://colletools.com
```

## 注意事项

1. **防火墙配置**: 确保服务器开放80和443端口
2. **DNS配置**: 确保域名正确解析到服务器IP
3. **日志监控**: 定期检查 `logs/` 目录下的日志文件
4. **备份**: 定期备份SSL证书和上传文件

## 问题诊断

如果正式页面无法显示，请按以下步骤排查：

1. 检查Docker服务状态
2. 验证nginx配置正确
3. 确认应用容器正常运行
4. 检查防火墙规则
5. 验证SSL证书有效
6. 查看错误日志

使用 `./deployment-status.sh` 可以自动完成大部分检查。