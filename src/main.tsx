import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.tsx'
import './index.css'
import { initI18n } from './i18n'
import { preloadOCRResources } from './utils/ocrConfig'

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Preload OCR and other advanced features
window.addEventListener('load', () => {
  setTimeout(() => {
    preloadOCRResources().then(success => {
      if (success) {
        console.log('🚀 Advanced features (OCR, Image Processing) ready!');
      } else {
        console.log('⚠️ Advanced features will load on-demand');
      }
    });
  }, 2000); // Delay to not interfere with initial page load
});

// 等待 i18n 初始化完成再渲染
initI18n.then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <HelmetProvider>
        <BrowserRouter>
          <Suspense fallback={<div>Loading...</div>}>
            <App />
          </Suspense>
        </BrowserRouter>
      </HelmetProvider>
    </React.StrictMode>,
  )
})