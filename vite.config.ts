import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
      },
    },
  },
  build: {
    // 启用代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          // 将大型第三方库分离到单独的chunk
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['lucide-react', 'sonner'],
          'vendor-i18n': ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
          // 将大型工具库延迟加载
          'vendor-pdf': ['pdf-lib', 'pdf-parse'],
          'vendor-office': ['docx', 'xlsx', 'mammoth'],
          'vendor-image': ['jimp', 'sharp'],
        }
      }
    },
    // 优化构建性能
    target: 'esnext',
    minify: 'esbuild',
    // 增加chunk大小警告阈值
    chunkSizeWarningLimit: 1000
  },
  // 优化依赖预构建
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react',
      'i18next',
      'react-i18next'
    ],
    exclude: [
      // 排除大型库，按需加载
      '@tensorflow/tfjs',
      '@tensorflow-models/universal-sentence-encoder',
      'puppeteer',
      'tesseract.js',
      'canvas',
      'firebase'
    ]
  },
  define: {
    global: 'globalThis'
  }
})
