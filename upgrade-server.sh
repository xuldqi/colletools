#!/bin/bash

# 服务器升级脚本 - 安装所有必要的构建工具
echo "🚀 升级服务器，安装构建工具..."

# 更新包管理器
echo "📦 更新包管理器..."
apt update && apt upgrade -y

# 安装 Node.js 20
echo "📦 安装 Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# 安装 Python 和构建工具
echo "🐍 安装 Python 和构建工具..."
apt-get install -y \
    python3 \
    python3-pip \
    build-essential \
    pkg-config

# 安装图像处理库
echo "🖼️ 安装图像处理库..."
apt-get install -y \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    libpixman-1-dev \
    libfreetype6-dev \
    libfontconfig1-dev

# 安装 PDF 处理库
echo "📄 安装 PDF 处理库..."
apt-get install -y \
    poppler-utils \
    ghostscript \
    libreoffice

# 安装 OCR 工具
echo "👁️ 安装 OCR 工具..."
apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-chi-sim \
    tesseract-ocr-eng

# 安装 FFmpeg
echo "🎬 安装 FFmpeg..."
apt-get install -y ffmpeg

# 安装 Chrome/Chromium (用于 Puppeteer)
echo "🌐 安装 Chrome..."
apt-get install -y \
    chromium-browser \
    chromium-chromedriver

# 设置环境变量
echo "🔧 设置环境变量..."
echo 'export CHROME_BIN=/usr/bin/chromium-browser' >> ~/.bashrc
echo 'export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true' >> ~/.bashrc
source ~/.bashrc

# 安装 Docker 构建工具
echo "🐳 安装 Docker 构建工具..."
apt-get install -y \
    docker.io \
    docker-compose

# 启动 Docker 服务
echo "🚀 启动 Docker 服务..."
systemctl start docker
systemctl enable docker

# 验证安装
echo "✅ 验证安装..."
echo "Node.js 版本："
node --version
echo "npm 版本："
npm --version
echo "Python 版本："
python3 --version
echo "Docker 版本："
docker --version

echo ""
echo "🎉 服务器升级完成！"
echo ""
echo "📋 已安装的工具："
echo "- Node.js 20"
echo "- Python 3"
echo "- 构建工具 (make, g++, pkg-config)"
echo "- 图像处理库 (Cairo, Pango, JPEG, etc.)"
echo "- PDF 处理工具 (Poppler, Ghostscript, LibreOffice)"
echo "- OCR 工具 (Tesseract)"
echo "- FFmpeg"
echo "- Chrome/Chromium"
echo "- Docker"
echo ""
echo "🚀 现在可以正常构建项目了："
echo "docker-compose up -d --build"
