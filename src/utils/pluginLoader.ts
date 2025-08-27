/**
 * Universal Plugin Loader
 * Dynamically loads CDN resources with loading indicators
 */

export interface PluginConfig {
  name: string;
  displayName: string;
  url: string;
  globalVar?: string;
  dependencies?: string[];
  checkFunction?: () => boolean;
}

export interface LoadingState {
  isLoading: boolean;
  progress: number;
  message: string;
  error?: string;
}

// Plugin configurations
export const PLUGINS: Record<string, PluginConfig> = {
  ffmpeg: {
    name: 'ffmpeg',
    displayName: 'FFmpeg 视频处理引擎',
    url: 'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.7/dist/umd/ffmpeg.js',
    globalVar: 'FFmpegWASM',
    checkFunction: () => {
      console.log('[FFmpeg Check] Checking FFmpeg availability...');
      console.log('[FFmpeg Check] window.FFmpegWASM:', typeof (window as any).FFmpegWASM);
      
      const isAvailable = typeof (window as any).FFmpegWASM !== 'undefined' && (window as any).FFmpegWASM;
      
      if (isAvailable) {
        console.log('[FFmpeg Check] ✅ FFmpeg found at window.FFmpegWASM');
        console.log('[FFmpeg Check] FFmpegWASM keys:', Object.keys((window as any).FFmpegWASM));
      } else {
        console.log('[FFmpeg Check] ❌ FFmpegWASM not found or not ready');
      }
      
      return isAvailable;
    }
  },
  
  gifuct: {
    name: 'gifuct',
    displayName: 'GIF 处理引擎',
    url: 'https://cdn.jsdelivr.net/npm/gifuct-js@2.1.2/dist/gifuct-js.umd.js',
    globalVar: 'gifuct'
  },
  
  opencv: {
    name: 'opencv',
    displayName: 'OpenCV 图像处理',
    url: 'https://docs.opencv.org/4.8.0/opencv.js',
    globalVar: 'cv',
    checkFunction: () => typeof (window as any).cv !== 'undefined' && (window as any).cv.Mat
  },
  
  'pdfjs-lib': {
    name: 'pdfjs-lib',
    displayName: 'PDF.js 渲染引擎',
    url: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js',
    globalVar: 'pdfjsLib',
    checkFunction: () => {
      console.log('[PDF.js Check] Checking PDF.js availability...');
      console.log('[PDF.js Check] window.pdfjsLib:', typeof (window as any).pdfjsLib);
      const isAvailable = typeof (window as any).pdfjsLib !== 'undefined';
      console.log(`[PDF.js Check] ${isAvailable ? '✅' : '❌'} PDF.js ${isAvailable ? 'found' : 'not found'}`);
      return isAvailable;
    }
  },

  tesseract: {
    name: 'tesseract',
    displayName: 'Tesseract.js OCR引擎',
    url: 'https://cdn.jsdelivr.net/npm/tesseract.js@5.0.4/dist/tesseract.min.js',
    globalVar: 'Tesseract',
    checkFunction: () => {
      console.log('[Tesseract Check] Checking Tesseract availability...');
      console.log('[Tesseract Check] window.Tesseract:', typeof (window as any).Tesseract);
      const isAvailable = typeof (window as any).Tesseract !== 'undefined';
      console.log(`[Tesseract Check] ${isAvailable ? '✅' : '❌'} Tesseract ${isAvailable ? 'found' : 'not found'}`);
      return isAvailable;
    }
  },

  'pdf-lib': {
    name: 'pdf-lib',
    displayName: 'PDF-lib PDF处理库',
    url: 'https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js',
    globalVar: 'PDFLib',
    checkFunction: () => {
      console.log('[PDF-lib Check] Checking PDF-lib availability...');
      const isAvailable = typeof (window as any).PDFLib !== 'undefined';
      console.log(`[PDF-lib Check] ${isAvailable ? '✅' : '❌'} PDF-lib ${isAvailable ? 'found' : 'not found'}`);
      return isAvailable;
    }
  }
};

// Global loading state management
class PluginManager {
  private loadedPlugins = new Set<string>();
  private loadingPlugins = new Map<string, Promise<void>>();
  private loadingStates = new Map<string, LoadingState>();
  private listeners = new Set<(pluginName: string, state: LoadingState) => void>();

  // Subscribe to loading state changes
  onLoadingStateChange(listener: (pluginName: string, state: LoadingState) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Update loading state and notify listeners
  private updateLoadingState(pluginName: string, state: Partial<LoadingState>) {
    const currentState = this.loadingStates.get(pluginName) || {
      isLoading: false,
      progress: 0,
      message: ''
    };
    
    const newState = { ...currentState, ...state };
    this.loadingStates.set(pluginName, newState);
    
    this.listeners.forEach(listener => listener(pluginName, newState));
  }

  // Check if plugin is already loaded
  isPluginLoaded(pluginName: string): boolean {
    const plugin = PLUGINS[pluginName];
    if (!plugin) return false;

    if (this.loadedPlugins.has(pluginName)) return true;
    
    // Check global variable or custom check function
    if (plugin.checkFunction) {
      const isLoaded = plugin.checkFunction();
      if (isLoaded) this.loadedPlugins.add(pluginName);
      return isLoaded;
    }
    
    if (plugin.globalVar) {
      const isLoaded = typeof (window as any)[plugin.globalVar] !== 'undefined';
      if (isLoaded) this.loadedPlugins.add(pluginName);
      return isLoaded;
    }
    
    return false;
  }

  // Load plugin dynamically
  async loadPlugin(pluginName: string): Promise<void> {
    console.log(`[PluginManager] Loading plugin: ${pluginName}`);
    
    if (this.isPluginLoaded(pluginName)) {
      console.log(`[PluginManager] Plugin ${pluginName} already loaded`);
      return Promise.resolve();
    }

    // Return existing loading promise if already loading
    if (this.loadingPlugins.has(pluginName)) {
      console.log(`[PluginManager] Plugin ${pluginName} already loading, returning existing promise`);
      return this.loadingPlugins.get(pluginName)!;
    }

    const plugin = PLUGINS[pluginName];
    if (!plugin) {
      console.error(`[PluginManager] Plugin ${pluginName} not found in PLUGINS config`);
      throw new Error(`Plugin ${pluginName} not found`);
    }

    console.log(`[PluginManager] Starting to load plugin ${pluginName} from ${plugin.url}`);

    const loadingPromise = this.loadPluginInternal(plugin);
    this.loadingPlugins.set(pluginName, loadingPromise);

    try {
      await loadingPromise;
      this.loadedPlugins.add(pluginName);
      this.updateLoadingState(pluginName, {
        isLoading: false,
        progress: 100,
        message: `${plugin.displayName}加载完成`
      });
    } catch (error) {
      this.updateLoadingState(pluginName, {
        isLoading: false,
        error: `${plugin.displayName}加载失败: ${error.message}`
      });
      throw error;
    } finally {
      this.loadingPlugins.delete(pluginName);
    }
  }

  private async loadPluginInternal(plugin: PluginConfig): Promise<void> {
    this.updateLoadingState(plugin.name, {
      isLoading: true,
      progress: 0,
      message: `正在加载${plugin.displayName}...`
    });

    // Load dependencies first
    if (plugin.dependencies) {
      for (const dep of plugin.dependencies) {
        this.updateLoadingState(plugin.name, {
          progress: 25,
          message: `正在加载依赖项: ${PLUGINS[dep]?.displayName || dep}...`
        });
        await this.loadPlugin(dep);
      }
    }

    this.updateLoadingState(plugin.name, {
      progress: 50,
      message: `正在下载${plugin.displayName}...`
    });

    // Create and load script
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = plugin.url;
      script.async = true;
      
      script.onload = () => {
        this.updateLoadingState(plugin.name, {
          progress: 75,
          message: `正在初始化${plugin.displayName}...`
        });
        
        // Wait for initialization (longer for complex plugins like FFmpeg)
        const waitTime = plugin.name === 'ffmpeg' ? 1000 : 100;
        setTimeout(() => {
          console.log(`[loadPluginInternal] Checking if ${plugin.name} is loaded after ${waitTime}ms wait`);
          if (this.isPluginLoaded(plugin.name)) {
            resolve();
          } else {
            console.error(`[loadPluginInternal] Plugin ${plugin.name} not available after loading`);
            console.error(`[loadPluginInternal] Available window properties:`, Object.keys(window).filter(k => k.includes('FF')));
            reject(new Error('Plugin loaded but not available'));
          }
        }, waitTime);
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load script'));
      };
      
      // Add progress simulation for large plugins
      if (plugin.name === 'opencv' || plugin.name === 'ffmpeg') {
        let progress = 50;
        const progressInterval = setInterval(() => {
          if (progress < 70) {
            progress += 5;
            this.updateLoadingState(plugin.name, {
              progress,
              message: `正在下载${plugin.displayName}... ${progress}%`
            });
          }
        }, 500);
        
        script.onload = () => {
          clearInterval(progressInterval);
          this.updateLoadingState(plugin.name, {
            progress: 90,
            message: `正在初始化${plugin.displayName}...`
          });
          setTimeout(() => resolve(), 100);
        };
      }
      
      document.head.appendChild(script);
    });
  }

  // Get current loading state
  getLoadingState(pluginName: string): LoadingState | null {
    return this.loadingStates.get(pluginName) || null;
  }

  // Load multiple plugins
  async loadPlugins(pluginNames: string[]): Promise<void> {
    await Promise.all(pluginNames.map(name => this.loadPlugin(name)));
  }
}

// Global plugin manager instance
export const pluginManager = new PluginManager();

// Convenience functions
export const loadFFmpeg = () => pluginManager.loadPlugin('ffmpeg');
export const loadOpenCV = () => pluginManager.loadPlugin('opencv');
export const loadGIF = () => pluginManager.loadPlugin('gifuct');
export const loadPDFJS = () => pluginManager.loadPlugin('pdfjs-lib');
export const loadPDFLib = () => pluginManager.loadPlugin('pdf-lib');
export const loadTesseract = () => pluginManager.loadPlugin('tesseract');

// React hook for loading state (to be imported from React when needed)
export const createUsePluginLoader = (React: any) => {
  return (pluginName: string) => {
    const [loadingState, setLoadingState] = React.useState<LoadingState | null>(() => 
      pluginManager.getLoadingState(pluginName)
    );

    React.useEffect(() => {
      const unsubscribe = pluginManager.onLoadingStateChange((name, state) => {
        if (name === pluginName) {
          setLoadingState(state);
        }
      });
      return unsubscribe;
    }, [pluginName]);

    const loadPlugin = React.useCallback(async () => {
      console.log(`[usePluginLoader] Loading plugin: ${pluginName}`);
      try {
        await pluginManager.loadPlugin(pluginName);
        console.log(`[usePluginLoader] Plugin ${pluginName} loaded successfully`);
      } catch (error) {
        console.error(`[usePluginLoader] Failed to load plugin ${pluginName}:`, error);
      }
    }, [pluginName]);

    const isLoaded = pluginManager.isPluginLoaded(pluginName);

    return { loadingState, loadPlugin, isLoaded };
  };
};