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
    toast.info(t('common.loadingTesseractOCREngine'));
    await loadTesseract();
    
    toast.info(t('common.recognizingImageText'));
    
    try {
      const { Tesseract } = (window as any);
      
      const result = await Tesseract.recognize(file, 'chi_sim+eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            const progress = Math.round(m.progress * 100);
            toast.info(`${t('common.recognizingText')} ${progress}%`);
          }
        }
      });
      
      const recognizedText = result.data.text.trim();
      if (recognizedText) {
        toast.success(`${t('common.textRecognitionComplete')} ${recognizedText.length}${t('common.characters')}`);
        return { text: `${t('common.ocrRecognitionResult')}\n\n${recognizedText}\n\n${t('common.recognitionComplete', { confidence: (result.data.confidence).toFixed(1) })}` };
      } else {
        return { text: t('common.noTextRecognized') };
      }
      
    } catch (error) {
      toast.error(t('common.ocrRecognitionFailed'));
              return { text: t('common.ocrRecognitionFailed') };
    }
  };

  const processHandwritingRecognition = async (file: File) => {
    toast.info(t('common.loadingHandwritingRecognitionEngine'));
    await loadTesseract();
    
    toast.info(t('tools.ocr.recognizingHandwriting'));
    
    try {
      const { Tesseract } = (window as any);
      
      const result = await Tesseract.recognize(file, 'chi_sim+eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            const progress = Math.round(m.progress * 100);
            toast.info(`${t('tools.ocr.recognizingHandwriting')} ${progress}%`);
          }
        }
      });
      
      const recognizedText = result.data.text.trim();
      toast.success(t('common.handwritingRecognitionComplete'));
      
      return { 
                  text: `${t('common.handwritingRecognitionResult')}\n\n${recognizedText || t('common.noHandwritingDetected')}\n\n${t('common.handwritingAccuracyNote')}` 
      };
      
    } catch (error) {
              return { text: t('common.handwritingRecognitionFailed') };
    }
  };

  const processDocumentScanner = async (file: File) => {
    toast.info(t('common.scanningDocument'));
    await loadTesseract();
    
    try {
      const { Tesseract } = (window as any);
      
      const result = await Tesseract.recognize(file, 'chi_sim+eng');
      const text = result.data.text.trim();
      
      toast.success(t('common.documentScanComplete'));
      
      return {
                  text: `${t('common.documentScanResult')}\n\n${text}\n\n${t('common.documentStatistics')}：\n- ${t('common.totalCharacters')}：${text.length}\n- ${t('common.confidence')}：${result.data.confidence.toFixed(1)}%\n- ${t('common.recognitionLanguage')}：中文+英文`
      };
      
    } catch (error) {
              return { text: t('common.documentScanFailed') };
    }
  };

  const processReceiptScanner = async (file: File) => {
    toast.info(t('common.scanningReceipt'));
    await loadTesseract();
    
    try {
      const { Tesseract } = (window as any);
      
      const result = await Tesseract.recognize(file, 'chi_sim+eng');
      const text = result.data.text.trim();
      
      // 模拟提取票据信息
      const lines = text.split('\n').filter(line => line.trim());
      const mockReceiptData = {
        merchantName: t('common.sampleMerchant'),
        date: new Date().toLocaleDateString(),
        amount: '¥88.00',
                  items: lines.slice(0, 3).join('\n') || t('common.itemsToBeRecognized')
      };
      
      toast.success(t('common.receiptScanComplete'));
      
      return {
                  text: `${t('common.receiptScanResult')}\n\n📝 ${t('common.originalText')}：\n${text}\n\n📊 ${t('common.structuredInformation')}：\n${t('common.merchant')}：${mockReceiptData.merchantName}\n${t('common.date')}：${mockReceiptData.date}\n${t('common.amount')}：${mockReceiptData.amount}\n${t('common.items')}：\n${mockReceiptData.items}\n\n💡 ${t('common.demoVersionNote')}`
      };
      
    } catch (error) {
              return { text: t('common.receiptScanFailed') };
    }
  };

  const processBusinessCardScanner = async (file: File) => {
    toast.info(t('common.scanningBusinessCard'));
    await loadTesseract();
    
    try {
      const { Tesseract } = (window as any);
      
      const result = await Tesseract.recognize(file, 'chi_sim+eng');
      const text = result.data.text.trim();
      
      toast.success(t('common.businessCardScanComplete'));
      
      return {
                  text: `${t('common.businessCardScanResult')}\n\n📝 ${t('common.recognizedText')}：\n${text}\n\n💼 ${t('common.extractedInformation')}：\n• ${t('common.name')}：[${t('common.pendingParsing')}]\n• ${t('common.company')}：[${t('common.pendingParsing')}]\n• ${t('common.position')}：[${t('common.pendingParsing')}]\n• ${t('common.phone')}：[${t('common.pendingParsing')}]\n• ${t('common.email')}：[${t('common.pendingParsing')}]\n\n💡 ${t('common.businessCardParsingNote')}`
      };
      
    } catch (error) {
              return { text: t('common.businessCardScanFailed') };
    }
  };

  const processLicensePlateReader = async (file: File) => {
    toast.info(t('common.recognizingLicensePlate'));
    await loadTesseract();
    
    try {
      const { Tesseract } = (window as any);
      
      const result = await Tesseract.recognize(file, 'eng', {
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      });
      
      const text = result.data.text.trim().replace(/\s+/g, '');
      
      toast.success(t('common.licensePlateRecognitionComplete'));
      
      return {
        text: `${t('common.licensePlateRecognitionResult')}\n\n${t('common.recognitionResult')}：${text || t('common.noLicensePlateDetected')}\n\n📝 ${t('common.instructions')}：\n• ${t('common.supportsStandardFormat')}\n• ${t('common.recommendClearImage')}\n• ${t('common.betterWithGoodLighting')}\n\n💡 ${t('common.basicVersionNote')}`
      };
      
    } catch (error) {
              return { text: t('common.licensePlateRecognitionFailed') };
    }
  };

  const ocrTools: OCRTool[] = [
    {
      id: 'image-to-text',
      name: t('tools.ocr.imageToText'),
      description: t('tools.ocr.imageToTextDesc'),
      icon: FileText,
      acceptedTypes: 'image/*',
      languages: t('common.chineseAndEnglish'),
      processingFunction: processImageToText
    },
    {
      id: 'handwriting-recognition',
      name: t('tools.ocr.handwritingRecognition'),
      description: t('tools.ocr.handwritingRecognitionDesc'),
      icon: Camera,
      acceptedTypes: 'image/*',
      languages: t('common.chineseAndEnglish'),
      processingFunction: processHandwritingRecognition
    },
    {
      id: 'document-scanner',
      name: t('tools.ocr.documentScanner'),
      description: t('tools.ocr.documentScannerDesc'),
      icon: Scan,
      acceptedTypes: 'image/*',
      languages: t('common.chineseAndEnglish'),
      processingFunction: processDocumentScanner
    },
    {
      id: 'receipt-scanner',
      name: t('tools.ocr.receiptScanner'),
      description: t('tools.ocr.receiptScannerDesc'),
      icon: Receipt,
      acceptedTypes: 'image/*',
      languages: t('common.chineseAndEnglish'),
      processingFunction: processReceiptScanner
    },
    {
      id: 'business-card-scanner',
      name: t('tools.ocr.businessCardScanner'),
      description: t('tools.ocr.businessCardScannerDesc'),
      icon: CreditCard,
      acceptedTypes: 'image/*',
      languages: t('common.chineseAndEnglish'),
      processingFunction: processBusinessCardScanner
    },
    {
      id: 'license-plate-reader',
      name: t('tools.ocr.licensePlateReader'),
      description: t('tools.ocr.licensePlateReaderDesc'),
      icon: Car,
      acceptedTypes: 'image/*',
      languages: t('common.englishAndNumbers'),
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
              setResult(t('common.processingFailedRetry'));
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
            <OCRPluginLoader className="mb-6" onLoadComplete={() => toast.success(t('common.tesseractEngineLoaded'))} />
            
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
                  <p className="text-sm text-blue-600">{t('common.supportedLanguages')}: {selectedTool.languages}</p>
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
                    {t('common.supportedFormats')}: {selectedTool.acceptedTypes} | {t('common.language')}: {selectedTool.languages}
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
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{t('common.imagePreview')}</h3>
                  <img
                    src={URL.createObjectURL(file)}
                                          alt={t('common.uploadedImage')}
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
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{t('common.recognitionResult')}</h3>
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
              {t('tools.ocr.subtitle')}
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t('tools.ocr.features')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-xl">🌍</span>
                </div>
                                  <h3 className="font-semibold text-gray-900 mb-2">{t('tools.ocr.multilingualSupport')}</h3>
                  <p className="text-gray-600 text-sm">{t('tools.ocr.multilingualSupportDesc')}</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 font-bold text-xl">🔒</span>
                </div>
                                  <h3 className="font-semibold text-gray-900 mb-2">{t('tools.ocr.privacySecurity')}</h3>
                  <p className="text-gray-600 text-sm">{t('tools.ocr.privacySecurityDesc')}</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 font-bold text-xl">⚡</span>
                </div>
                                  <h3 className="font-semibold text-gray-900 mb-2">{t('tools.ocr.fastRecognition')}</h3>
                  <p className="text-gray-600 text-sm">{t('tools.ocr.fastRecognitionDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OCRTools;