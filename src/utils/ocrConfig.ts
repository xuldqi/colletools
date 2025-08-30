/**
 * OCR Configuration for Tesseract.js CDN
 * This configuration ensures optimal loading and performance of OCR capabilities
 */
import { PLUGINS } from './pluginLoader';

// Add Tesseract plugin configuration
PLUGINS.tesseract = {
  name: 'tesseract',
  displayName: 'Tesseract.js OCR 引擎',
  url: 'https://unpkg.com/tesseract.js@v4.1.4/dist/tesseract.min.js',
  globalVar: 'Tesseract',
  checkFunction: () => typeof (window as any).Tesseract !== 'undefined' && (window as any).Tesseract.createWorker
};

// Configure Tesseract.js to use CDN resources
export const tesseractConfig = {
  // CDN paths for Tesseract.js core and worker
  corePath: 'https://unpkg.com/tesseract.js@v4.1.4/dist/tesseract-core.wasm.js',
  workerPath: 'https://unpkg.com/tesseract.js@v4.1.4/dist/worker.min.js',
  langPath: 'https://tessdata.projectnaptha.com/4.0.0',
  
  // Default language settings
  defaultLanguages: ['eng', 'chi_sim', 'chi_tra', 'jpn', 'kor', 'spa', 'fra', 'deu'],
  
  // Performance settings
  options: {
    logger: (m: any) => console.log('OCR Progress:', m),
    
    // OCR Engine Mode
    tessedit_ocr_engine_mode: 1, // Neural nets LSTM engine only
    
    // Page Segmentation Mode
    tessedit_pageseg_mode: 6, // Uniform block of text
    
    // Character whitelist/blacklist can be set per use case
    preserve_interword_spaces: '1',
  }
};

// Function to preload OCR resources using new plugin system
export const preloadOCRResources = async () => {
  try {
    const { pluginManager } = await import('./pluginLoader');
    await pluginManager.loadPlugin('tesseract');
    
    // Check if Tesseract is available from CDN
    if (typeof window !== 'undefined' && (window as any).Tesseract) {
      console.log('✅ Tesseract.js loaded successfully from CDN');
      
      // Create a worker to pre-initialize
      const worker = (window as any).Tesseract.createWorker();
      
      try {
        // Check if worker has load method (older versions) or use new API
        if (typeof worker.load === 'function') {
          await worker.load();
          await worker.loadLanguage('eng'); // Preload English
          await worker.initialize('eng');
        } else {
          // New Tesseract.js API (v4+)
          await worker.loadLanguage('eng');
          await worker.initialize('eng');
        }
        
        // Store globally for use in components
        (window as any).tessWorker = worker;
        
        console.log('✅ OCR engine pre-initialized');
      } catch (workerError) {
        console.warn('⚠️ Worker initialization failed, will use on-demand loading:', workerError);
        // Don't store failed worker
      }
      
      console.log('✅ OCR engine pre-initialized');
      
      return true;
    }
  } catch (error) {
    console.warn('⚠️ OCR preload failed, will load on demand:', error);
  }
  return false;
};

// Function to initialize OCR for specific language
export const initializeOCRForLanguage = async (language: string = 'eng') => {
  try {
    if (typeof window !== 'undefined' && (window as any).Tesseract) {
      const worker = (window as any).Tesseract.createWorker();
      
      // Check if worker has load method (older versions) or use new API
      if (typeof worker.load === 'function') {
        await worker.load();
        await worker.loadLanguage(language);
        await worker.initialize(language);
      } else {
        // New Tesseract.js API (v4+)
        await worker.loadLanguage(language);
        await worker.initialize(language);
      }
      
      return worker;
    }
  } catch (error) {
    console.error('Failed to initialize OCR for language:', language, error);
  }
  return null;
};

// QR Code configuration
export const qrCodeConfig = {
  // Use jsQR from CDN for reading QR codes
  canvasSize: { width: 800, height: 600 },
  options: {
    inversionAttempts: 'dontInvert' as const,
  }
};

// Image processing configuration
export const imageProcessingConfig = {
  // Default settings for image preprocessing
  preprocessing: {
    contrast: 1.2,
    brightness: 1.1,
    sharpen: true,
    grayscale: true
  },
  
  // Supported formats
  supportedFormats: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'],
  
  // Maximum file size (50MB)
  maxFileSize: 50 * 1024 * 1024,
};
