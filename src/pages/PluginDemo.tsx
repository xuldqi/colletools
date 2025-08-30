import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VideoPluginLoader, ImagePluginLoader, OCRPluginLoader } from '../components/PluginLoader';
import { pluginManager, loadFFmpeg, loadOpenCV } from '../utils/pluginLoader';
import { Video, Image as ImageIcon, FileText, Play, Upload } from 'lucide-react';

const PluginDemo: React.FC = () => {
  const { t } = useTranslation();
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);
  const [testFile, setTestFile] = useState<File | null>(null);
  const [result, setResult] = useState<string>('');

  const demoOptions = [
    {
      id: 'video',
      title: t('demo.video.title'),
      description: t('demo.video.description'),
      icon: Video,
      pluginName: 'ffmpeg',
      loadFunction: loadFFmpeg
    },
    {
      id: 'image',
      title: t('demo.image.title'), 
      description: t('demo.image.description'),
      icon: ImageIcon,
      pluginName: 'opencv',
      loadFunction: loadOpenCV
    },
    {
      id: 'ocr',
      title: t('demo.ocr.title'),
      description: t('demo.ocr.description'),
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

    setResult(t('common.processing'));

    try {
      // Load plugin if not already loaded
      await demo.loadFunction();

      // Simulate processing based on demo type
      switch (selectedDemo) {
        case 'video':
          setResult(t('demo.video.success', { 
            fileName: testFile.name, 
            fileSize: (testFile.size / 1024 / 1024).toFixed(2) 
          }));
          break;
          
        case 'image':
          setResult(t('demo.image.success', { 
            fileName: testFile.name, 
            fileSize: (testFile.size / 1024 / 1024).toFixed(2) 
          }));
          break;
          
        case 'ocr':
          setResult(t('demo.ocr.success', { 
            fileName: testFile.name, 
            fileSize: (testFile.size / 1024 / 1024).toFixed(2) 
          }));
          break;
      }
    } catch (error) {
      setResult(t('common.processingFailed', { error: error.message }));
    }
  };

  const renderPluginLoader = () => {
    switch (selectedDemo) {
      case 'video':
        return <VideoPluginLoader className="min-h-[300px]">
          <div className="text-center p-6">
            <Video className="w-12 h-12 mx-auto mb-4 text-green-600" />
            <h3 className="text-lg font-semibold mb-2">{t('demo.ffmpegReady')}</h3>
            <p className="text-gray-600">{t('demo.ffmpegReadyDesc')}</p>
          </div>
        </VideoPluginLoader>;
      case 'image':
        return <ImagePluginLoader className="min-h-[300px]">
          <div className="text-center p-6">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 text-green-600" />
            <h3 className="text-lg font-semibold mb-2">{t('demo.opencvReady')}</h3>
            <p className="text-gray-600">{t('demo.opencvReadyDesc')}</p>
          </div>
        </ImagePluginLoader>;
      case 'ocr':
        return <OCRPluginLoader className="min-h-[300px]">
          <div className="text-center p-6">
            <FileText className="w-12 h-12 mx-auto mb-4 text-green-600" />
            <h3 className="text-lg font-semibold mb-2">{t('demo.tesseractReady')}</h3>
            <p className="text-gray-600">{t('demo.tesseractReadyDesc')}</p>
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
            {t('demo.title')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('demo.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Plugin Selection */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">{t('demo.selectFunction')}</h2>
            
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
                        {isLoaded && <span className="ml-2 text-sm text-green-600">✅ {t('common.loaded')}</span>}
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('demo.uploadTestFile')}</h3>
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
                      {t('common.selected')}: {testFile.name}
                    </p>
                  )}
                </div>
                
                {testFile && (
                  <button
                    onClick={runDemo}
                    className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {t('demo.startDemo')}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Plugin Loading Area */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">{t('demo.pluginLoadingStatus')}</h2>
            
            <div className="bg-white rounded-lg border min-h-[400px]">
              {selectedDemo ? renderPluginLoader() : (
                <div className="flex items-center justify-center h-[400px] text-gray-500">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Play className="w-8 h-8 text-gray-400" />
                    </div>
                    <p>{t('demo.selectFunctionToStart')}</p>
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