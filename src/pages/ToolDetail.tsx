import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, Settings, Play, Download, ArrowLeft, FileText, Image, Video, PenTool, Database } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

interface ToolOption {
  name: string;
  label: string;
  type: 'select' | 'range' | 'textarea' | 'text' | 'number' | 'checkbox' | 'file';
  options?: string[];
  min?: number;
  max?: number;
  default?: string | number | boolean;
  placeholder?: string;
  required?: boolean;
}

interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  acceptedFormats: string[];
  maxFiles: number;
  options: ToolOption[];
}

interface ProcessingResult {
  fileId: string;
  fileName: string;
  fileSize: number;
  message: string;
  downloadUrl?: string;
  generatedText?: string;
  originalSize?: number;
  additionalFiles?: string[];
  format?: string;
  quality?: number;
  wordCount?: number;
}

const ToolDetail: React.FC = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  const [options, setOptions] = useState<Record<string, string | number | boolean | File>>({});
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const fetchToolDetails = useCallback(async () => {
    try {
      // Get current language from i18n
      const currentLanguage = i18n.language || 'en';
      const response = await fetch(`/api/tools/${toolId}?lang=${currentLanguage}`);
      const data = await response.json();
      
      if (data.success) {
        setTool(data.data);
        // Initialize options with default values
        const defaultOptions: Record<string, string | number | boolean> = {};
        data.data.options.forEach((option: ToolOption) => {
          defaultOptions[option.name] = option.default || '';
        });
        setOptions(defaultOptions);
      }
    } catch (error) {
      console.error('Failed to fetch tool details:', error);
    } finally {
      setLoading(false);
    }
  }, [toolId]);

  useEffect(() => {
    fetchToolDetails();
  }, [fetchToolDetails]);



  const handleFileSelect = (selectedFiles: FileList) => {
    const fileArray = Array.from(selectedFiles);
    if (tool && tool.maxFiles > 0) {
      setFiles(fileArray.slice(0, tool.maxFiles));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = e.dataTransfer.files;
    handleFileSelect(droppedFiles);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleOptionChange = (optionName: string, value: string | number | boolean | File) => {
    setOptions(prev => ({
      ...prev,
      [optionName]: value
    }));
  };

  const handleProcess = async () => {
    if (!tool) return;
    
    setProcessing(true);
    setResult(null);
    
    try {
      const formData = new FormData();
      
      // Add files if required
      if (tool.maxFiles > 0) {
        files.forEach(file => {
          formData.append('files', file);
        });
      }
      
      // Add options
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          formData.append(key, value.toString());
        }
      });
      
      const response = await fetch(`/api/tools/${toolId}/process`, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResult({...data.data, downloadUrl: data.downloadUrl});
        // Auto-download if download URL is available
        if (data.downloadUrl) {
          const downloadLink = document.createElement('a');
          downloadLink.href = data.downloadUrl;
          downloadLink.download = data.data.fileName || 'processed_file';
          downloadLink.click();
        }
      } else {
        alert(t('common.processingFailed') + ': ' + data.error);
      }
    } catch (error) {
      console.error('Processing error:', error);
      alert(t('common.processingFailedTryAgain'));
    } finally {
      setProcessing(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'pdf': return <FileText className="w-6 h-6" />;
      case 'image': return <Image className="w-6 h-6" />;
      case 'video': return <Video className="w-6 h-6" />;
      case 'ai-writing': return <PenTool className="w-6 h-6" />;
      case 'file': return <Database className="w-6 h-6" />;
      default: return <FileText className="w-6 h-6" />;
    }
  };

  // 根据工具类别返回对应的页面路径
  const getCategoryPath = (category: string) => {
    switch (category) {
      case 'pdf': return '/pdf';
      case 'image': return '/image';
      case 'video': return '/video';
      case 'ocr': return '/ocr';
      case 'ai-writing': return '/ai-writing';
      case 'file':
      case 'text':
      case 'converter':
      case 'developer':
        return '/document-data';
      default: return '/';
    }
  };

  // 智能返回函数
  const handleSmartBack = () => {
    if (tool) {
      const categoryPath = getCategoryPath(tool.category);
      navigate(categoryPath);
    } else {
      navigate('/');
    }
  };

  const canProcess = () => {
    if (!tool) return false;
    
    // Check if files are required and provided
    if (tool.maxFiles > 0 && files.length === 0) return false;
    
    // Check required options
    const requiredOptions = tool.options.filter(opt => opt.required);
    for (const option of requiredOptions) {
      if (!options[option.name] || options[option.name].toString().trim() === '') {
        return false;
      }
    }
    
    return true;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loadingToolDetails')}</p>
        </div>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('common.toolNotFound')}</h2>
          <p className="text-gray-600 mb-6">{t('common.toolNotFoundDesc')}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('common.goHome')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-end">
            <button
              onClick={handleSmartBack}
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('common.back')}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Tool Info */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              {getCategoryIcon(tool.category)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{tool.name}</h1>
              <p className="text-gray-600 mt-1">{tool.description}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* File Upload Section */}
            {tool.maxFiles > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  {t('common.uploadFiles')}
                </h2>
                
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    {t('common.dropFilesHere')}
                  </p>
                  <p className="text-gray-600 mb-4">
                    {t('common.acceptedFormats')}: {tool.acceptedFormats.join(', ')}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    {t('common.maximumFiles', { count: tool.maxFiles })}
                  </p>
                  
                  <input
                    type="file"
                    multiple={tool.maxFiles > 1}
                    accept={tool.acceptedFormats.join(',')}
                    onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                    className="hidden"
                    id="file-input"
                  />
                  <label
                    htmlFor="file-input"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-block"
                  >
                    {t('common.chooseFiles')}
                  </label>
                </div>
                
                {/* Selected Files */}
                {files.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-medium text-gray-900 mb-2">{t('common.selectedFiles')}:</h3>
                    <div className="space-y-2">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center">
                            <FileText className="w-4 h-4 text-gray-500 mr-2" />
                            <span className="text-sm font-medium">{file.name}</span>
                            <span className="text-xs text-gray-500 ml-2">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <button
                            onClick={() => setFiles(files.filter((_, i) => i !== index))}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            {t('common.remove')}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Options Section */}
            {tool.options.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  {t('common.options')}
                </h2>
                
                <div className="space-y-4">
                  {tool.options.map((option) => (
                    <div key={option.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {option.label}
                        {option.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      
                      {option.type === 'select' && (
                        <select
                          value={typeof options[option.name] === 'string' ? options[option.name] as string : ''}
                          onChange={(e) => handleOptionChange(option.name, e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {option.options?.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      )}
                      
                      {option.type === 'range' && (
                        <div>
                          <input
                            type="range"
                            min={option.min}
                            max={option.max}
                            value={typeof options[option.name] === 'number' ? options[option.name] as number : (typeof option.default === 'number' ? option.default : 0)}
                            onChange={(e) => handleOptionChange(option.name, parseInt(e.target.value))}
                            className="w-full"
                          />
                          <div className="flex justify-between text-sm text-gray-500 mt-1">
                            <span>{option.min}</span>
                            <span className="font-medium">{typeof options[option.name] === 'number' ? (options[option.name] as number) : (typeof option.default === 'number' ? option.default : 0)}</span>
                            <span>{option.max}</span>
                          </div>
                        </div>
                      )}
                      
                      {option.type === 'textarea' && (
                        <textarea
                          value={typeof options[option.name] === 'string' ? options[option.name] as string : ''}
                          onChange={(e) => handleOptionChange(option.name, e.target.value)}
                          placeholder={option.placeholder}
                          rows={4}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      )}
                      
                      {option.type === 'text' && (
                        <input
                          type="text"
                          value={typeof options[option.name] === 'string' ? options[option.name] as string : ''}
                          onChange={(e) => handleOptionChange(option.name, e.target.value)}
                          placeholder={option.placeholder}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      )}
                      
                      {option.type === 'number' && (
                        <input
                          type="number"
                          value={typeof options[option.name] === 'number' ? options[option.name] as number : ''}
                          onChange={(e) => handleOptionChange(option.name, parseInt(e.target.value) || 0)}
                          placeholder={option.placeholder}
                          min={option.min}
                          max={option.max}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      )}
                      
                      {option.type === 'checkbox' && (
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={typeof options[option.name] === 'boolean' ? options[option.name] as boolean : false}
                            onChange={(e) => handleOptionChange(option.name, e.target.checked)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{option.placeholder}</span>
                        </div>
                      )}
                      
                      {option.type === 'file' && (
                        <input
                            type="file"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleOptionChange(option.name, file);
                              }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Process Button */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <button
                onClick={handleProcess}
                disabled={!canProcess() || processing}
                className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors ${
                  canProcess() && !processing
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {t('common.processing')}
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    {t('common.process')} {tool.name}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('common.results')}</h2>
              
              {!result && (
                <div className="text-center text-gray-500 py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="w-8 h-8 text-gray-400" />
                  </div>
                  <p>{t('common.processFilesToSeeResults')}</p>
                </div>
              )}
              
              {result && (
                <div className="space-y-4">
                  <div className="flex items-center text-green-600 mb-4">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                    <span className="font-medium">{t('common.processingComplete')}</span>
                  </div>
                  
                  {result.downloadUrl && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">{t('common.download')}</h3>
                      <a
                        href={result.downloadUrl}
                        download
                        className="flex items-center justify-center w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {t('common.downloadFile')}
                      </a>
                    </div>
                  )}
                  
                  {result.generatedText && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">{t('common.generatedText')}</h3>
                      <div className="bg-gray-50 p-4 rounded-lg text-sm">
                        <p className="whitespace-pre-wrap">{result.generatedText}</p>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        {t('common.wordCount')}: {result.wordCount}
                      </div>
                    </div>
                  )}
                  
                  {/* Additional result info */}
                  <div className="text-sm text-gray-600 space-y-1">
                    {result.fileSize && (
                      <div>{t('common.fileSize')}: {result.fileSize}</div>
                    )}
                    {result.format && (
                      <div>Format: {result.format}</div>
                    )}
                    {result.quality && (
                      <div>Quality: {result.quality}%</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolDetail;