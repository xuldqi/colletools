# ColleTools

统一的在线工具平台：学生工具（GPA 计算器、邮件生成、引用助手、番茄钟等）+ 100+ 通用工具（PDF、图片、视频、OCR 等）。

## 子域名

| 子域名 | 内容 |
|--------|------|
| www.colletools.com / colletools.com | 本应用（学生工具 + 100+ 工具） |
| i.colletools.com | 个人作品集（独立项目 mycolletools） |

## 技术栈

- **前端**: React 18 + Vite + TypeScript + Tailwind CSS
- **后端**: Express (API 服务)
- **国际化**: React i18next

## 开发

```bash
# 首次安装（若 Puppeteer 下载失败，可设 PUPPETEER_SKIP_DOWNLOAD=1）
npm install
npm run dev   # 同时启动前端(Vite)和后端(Express)
```

前端: http://localhost:5173  
后端 API: http://localhost:3002  

## 构建

```bash
npm run build
```

## 部署

需要服务器（Docker/PM2），因依赖 FFmpeg、Puppeteer 等。详见 DEPLOYMENT.md。
