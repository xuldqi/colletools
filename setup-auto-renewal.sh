#!/bin/bash

# 设置SSL证书自动续期
echo "🔧 设置SSL证书自动续期..."

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then
    echo "❌ 请使用 root 用户运行此脚本"
    exit 1
fi

# 设置项目目录
PROJECT_DIR="/var/www/colletools"

# 确保续期脚本可执行
chmod +x "$PROJECT_DIR/ssl-renew.sh"

# 添加定时任务
echo "📅 添加定时任务..."
(crontab -l 2>/dev/null; echo "0 2 * * 0 $PROJECT_DIR/ssl-renew.sh >> $PROJECT_DIR/logs/ssl-renew.log 2>&1") | crontab -

# 验证定时任务
echo "✅ 定时任务已设置："
crontab -l | grep ssl-renew

echo ""
echo "🎉 自动续期设置完成！"
echo "- 每周日凌晨2点自动检查并续期SSL证书"
echo "- 日志保存在: $PROJECT_DIR/logs/ssl-renew.log"
echo ""
echo "手动测试续期："
echo "sudo $PROJECT_DIR/ssl-renew.sh"