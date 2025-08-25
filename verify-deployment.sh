#!/bin/bash

echo "🔍 验证部署状态"
echo "=================="

# 获取服务器IP
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "localhost")
echo "服务器IP: $SERVER_IP"

echo -e "\n1. 检查容器状态..."
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo -e "\n2. 测试端口连通性..."
nc -zv localhost 8080 2>&1 || echo "8080端口未开放"

echo -e "\n3. 测试网站访问..."
echo "测试默认页面:"
curl -I -m 5 http://localhost:8080/ 2>/dev/null | head -1 || echo "❌ 默认页面无法访问"

echo "测试 Colletools:"
curl -I -m 5 http://localhost:8080/colletools 2>/dev/null | head -1 || echo "❌ Colletools无法访问"

echo "测试 DropShare:"
curl -I -m 5 http://localhost:8080/dropshare 2>/dev/null | head -1 || echo "❌ DropShare无法访问"

echo -e "\n4. 检查日志..."
echo "Nginx日志:"
docker logs nginx-simple --tail 3 2>/dev/null || echo "无Nginx日志"

echo -e "\n5. 提供访问链接..."
echo "🌐 访问地址："
echo "- http://$SERVER_IP:8080 (默认页面)"
echo "- http://$SERVER_IP:8080/colletools"
echo "- http://$SERVER_IP:8080/dropshare"

echo -e "\n6. 常见问题排查..."
echo "如果无法访问，请检查："
echo "- 防火墙是否开放8080端口"
echo "- 云服务器安全组是否允许8080端口"
echo "- Docker容器是否正常运行"