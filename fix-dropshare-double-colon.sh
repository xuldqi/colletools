#!/bin/bash

# 修复 DropShare 双冒号路由错误
echo "🔧 修复 DropShare 双冒号路由错误..."
echo "==================================="

PROJECT_DIR="/var/www/dropshare"
cd "$PROJECT_DIR" || exit 1

echo "📁 当前目录: $(pwd)"

# 1. 备份文件
echo ""
echo "💾 1. 备份当前文件..."
if [ -f "index.js" ]; then
    cp index.js index.js.backup.$(date +%Y%m%d_%H%M%S)
    echo "✅ 已备份 index.js"
else
    echo "❌ 未找到 index.js"
    exit 1
fi

# 2. 检查当前错误的路由
echo ""
echo "🔍 2. 检查错误的路由模式..."
echo "当前文件中的双冒号路由："
grep -n "::" index.js || echo "未找到双冒号路由"

# 3. 修复双冒号路由
echo ""
echo "🔧 3. 修复路由定义..."

# 创建临时修复脚本
cat > fix_routes.js << 'EOF'
const fs = require('fs');

let content = fs.readFileSync('index.js', 'utf8');
console.log('修复前的双冒号路由：');
const doubleColonMatches = content.match(/app\.(get|post|put|delete|patch)\s*\(\s*['"`][^'"`]*::[^'"`]*['"`]/g);
if (doubleColonMatches) {
    doubleColonMatches.forEach(match => console.log('  ', match));
} else {
    console.log('  未找到双冒号路由');
}

// 修复常见的双冒号路由模式
const fixes = [
    // 用户相关路由
    { from: /\/user::/g, to: '/user/:id' },
    { from: /\/users::/g, to: '/users/:id' },
    
    // 文件相关路由  
    { from: /\/file::/g, to: '/file/:id' },
    { from: /\/files::/g, to: '/files/:id' },
    
    // 路径相关路由
    { from: /\/path::/g, to: '/path/:param' },
    { from: /\/paths::/g, to: '/paths/:param' },
    
    // 通用路由
    { from: /\/item::/g, to: '/item/:id' },
    { from: /\/items::/g, to: '/items/:id' },
    { from: /\/data::/g, to: '/data/:id' },
    
    // 其他可能的模式
    { from: /'\/([^'\/]+)::'/g, to: "'/$1/:id'" },
    { from: /"\/([^"\/]+)::"/g, to: '"/$1/:id"' },
    { from: /`\/([^`\/]+)::`/g, to: '`/$1/:id`' }
];

let changesMade = 0;
fixes.forEach(fix => {
    const before = content;
    content = content.replace(fix.from, fix.to);
    if (content !== before) {
        changesMade++;
        console.log(`✅ 应用修复: ${fix.from} -> ${fix.to}`);
    }
});

if (changesMade === 0) {
    console.log('⚠️ 未找到可自动修复的双冒号路由');
    console.log('可能需要手动检查和修复特殊情况');
} else {
    fs.writeFileSync('index.js', content);
    console.log(`🎉 共修复了 ${changesMade} 个路由模式`);
}

console.log('\n修复后检查：');
const remainingDoubleColons = content.match(/::/g);
if (remainingDoubleColons) {
    console.log(`⚠️ 仍有 ${remainingDoubleColons.length} 个双冒号需要手动处理`);
    
    // 显示剩余的双冒号上下文
    const lines = content.split('\n');
    lines.forEach((line, index) => {
        if (line.includes('::')) {
            console.log(`  第 ${index + 1} 行: ${line.trim()}`);
        }
    });
} else {
    console.log('✅ 未发现剩余的双冒号');
}
EOF

# 4. 运行修复
echo "运行自动修复..."
node fix_routes.js
rm fix_routes.js

# 5. 显示修复结果
echo ""
echo "🔍 4. 修复后的文件内容预览..."
echo "路由定义部分："
grep -n -A 1 -B 1 "app\.\(get\|post\|put\|delete\|patch\)" index.js | head -20

# 6. 重启服务
echo ""
echo "🔄 5. 重启 PM2 服务..."
pm2 restart dropshare
sleep 3

# 7. 测试服务
echo ""
echo "🧪 6. 测试服务..."
if curl -s http://localhost:3003 2>/dev/null | head -1 | grep -q "<!DOCTYPE\|<html\|{"; then
    echo "✅ 本地服务启动成功"
    
    # 测试外部访问
    if curl -I http://dropshare.tech 2>/dev/null | grep -q "200"; then
        echo "✅ dropshare.tech 访问正常"
        echo ""
        echo "🎉 修复成功！DropShare 应该可以正常访问了"
    else
        echo "⚠️ 外部访问仍有问题，可能需要检查 nginx 配置"
    fi
else
    echo "❌ 服务仍然异常"
    echo ""
    echo "🔍 查看最新日志："
    pm2 logs dropshare --lines 5
fi

echo ""
echo "📋 修复完成!"
echo "=============="
echo "🌐 测试访问: http://dropshare.tech"
echo "🔍 如果仍有问题，检查日志: pm2 logs dropshare"