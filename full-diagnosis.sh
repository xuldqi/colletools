#!/bin/bash

# 全面诊断 dropshare.tech 访问问题
echo "🔍 全面诊断 dropshare.tech 访问问题..."
echo "====================================="

echo "1. 基础连接测试:"
echo "---------------"
echo "本地服务测试:"
curl -s -I http://localhost:8080 | head -3
echo ""

echo "2. DNS 解析测试:"
echo "---------------"
echo "dropshare.tech 的 DNS 解析:"
nslookup dropshare.tech
echo ""
echo "本机 IP 地址:"
hostname -I
echo ""

echo "3. nginx 配置全面检查:"
echo "--------------------"
echo "所有启用的站点:"
ls -la /etc/nginx/sites-enabled/
echo ""

echo "nginx 主配置检查 server_names_hash_bucket_size:"
grep -n "server_names_hash_bucket_size" /etc/nginx/nginx.conf || echo "未设置 server_names_hash_bucket_size"
echo ""

echo "检查所有配置文件中的 dropshare.tech:"
for config in /etc/nginx/sites-enabled/*; do
    if [ -f "$config" ]; then
        echo "=== $config ==="
        if grep -q "dropshare" "$config"; then
            cat "$config"
        else
            echo "此文件不包含 dropshare 配置"
        fi
        echo ""
    fi
done

echo "4. 端口和防火墙检查:"
echo "------------------"
echo "80 端口监听状态:"
netstat -tlnp | grep :80
echo ""

echo "防火墙状态:"
ufw status 2>/dev/null || echo "ufw 未启用或不可用"
echo ""

echo "5. nginx 进程和状态:"
echo "------------------"
echo "nginx 进程:"
ps aux | grep nginx | grep -v grep
echo ""

echo "nginx 状态:"
systemctl status nginx --no-pager -l
echo ""

echo "6. 测试所有可能的访问方式:"
echo "------------------------"

# 测试本机IP访问
LOCAL_IP=$(hostname -I | awk '{print $1}')
echo "测试本机IP ($LOCAL_IP):"
curl -s -I -H "Host: dropshare.tech" http://$LOCAL_IP/ | head -3
echo ""

echo "测试 127.0.0.1:"
curl -s -I -H "Host: dropshare.tech" http://127.0.0.1/ | head -3
echo ""

echo "测试域名 (不带 Host 头):"
curl -s -I http://dropshare.tech/ | head -3
echo ""

echo "7. nginx 错误日志:"
echo "----------------"
echo "最新的 nginx 错误:"
tail -20 /var/log/nginx/error.log 2>/dev/null | tail -10
echo ""

echo "8. 尝试创建最简单的测试配置:"
echo "---------------------------"

# 备份所有现有配置
echo "备份现有配置..."
mkdir -p /tmp/nginx-backup-$(date +%s)
cp -r /etc/nginx/sites-enabled/* /tmp/nginx-backup-$(date +%s)/ 2>/dev/null

# 禁用所有现有配置
echo "临时禁用所有配置..."
rm -f /etc/nginx/sites-enabled/*

# 创建最简单的测试配置
echo "创建测试配置..."
cat > /etc/nginx/sites-available/test-dropshare << 'EOF'
server {
    listen 80 default_server;
    server_name _;
    
    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOF

ln -s /etc/nginx/sites-available/test-dropshare /etc/nginx/sites-enabled/

echo "测试新配置..."
if nginx -t; then
    echo "✅ 测试配置语法正确"
    echo "重启 nginx..."
    systemctl reload nginx
    sleep 2
    
    echo "测试访问..."
    echo "通过域名访问:"
    curl -s -I http://dropshare.tech | head -3
    echo ""
    echo "通过IP访问:"
    curl -s -I http://$LOCAL_IP | head -3
    
else
    echo "❌ 测试配置语法错误"
    nginx -t
fi

echo ""
echo "9. 建议的下一步:"
echo "==============="
echo "如果上述测试配置工作了，问题是之前的 nginx 配置冲突"
echo "如果还不工作，可能是:"
echo "- DNS 问题 (dropshare.tech 没有指向这台服务器)"
echo "- 防火墙阻挡了 80 端口"  
echo "- 网络路由问题"
echo ""
echo "恢复原配置命令 (如果需要):"
echo "cp /tmp/nginx-backup-*/\* /etc/nginx/sites-enabled/"
echo "systemctl reload nginx"