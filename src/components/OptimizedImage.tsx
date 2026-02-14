import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  placeholder?: string;
  fallback?: string;
  onLoad?: () => void;
  onError?: () => void;
  sizes?: string;
  quality?: number;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  priority = false,
  placeholder,
  fallback,
  onLoad,
  onError,
  sizes,
  quality = 80
}) => {
  const { t } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority || loading === 'eager');
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 检查WebP支持
  const [supportsWebP, setSupportsWebP] = useState(false);
  
  useEffect(() => {
    const checkWebPSupport = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const dataURL = canvas.toDataURL('image/webp');
        setSupportsWebP(dataURL.indexOf('data:image/webp') === 0);
      }
    };
    
    checkWebPSupport();
  }, []);

  // 懒加载观察器
  useEffect(() => {
    if (loading === 'lazy' && !priority && imgRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              observerRef.current?.disconnect();
            }
          });
        },
        {
          rootMargin: '50px'
        }
      );
      
      observerRef.current.observe(imgRef.current);
    }
    
    return () => {
      observerRef.current?.disconnect();
    };
  }, [loading, priority]);

  // 生成优化的图片URL
  const getOptimizedSrc = (originalSrc: string): string => {
    // 如果是外部URL，直接返回
    if (originalSrc.startsWith('http')) {
      return originalSrc;
    }
    
    // 构建优化参数
    const params = new URLSearchParams();
    if (width) params.append('w', width.toString());
    if (height) params.append('h', height.toString());
    if (quality !== 80) params.append('q', quality.toString());
    if (supportsWebP) params.append('f', 'webp');
    
    const queryString = params.toString();
    return queryString ? `${originalSrc}?${queryString}` : originalSrc;
  };

  // 生成srcSet
  const generateSrcSet = (originalSrc: string): string => {
    if (originalSrc.startsWith('http') || !width) {
      return '';
    }
    
    const densities = [1, 1.5, 2, 3];
    return densities
      .map(density => {
        const scaledWidth = Math.round(width * density);
        const params = new URLSearchParams();
        params.append('w', scaledWidth.toString());
        if (height) params.append('h', Math.round(height * density).toString());
        if (quality !== 80) params.append('q', quality.toString());
        if (supportsWebP) params.append('f', 'webp');
        
        return `${originalSrc}?${params.toString()} ${density}x`;
      })
      .join(', ');
  };

  // 处理图片加载完成
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  // 处理图片加载错误
  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // 生成占位符
  const renderPlaceholder = () => {
    if (placeholder) {
      return (
        <img
          src={placeholder}
          alt=""
          className={`${className} blur-sm transition-all duration-300`}
          style={{ width, height }}
        />
      );
    }
    
    return (
      <div
        className={`${className} bg-gray-200 animate-pulse flex items-center justify-center`}
        style={{ width, height }}
      >
        <svg
          className="w-8 h-8 text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    );
  };

  // 生成错误状态
  const renderError = () => {
    if (fallback) {
      return (
        <img
          src={fallback}
          alt={alt}
          className={className}
          style={{ width, height }}
        />
      );
    }
    
    return (
      <div
        className={`${className} bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500`}
        style={{ width, height }}
      >
        <div className="text-center">
          <svg
            className="w-8 h-8 mx-auto mb-2 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-xs">{t('image.loadError', '图片加载失败')}</p>
        </div>
      </div>
    );
  };

  // 如果出错，显示错误状态
  if (hasError) {
    return renderError();
  }

  // 如果还没有进入视口，显示占位符
  if (!isInView) {
    return (
      <div ref={imgRef} style={{ width, height }}>
        {renderPlaceholder()}
      </div>
    );
  }

  const optimizedSrc = getOptimizedSrc(src);
  const srcSet = generateSrcSet(src);

  return (
    <div className="relative" style={{ width, height }}>
      {/* 占位符 */}
      {!isLoaded && renderPlaceholder()}
      
      {/* 实际图片 */}
      <img
        ref={imgRef}
        src={optimizedSrc}
        srcSet={srcSet || undefined}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        className={`${className} transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          position: isLoaded ? 'static' : 'absolute',
          top: isLoaded ? 'auto' : 0,
          left: isLoaded ? 'auto' : 0
        }}
      />
    </div>
  );
};

export default OptimizedImage;

// 导出预设配置的图片组件
export const HeroImage: React.FC<Omit<OptimizedImageProps, 'priority' | 'loading'>> = (props) => (
  <OptimizedImage {...props} priority loading="eager" />
);

export const LazyImage: React.FC<OptimizedImageProps> = (props) => (
  <OptimizedImage {...props} loading="lazy" />
);

export const ThumbnailImage: React.FC<Omit<OptimizedImageProps, 'quality'>> = (props) => (
  <OptimizedImage {...props} quality={60} />
);