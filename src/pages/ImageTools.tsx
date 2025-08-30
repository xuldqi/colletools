import React, { useState } from 'react';
import { Image, Minimize2, Palette, Crop, RotateCw, Upload, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next'
import SEOHead from '../components/SEOHead'
import StructuredData from '../components/StructuredData';
import { ImagePluginLoader } from '../components/PluginLoader';
import { pluginManager, loadOpenCV } from '../utils/pluginLoader';

interface ImageTool {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  popular: boolean;
  requiredPlugin: string;
  processingFunction: (file: File) => Promise<{ url?: string; }>;
}

const ImageTools = () => {
  const { t } = useTranslation();
  const [selectedTool, setSelectedTool] = useState<ImageTool | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImageUrl, setProcessedImageUrl] = useState<string>('');
  // 通用参数（根据不同工具显示/使用）
  const [convertFormat, setConvertFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [quality, setQuality] = useState<number>(80); // 0-100
  const [targetWidth, setTargetWidth] = useState<number>(1000);
  const [maintainAspect, setMaintainAspect] = useState<boolean>(true);
  const [cropPercent, setCropPercent] = useState<number>(80); // 取较小边百分比
  const [rotateAngle, setRotateAngle] = useState<number>(90);
  const [enhanceStrength, setEnhanceStrength] = useState<number>(10); // 亮度/对比度增益
  const [originalSizeMB, setOriginalSizeMB] = useState<string>('');
  const [estimatedSizeMB, setEstimatedSizeMB] = useState<string>('');
  const [processedSizeMB, setProcessedSizeMB] = useState<string>('');

  // 图像处理函数
  const dataUrlToBlob = (dataUrl: string): Blob => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };
  const processImageConvert = async (file: File) => {
    toast.info(t('common.convertingImageFormat'));
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error(t('common.canvasContextError'));
      }
      
      const img = document.createElement("img");
      
      return new Promise<{ url: string }>((resolve, reject) => {
        img.onload = () => {
          try {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            const mime = convertFormat === 'png' ? 'image/png' : convertFormat === 'webp' ? 'image/webp' : 'image/jpeg';
            const q = convertFormat === 'png' ? undefined : Math.min(1, Math.max(0, quality / 100));
            canvas.toBlob((blob) => {
              try {
                if (blob) {
                  toast.success(`✅ ${t('common.imageFormatConversionComplete')}${convertFormat.toUpperCase()}`);
                  resolve({ url: URL.createObjectURL(blob) });
                } else {
                  // 兜底：使用 dataURL 转 blob
                  const dataUrl = canvas.toDataURL(mime, q as number | undefined);
                  const fallbackBlob = dataUrlToBlob(dataUrl);
                  toast.success(`✅ ${t('common.imageFormatConversionComplete')}`);
                  resolve({ url: URL.createObjectURL(fallbackBlob) });
                }
              } catch (e) {
                reject(new Error(`${t('common.imageConversionError')}: ${(e as Error).message}`));
              }
            }, mime, q);
          } catch (error) {
            reject(new Error(`${t('common.imageProcessingError')}: ${error instanceof Error ? error.message : t('common.unknownError')}`));
          }
        };
        
        img.onerror = () => {
          reject(new Error(t('common.imageLoadError')));
        };
        
        img.src = URL.createObjectURL(file);
      });
    } catch (error) {
      throw new Error(`${t('common.initializationError')}: ${error instanceof Error ? error.message : t('common.unknownError')}`);
    }
  };

  const processImageCompress = async (file: File) => {
    toast.info(t('common.compressingImage'));
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error(t('common.canvasContextError'));
      }
      
      const img = document.createElement("img");
      
      return new Promise<{ url: string }>((resolve, reject) => {
        img.onload = () => {
          try {
            // 尺寸压缩到指定百分比（cropPercent 充当缩放百分比控制）
            const scale = Math.max(10, Math.min(100, cropPercent)) / 100;
            canvas.width = Math.round(img.width * scale);
            canvas.height = Math.round(img.height * scale);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            const q = Math.min(1, Math.max(0, quality / 100));
            canvas.toBlob((blob) => {
              try {
                let outBlob = blob;
                if (!outBlob) {
                  const dataUrl = canvas.toDataURL('image/jpeg', q);
                  outBlob = dataUrlToBlob(dataUrl);
                }
                const originalSize = (file.size / 1024 / 1024).toFixed(2);
                const compressedSize = (outBlob.size / 1024 / 1024).toFixed(2);
                const reduction = file.size > 0 ? (((file.size - outBlob.size) / file.size) * 100).toFixed(1) : '0.0';
                toast.success(t('common.imageCompressionCompleteWithSize', { originalSize, compressedSize, reduction }));
                setProcessedSizeMB(compressedSize);
                if (processedImageUrl) URL.revokeObjectURL(processedImageUrl);
                resolve({ url: URL.createObjectURL(outBlob) });
              } catch (e) {
                reject(new Error(`${t('common.imageCompressionError')}: ${(e as Error).message}`));
              }
            }, 'image/jpeg', q);
          } catch (error) {
            reject(new Error(`${t('common.imageProcessingError')}: ${error instanceof Error ? error.message : t('common.unknownError')}`));
          }
        };
        
        img.onerror = () => {
          reject(new Error(t('common.imageLoadError')));
        };
        
        img.src = URL.createObjectURL(file);
      });
    } catch (error) {
      throw new Error(`${t('common.initializationError')}: ${error instanceof Error ? error.message : t('common.unknownError')}`);
    }
  };

  const processPhotoEnhancer = async (file: File) => {
    toast.info(t('common.enhancingImage'));
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error(t('common.canvasContextError'));
      }
      
      const img = document.createElement("img");
      
      return new Promise<{ url: string }>((resolve, reject) => {
        img.onload = () => {
          try {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            // 获取图像数据并进行增强处理
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            // 应用亮度、对比度增强（强度可调）
            for (let i = 0; i < data.length; i += 4) {
              const brightness = enhanceStrength; // -50 ~ +50（这里只用正增益）
              const contrastFactor = 1 + enhanceStrength / 100; // 1.0~1.5
              data[i] = Math.min(255, Math.max(0, (data[i] + brightness - 128) * contrastFactor + 128));
              data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] + brightness - 128) * contrastFactor + 128));
              data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] + brightness - 128) * contrastFactor + 128));
            }
            
            // 将处理后的数据放回canvas
            ctx.putImageData(imageData, 0, 0);
            
            canvas.toBlob((blob) => {
              try {
                const outBlob = blob || dataUrlToBlob(canvas.toDataURL('image/jpeg', 0.9));
                toast.success(`✅ ${t('common.imageEnhancementComplete')}`);
                resolve({ url: URL.createObjectURL(outBlob) });
              } catch (e) {
                reject(new Error(`${t('common.imageEnhancementError')}: ${(e as Error).message}`));
              }
            }, 'image/jpeg', 0.9);
          } catch (error) {
            reject(new Error(`${t('common.imageProcessingError')}: ${error instanceof Error ? error.message : t('common.unknownError')}`));
          }
        };
        
        img.onerror = () => {
          reject(new Error(t('common.imageLoadError')));
        };
        
        img.src = URL.createObjectURL(file);
      });
    } catch (error) {
      throw new Error(`${t('common.initializationError')}: ${error instanceof Error ? error.message : t('common.unknownError')}`);
    }
  };

  const processImageCrop = async (file: File) => {
    toast.info('t("common.croppingImage")');
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error(t('common.canvasContextError'));
      }
      
      const img = document.createElement("img");
      
      return new Promise<{ url: string }>((resolve, reject) => {
        img.onload = () => {
          try {
            // 计算正方形裁剪尺寸（取较小边的 cropPercent%）
            const cropSize = Math.min(img.width, img.height) * Math.max(10, Math.min(100, cropPercent)) / 100;
            canvas.width = cropSize;
            canvas.height = cropSize;
            
            // 计算居中裁剪的起始位置
            const startX = (img.width - cropSize) / 2;
            const startY = (img.height - cropSize) / 2;
            
            // 绘制裁剪后的图像
            ctx.drawImage(
              img,
              startX, startY, cropSize, cropSize, // 源图像裁剪区域
              0, 0, cropSize, cropSize            // 目标canvas区域
            );
            
            canvas.toBlob((blob) => {
              try {
                const outBlob = blob || dataUrlToBlob(canvas.toDataURL('image/jpeg', 0.9));
                toast.success(t('common.imageCroppingCompleteWithSize', { size: cropSize.toFixed(0) }));
                resolve({ url: URL.createObjectURL(outBlob) });
              } catch (e) {
                reject(new Error(t('common.imageCroppingError', { error: (e as Error).message })));
              }
            }, 'image/jpeg', 0.9);
          } catch (error) {
            reject(new Error(`${t('common.imageProcessingError')}: ${error instanceof Error ? error.message : t('common.unknownError')}`));
          }
        };
        
        img.onerror = () => {
          reject(new Error(t('common.imageLoadError')));
        };
        
        img.src = URL.createObjectURL(file);
      });
    } catch (error) {
      throw new Error(`${t('common.initializationError')}: ${error instanceof Error ? error.message : t('common.unknownError')}`);
    }
  };

  const processImageRotate = async (file: File) => {
    toast.info(t('common.rotatingImage'));
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error(t('common.canvasContextError'));
      }
      
      const img = document.createElement("img");
      
      return new Promise<{ url: string }>((resolve, reject) => {
        img.onload = () => {
          try {
            const angleRad = ((rotateAngle % 360) * Math.PI) / 180;
            // 简化：对 90/180/270 的情况进行尺寸适配
            const norm = ((rotateAngle % 360) + 360) % 360;
            if (norm === 90 || norm === 270) {
              canvas.width = img.height;
              canvas.height = img.width;
            } else {
              canvas.width = img.width;
              canvas.height = img.height;
            }
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(angleRad);
            ctx.drawImage(img, -img.width / 2, -img.height / 2);
            
            canvas.toBlob((blob) => {
              try {
                const outBlob = blob || dataUrlToBlob(canvas.toDataURL('image/jpeg', 0.9));
                toast.success(t('common.imageRotationCompleteWithSize', { originalSize: `${img.width}×${img.height}`, newSize: `${canvas.width}×${canvas.height}` }));
                resolve({ url: URL.createObjectURL(outBlob) });
              } catch (e) {
                reject(new Error(t('common.imageRotationError', { error: (e as Error).message })));
              }
            }, 'image/jpeg', 0.9);
          } catch (error) {
            reject(new Error(`${t('common.imageProcessingError')}: ${error instanceof Error ? error.message : t('common.unknownError')}`));
          }
        };
        
        img.onerror = () => {
          reject(new Error(t('common.imageLoadError')));
        };
        
        img.src = URL.createObjectURL(file);
      });
    } catch (error) {
      throw new Error(`${t('common.initializationError')}: ${error instanceof Error ? error.message : t('common.unknownError')}`);
    }
  };

  const processImageResize = async (file: File) => {
    toast.info(t('common.resizingImage'));
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error(t('common.canvasContextError'));
      }
      
      const img = document.createElement("img");
      
      return new Promise<{ url: string }>((resolve, reject) => {
        img.onload = () => {
          try {
            const w = Math.max(1, targetWidth);
            const aspectRatio = img.height / img.width;
            canvas.width = w;
            canvas.height = maintainAspect ? Math.round(w * aspectRatio) : img.height;
            
            // 高质量缩放
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            canvas.toBlob((blob) => {
              try {
                const outBlob = blob || dataUrlToBlob(canvas.toDataURL('image/jpeg', 0.9));
                toast.success(t('common.imageResizingCompleteWithSize', { originalSize: `${img.width}×${img.height}`, newSize: `${canvas.width}×${canvas.height}` }));
                resolve({ url: URL.createObjectURL(outBlob) });
              } catch (e) {
                reject(new Error(t('common.imageResizingError', { error: (e as Error).message })));
              }
            }, 'image/jpeg', 0.9);
          } catch (error) {
            reject(new Error(`${t('common.imageProcessingError')}: ${error instanceof Error ? error.message : t('common.unknownError')}`));
          }
        };
        
        img.onerror = () => {
          reject(new Error(t('common.imageLoadError')));
        };
        
        img.src = URL.createObjectURL(file);
      });
    } catch (error) {
      throw new Error(`${t('common.initializationError')}: ${error instanceof Error ? error.message : t('common.unknownError')}`);
    }
  };

  

  const imageTools: ImageTool[] = [
    {
      id: 'image-converter',
      title: t('tools.image.imageConverter'),
      description: t('tools.image.imageConverterDesc'),
      icon: Image,
      popular: true,
      requiredPlugin: 'canvas',
      processingFunction: processImageConvert
    },
    {
      id: 'image-compressor',
      title: t('tools.image.imageCompressor'),
      description: t('tools.image.imageCompressorDesc'),
      icon: Minimize2,
      popular: true,
      requiredPlugin: 'canvas',
      processingFunction: processImageCompress
    },
    {
      id: 'photo-enhancer',
      title: t('tools.image.photoEnhancer'),
      description: t('tools.image.photoEnhancerDesc'),
      icon: Palette,
      popular: true,
      requiredPlugin: 'opencv',
      processingFunction: processPhotoEnhancer
    },
    {
      id: 'image-cropper',
      title: t('tools.image.imageCropper'),
      description: t('tools.image.imageCropperDesc'),
      icon: Crop,
      popular: true,
      requiredPlugin: 'canvas',
      processingFunction: processImageCrop
    },
    {
      id: 'image-rotator',
      title: t('tools.image.imageRotator'),
      description: t('tools.image.imageRotatorDesc'),
      icon: RotateCw,
      popular: false,
      requiredPlugin: 'canvas',
      processingFunction: processImageRotate
    },
    {
      id: 'image-resizer',
      title: t('tools.image.imageResizer'),
      description: t('tools.image.imageResizerDesc'),
      icon: Image,
      popular: false,
      requiredPlugin: 'canvas',
      processingFunction: processImageResize
    }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setProcessedImageUrl('');
      setProcessedSizeMB('');
      const sizeMB = (selectedFile.size / 1024 / 1024).toFixed(2);
      setOriginalSizeMB(sizeMB);
      if (selectedTool?.id === 'image-compressor') {
        const scale = Math.max(10, Math.min(100, cropPercent)) / 100;
        const qualityFactor = Math.min(1, Math.max(0.1, quality / 100));
        const estimated = parseFloat(sizeMB) * (scale * scale) * (0.6 + 0.4 * qualityFactor);
        setEstimatedSizeMB(estimated.toFixed(2));
      } else {
        setEstimatedSizeMB('');
      }
    }
  };

  const handleProcess = async () => {
    if (!selectedTool || !file) {
      toast.error(t('common.selectToolAndFile'));
      return;
    }

    setIsProcessing(true);

    try {
      // 如果需要OpenCV，加载插件
      if (selectedTool.requiredPlugin === 'opencv') {
        toast.info(t('common.loadingOpenCV'));
        await loadOpenCV();
      }
      
      // 使用对应的处理函数
      toast.info(t('common.processingImage'));
      const result = await selectedTool.processingFunction(file);
      
      if (result.url) {
        setProcessedImageUrl(result.url);
      }
      
      toast.success(t('common.processingComplete'));
    } catch (error) {
      console.error(t('common.imageProcessingError'), error);
      toast.error((error as Error).message || t('common.processingError'));
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (processedImageUrl) {
      const link = document.createElement('a');
      link.href = processedImageUrl;
      const ext = selectedTool?.id === 'image-converter' ? convertFormat : 'jpg';
      link.download = `processed_${selectedTool?.id}_${Date.now()}.${ext}`;
      link.click();
    }
  };

  const resetTool = () => {
    setSelectedTool(null);
    setFile(null);
    setProcessedImageUrl('');
    if (processedImageUrl) {
      URL.revokeObjectURL(processedImageUrl);
    }
  };

  const selectTool = (tool: ImageTool) => {
    setSelectedTool(tool);
    setFile(null);
    setProcessedImageUrl('');
  };

  if (selectedTool) {
    const isPluginLoaded = selectedTool.requiredPlugin === 'canvas' ? true : pluginManager.isPluginLoaded(selectedTool.requiredPlugin);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            {selectedTool.requiredPlugin === 'opencv' && !isPluginLoaded && (
              <ImagePluginLoader className="mb-6" onLoadComplete={() => toast.success(t('common.opencvEngineLoaded'))} />
            )}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                  <selectedTool.icon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedTool.title}
                  </h2>
                  <p className="text-gray-600">{selectedTool.description}</p>
                </div>
              </div>
              <button
                onClick={resetTool}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('common.back')}</span>
              </button>
            </div>

            <div className="space-y-6">
              {/* Parameter area: display corresponding controls based on tool type */}
              {selectedTool.id === 'image-converter' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('common.outputFormat')}</label>
                    <select
                      className="w-full border rounded-lg px-3 py-2"
                      value={convertFormat}
                      onChange={(e) => setConvertFormat(e.target.value as 'png'|'jpeg'|'webp')}
                    >
                      <option value="png">{t('common.pngLossless')}</option>
                      <option value="jpeg">{t('common.jpegLossy')}</option>
                      <option value="webp">{t('common.webpBetter')}</option>
                    </select>
                  </div>
                  {(convertFormat === 'jpeg' || convertFormat === 'webp') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('common.quality')} ({quality}%)</label>
                      <input type="range" min={1} max={100} value={quality} onChange={(e) => setQuality(parseInt(e.target.value))} className="w-full" />
                    </div>
                  )}
                </div>
              )}

              {selectedTool.id === 'image-compressor' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('common.compressionQuality')} ({quality}%)</label>
                    <input type="range" min={1} max={100} value={quality} onChange={(e) => setQuality(parseInt(e.target.value))} className="w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('common.scaleRatio')} ({cropPercent}%)</label>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      value={cropPercent}
                      onChange={(e) => {
                        const v = parseInt(e.target.value);
                        setCropPercent(v);
                        if (file) {
                          const sizeMB = file.size / 1024 / 1024;
                          const scale = Math.max(10, Math.min(100, v)) / 100;
                          const qualityFactor = Math.min(1, Math.max(0.1, quality / 100));
                          setEstimatedSizeMB((sizeMB * (scale * scale) * (0.6 + 0.4 * qualityFactor)).toFixed(2));
                        }
                      }}
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              {selectedTool.id === 'image-resizer' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('common.targetWidth')}</label>
                    <input type="number" className="w-full border rounded-lg px-3 py-2" value={targetWidth} onChange={(e) => setTargetWidth(parseInt(e.target.value || '0'))} />
                  </div>
                  <div className="flex items-end">
                    <label className="inline-flex items-center space-x-2">
                      <input type="checkbox" checked={maintainAspect} onChange={(e) => setMaintainAspect(e.target.checked)} />
                      <span className="text-sm text-gray-700">{t('common.maintainAspectRatio')}</span>
                    </label>
                  </div>
                </div>
              )}

              {selectedTool.id === 'image-cropper' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">t("common.centerCropRatio")（{cropPercent}%）</label>
                  <input type="range" min={10} max={100} value={cropPercent} onChange={(e) => setCropPercent(parseInt(e.target.value))} className="w-full" />
                </div>
              )}

              {selectedTool.id === 'image-rotator' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">t("common.rotationAngle")</label>
                  <input type="number" className="w-full border rounded-lg px-3 py-2" value={rotateAngle} onChange={(e) => setRotateAngle(parseInt(e.target.value || '0'))} />
                </div>
              )}

              {selectedTool.id === 'photo-enhancer' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">t("common.enhancementStrength")（{enhanceStrength}）</label>
                  <input type="range" min={0} max={50} value={enhanceStrength} onChange={(e) => setEnhanceStrength(parseInt(e.target.value))} className="w-full" />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('common.selectImageFile')}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer text-green-600 hover:text-green-700 font-medium"
                  >
                    {t('common.clickToSelectImageFile')}
                  </label>
                  <p className="text-gray-500 text-sm mt-2">
                    {t('common.supportedFormats')}
                  </p>
                  {file && (
                    <p className="text-green-600 text-sm mt-2">
                      {t('common.selected')}: {file.name}
                    </p>
                  )}
                </div>
              </div>

              {file && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{t('common.originalPreview')}</h3>
                    <img
                      src={URL.createObjectURL(file)}
                      alt={t('common.originalImage')}
                      className="w-full h-64 object-cover rounded-lg border"
                    />
                    {(selectedTool.id === 'image-compressor' || selectedTool.id === 'image-converter' || selectedTool.id === 'image-resizer') && (
                      <p className="text-sm text-gray-600 mt-2">{t('common.originalSize')}: {originalSizeMB}MB</p>
                    )}
                    {selectedTool.id === 'image-compressor' && estimatedSizeMB && (
                      <p className="text-sm text-blue-600 mt-1">{t('common.estimatedSize')}: ~{estimatedSizeMB}MB（{t('common.estimated')}）</p>
                    )}
                  </div>
                  {processedImageUrl && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{t('common.processedResult')}</h3>
                      <img
                        src={processedImageUrl}
                        alt={t('common.processedImage')}
                        className="w-full h-64 object-cover rounded-lg border"
                      />
                      {processedSizeMB && (
                        <p className="text-sm text-green-600 mt-2">{t('common.actualSize')}: {processedSizeMB}MB</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={handleProcess}
                  disabled={!file || isProcessing}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isProcessing ? t('common.processing') : t('common.startProcessing')}
                </button>
                {processedImageUrl && (
                  <button
                    onClick={downloadImage}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    {t('common.downloadImage')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead seoKey="imageTools" />
      <StructuredData type="SoftwareApplication" />
      <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Image className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('tools.image.title')}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('tools.image.pageDescription')}
          </p>
        </div>

        {/* Popular Tools Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('common.mostPopularTools')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {imageTools.filter(tool => tool.popular).map((tool) => {
              const IconComponent = tool.icon
              return (
                <div key={tool.title} onClick={() => selectTool(tool)} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer group">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors mb-2">
                      {tool.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">{tool.description}</p>
                    <button className="w-full bg-green-600 text-white hover:bg-green-700 py-2 rounded-md font-medium transition-colors">
                      {t('common.useTool')}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* All Tools Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('common.allTools')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {imageTools.map((tool) => {
              const IconComponent = tool.icon
              return (
                <div key={tool.title} onClick={() => selectTool(tool)} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer group">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                      <IconComponent className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                        {tool.title}
                      </h3>
                      {tool.popular && (
                        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          {t('common.popular')}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{tool.description}</p>
                  <button className="w-full bg-gray-600 text-white hover:bg-gray-700 py-2 rounded-md font-medium transition-colors">
                    {t('common.useTool')}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t('common.advancedProcessing')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-bold text-xl">🤖</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('common.aiPowered')}</h3>
              <p className="text-gray-600 text-sm">{t('common.aiPoweredDesc')}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">📱</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('common.allFormats')}</h3>
              <p className="text-gray-600 text-sm">{t('common.allFormatsDesc')}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold text-xl">⚡</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('common.instantResults')}</h3>
              <p className="text-gray-600 text-sm">{t('common.instantResultsDesc')}</p>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="mt-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">{t('common.readyToEdit')}</h2>
          <p className="text-green-100 mb-6">{t('common.uploadAndStart')}</p>
          <button className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors">
            {t('common.chooseImageFile')}
          </button>
        </div>
      </div>
    </div>
    </>
  )
}

export default ImageTools
