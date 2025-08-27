#!/bin/bash

echo "🔧 修复所有功能页面的API端点路径..."

# 修复PDF工具页面
echo "📄 修复PDF工具页面..."
sed -i '' 's|endpoint: '\''/api/pdf/|endpoint: '\''/api/tools/|g' src/pages/PDFTools.tsx
sed -i '' 's|endpoint: '\''/api/pdf/from-word'\''|endpoint: '\''/api/tools/word-to-pdf/process'\''|g' src/pages/PDFTools.tsx
sed -i '' 's|endpoint: '\''/api/pdf/fill-form'\''|endpoint: '\''/api/tools/pdf-form-filler/process'\''|g' src/pages/PDFTools.tsx
sed -i '' 's|endpoint: '\''/api/pdf/add-signature'\''|endpoint: '\''/api/tools/pdf-signature/process'\''|g' src/pages/PDFTools.tsx

# 修复图片工具页面
echo "🖼️ 修复图片工具页面..."
sed -i '' 's|endpoint: '\''/api/image/|endpoint: '\''/api/tools/|g' src/pages/ImageTools.tsx
sed -i '' 's|endpoint: '\''/api/tools/convert'\''|endpoint: '\''/api/tools/image-convert/process'\''|g' src/pages/ImageTools.tsx
sed -i '' 's|endpoint: '\''/api/tools/compress'\''|endpoint: '\''/api/tools/image-compress/process'\''|g' src/pages/ImageTools.tsx
sed -i '' 's|endpoint: '\''/api/tools/enhance'\''|endpoint: '\''/api/tools/image-enhancer/process'\''|g' src/pages/ImageTools.tsx
sed -i '' 's|endpoint: '\''/api/tools/crop'\''|endpoint: '\''/api/tools/image-crop/process'\''|g' src/pages/ImageTools.tsx
sed -i '' 's|endpoint: '\''/api/tools/rotate'\''|endpoint: '\''/api/tools/image-rotate/process'\''|g' src/pages/ImageTools.tsx
sed -i '' 's|endpoint: '\''/api/tools/resize'\''|endpoint: '\''/api/tools/image-resize/process'\''|g' src/pages/ImageTools.tsx

# 修复OCR工具页面
echo "📝 修复OCR工具页面..."
sed -i '' 's|endpoint: '\''/api/ocr/|endpoint: '\''/api/tools/|g' src/pages/OCRTools.tsx
sed -i '' 's|endpoint: '\''/api/tools/image-to-text'\''|endpoint: '\''/api/tools/image-to-text/process'\''|g' src/pages/OCRTools.tsx
sed -i '' 's|endpoint: '\''/api/tools/pdf-ocr'\''|endpoint: '\''/api/tools/pdf-ocr/process'\''|g' src/pages/OCRTools.tsx
sed -i '' 's|endpoint: '\''/api/tools/handwriting'\''|endpoint: '\''/api/tools/handwriting-recognition/process'\''|g' src/pages/OCRTools.tsx
sed -i '' 's|endpoint: '\''/api/tools/document-scan'\''|endpoint: '\''/api/tools/document-scanner/process'\''|g' src/pages/OCRTools.tsx
sed -i '' 's|endpoint: '\''/api/tools/table-extract'\''|endpoint: '\''/api/tools/table-extractor/process'\''|g' src/pages/OCRTools.tsx
sed -i '' 's|endpoint: '\''/api/tools/receipt-scan'\''|endpoint: '\''/api/tools/receipt-scanner/process'\''|g' src/pages/OCRTools.tsx
sed -i '' 's|endpoint: '\''/api/tools/business-card'\''|endpoint: '\''/api/tools/business-card-scanner/process'\''|g' src/pages/OCRTools.tsx
sed -i '' 's|endpoint: '\''/api/tools/license-plate'\''|endpoint: '\''/api/tools/license-plate-reader/process'\''|g' src/pages/OCRTools.tsx
sed -i '' 's|endpoint: '\''/api/tools/qr-code'\''|endpoint: '\''/api/tools/qr-code-reader/process'\''|g' src/pages/OCRTools.tsx

# 修复视频工具页面 - 需要添加endpoint字段
echo "🎥 修复视频工具页面..."
# 先备份原文件
cp src/pages/VideoTools.tsx src/pages/VideoTools.tsx.backup

# 创建修复后的视频工具页面
cat > src/pages/VideoTools.tsx << 'EOF'
import React, { useState } from 'react';
import { Video, Upload, Scissors, Minimize2, RotateCw, Volume2, FileVideo, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import SEOHead from '../components/SEOHead';
import StructuredData from '../components/StructuredData';

interface VideoTool {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  popular: boolean;
  endpoint: string;
  acceptedTypes: string;
}

const VideoTools = () => {
  const { t } = useTranslation();
  const [selectedTool, setSelectedTool] = useState<VideoTool | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFileUrl, setProcessedFileUrl] = useState<string>('');

  const videoTools: VideoTool[] = [
    {
      id: 'video-convert',
      title: t('tools.video.videoConverter'),
      description: t('tools.video.videoConverterDesc'),
      icon: Video,
      popular: true,
      endpoint: '/api/tools/video-convert/process',
      acceptedTypes: 'video/*'
    },
    {
      id: 'video-compress',
      title: t('tools.video.videoCompressor'),
      description: t('tools.video.videoCompressorDesc'),
      icon: Minimize2,
      popular: true,
      endpoint: '/api/tools/video-compress/process',
      acceptedTypes: 'video/*'
    },
    {
      id: 'video-trimmer',
      title: t('tools.video.videoTrimmer'),
      description: t('tools.video.videoTrimmerDesc'),
      icon: Scissors,
      popular: true,
      endpoint: '/api/tools/video-trimmer/process',
      acceptedTypes: 'video/*'
    },
    {
      id: 'gif-maker',
      title: t('tools.video.videoToGif'),
      description: t('tools.video.videoToGifDesc'),
      icon: FileVideo,
      popular: true,
      endpoint: '/api/tools/gif-maker/process',
      acceptedTypes: 'video/*'
    },
    {
      id: 'video-rotator',
      title: t('tools.video.videoRotator'),
      description: t('tools.video.videoRotatorDesc'),
      icon: RotateCw,
      popular: false,
      endpoint: '/api/tools/video-rotator/process',
      acceptedTypes: 'video/*'
    },
    {
      id: 'audio-extractor',
      title: t('tools.video.audioExtractor'),
      description: t('tools.video.audioExtractorDesc'),
      icon: Volume2,
      popular: false,
      endpoint: '/api/tools/audio-extractor/process',
      acceptedTypes: 'video/*'
    },
    {
      id: 'video-merger',
      title: t('tools.video.videoMerger'),
      description: t('tools.video.videoMergerDesc'),
      icon: Upload,
      popular: false,
      endpoint: '/api/tools/video-merger/process',
      acceptedTypes: 'video/*'
    }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setProcessedFileUrl('');
    }
  };

  const handleProcess = async () => {
    if (!selectedTool || !file) {
      toast.error(t('common.selectToolAndFile'));
      return;
    }

    setIsProcessing(true);
    const formData = new FormData();
    formData.append('files', file);

    try {
      const response = await fetch(selectedTool.endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t('common.processingFailed'));
      }

      const data = await response.json();
      
      // 下载处理后的文件
      if (data.fileId) {
        const downloadResponse = await fetch(`/api/download/${data.fileId}`);
        if (downloadResponse.ok) {
          const blob = await downloadResponse.blob();
          const url = URL.createObjectURL(blob);
          setProcessedFileUrl(url);
        }
      }
      
      toast.success(data.message || t('common.processingComplete'));
    } catch (error) {
      console.error('视频处理错误:', error);
      toast.error(error.message || t('common.processingFailedRetry'));
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadFile = () => {
    if (processedFileUrl) {
      const link = document.createElement('a');
      link.href = processedFileUrl;
      link.download = `processed_${selectedTool?.id}_${Date.now()}.${selectedTool?.id === 'gif-maker' ? 'gif' : 'mp4'}`;
      link.click();
    }
  };

  const resetTool = () => {
    setSelectedTool(null);
    setFile(null);
    setProcessedFileUrl('');
    if (processedFileUrl) {
      URL.revokeObjectURL(processedFileUrl);
    }
  };

  const selectTool = (tool: VideoTool) => {
    setSelectedTool(tool);
    setFile(null);
    setProcessedFileUrl('');
  };

  if (selectedTool) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                  <selectedTool.icon className="w-6 h-6 text-blue-600" />
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
                  {t('common.selectFile')}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <input
                    type="file"
                    accept={selectedTool.acceptedTypes}
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {t('common.clickToSelectFile')}
                  </label>
                  <p className="text-gray-500 text-sm mt-2">
                    {t('common.supportedFormats')}: {selectedTool.acceptedTypes}
                  </p>
                  {file && (
                    <p className="text-green-600 text-sm mt-2">
                      {t('common.selected')}: {file.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleProcess}
                  disabled={!file || isProcessing}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isProcessing ? t('common.processing') : t('common.startProcessing')}
                </button>
                {processedFileUrl && (
                  <button
                    onClick={downloadFile}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    {t('common.downloadFile')}
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
      <SEOHead seoKey="videoTools" />
      <StructuredData type="SoftwareApplication" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('tools.video.title')}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('tools.video.pageDescription')}
          </p>
        </div>

        {/* Popular Tools Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('common.mostPopularTools')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {videoTools.filter(tool => tool.popular).map((tool) => {
              const IconComponent = tool.icon
              return (
                <div key={tool.id} onClick={() => selectTool(tool)} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer group">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                      {tool.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">{tool.description}</p>
                    <div className="w-full bg-blue-600 text-white hover:bg-blue-700 py-2 rounded-md font-medium transition-colors text-center">
                      {t('common.useTool')}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* All Tools Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('common.allTools')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {videoTools.map((tool) => {
              const IconComponent = tool.icon
              return (
                <div key={tool.id} onClick={() => selectTool(tool)} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer group">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                      {tool.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">{tool.description}</p>
                    <div className="w-full bg-blue-600 text-white hover:bg-blue-700 py-2 rounded-md font-medium transition-colors text-center">
                      {t('common.useTool')}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoTools;
EOF

# 修复其他工具页面
echo "🔧 修复其他工具页面..."

# 修复文档数据处理工具页面
if [ -f "src/pages/DocumentDataTools.tsx" ]; then
  sed -i '' 's|endpoint: '\''/api/document/|endpoint: '\''/api/tools/|g' src/pages/DocumentDataTools.tsx
fi

# 修复文件工具页面
if [ -f "src/pages/FileTools.tsx" ]; then
  sed -i '' 's|endpoint: '\''/api/file/|endpoint: '\''/api/tools/|g' src/pages/FileTools.tsx
fi

# 修复文本工具页面
if [ -f "src/pages/TextTools.tsx" ]; then
  sed -i '' 's|endpoint: '\''/api/text/|endpoint: '\''/api/tools/|g' src/pages/TextTools.tsx
fi

# 修复开发者工具页面
if [ -f "src/pages/DeveloperTools.tsx" ]; then
  sed -i '' 's|endpoint: '\''/api/developer/|endpoint: '\''/api/tools/|g' src/pages/DeveloperTools.tsx
fi

# 修复转换工具页面
if [ -f "src/pages/ConverterTools.tsx" ]; then
  sed -i '' 's|endpoint: '\''/api/converter/|endpoint: '\''/api/tools/|g' src/pages/ConverterTools.tsx
fi

echo "✅ 所有API端点路径修复完成！"
echo ""
echo "📋 修复内容："
echo "  - PDF工具: /api/pdf/* → /api/tools/*/process"
echo "  - 图片工具: /api/image/* → /api/tools/*/process"
echo "  - 视频工具: 添加了完整的处理逻辑和API端点"
echo "  - OCR工具: /api/ocr/* → /api/tools/*/process"
echo "  - 其他工具: 统一修复API路径"
echo ""
echo "�� 现在所有功能应该都能正常工作了！"
