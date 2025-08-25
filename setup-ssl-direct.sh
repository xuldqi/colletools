#!/bin/bash

# SSL证书配置脚本（直接部署版本）
echo "🔐 配置SSL证书"
echo "============="

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then
    echo "❌ 请使用 root 用户运行此脚本"
    exit 1
fi

# 1. 安装 Certbot
echo "📦 1. 安装 Certbot..."
if ! command -v certbot >/dev/null 2>&1; then
    apt-get update
    apt-get install -y certbot python3-certbot-nginx
    echo "✅ Certbot 安装完成"
else
    echo "✅ Certbot 已安装"
fi

# 2. 配置主域名证书
echo ""
echo "🌐 2. 配置主域名 SSL..."
echo "是否为 colletools.com 申请SSL证书? (y/n)"
read -r SETUP_PRIMARY

if [ "$SETUP_PRIMARY" = "y" ]; then
    certbot --nginx -d colletools.com -d www.colletools.com
fi

# 3. 配置第二域名证书
echo ""
echo "🌐 3. 配置第二域名 SSL..."
echo "是否为 dropshare.com 申请SSL证书? (y/n)"
read -r SETUP_SECONDARY

if [ "$SETUP_SECONDARY" = "y" ]; then
    certbot --nginx -d dropshare.com -d www.dropshare.com
fi

# 4. 设置自动续期
echo ""
echo "🔄 4. 设置自动续期..."

# 创建续期脚本
cat > /usr/local/bin/ssl-renew-direct.sh << 'EOF'
#!/bin/bash
# SSL自动续期脚本（直接部署版本）

echo "$(date): 开始SSL证书续期检查..." >> /var/log/ssl-renew.log

# 续期所有证书
certbot renew --quiet --no-self-upgrade

if [ $? -eq 0 ]; then
    echo "$(date): SSL证书续期成功" >> /var/log/ssl-renew.log
    # 重载nginx
    systemctl reload nginx
    echo "$(date): Nginx已重载" >> /var/log/ssl-renew.log
else
    echo "$(date): SSL证书续期失败" >> /var/log/ssl-renew.log
fi
EOF

chmod +x /usr/local/bin/ssl-renew-direct.sh

# 添加定时任务
if ! crontab -l 2>/dev/null | grep -q "ssl-renew-direct.sh"; then
    (crontab -l 2>/dev/null; echo "0 2 * * 0 /usr/local/bin/ssl-renew-direct.sh") | crontab -
    echo "✅ 自动续期任务已设置（每周日凌晨2点）"
else
    echo "✅ 自动续期任务已存在"
fi

# 5. 测试SSL配置
echo ""
echo "🧪 5. 测试SSL配置..."
if nginx -t; then
    echo "✅ Nginx配置正确"
    systemctl reload nginx
else
    echo "❌ Nginx配置有问题"
fi

echo ""
echo "🎉 SSL配置完成！"
echo "================"
echo "📋 配置信息："
echo "- 证书路径: /etc/letsencrypt/live/"
echo "- 自动续期: 每周日凌晨2点"
echo "- 续期日志: /var/log/ssl-renew.log"
echo ""
echo "🔧 管理命令："
echo "- 查看证书: certbot certificates"
echo "- 手动续期: certbot renew"
echo "- 测试续期: certbot renew --dry-run"
echo ""
echo "🌐 现在可以通过 HTTPS 访问："
echo "- https://colletools.com"
echo "- https://dropshare.com"