#!/bin/bash

# 设置服务器重启后自动启动 Docker Compose
echo "🚀 设置服务器重启后自动启动 Docker Compose..."

# 获取当前目录的绝对路径
CURRENT_DIR=$(pwd)
PROJECT_NAME="colletools"

# 创建 systemd 服务文件
echo "📝 创建 systemd 服务文件..."
cat > /etc/systemd/system/${PROJECT_NAME}.service << EOF
[Unit]
Description=Colletools Docker Compose Service
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=${CURRENT_DIR}
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

echo "✅ 已创建 systemd 服务文件：/etc/systemd/system/${PROJECT_NAME}.service"

# 重新加载 systemd 配置
echo "🔄 重新加载 systemd 配置..."
systemctl daemon-reload

# 启用服务（开机自启）
echo "🔧 启用开机自启服务..."
systemctl enable ${PROJECT_NAME}.service

# 启动服务
echo "🚀 启动服务..."
systemctl start ${PROJECT_NAME}.service

# 检查服务状态
echo "📊 检查服务状态..."
systemctl status ${PROJECT_NAME}.service --no-pager

echo ""
echo "✅ 自动启动设置完成！"
echo ""
echo "📋 服务管理命令："
echo "启动服务：sudo systemctl start ${PROJECT_NAME}"
echo "停止服务：sudo systemctl stop ${PROJECT_NAME}"
echo "重启服务：sudo systemctl restart ${PROJECT_NAME}"
echo "查看状态：sudo systemctl status ${PROJECT_NAME}"
echo "查看日志：sudo journalctl -u ${PROJECT_NAME} -f"
echo ""
echo "🔧 禁用自动启动："
echo "sudo systemctl disable ${PROJECT_NAME}.service"
echo ""
echo "📄 服务文件位置："
echo "/etc/systemd/system/${PROJECT_NAME}.service"
