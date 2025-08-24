#!/bin/bash

echo "🔍 服务器诊断脚本"
echo "=================="

# 检查Docker服务状态
echo "📋 1. Docker服务状态："
systemctl status docker --no-pager -l

echo -e "\n📋 2. 运行中的容器："
docker ps -a

echo -e "\n📋 3. 容器日志分析："
echo "--- nginx-proxy 日志 ---"
docker logs nginx-proxy --tail 10 2>/dev/null || echo "nginx-proxy 容器不存在"

echo -e "\n--- colletools-app 日志 ---"
docker logs colletools-colletools-app --tail 10 2>/dev/null || echo "colletools-app 容器不存在"

echo -e "\n📋 4. 端口占用情况："
netstat -tulpn | grep -E ":80|:443|:8080|:3000"

echo -e "\n📋 5. DNS解析测试："
nslookup dropshare.com
nslookup colletools.com

echo -e "\n📋 6. 系统服务状态："
systemctl status nginx apache2 --no-pager -l 2>/dev/null || echo "nginx/apache2 未安装或未运行"

echo -e "\n📋 7. Docker Compose 配置检查："
echo "--- colletools 配置 ---"
cd /var/www/colletools 2>/dev/null && docker-compose config 2>/dev/null || echo "colletools 目录不存在或配置错误"

echo -e "\n--- dropshare 配置 ---"
cd /var/www/dropshare 2>/dev/null && docker-compose config 2>/dev/null || echo "dropshare 目录不存在或配置错误"

echo -e "\n📋 8. 磁盘空间："
df -h

echo -e "\n📋 9. 内存使用："
free -h

echo -e "\n🔍 诊断完成！"
