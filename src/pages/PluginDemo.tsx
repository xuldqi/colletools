import React, { useState } from 'react';
import { VideoPluginLoader, ImagePluginLoader, OCRPluginLoader } from '../components/PluginLoader';
import { pluginManager, loadFFmpeg, loadOpenCV } from '../utils/pluginLoader';
import { Video, Image as ImageIcon, FileText, Play, Upload } from 'lucide-react';

const PluginDemo: React.FC = () => {
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);
  const [testFile, setTestFile] = useState<File | null>(null);
  const [result, setResult] = useState<string>('');

  const demoOptions = [
    {
      id: 'video',
      title: '视频处理演示',
      description: '使用FFmpeg.js进行视频转换和处理',
      icon: Video,
      pluginName: 'ffmpeg',
      loadFunction: loadFFmpeg
    },
    {
      id: 'image',
      title: '图像处理演示', 
      description: '使用OpenCV.js进行高级图像处理',
      icon: ImageIcon,
      pluginName: 'opencv',
      loadFunction: loadOpenCV
    },
    {
      id: 'ocr',
      title: 'OCR文字识别演示',
      description: '使用Tesseract.js进行文字识别',
      icon: FileText,
      pluginName: 'tesseract',
      loadFunction: () => pluginManager.loadPlugin('tesseract')
    }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setTestFile(file);
      setResult('');
    }
  };

  const runDemo = async () => {
    if (!selectedDemo || !testFile) return;

    const demo = demoOptions.find(d => d.id === selectedDemo);
    if (!demo) return;

    setResult('正在处理...');

    try {
      // Load plugin if not already loaded
      await demo.loadFunction();

      // Simulate processing based on demo type
      switch (selectedDemo) {
        case 'video':
          setResult(`✅ 视频文件 "${testFile.name}" 已成功加载FFmpeg.js引擎！
📊 文件大小: ${(testFile.size / 1024 / 1024).toFixed(2)} MB
🎬 可进行格式转换、压缩、剪辑等操作
🔧 FFmpeg.js已准备就绪，支持所有主流视频格式`);
          break;
          
        case 'image':
          setResult(`✅ 图像文件 "${testFile.name}" 已成功加载OpenCV.js引擎！
🖼️ 文件大小: ${(testFile.size / 1024 / 1024).toFixed(2)} MB  
🎨 可进行滤镜、变换、特征检测等操作
⚡ OpenCV.js已准备就绪，支持高级图像处理`);
          break;
          
        case 'ocr':
          setResult(`✅ 图像文件 "${testFile.name}" 已成功加载Tesseract.js引擎！
📄 文件大小: ${(testFile.size / 1024 / 1024).toFixed(2)} MB
🔍 可进行文字识别、多语言OCR等操作  
📝 Tesseract.js已准备就绪，支持40+种语言识别`);
          break;
      }
    } catch (error) {
      setResult(`❌ 处理失败: ${error.message}`);
    }
  };

  const renderPluginLoader = () => {
    switch (selectedDemo) {
      case 'video':
        return <VideoPluginLoader className="min-h-[300px]">
          <div className="text-center p-6">
            <Video className="w-12 h-12 mx-auto mb-4 text-green-600" />
            <h3 className="text-lg font-semibold mb-2">FFmpeg.js 已准备就绪!</h3>
            <p className="text-gray-600">视频处理引擎加载完成，可以开始处理视频文件</p>
          </div>
        </VideoPluginLoader>;
      case 'image':
        return <ImagePluginLoader className="min-h-[300px]">
          <div className="text-center p-6">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 text-green-600" />
            <h3 className="text-lg font-semibold mb-2">OpenCV.js 已准备就绪!</h3>
            <p className="text-gray-600">图像处理引擎加载完成，可以开始处理图像文件</p>
          </div>
        </ImagePluginLoader>;
      case 'ocr':
        return <OCRPluginLoader className="min-h-[300px]">
          <div className="text-center p-6">
            <FileText className="w-12 h-12 mx-auto mb-4 text-green-600" />
            <h3 className="text-lg font-semibold mb-2">Tesseract.js 已准备就绪!</h3>
            <p className="text-gray-600">OCR引擎加载完成，可以开始识别图像中的文字</p>
          </div>
        </OCRPluginLoader>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 高级插件演示中心
          </h1>
          <p className="text-xl text-gray-600">
            体验从CDN动态加载的专业工具插件
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Plugin Selection */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">选择演示功能</h2>
            
            {demoOptions.map((option) => {
              const IconComponent = option.icon;
              const isLoaded = pluginManager.isPluginLoaded(option.pluginName);
              
              return (
                <div
                  key={option.id}
                  onClick={() => setSelectedDemo(option.id)}
                  className={`p-6 border rounded-lg cursor-pointer transition-all ${
                    selectedDemo === option.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      isLoaded ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <IconComponent className={`w-6 h-6 ${
                        isLoaded ? 'text-green-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {option.title}
                        {isLoaded && <span className="ml-2 text-sm text-green-600">✅ 已加载</span>}
                      </h3>
                      <p className="text-gray-600 mt-1">{option.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* File Upload */}
            {selectedDemo && (
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">上传测试文件</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    accept={selectedDemo === 'video' ? 'video/*' : 'image/*'}
                    className="w-full"
                  />
                  {testFile && (
                    <p className="text-sm text-green-600 mt-2">
                      已选择: {testFile.name}
                    </p>
                  )}
                </div>
                
                {testFile && (
                  <button
                    onClick={runDemo}
                    className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    开始演示
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Plugin Loading Area */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">插件加载状态</h2>
            
            <div className="bg-white rounded-lg border min-h-[400px]">
              {selectedDemo ? renderPluginLoader() : (
                <div className="flex items-center justify-center h-[400px] text-gray-500">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Play className="w-8 h-8 text-gray-400" />
                    </div>
                    <p>请选择一个功能开始演示</p>
                  </div>
                </div>
              )}
            </div>

            {/* Results */}
            {result && (
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">处理结果</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800">
                    {result}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PluginDemo;