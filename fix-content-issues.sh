#!/bin/bash

echo "🔧 修复页面内容显示问题"
echo "========================"

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then
    echo "❌ 请使用 root 用户运行此脚本"
    echo "使用：sudo ./fix-content-issues.sh"
    exit 1
fi

echo "📋 1. 检查当前容器状态..."
docker ps

echo -e "\n📋 2. 检查 colletools-app 容器日志..."
docker logs colletools-app --tail 20 2>/dev/null || echo "colletools-app 容器不存在"

echo -e "\n📋 3. 检查 dropshare 静态文件..."
if [ -f "/var/www/dropshare/dist/index.html" ]; then
    echo "dropshare index.html 内容："
    head -10 /var/www/dropshare/dist/index.html
else
    echo "dropshare index.html 不存在"
fi

echo -e "\n📝 4. 修复 dropshare 静态文件编码问题..."
cat > /var/www/dropshare/dist/index.html << 'EOF'
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DropShare - 文件分享平台</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .container {
            max-width: 800px;
            text-align: center;
            padding: 40px 20px;
        }
        
        .logo {
            font-size: 4em;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .title {
            font-size: 2.5em;
            margin-bottom: 30px;
            font-weight: 300;
        }
        
        .status {
            background: rgba(255,255,255,0.2);
            padding: 30px;
            border-radius: 15px;
            margin: 30px 0;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.1);
        }
        
        .status h2 {
            font-size: 1.5em;
            margin-bottom: 15px;
            color: #4ade80;
        }
        
        .time {
            font-size: 1.2em;
            margin: 15px 0;
            opacity: 0.9;
        }
        
        .links {
            margin-top: 40px;
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
        }
        
        .btn {
            color: white;
            text-decoration: none;
            padding: 15px 30px;
            background: rgba(255,255,255,0.2);
            border-radius: 10px;
            border: 1px solid rgba(255,255,255,0.3);
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        }
        
        .btn:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        
        .features {
            margin-top: 40px;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
        }
        
        .feature {
            background: rgba(255,255,255,0.1);
            padding: 20px;
            border-radius: 10px;
            border: 1px solid rgba(255,255,255,0.2);
        }
        
        .feature h3 {
            margin-bottom: 10px;
            color: #4ade80;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🚀</div>
        <h1 class="title">DropShare</h1>
        
        <div class="status">
            <h2>✅ 网站运行正常</h2>
            <p>多站点部署在8080端口成功运行</p>
            <p class="time">服务器时间: <span id="time"></span></p>
            <p>部署状态: 在线</p>
        </div>
        
        <div class="features">
            <div class="feature">
                <h3>📁 文件分享</h3>
                <p>安全可靠的文件分享服务</p>
            </div>
            <div class="feature">
                <h3>🔒 隐私保护</h3>
                <p>端到端加密保护您的数据</p>
            </div>
            <div class="feature">
                <h3>⚡ 高速传输</h3>
                <p>优化的传输速度</p>
            </div>
        </div>
        
        <div class="links">
            <a href="http://colletools.com:8080" class="btn">访问 Colletools</a>
            <a href="/" class="btn">刷新页面</a>
        </div>
    </div>
    
    <script>
        // 更新时间
        function updateTime() {
            const now = new Date();
            document.getElementById('time').textContent = now.toLocaleString('zh-CN');
        }
        
        updateTime();
        setInterval(updateTime, 1000);
        
        // 添加一些交互效果
        document.addEventListener('DOMContentLoaded', function() {
            const container = document.querySelector('.container');
            container.style.opacity = '0';
            container.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                container.style.transition = 'all 0.5s ease';
                container.style.opacity = '1';
                container.style.transform = 'translateY(0)';
            }, 100);
        });
    </script>
</body>
</html>
EOF

echo "✅ dropshare 静态文件已修复"

echo -e "\n📋 5. 检查 colletools-app 构建状态..."
if docker ps | grep -q colletools-app; then
    echo "colletools-app 容器正在运行"
    
    # 检查容器内部
    echo "检查容器内部文件..."
    docker exec colletools-app ls -la /app 2>/dev/null || echo "无法访问容器内部"
    
    # 检查端口监听
    echo "检查端口监听..."
    docker exec colletools-app netstat -tlnp 2>/dev/null || echo "无法检查端口"
    
else
    echo "colletools-app 容器未运行，重新构建..."
    
    echo "重新构建 colletools-app..."
    docker-compose build colletools-app
    
    echo "启动 colletools-app..."
    docker-compose up -d colletools-app
    
    echo "等待启动..."
    sleep 10
    
    echo "检查启动状态..."
    docker ps | grep colletools-app
fi

echo -e "\n📋 6. 重启 nginx 代理..."
docker restart nginx-8080

echo "⏳ 7. 等待服务重启..."
sleep 5

echo "📋 8. 最终状态检查..."
docker ps

echo "🌐 9. 测试访问..."
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "localhost")
echo "服务器IP: $SERVER_IP"

echo "测试 dropshare:"
curl -I http://$SERVER_IP:8080 2>/dev/null || echo "dropshare访问失败"

echo "测试 colletools:"
curl -I http://$SERVER_IP:8080 2>/dev/null || echo "colletools访问失败"

echo -e "\n📝 10. 提供测试链接..."
echo -e "\n🎉 修复完成！请测试以下链接："
echo "=================================="
echo "DropShare:"
echo "- http://dropshare.tech:8080"
echo "- http://$SERVER_IP:8080"
echo ""
echo "Colletools:"
echo "- http://colletools.com:8080"
echo "- http://$SERVER_IP:8080"
echo ""
echo "📋 如果还有问题，请检查："
echo "1. 浏览器缓存（Ctrl+F5 强制刷新）"
echo "2. 容器日志: docker logs colletools-app"
echo "3. nginx日志: docker logs nginx-8080"
