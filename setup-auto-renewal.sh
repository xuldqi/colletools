#!/bin/bash

# 设置 SSL 证书自动续期
echo "🔄 设置 SSL 证书自动续期..."

# 检查 crontab 是否已存在
if crontab -l 2>/dev/null | grep -q "ssl-renew.sh"; then
    echo "✅ 自动续期任务已存在"
    crontab -l | grep "ssl-renew"
else
    echo "📝 添加自动续期任务..."
    
    # 获取当前目录的绝对路径
    CURRENT_DIR=$(pwd)
    
    # 创建续期脚本的完整路径
    RENEW_SCRIPT="$CURRENT_DIR/ssl-renew.sh"
    
    # 添加 crontab 任务（每天凌晨 2 点检查并续期）
    (crontab -l 2>/dev/null; echo "0 2 * * * $RENEW_SCRIPT >> $CURRENT_DIR/logs/ssl-renewal.log 2>&1") | crontab -
    
    echo "✅ 已添加自动续期任务"
    echo "📅 续期时间：每天凌晨 2:00"
    echo "📄 日志文件：$CURRENT_DIR/logs/ssl-renewal.log"
fi

# 创建日志目录
mkdir -p logs

# 显示当前的 crontab 任务
echo ""
echo "📋 当前的 crontab 任务："
crontab -l

# 测试续期脚本
echo ""
echo "🧪 测试续期脚本..."
if [ -f "ssl-renew.sh" ]; then
    echo "✅ 续期脚本存在"
    chmod +x ssl-renew.sh
else
    echo "❌ 续期脚本不存在"
fi

echo ""
echo "🔧 手动续期命令："
echo "./ssl-renew.sh"

echo ""
echo "📊 查看续期日志："
echo "tail -f logs/ssl-renewal.log"

echo ""
echo "📋 管理 crontab 任务："
echo "crontab -e  # 编辑定时任务"
echo "crontab -l  # 查看定时任务"
echo "crontab -r  # 删除所有定时任务"
