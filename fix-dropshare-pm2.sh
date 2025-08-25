#!/bin/bash

# 修复 DropShare PM2 配置
echo "🔧 修复 DropShare PM2 配置..."
echo "============================"

PROJECT_DIR="/var/www/dropshare"
cd "$PROJECT_DIR" || exit 1

echo "📋 1. 检查当前 PM2 配置："
pm2 describe dropshare 2>/dev/null || echo "未找到 dropshare PM2 进程"

echo ""
echo "📄 2. 检查 ecosystem 配置文件："
if [ -f "ecosystem.config.js" ]; then
    echo "找到 ecosystem.config.js："
    cat ecosystem.config.js
elif [ -f "pm2.config.js" ]; then
    echo "找到 pm2.config.js："
    cat pm2.config.js
else
    echo "未找到 PM2 配置文件"
fi

echo ""
echo "🔍 3. 检查文件差异："
echo "--- index.js 内容 ---"
if [ -f "index.js" ]; then
    head -10 index.js
else
    echo "❌ index.js 不存在"
fi

echo ""
echo "--- index-simple.js 内容 ---"
if [ -f "index-simple.js" ]; then
    head -10 index-simple.js
else
    echo "❌ index-simple.js 不存在"
fi

echo ""
echo "🔄 4. 修复步骤："

# 如果 index.js 内容看起来是测试内容，并且有 index.js.bak
if [ -f "index.js.bak" ]; then
    echo "✅ 找到备份文件 index.js.bak"
    echo "🔄 恢复正式文件..."
    cp index.js.bak index.js
    echo "✅ 已恢复 index.js"
else
    echo "⚠️ 未找到 index.js.bak 备份文件"
fi

# 确保 PM2 使用正确的文件
echo ""
echo "🔄 5. 重新配置 PM2..."

# 删除现有进程
pm2 delete dropshare 2>/dev/null || true

# 重新启动，确保使用 index.js
if [ -f "ecosystem.config.js" ]; then
    echo "使用 ecosystem.config.js 启动..."
    pm2 start ecosystem.config.js
else
    echo "直接启动 index.js..."
    pm2 start index.js --name dropshare
fi

sleep 3

echo ""
echo "🧪 6. 检查结果："
pm2 list | grep dropshare || echo "❌ PM2 进程未启动"

echo ""
echo "测试本地服务响应："
RESPONSE=$(curl -s http://localhost:3003 2>/dev/null | head -1)
if echo "$RESPONSE" | grep -q "<!DOCTYPE\|<html"; then
    echo "✅ 服务返回 HTML 页面"
    echo "响应: $RESPONSE"
else
    echo "❌ 服务响应异常"
    echo "响应: $RESPONSE"
    echo ""
    echo "🔍 查看 PM2 日志："
    pm2 logs dropshare --lines 5
fi

echo ""
echo "🎉 修复完成！"
echo "访问 http://dropshare.tech 查看结果"