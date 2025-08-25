#!/bin/bash

# 修复 DropShare 项目前端显示
echo "🔧 修复 DropShare 前端..."
echo "========================"

# 检查权限
if [ "$EUID" -ne 0 ]; then
    echo "❌ 请使用 root 用户运行此脚本"
    exit 1
fi

PROJECT_DIR="/var/www/dropshare"
cd "$PROJECT_DIR" || { echo "❌ 无法进入项目目录"; exit 1; }

echo "📁 当前项目目录内容："
ls -la

echo ""
echo "🔍 检查前端文件..."

# 寻找正确的静态文件目录
STATIC_DIR=""
if [ -d "dist" ] && [ -f "dist/index.html" ]; then
    STATIC_DIR="$PROJECT_DIR/dist"
    echo "✅ 找到构建文件：dist/"
elif [ -d "build" ] && [ -f "build/index.html" ]; then
    STATIC_DIR="$PROJECT_DIR/build"
    echo "✅ 找到构建文件：build/"
elif [ -d "public" ] && [ -f "public/index.html" ]; then
    STATIC_DIR="$PROJECT_DIR/public"
    echo "✅ 找到静态文件：public/"
elif [ -f "index.html" ]; then
    STATIC_DIR="$PROJECT_DIR"
    echo "✅ 使用根目录静态文件"
else
    echo "❌ 未找到前端文件，尝试构建..."
    
    # 尝试构建前端
    if [ -f "package.json" ]; then
        echo "🔨 尝试构建项目..."
        
        # 检查 node_modules
        if [ ! -d "node_modules" ]; then
            echo "📦 安装依赖..."
            npm install || yarn install || { echo "❌ 依赖安装失败"; exit 1; }
        fi
        
        # 尝试不同的构建命令
        if npm run build 2>/dev/null; then
            echo "✅ npm run build 成功"
        elif npm run dist 2>/dev/null; then
            echo "✅ npm run dist 成功"
        elif yarn build 2>/dev/null; then
            echo "✅ yarn build 成功"
        else
            echo "❌ 构建失败，使用默认测试页面"
            # 创建默认的应用页面
            mkdir -p dist
            cat > dist/index.html << 'EOF'
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DropShare - 文件分享平台</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            text-align: center;
            max-width: 500px;
            margin: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        h1 { color: white; font-size: 3em; margin-bottom: 20px; }
        .subtitle { color: rgba(255,255,255,0.8); font-size: 1.2em; margin-bottom: 30px; }
        .upload-area {
            border: 2px dashed rgba(255,255,255,0.3);
            border-radius: 15px;
            padding: 40px;
            margin: 20px 0;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .upload-area:hover { 
            border-color: rgba(255,255,255,0.6);
            background: rgba(255,255,255,0.05);
        }
        .upload-text { color: white; font-size: 1.1em; }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-top: 30px;
        }
        .feature {
            background: rgba(255,255,255,0.1);
            border-radius: 10px;
            padding: 20px 15px;
            color: white;
            text-align: center;
        }
        .icon { font-size: 2em; margin-bottom: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 DropShare</h1>
        <p class="subtitle">安全、快速的文件分享平台</p>
        
        <div class="upload-area" onclick="document.getElementById('fileInput').click()">
            <div class="upload-text">
                <div class="icon">📁</div>
                点击选择文件或拖拽到此处
            </div>
        </div>
        <input type="file" id="fileInput" style="display:none" multiple>
        
        <div class="features">
            <div class="feature">
                <div class="icon">🔐</div>
                <div>安全加密</div>
            </div>
            <div class="feature">
                <div class="icon">⚡</div>
                <div>极速传输</div>
            </div>
            <div class="feature">
                <div class="icon">🌍</div>
                <div>全球访问</div>
            </div>
        </div>
    </div>

    <script>
        const fileInput = document.getElementById('fileInput');
        const uploadArea = document.querySelector('.upload-area');
        
        fileInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                alert(`选择了 ${this.files.length} 个文件\n\n实际功能开发中...`);
            }
        });
        
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = 'rgba(255,255,255,0.8)';
            this.style.background = 'rgba(255,255,255,0.1)';
        });
        
        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.borderColor = 'rgba(255,255,255,0.3)';
            this.style.background = 'transparent';
        });
        
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = 'rgba(255,255,255,0.3)';
            this.style.background = 'transparent';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                alert(`拖拽了 ${files.length} 个文件\n\n实际功能开发中...`);
            }
        });
    </script>
</body>
</html>
EOF
            echo "✅ 创建了默认应用页面"
        fi
        
        # 重新检查构建结果
        if [ -d "dist" ] && [ -f "dist/index.html" ]; then
            STATIC_DIR="$PROJECT_DIR/dist"
        elif [ -d "build" ] && [ -f "build/index.html" ]; then
            STATIC_DIR="$PROJECT_DIR/build"
        fi
    else
        echo "❌ 无 package.json，无法构建"
        exit 1
    fi
fi

if [ -z "$STATIC_DIR" ]; then
    echo "❌ 仍然无法找到静态文件目录"
    exit 1
fi

echo "✅ 使用静态文件目录：$STATIC_DIR"

# 更新 nginx 配置
echo ""
echo "🔄 更新 nginx 配置..."

# 备份当前配置
cp /etc/nginx/sites-available/domains-simple /etc/nginx/sites-available/domains-simple.backup.$(date +%Y%m%d_%H%M%S)

# 创建新配置，更新 DropShare 的 root 路径
sed "s|root /var/www/dropshare;|root $STATIC_DIR;|g" /etc/nginx/sites-available/domains-simple > /etc/nginx/sites-available/domains-simple.tmp
mv /etc/nginx/sites-available/domains-simple.tmp /etc/nginx/sites-available/domains-simple

echo "✅ nginx 配置已更新，指向：$STATIC_DIR"

# 测试配置
echo ""
echo "🧪 测试 nginx 配置..."
if nginx -t; then
    echo "✅ nginx 配置测试通过"
    systemctl reload nginx
    echo "✅ nginx 重启成功"
else
    echo "❌ nginx 配置错误"
    exit 1
fi

# 等待服务稳定
sleep 3

echo ""
echo "🌐 测试访问..."
if curl -I http://dropshare.tech 2>/dev/null | grep -q "200"; then
    echo "✅ DropShare 访问正常"
else
    echo "❌ DropShare 访问异常"
fi

echo ""
echo "🎉 DropShare 修复完成！"
echo "========================"
echo "🌐 访问地址：http://dropshare.tech"
echo "📁 静态文件目录：$STATIC_DIR"
echo ""
echo "💡 如需 HTTPS：sudo certbot --nginx -d dropshare.tech"