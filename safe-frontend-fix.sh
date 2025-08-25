#!/bin/bash

# 安全的前端修复脚本
echo "🛡️  安全修复ColleTools前端..."

PROJECT_DIR="/var/www/colletools"
cd "$PROJECT_DIR" || exit 1

# 1. 回滚到工作状态
echo "🔄 1. 回滚到安全状态..."
git checkout api/app.ts
pm2 restart colletools
sleep 3

# 2. 确认基础服务正常
echo "🧪 2. 确认基础服务..."
if curl -s http://localhost:3002/health | grep -q "success"; then
    echo "✅ 基础服务正常"
else
    echo "❌ 基础服务异常，停止修复"
    exit 1
fi

# 3. 只添加最基本的静态文件支持
echo "🔧 3. 添加基础静态文件支持..."

# 创建最小修改脚本
cat > minimal_fix.js << 'EOF'
const fs = require('fs');

let content = fs.readFileSync('api/app.ts', 'utf8');

// 只做最小的修改，添加path导入
if (!content.includes('import path from')) {
    content = content.replace(
        "import dotenv from 'dotenv';",
        "import dotenv from 'dotenv';\nimport path from 'path';"
    );
}

// 在cors之后添加静态文件服务
if (!content.includes('express.static')) {
    content = content.replace(
        'app.use(cors());',
        'app.use(cors());\napp.use(express.static(path.join(__dirname, \'../dist\')));'
    );
}

fs.writeFileSync('api/app.ts', content);
console.log('✅ 最小修改完成');
EOF

node minimal_fix.js
rm minimal_fix.js

# 4. 重启并测试
echo "🔄 4. 重启服务..."
pm2 restart colletools
sleep 5

# 5. 测试
echo "🧪 5. 测试修复..."
if curl -s http://localhost:3002/health | grep -q "success"; then
    echo "✅ 服务正常"
    
    # 测试前端
    FRONT_TEST=$(curl -s http://localhost:3002/ | head -1)
    if echo "$FRONT_TEST" | grep -q "<!DOCTYPE\|<html"; then
        echo "✅ 前端服务正常"
    else
        echo "⚠️  前端可能需要构建: npm run build"
    fi
else
    echo "❌ 修复失败，回滚"
    git checkout api/app.ts
    pm2 restart colletools
fi

echo "🎉 安全修复完成"