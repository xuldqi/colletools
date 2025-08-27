import React, { useState } from 'react';
import { Upload, FileText, Camera, CreditCard, Car, QrCode, Receipt, Scan, Table, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import SEOHead from '../components/SEOHead';
import StructuredData from '../components/StructuredData';
import { OCRPluginLoader } from '../components/PluginLoader';
import { loadTesseract } from '../utils/pluginLoader';

interface OCRTool {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  acceptedTypes: string;
  languages: string;
  processingFunction: (file: File) => Promise<{ text: string; }>;
}

const OCRTools: React.FC = () => {
  const { t } = useTranslation();

  // OCR处理函数
  const processImageToText = async (file: File) => {
    toast.info('正在加载Tesseract.js OCR引擎...');
    await loadTesseract();
    
    toast.info('正在识别图片中的文字 (中英文)...');
    
    try {
      const { Tesseract } = (window as any);
      
      const result = await Tesseract.recognize(file, 'chi_sim+eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            const progress = Math.round(m.progress * 100);
            toast.info(`正在识别文字... ${progress}%`);
          }
        }
      });
      
      const recognizedText = result.data.text.trim();
      if (recognizedText) {
        toast.success(`✅ 文字识别完成！识别出${recognizedText.length}个字符`);
        return { text: `📝 OCR识别结果\n\n${recognizedText}\n\n✅ 识别完成 (置信度: ${(result.data.confidence).toFixed(1)}%)` };
      } else {
        return { text: '❌ 未识别到文字内容，请确保图片清晰且包含文字。' };
      }
      
    } catch (error) {
      toast.error('OCR识别失败，请重试');
      return { text: '❌ OCR识别失败，请确保图片格式正确且包含清晰的文字。' };
    }
  };

  const processHandwritingRecognition = async (file: File) => {
    toast.info('正在加载手写文字识别引擎...');
    await loadTesseract();
    
    toast.info('正在识别手写文字...');
    
    try {
      const { Tesseract } = (window as any);
      
      const result = await Tesseract.recognize(file, 'chi_sim+eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            const progress = Math.round(m.progress * 100);
            toast.info(`正在识别手写文字... ${progress}%`);
          }
        }
      });
      
      const recognizedText = result.data.text.trim();
      toast.success('✅ 手写文字识别完成！');
      
      return { 
        text: `✍️ 手写文字识别结果\n\n${recognizedText || '未识别到手写文字'}\n\n📝 提示：手写文字识别准确率较低，建议使用清晰的印刷体文字。` 
      };
      
    } catch (error) {
      return { text: '❌ 手写文字识别失败，请确保图片清晰。' };
    }
  };

  const processDocumentScanner = async (file: File) => {
    toast.info('正在扫描文档...');
    await loadTesseract();
    
    try {
      const { Tesseract } = (window as any);
      
      const result = await Tesseract.recognize(file, 'chi_sim+eng');
      const text = result.data.text.trim();
      
      toast.success('✅ 文档扫描完成！');
      
      return {
        text: `📄 文档扫描结果\n\n${text}\n\n📊 文档统计：\n- 总字符数：${text.length}\n- 置信度：${result.data.confidence.toFixed(1)}%\n- 识别语言：中文+英文`
      };
      
    } catch (error) {
      return { text: '❌ 文档扫描失败，请确保文档图片清晰。' };
    }
  };

  const processReceiptScanner = async (file: File) => {
    toast.info('正在扫描票据内容...');
    await loadTesseract();
    
    try {
      const { Tesseract } = (window as any);
      
      const result = await Tesseract.recognize(file, 'chi_sim+eng');
      const text = result.data.text.trim();
      
      // 模拟提取票据信息
      const lines = text.split('\n').filter(line => line.trim());
      const mockReceiptData = {
        merchantName: '示例商户',
        date: new Date().toLocaleDateString(),
        amount: '¥88.00',
        items: lines.slice(0, 3).join('\n') || '商品项目待识别'
      };
      
      toast.success('✅ 票据扫描完成！');
      
      return {
        text: `🧾 票据扫描结果\n\n📝 原始文字：\n${text}\n\n📊 结构化信息：\n商户：${mockReceiptData.merchantName}\n日期：${mockReceiptData.date}\n金额：${mockReceiptData.amount}\n项目：\n${mockReceiptData.items}\n\n💡 这是演示版本，实际使用中会提供更精确的票据解析。`
      };
      
    } catch (error) {
      return { text: '❌ 票据扫描失败，请确保票据图片清晰完整。' };
    }
  };

  const processBusinessCardScanner = async (file: File) => {
    toast.info('正在扫描名片信息...');
    await loadTesseract();
    
    try {
      const { Tesseract } = (window as any);
      
      const result = await Tesseract.recognize(file, 'chi_sim+eng');
      const text = result.data.text.trim();
      
      toast.success('✅ 名片扫描完成！');
      
      return {
        text: `👤 名片扫描结果\n\n📝 识别到的文字：\n${text}\n\n💼 提取的信息：\n• 姓名：[待解析]\n• 公司：[待解析]\n• 职位：[待解析]\n• 电话：[待解析]\n• 邮箱：[待解析]\n\n💡 完整的名片解析功能正在开发中，将支持智能信息提取和联系人创建。`
      };
      
    } catch (error) {
      return { text: '❌ 名片扫描失败，请确保名片图片清晰。' };
    }
  };

  const processLicensePlateReader = async (file: File) => {
    toast.info('正在识别车牌号码...');
    await loadTesseract();
    
    try {
      const { Tesseract } = (window as any);
      
      const result = await Tesseract.recognize(file, 'eng', {
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      });
      
      const text = result.data.text.trim().replace(/\s+/g, '');
      
      toast.success('✅ 车牌识别完成！');
      
      return {
        text: `🚗 车牌识别结果\n\n识别结果：${text || '[未识别到车牌]'}\n\n📝 说明：\n• 支持标准车牌格式\n• 建议图片清晰、角度正面\n• 光线充足效果更好\n\n💡 这是基础版本，完整版将支持多种车牌类型和更高的识别准确率。`
      };
      
    } catch (error) {
      return { text: '❌ 车牌识别失败，请确保车牌图片清晰可见。' };
    }
  };

  const ocrTools: OCRTool[] = [
    {
      id: 'image-to-text',
      name: t('tools.ocr.imageToText'),
      description: t('tools.ocr.imageToTextDesc'),
      icon: FileText,
      acceptedTypes: 'image/*',
      languages: '中文+英文',
      processingFunction: processImageToText
    },
    {
      id: 'handwriting-recognition',
      name: t('tools.ocr.handwritingRecognition'),
      description: t('tools.ocr.handwritingRecognitionDesc'),
      icon: Camera,
      acceptedTypes: 'image/*',
      languages: '中文+英文',
      processingFunction: processHandwritingRecognition
    },
    {
      id: 'document-scanner',
      name: t('tools.ocr.documentScanner'),
      description: t('tools.ocr.documentScannerDesc'),
      icon: Scan,
      acceptedTypes: 'image/*',
      languages: '中文+英文',
      processingFunction: processDocumentScanner
    },
    {
      id: 'receipt-scanner',
      name: t('tools.ocr.receiptScanner'),
      description: t('tools.ocr.receiptScannerDesc'),
      icon: Receipt,
      acceptedTypes: 'image/*',
      languages: '中文+英文',
      processingFunction: processReceiptScanner
    },
    {
      id: 'business-card-scanner',
      name: t('tools.ocr.businessCardScanner'),
      description: t('tools.ocr.businessCardScannerDesc'),
      icon: CreditCard,
      acceptedTypes: 'image/*',
      languages: '中文+英文',
      processingFunction: processBusinessCardScanner
    },
    {
      id: 'license-plate-reader',
      name: t('tools.ocr.licensePlateReader'),
      description: t('tools.ocr.licensePlateReaderDesc'),
      icon: Car,
      acceptedTypes: 'image/*',
      languages: '英文+数字',
      processingFunction: processLicensePlateReader
    }
  ];
  const [selectedTool, setSelectedTool] = useState<OCRTool | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string>('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult('');
    }
  };

  const handleProcess = async () => {
    if (!selectedTool || !file) {
      toast.error(t('common.selectToolAndFile'));
      return;
    }

    setIsProcessing(true);

    try {
      const result = await selectedTool.processingFunction(file);
      setResult(result.text);
    } catch (error) {
      console.error(t('tools.ocr.processingError'), error);
      toast.error((error as Error).message || t('tools.ocr.ocrError'));
      setResult('❌ 处理失败，请重试。');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetTool = () => {
    setSelectedTool(null);
    setFile(null);
    setResult('');
  };

  const selectTool = (tool: OCRTool) => {
    setSelectedTool(tool);
    setFile(null);
    setResult('');
  };

  if (selectedTool) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <OCRPluginLoader className="mb-6" onLoadComplete={() => toast.success('Tesseract.js OCR引擎加载完成！')} />
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                  <selectedTool.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedTool.name}
                  </h2>
                  <p className="text-gray-600">{selectedTool.description}</p>
                  <p className="text-sm text-blue-600">支持语言: {selectedTool.languages}</p>
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
                    {t('common.clickToSelectImage')}
                  </label>
                  <p className="text-gray-500 text-sm mt-2">
                    支持格式: {selectedTool.acceptedTypes} | 语言: {selectedTool.languages}
                  </p>
                  {file && (
                    <p className="text-green-600 text-sm mt-2">
                      {t('common.selected')}: {file.name}
                    </p>
                  )}
                </div>
              </div>

              {file && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">图片预览</h3>
                  <img
                    src={URL.createObjectURL(file)}
                    alt="上传的图片"
                    className="max-w-full h-64 object-contain rounded-lg border mx-auto"
                  />
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={handleProcess}
                  disabled={!file || isProcessing}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isProcessing ? t('common.processing') + '...' : t('tools.ocr.startRecognition')}
                </button>
              </div>

              {result && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">识别结果</h3>
                  <div className="bg-gray-50 rounded-lg p-4 border max-h-80 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800">
                      {result}
                    </pre>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(result)}
                    className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {t('common.copyText')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead seoKey="ocrTools" />
      <StructuredData type="SoftwareApplication" />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Scan className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('tools.ocr.title')}</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              使用 Tesseract.js 强大的 OCR 引擎，支持40+种语言的文字识别
            </p>
          </div>

          {/* OCR Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ocrTools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <div
                  key={tool.id}
                  onClick={() => selectTool(tool)}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer group"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-sm text-blue-600">{tool.languages}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">{tool.description}</p>
                  <button className="w-full bg-blue-600 text-white hover:bg-blue-700 py-2 rounded-md font-medium transition-colors">
                    {t('common.useTool')}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Features */}
          <div className="mt-16 bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">OCR 功能特色</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-xl">🌍</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">多语言支持</h3>
                <p className="text-gray-600 text-sm">支持中文、英文等40+种语言的文字识别</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 font-bold text-xl">🔒</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">隐私安全</h3>
                <p className="text-gray-600 text-sm">本地处理，图片不会上传到服务器</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 font-bold text-xl">⚡</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">快速识别</h3>
                <p className="text-gray-600 text-sm">基于 Tesseract.js，识别速度快准确率高</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OCRTools;