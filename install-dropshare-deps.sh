#!/bin/bash

# 安装 DropShare 项目依赖
echo "📦 安装 DropShare 依赖..."
echo "========================"

PROJECT_DIR="/var/www/dropshare"
cd "$PROJECT_DIR" || exit 1

echo "📁 当前目录: $(pwd)"

# 1. 检查 package.json
echo ""
echo "🔍 1. 检查 package.json："
if [ -f "package.json" ]; then
    echo "✅ 找到 package.json"
    echo "依赖列表："
    grep -A 20 '"dependencies"' package.json || grep -A 20 '"devDependencies"' package.json || echo "未找到依赖列表"
else
    echo "❌ 未找到 package.json"
    exit 1
fi

echo ""
echo "🔍 2. 检查 node_modules："
if [ -d "node_modules" ]; then
    echo "⚠️ node_modules 已存在，但可能不完整"
    echo "node_modules 大小："
    du -sh node_modules/ 2>/dev/null || echo "无法获取大小"
else
    echo "❌ 未找到 node_modules"
fi

echo ""
echo "📦 3. 安装依赖..."

# 清理可能损坏的 node_modules
if [ -d "node_modules" ]; then
    echo "🗑️ 清理现有 node_modules..."
    rm -rf node_modules
fi

# 删除可能存在的 package-lock.json
if [ -f "package-lock.json" ]; then
    echo "🗑️ 删除 package-lock.json..."
    rm -f package-lock.json
fi

# 安装依赖
echo "📥 开始安装依赖..."
if command -v npm >/dev/null 2>&1; then
    echo "使用 npm 安装..."
    npm install
    INSTALL_EXIT_CODE=$?
else
    echo "❌ 未找到 npm"
    exit 1
fi

if [ $INSTALL_EXIT_CODE -eq 0 ]; then
    echo "✅ 依赖安装成功"
else
    echo "❌ 依赖安装失败，退出码: $INSTALL_EXIT_CODE"
    exit 1
fi

echo ""
echo "🔍 4. 验证关键依赖："
MISSING_DEPS=()

if [ ! -d "node_modules/express" ]; then
    MISSING_DEPS+=("express")
fi

if [ ! -d "node_modules/cors" ]; then
    MISSING_DEPS+=("cors")
fi

if [ ! -d "node_modules/body-parser" ]; then
    echo "⚠️ body-parser 可能需要（但现代 express 可能不需要）"
fi

if [ ${#MISSING_DEPS[@]} -gt 0 ]; then
    echo "❌ 仍然缺少依赖: ${MISSING_DEPS[*]}"
    echo "🔧 手动安装关键依赖..."
    npm install express cors
else
    echo "✅ 关键依赖检查通过"
fi

echo ""
echo "🔄 5. 重启 PM2 服务..."
pm2 restart dropshare
sleep 3

echo ""
echo "🧪 6. 测试服务..."
if curl -s http://localhost:3003 2>/dev/null | head -1 | grep -q "<!DOCTYPE\|<html\|{"; then
    echo "✅ 服务启动成功"
    
    # 测试外部访问
    echo ""
    echo "🌐 测试外部访问..."
    if curl -I http://dropshare.tech 2>/dev/null | grep -q "200"; then
        echo "✅ dropshare.tech 访问正常"
    else
        echo "❌ dropshare.tech 访问异常，可能需要检查 nginx 配置"
    fi
    
else
    echo "❌ 服务仍然异常"
    echo ""
    echo "🔍 查看最新日志："
    pm2 logs dropshare --lines 10
fi

echo ""
echo "🎉 依赖安装完成！"
echo "==================="
echo "🌐 访问地址: http://dropshare.tech"
echo ""
echo "💡 如果仍有问题："
echo "- 检查 PM2 日志: pm2 logs dropshare"
echo "- 检查端口占用: netstat -tlnp | grep 3003"
echo "- 手动测试: node index.js"