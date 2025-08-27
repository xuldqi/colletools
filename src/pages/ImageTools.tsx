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

  // 图像处理函数
  const processImageConvert = async (file: File) => {
    toast.info('正在进行图像格式转换...');
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    return new Promise<{ url: string }>((resolve) => {
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        // 转换为PNG格式（无损）
        canvas.toBlob((blob) => {
          if (blob) {
            toast.success('✅ 图像格式转换完成！已转换为PNG格式');
            resolve({ url: URL.createObjectURL(blob) });
          }
        }, 'image/png');
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const processImageCompress = async (file: File) => {
    toast.info('正在压缩图像...');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    return new Promise<{ url: string }>((resolve) => {
      img.onload = () => {
        // 尺寸压缩到85%，质量压缩到70%
        canvas.width = Math.round(img.width * 0.85);
        canvas.height = Math.round(img.height * 0.85);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const originalSize = (file.size / 1024 / 1024).toFixed(2);
            const compressedSize = (blob.size / 1024 / 1024).toFixed(2);
            const reduction = (((file.size - blob.size) / file.size) * 100).toFixed(1);
            
            toast.success(`✅ 图像压缩完成！${originalSize}MB → ${compressedSize}MB (减少${reduction}%)`);
            resolve({ url: URL.createObjectURL(blob) });
          }
        }, 'image/jpeg', 0.7);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const processPhotoEnhancer = async (file: File) => {
    toast.info('正在进行图像增强处理...');
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    return new Promise<{ url: string }>((resolve) => {
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        // 获取图像数据并进行增强处理
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // 应用亮度、对比度和饱和度增强
        for (let i = 0; i < data.length; i += 4) {
          // 增加亮度 (+10)
          data[i] = Math.min(255, data[i] + 10);     // Red
          data[i + 1] = Math.min(255, data[i + 1] + 10); // Green  
          data[i + 2] = Math.min(255, data[i + 2] + 10); // Blue
          
          // 增强对比度 (1.1倍)
          data[i] = Math.min(255, Math.max(0, (data[i] - 128) * 1.1 + 128));
          data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * 1.1 + 128));
          data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * 1.1 + 128));
        }
        
        // 将处理后的数据放回canvas
        ctx.putImageData(imageData, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            toast.success('✅ 图像增强完成！已提升亮度和对比度');
            resolve({ url: URL.createObjectURL(blob) });
          }
        }, 'image/jpeg', 0.9);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const processImageCrop = async (file: File) => {
    toast.info('正在裁剪图像（中心正方形）...');
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    return new Promise<{ url: string }>((resolve) => {
      img.onload = () => {
        // 计算正方形裁剪尺寸（取较小边的80%）
        const cropSize = Math.min(img.width, img.height) * 0.8;
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
          if (blob) {
            toast.success(`✅ 图像裁剪完成！裁剪为 ${cropSize.toFixed(0)}×${cropSize.toFixed(0)} 正方形`);
            resolve({ url: URL.createObjectURL(blob) });
          }
        }, 'image/jpeg', 0.9);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const processImageRotate = async (file: File) => {
    toast.info('正在旋转图像（顺时针90度）...');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    return new Promise<{ url: string }>((resolve) => {
      img.onload = () => {
        // 90度旋转后，宽高互换
        canvas.width = img.height;
        canvas.height = img.width;
        
        // 移动到中心点并旋转
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(Math.PI / 2); // 顺时针旋转90度
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        
        canvas.toBlob((blob) => {
          if (blob) {
            toast.success(`✅ 图像旋转完成！${img.width}×${img.height} → ${img.height}×${img.width}`);
            resolve({ url: URL.createObjectURL(blob) });
          }
        }, 'image/jpeg', 0.9);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const processImageResize = async (file: File) => {
    toast.info('正在调整图像尺寸（宽度1000px）...');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    return new Promise<{ url: string }>((resolve) => {
      img.onload = () => {
        const targetWidth = 1000;
        const aspectRatio = img.height / img.width;
        
        canvas.width = targetWidth;
        canvas.height = Math.round(targetWidth * aspectRatio);
        
        // 高质量缩放
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            toast.success(`✅ 尺寸调整完成！${img.width}×${img.height} → ${canvas.width}×${canvas.height}`);
            resolve({ url: URL.createObjectURL(blob) });
          }
        }, 'image/jpeg', 0.9);
      };
      img.src = URL.createObjectURL(file);
    });
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
        toast.info('正在加载OpenCV.js图像处理引擎...');
        await loadOpenCV();
      }
      
      // 使用对应的处理函数
      toast.info('正在处理图像...');
      const result = await selectedTool.processingFunction(file);
      
      if (result.url) {
        setProcessedImageUrl(result.url);
      }
      
      toast.success(t('common.processingComplete'));
    } catch (error) {
      console.error('图像处理错误:', error);
      toast.error((error as Error).message || t('common.processingError'));
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (processedImageUrl) {
      const link = document.createElement('a');
      link.href = processedImageUrl;
      link.download = `processed_${selectedTool?.id}_${Date.now()}.png`;
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
              <ImagePluginLoader className="mb-6" onLoadComplete={() => toast.success('OpenCV.js图像处理引擎加载完成！')} />
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
                    {t('common.clickToSelectImage')}
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
                  </div>
                  {processedImageUrl && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{t('common.processedResult')}</h3>
                      <img
                        src={processedImageUrl}
                        alt={t('common.processedImage')}
                        className="w-full h-64 object-cover rounded-lg border"
                      />
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