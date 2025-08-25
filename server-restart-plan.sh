#!/bin/bash

# 服务器重启前后检查计划
echo "🔄 服务器重启检查计划..."
echo "======================="

ACTION=${1:-"check"}

if [ "$ACTION" = "before" ]; then
    echo "📋 重启前检查和准备..."
    echo "===================="
    
    echo "1. 保存当前状态:"
    echo "---------------"
    echo "当前时间: $(date)"
    echo "nginx状态: $(systemctl is-active nginx)"
    echo "PM2进程数: $(pm2 list 2>/dev/null | grep -c online || echo 0)"
    
    # 保存重启前状态
    mkdir -p /tmp/restart-backup
    systemctl status nginx > /tmp/restart-backup/nginx-status-before.txt
    pm2 list > /tmp/restart-backup/pm2-status-before.txt 2>/dev/null || echo "PM2未运行" > /tmp/restart-backup/pm2-status-before.txt
    netstat -tlnp > /tmp/restart-backup/ports-before.txt
    
    echo "✅ 状态已保存到 /tmp/restart-backup/"
    
    echo ""
    echo "2. 确保服务自启动:"
    echo "----------------"
    systemctl enable nginx
    echo "✅ nginx已设置为开机自启动"
    
    echo ""
    echo "3. 保存PM2配置:"
    echo "-------------"
    pm2 save 2>/dev/null && echo "✅ PM2配置已保存" || echo "❌ PM2配置保存失败"
    
    echo ""
    echo "🚨 准备就绪，可以安全重启服务器!"
    echo "重启后请运行: sudo bash server-restart-plan.sh after"
    
elif [ "$ACTION" = "after" ]; then
    echo "🔍 重启后检查..."
    echo "==============="
    
    echo "1. 基础服务状态:"
    echo "---------------"
    echo "系统运行时间: $(uptime)"
    echo "nginx状态: $(systemctl is-active nginx)"
    
    if ! systemctl is-active --quiet nginx; then
        echo "🔧 启动nginx..."
        systemctl start nginx
        systemctl enable nginx
    fi
    
    echo ""
    echo "2. 恢复PM2进程:"
    echo "-------------"
    if command -v pm2 >/dev/null; then
        pm2 resurrect 2>/dev/null
        sleep 3
        pm2 list
        
        # 如果PM2进程没有自动恢复，手动启动
        if ! pm2 list 2>/dev/null | grep -q online; then
            echo "手动启动PM2进程..."
            cd /var/www/colletools && pm2 start server.ts --name colletools 2>/dev/null || echo "ColleTools启动失败"
            cd /var/www/dropshare && pm2 start index.js --name dropshare 2>/dev/null || echo "DropShare启动失败"
        fi
    else
        echo "❌ PM2未安装"
    fi
    
    echo ""
    echo "3. 端口检查:"
    echo "----------"
    echo "80端口: $(netstat -tlnp | grep :80 | wc -l) 个监听"
    echo "3002端口: $(netstat -tlnp | grep :3002 | wc -l) 个监听"
    echo "8080端口: $(netstat -tlnp | grep :8080 | wc -l) 个监听"
    
    echo ""
    echo "4. 网站可用性测试:"
    echo "----------------"
    sleep 5  # 等待服务完全启动
    
    echo "测试本地服务:"
    curl -s -I http://localhost:3002 | head -1 && echo "✅ ColleTools本地正常" || echo "❌ ColleTools本地异常"
    curl -s -I http://localhost:8080 | head -1 && echo "✅ DropShare本地正常" || echo "❌ DropShare本地异常"
    
    echo ""
    echo "测试外部访问:"
    curl -s -I http://colletools.com | head -1 && echo "✅ colletools.com外部正常" || echo "❌ colletools.com外部异常"
    curl -s -I http://dropshare.tech | head -1 && echo "✅ dropshare.tech外部正常" || echo "❌ dropshare.tech外部异常"
    
    echo ""
    echo "5. 对比重启前后:"
    echo "==============="
    if [ -f "/tmp/restart-backup/ports-before.txt" ]; then
        echo "重启前端口数: $(cat /tmp/restart-backup/ports-before.txt | wc -l)"
        echo "重启后端口数: $(netstat -tlnp | wc -l)"
    fi
    
else
    echo "📊 当前系统状态检查..."
    echo "===================="
    
    echo "1. 运行终极诊断:"
    echo "==============="
    bash ultimate-diagnosis.sh
    
    echo ""
    echo "2. 重启建议:"
    echo "==========="
    echo "如果上述诊断显示服务器配置正常但外部仍无法访问，"
    echo "很可能是系统级别的网络问题，建议重启。"
    echo ""
    echo "🔄 重启流程:"
    echo "1. sudo bash server-restart-plan.sh before"
    echo "2. sudo reboot"
    echo "3. 重启后登录: sudo bash server-restart-plan.sh after"
    echo ""
    echo "⚠️  重启前确保:"
    echo "- 保存了所有重要数据"
    echo "- 确认有控制台访问权限"
    echo "- 网站代码已提交到Git"
fi