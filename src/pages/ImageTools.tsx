import React, { useState } from 'react';
import { Image, Minimize2, Palette, Crop, RotateCw, Upload, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface ImageTool {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  popular: boolean;
  endpoint: string;
}

const ImageTools = () => {
  const { t } = useTranslation();
  const [selectedTool, setSelectedTool] = useState<ImageTool | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImageUrl, setProcessedImageUrl] = useState<string>('');

  const imageTools: ImageTool[] = [
    {
      id: 'image-converter',
      title: t('tools.image.imageConverter'),
      description: t('tools.image.imageConverterDesc'),
      icon: Image,
      popular: true,
      endpoint: '/api/image/convert'
    },
    {
      id: 'image-compressor',
      title: t('tools.image.imageCompressor'),
      description: t('tools.image.imageCompressorDesc'),
      icon: Minimize2,
      popular: true,
      endpoint: '/api/image/compress'
    },
    {
      id: 'photo-enhancer',
      title: t('tools.image.photoEnhancer'),
      description: t('tools.image.photoEnhancerDesc'),
      icon: Palette,
      popular: true,
      endpoint: '/api/image/enhance'
    },
    {
      id: 'image-cropper',
      title: t('tools.image.imageCropper'),
      description: t('tools.image.imageCropperDesc'),
      icon: Crop,
      popular: true,
      endpoint: '/api/image/crop'
    },
    {
      id: 'image-rotator',
      title: t('tools.image.imageRotator'),
      description: t('tools.image.imageRotatorDesc'),
      icon: RotateCw,
      popular: false,
      endpoint: '/api/image/rotate'
    },
    {
      id: 'image-resizer',
      title: t('tools.image.imageResizer'),
      description: t('tools.image.imageResizerDesc'),
      icon: Image,
      popular: false,
      endpoint: '/api/image/resize'
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
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(selectedTool.endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(t('common.processingFailed'));
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setProcessedImageUrl(url);
      toast.success(t('common.processingComplete'));
    } catch (error) {
      console.error('图片处理错误:', error);
      toast.error(t('common.processingError'));
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
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
  )
}

export default ImageTools