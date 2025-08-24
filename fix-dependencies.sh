#!/bin/bash

# 修复依赖问题的脚本
echo "🔧 修复项目依赖问题..."

# 备份原始 package.json
echo "📋 备份原始 package.json..."
cp package.json package.json.backup

# 使用简化版 package.json
echo "📝 使用简化版 package.json..."
cp package.json.simple package.json

# 清理 node_modules 和 package-lock.json
echo "🧹 清理旧的依赖..."
rm -rf node_modules package-lock.json

# 重新安装依赖
echo "📦 重新安装依赖..."
npm install

# 构建项目
echo "🔨 构建项目..."
npm run build

echo ""
echo "✅ 依赖修复完成！"
echo ""
echo "📋 已移除的复杂依赖："
echo "- canvas (需要编译)"
echo "- puppeteer (需要编译)"
echo "- sharp (需要编译)"
echo "- @ffmpeg-installer/ffmpeg (需要编译)"
echo "- fluent-ffmpeg (需要编译)"
echo "- libreoffice-convert (需要编译)"
echo "- pdf2pic (需要编译)"
echo "- tesseract.js (需要编译)"
echo "- @tensorflow-models/universal-sentence-encoder (需要编译)"
echo "- @tensorflow/tfjs (需要编译)"
echo ""
echo "🔧 如果某些功能需要这些依赖，可以："
echo "1. 使用在线服务替代"
echo "2. 使用预构建的 Docker 镜像"
echo "3. 在服务器上预安装这些工具"
echo ""
echo "🚀 现在可以尝试部署了："
echo "./ultra-simple-deploy.sh"
