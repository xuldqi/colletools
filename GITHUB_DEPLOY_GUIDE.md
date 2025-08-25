# 🚀 ColleTools GitHub 部署指南

## 📋 通过 GitHub 部署步骤

### 1. 准备 GitHub 仓库

```bash
# 在本地项目目录
git init
git add .
git commit -m "Initial commit - ColleTools with fixed configs"
git branch -M main
git remote add origin https://github.com/你的用户名/colletools.git
git push -u origin main
```

### 2. 服务器上部署

```bash
# 1. 连接到服务器
ssh username@your-server-ip

# 2. 克隆项目
cd /var/www
sudo git clone https://github.com/你的用户名/colletools.git
cd colletools

# 3. 一键部署
sudo chmod +x deploy-direct.sh
sudo ./deploy-direct.sh
```

### 3. 后续更新流程

```bash
# 本地修改后
git add .
git commit -m "Update: 功能描述"
git push

# 服务器更新
cd /var/www/colletools
sudo git pull
npm install
npm run build
pm2 restart colletools
```

## 🔐 敏感信息处理

### 需要修改的文件

**在 GitHub 上传前**：

1. **修改 .env 为模板**
```bash
# 重命名当前配置
mv .env .env.example

# 创建模板
cat > .env.example << EOF
# 域名配置
PRIMARY_DOMAIN=your-domain.com
SECONDARY_DOMAIN=your-second-domain.com

# SSL 证书邮箱
SSL_EMAIL=your-email@example.com

# 应用配置
NODE_ENV=production
PORT=3000

# 部署配置
DEPLOY_ID=prod
HTTP_PORT=80
HTTPS_PORT=443
EOF
```

2. **确保 .gitignore 包含敏感文件**
```bash
# 检查 .gitignore
cat >> .gitignore << EOF
.env
logs/
uploads/
ssl/
*.log
node_modules/
dist/
EOF
```

## 🛠️ 服务器部署脚本调整

修改 `deploy-direct.sh` 以支持 GitHub 部署：

```bash
# 在部署脚本中添加环境配置步骤
echo "📝 配置生产环境..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "请编辑 .env 文件设置正确的域名和邮箱："
    echo "nano .env"
    echo "设置完成后按回车继续..."
    read
fi
```

## 📂 推荐的项目结构

```
/var/www/
├── project1/          # 你的现有项目 (端口3001)
├── colletools/        # ColleTools (端口3002)
└── future-project/    # 将来的项目 (端口3003+)
```

## 🔄 GitHub Webhook 自动部署（高级，可选）

如果想要推送代码后自动部署：

### 1. 创建 webhook 脚本
```bash
# /var/www/colletools/webhook.js
const express = require('express');
const { exec } = require('child_process');
const app = express();

app.use(express.json());

app.post('/webhook', (req, res) => {
    console.log('Received webhook:', new Date());
    
    exec('cd /var/www/colletools && git pull && npm install && npm run build && pm2 restart colletools', 
        (error, stdout, stderr) => {
            if (error) {
                console.error('Deploy error:', error);
                return res.status(500).send('Deploy failed');
            }
            console.log('Deploy success:', stdout);
            res.send('Deploy success');
        }
    );
});

app.listen(3010, () => {
    console.log('Webhook server running on port 3010');
});
```

### 2. 在 GitHub 设置 Webhook
- 进入仓库 Settings → Webhooks
- 添加 Webhook URL: `http://your-server-ip:3010/webhook`
- 选择 "Just the push event"

## 📝 最终部署清单

### 本地准备
- [ ] 修改 .env 为 .env.example
- [ ] 确认 .gitignore 正确
- [ ] 提交代码到 GitHub

### 服务器部署
- [ ] 克隆项目：`git clone ...`
- [ ] 复制并编辑 .env：`cp .env.example .env`
- [ ] 运行部署脚本：`sudo ./deploy-direct.sh`
- [ ] 配置 SSL：`sudo ./setup-ssl-direct.sh`
- [ ] 测试访问网站

### 验证部署
- [ ] 访问 http://colletools.com
- [ ] 检查 API：http://colletools.com/health
- [ ] 测试文件上传功能
- [ ] 确认 PM2 状态：`pm2 status`

## 🎉 预期结果

部署成功后：
- ✅ 两个项目和平共存（端口3001和3002）
- ✅ nginx 自动分发请求到正确项目
- ✅ 支持多个域名
- ✅ SSL 自动续期
- ✅ 进程自动重启
- ✅ 开机自启动

---

**现在可以提交代码到GitHub，然后在服务器上一键部署了！**