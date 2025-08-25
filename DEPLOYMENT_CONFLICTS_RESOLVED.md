# ColleTools 服务器冲突问题完整解决方案

## 🚨 发现的潜在冲突

### 1. 端口冲突
- **80/443端口**: 通常被系统nginx或其他Web服务占用
- **容器名称**: `nginx-proxy` 等通用名称可能与其他项目冲突
- **Docker网络**: 网络名称可能重复

### 2. 主要风险
- 多个项目共用相同端口导致服务无法启动
- 容器名称冲突导致部署失败
- nginx配置相互干扰

## ✅ 完整解决方案

### 方案一：使用安全配置（推荐）

```bash
# 1. 先检查冲突
sudo ./check-conflicts.sh

# 2. 使用安全部署脚本
sudo chmod +x deploy-safe.sh
sudo ./deploy-safe.sh

# 选择"使用安全配置"选项
```

**特点**：
- 自动检测端口冲突
- 使用备用端口（8080/8443）如果默认端口被占用
- 容器名称包含时间戳，避免冲突
- 独立的Docker网络

### 方案二：手动调整配置

1. **修改端口** (如果80/443被占用)：
```bash
# 编辑 .env 文件
HTTP_PORT=8080
HTTPS_PORT=8443
```

2. **使用独特的容器名称**：
使用 `docker-compose.safe.yml` 替代标准配置

3. **停止冲突服务**：
```bash
# 停止系统nginx
sudo systemctl stop nginx
sudo systemctl disable nginx

# 或者停止其他占用端口的服务
sudo lsof -i :80
sudo kill -9 <PID>
```

### 方案三：使用反向代理统一管理

如果服务器运行多个项目，建议：

1. **安装统一的nginx反向代理**
2. **每个项目使用不同内部端口**
3. **通过主nginx分发请求**

示例配置：
```nginx
# 主nginx配置
server {
    listen 80;
    server_name colletools.com;
    location / {
        proxy_pass http://localhost:8080;
    }
}

server {
    listen 80;
    server_name otherproject.com;
    location / {
        proxy_pass http://localhost:8090;
    }
}
```

## 🛠️ 部署前检查清单

- [ ] 运行 `./check-conflicts.sh` 检查冲突
- [ ] 确认使用正确的端口配置
- [ ] 检查Docker容器名称唯一性
- [ ] 验证nginx配置文件正确
- [ ] 确保防火墙规则已配置
- [ ] 检查磁盘空间充足

## 📋 快速命令参考

### 检查和诊断
```bash
# 检查端口占用
sudo lsof -i :80
sudo netstat -tulpn | grep :80

# 检查Docker容器
docker ps -a

# 检查nginx配置
docker-compose exec nginx nginx -t
```

### 清理旧资源
```bash
# 停止所有相关容器
docker-compose down

# 清理未使用的资源
docker system prune -f

# 删除特定容器
docker rm -f container_name
```

### 部署命令
```bash
# 安全部署（推荐）
sudo ./deploy-safe.sh

# 标准部署（需要80/443端口）
sudo ./deploy.sh production

# 测试部署（8080端口）
sudo ./deploy.sh test
```

## ⚠️ 重要提醒

1. **备份重要数据**：部署前备份SSL证书和上传文件
2. **记录端口配置**：如果使用非标准端口，需要更新DNS或通知用户
3. **监控日志**：部署后持续监控错误日志
4. **定期检查**：使用 `./deployment-status.sh` 定期检查系统状态

## 🆘 故障排除

如果部署后仍有问题：

1. 查看详细日志：
```bash
docker-compose logs -f nginx
docker-compose logs -f colletools-app
```

2. 检查网络连通性：
```bash
docker exec colletools-app curl http://localhost:3000/health
```

3. 验证DNS解析：
```bash
nslookup colletools.com
```

4. 测试本地访问：
```bash
curl -I http://localhost:8080
```

通过以上方案，可以确保ColleTools与服务器上其他项目和平共存，避免冲突。