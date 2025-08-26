import { useEffect } from 'react';

interface PerformanceMetrics {
  FCP?: number; // First Contentful Paint
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  TTFB?: number; // Time to First Byte
}

const PerformanceMonitor: React.FC = () => {
  useEffect(() => {
    // 监控核心Web指标
    const observePerformance = () => {
      const metrics: PerformanceMetrics = {};

      // 监控 LCP (Largest Contentful Paint)
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1] as any;
            metrics.LCP = lastEntry.startTime;
            console.log('LCP:', metrics.LCP);
            
            // 发送到分析服务
            sendMetrics('LCP', metrics.LCP);
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          console.warn('LCP observation not supported');
        }

        // 监控 FID (First Input Delay)
        try {
          const fidObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach((entry: any) => {
              metrics.FID = entry.processingStart - entry.startTime;
              console.log('FID:', metrics.FID);
              
              // 发送到分析服务
              sendMetrics('FID', metrics.FID);
            });
          });
          fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {
          console.warn('FID observation not supported');
        }

        // 监控 CLS (Cumulative Layout Shift)
        try {
          let clsValue = 0;
          const clsObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach((entry: any) => {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            });
            metrics.CLS = clsValue;
            console.log('CLS:', metrics.CLS);
            
            // 发送到分析服务
            sendMetrics('CLS', metrics.CLS);
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
          console.warn('CLS observation not supported');
        }
      }

      // 监控 FCP (First Contentful Paint)
      if ('performance' in window && 'getEntriesByType' in performance) {
        const paintEntries = performance.getEntriesByType('paint');
        const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          metrics.FCP = fcpEntry.startTime;
          console.log('FCP:', metrics.FCP);
          sendMetrics('FCP', metrics.FCP);
        }
      }

      // 监控 TTFB (Time to First Byte)
      if ('performance' in window && 'timing' in performance) {
        const timing = performance.timing;
        metrics.TTFB = timing.responseStart - timing.navigationStart;
        console.log('TTFB:', metrics.TTFB);
        sendMetrics('TTFB', metrics.TTFB);
      }

      // 监控资源加载性能
      if ('performance' in window && 'getEntriesByType' in performance) {
        const resourceEntries = performance.getEntriesByType('resource');
        const slowResources = resourceEntries.filter((entry: any) => entry.duration > 1000);
        if (slowResources.length > 0) {
          console.warn('Slow loading resources:', slowResources);
          sendMetrics('slow_resources', slowResources.length);
        }
      }
    };

    // 页面加载完成后开始监控
    if (document.readyState === 'complete') {
      observePerformance();
    } else {
      window.addEventListener('load', observePerformance);
    }

    // 监控内存使用情况
    const monitorMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const memoryUsage = {
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit
        };
        console.log('Memory usage:', memoryUsage);
        
        // 如果内存使用超过80%，发出警告
        if (memoryUsage.used / memoryUsage.limit > 0.8) {
          console.warn('High memory usage detected');
          sendMetrics('high_memory_usage', memoryUsage.used / memoryUsage.limit);
        }
      }
    };

    // 每30秒检查一次内存使用情况
    const memoryInterval = setInterval(monitorMemory, 30000);

    return () => {
      clearInterval(memoryInterval);
      window.removeEventListener('load', observePerformance);
    };
  }, []);

  // 发送性能指标到分析服务
  const sendMetrics = (metricName: string, value: number) => {
    // 这里可以集成Google Analytics、Firebase Analytics或其他分析服务
    if (typeof gtag !== 'undefined') {
      gtag('event', 'performance_metric', {
        metric_name: metricName,
        metric_value: Math.round(value),
        custom_parameter: {
          user_agent: navigator.userAgent,
          connection_type: (navigator as any).connection?.effectiveType || 'unknown'
        }
      });
    }

    // 也可以发送到自定义的分析端点
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/analytics/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metric: metricName,
          value: value,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent
        })
      }).catch(err => console.warn('Failed to send performance metrics:', err));
    }
  };

  return null; // 这是一个无UI的监控组件
};

export default PerformanceMonitor;

// 导出性能监控工具函数
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  const duration = end - start;
  console.log(`${name} took ${duration} milliseconds`);
  return duration;
};

// 导出异步性能监控工具函数
export const measureAsyncPerformance = async (name: string, fn: () => Promise<any>) => {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  const duration = end - start;
  console.log(`${name} took ${duration} milliseconds`);
  return { result, duration };
};