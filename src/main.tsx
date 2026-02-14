import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.tsx'
import './index.css'
import { initI18n } from './i18n'
import { preloadOCRResources } from './utils/ocrConfig'

// 立即渲染应用，不等待i18n初始化
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        }>
          <App />
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
)

// 异步初始化i18n，不阻塞首屏渲染
initI18n.catch(error => {
  console.warn('i18n initialization failed:', error)
})

// 延迟注册Service Worker，避免阻塞首屏
setTimeout(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }
}, 3000)

// 延迟预加载OCR资源，避免影响首屏性能
setTimeout(() => {
  preloadOCRResources();
}, 5000)