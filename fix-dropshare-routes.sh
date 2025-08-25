#!/bin/bash

# 修复 DropShare 路由参数问题
echo "🔧 修复 DropShare 路由问题..."
echo "============================="

PROJECT_DIR="/var/www/dropshare"
cd "$PROJECT_DIR" || exit 1

echo "📁 当前目录: $(pwd)"

echo ""
echo "🔍 1. 查找路由定义相关文件..."
echo "主要文件："
ls -la *.js 2>/dev/null || echo "未找到 JS 文件"

echo ""
echo "路由相关文件："
find . -name "*.js" -not -path "./node_modules/*" 2>/dev/null | head -10

echo ""
echo "🔍 2. 检查 index.js 中的路由定义..."
if [ -f "index.js" ]; then
    echo "--- index.js 内容 ---"
    cat index.js
else
    echo "❌ 未找到 index.js"
fi

echo ""
echo "🔍 3. 检查是否有路由参数语法错误..."

# 检查常见的路由参数错误
echo "查找可能的问题路由："

# 查找所有 JS 文件中的路由定义
for file in *.js; do
    if [ -f "$file" ] && [ "$file" != "index.js" ]; then
        echo ""
        echo "--- $file ---"
        cat "$file"
    fi
done

echo ""
echo "🔍 4. 查找 routes 目录..."
if [ -d "routes" ]; then
    echo "✅ 找到 routes 目录"
    ls -la routes/
    
    echo ""
    echo "routes 目录下的文件内容："
    for route_file in routes/*.js; do
        if [ -f "$route_file" ]; then
            echo ""
            echo "--- $route_file ---"
            cat "$route_file"
        fi
    done
else
    echo "⚠️ 未找到 routes 目录"
fi

echo ""
echo "🔧 5. 常见路由问题和解决方案："
echo "================================"
echo "❌ 错误的路由参数语法示例："
echo "app.get('/user/::', handler)  // 空参数名"
echo "app.get('/file/:', handler)   // 不完整参数"
echo "app.get('/path//:', handler)  // 双斜杠问题"
echo ""
echo "✅ 正确的路由参数语法："
echo "app.get('/user/:id', handler)"
echo "app.get('/file/:filename', handler)"
echo "app.get('/path/:param', handler)"

echo ""
echo "🔍 6. 检查 package.json 中的 path-to-regexp 版本..."
if grep -q "path-to-regexp" package.json; then
    echo "找到 path-to-regexp 依赖："
    grep "path-to-regexp" package.json
else
    echo "未在 package.json 中直接找到 path-to-regexp（可能是 express 的间接依赖）"
fi

echo ""
echo "💡 建议修复步骤："
echo "================="
echo "1. 检查上面显示的路由定义"
echo "2. 查找形如 '/:' 或 '/::' 的错误语法"
echo "3. 确保所有路由参数都有有效的名称"
echo "4. 修复后重启服务：pm2 restart dropshare"

echo ""
echo "🔧 如果需要创建简单的测试路由文件，请告诉我！"