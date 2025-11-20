# 部署检查清单

## ✅ 已修复的问题

1. **Spotify 播放器链接** - 已更新为有效的 Lofi Girl 播放列表
2. **构建错误** - 移除了导致构建失败的实验性配置

## ⚠️ 需要在 Vercel 配置

### 环境变量设置

1. 登录 Vercel Dashboard
2. 选择你的项目 (colletools)
3. 进入 **Settings** → **Environment Variables**
4. 添加以下环境变量：

**方式一：使用 OpenAI 兼容的第三方 API（推荐）**
```
Key: OPENAI_API_KEY
Value: (你的 API 密钥，通常以 sk- 开头)

Key: OPENAI_API_BASE_URL (可选)
Value: (你的 API 基础 URL，例如 https://api.example.com/v1)
如果不填，默认使用 https://api.openai.com/v1

Key: OPENAI_MODEL (可选)
Value: (模型名称，例如 gpt-3.5-turbo, gpt-4)
如果不填，默认使用 gpt-3.5-turbo
```

**方式二：使用 Google Gemini API**
```
Key: GEMINI_API_KEY
Value: (你的 Google Gemini API 密钥，以 AIza... 开头)
```

5. **重要**：添加后需要重新部署
   - 进入 **Deployments** 页面
   - 点击最新的部署右侧的 **...** 菜单
   - 选择 **Redeploy**

### 验证步骤

部署完成后，测试以下功能：

1. ✅ 访问 `/pomodoro` - 确认 Spotify 播放器正常加载
2. ✅ 访问 `/email-gen` - 填写表单并点击 "Generate Draft"
   - 如果显示错误，检查 Vercel 环境变量是否正确配置
   - 检查 Vercel 部署日志中的错误信息

## 其他注意事项

- 日期输入框的显示格式由浏览器语言决定，这是正常的浏览器行为
- 所有数据都存储在用户的浏览器 localStorage 中，无需数据库
- 网站已配置为隐私优先，无追踪、无数据销售

