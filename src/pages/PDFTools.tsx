import React, { useState } from 'react';
import { FileText, Download, Upload, Merge, Split, Minimize2, Edit, Scan, PenTool, Stamp, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next'
import SEOHead from '../components/SEOHead'
import StructuredData from '../components/StructuredData';

interface PDFTool {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  popular: boolean;
  endpoint: string;
  acceptedTypes: string;
}

const PDFTools = () => {
  const { t } = useTranslation();
  const [selectedTool, setSelectedTool] = useState<PDFTool | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFileUrl, setProcessedFileUrl] = useState<string>('');
  const [extractedText, setExtractedText] = useState<string>('');

  const pdfTools: PDFTool[] = [
    {
      id: 'pdf-to-word',
      title: t('tools.pdf.pdfToWord'),
      description: t('tools.pdf.pdfToWordDesc'),
      icon: Edit,
      popular: true,
      endpoint: '/api/pdf/to-word',
      acceptedTypes: '.pdf'
    },
    {
      id: 'word-to-pdf',
      title: t('tools.pdf.wordToPdf'),
      description: t('tools.pdf.wordToPdfDesc'),
      icon: FileText,
      popular: true,
      endpoint: '/api/pdf/from-word',
      acceptedTypes: '.doc,.docx'
    },
    {
      id: 'pdf-merge',
      title: t('tools.pdf.mergePdf'),
      description: t('tools.pdf.mergePdfDesc'),
      icon: Merge,
      popular: true,
      endpoint: '/api/pdf/merge',
      acceptedTypes: '.pdf'
    },
    {
      id: 'pdf-split',
      title: t('tools.pdf.splitPdf'),
      description: t('tools.pdf.splitPdfDesc'),
      icon: Split,
      popular: false,
      endpoint: '/api/pdf/split',
      acceptedTypes: '.pdf'
    },
    {
      id: 'pdf-compress',
      title: t('tools.pdf.compressPdf'),
      description: t('tools.pdf.compressPdfDesc'),
      icon: Minimize2,
      popular: true,
      endpoint: '/api/pdf/compress',
      acceptedTypes: '.pdf'
    },
    {
      id: 'pdf-ocr',
      title: t('tools.pdf.pdfOcr'),
      description: t('tools.pdf.pdfOcrDesc'),
      icon: Scan,
      popular: false,
      endpoint: '/api/pdf/ocr',
      acceptedTypes: '.pdf'
    },
    {
      id: 'pdf-form-filler',
      title: t('tools.pdf.pdfFormFiller'),
      description: t('tools.pdf.pdfFormFillerDesc'),
      icon: Edit,
      popular: false,
      endpoint: '/api/pdf/fill-form',
      acceptedTypes: '.pdf'
    },
    {
      id: 'pdf-signature',
      title: t('tools.pdf.addSignature'),
      description: t('tools.pdf.addSignatureDesc'),
      icon: PenTool,
      popular: false,
      endpoint: '/api/pdf/add-signature',
      acceptedTypes: '.pdf'
    },
    {
      id: 'pdf-watermark',
      title: t('tools.pdf.pdfWatermark'),
      description: t('tools.pdf.pdfWatermarkDesc'),
      icon: Stamp,
      popular: false,
      endpoint: '/api/pdf/add-watermark',
      acceptedTypes: '.pdf'
    },
    {
      id: 'pdf-to-excel',
      title: t('tools.pdf.pdfToExcel'),
      description: t('tools.pdf.pdfToExcelDesc'),
      icon: Download,
      popular: false,
      endpoint: '/api/pdf/to-excel',
      acceptedTypes: '.pdf'
    },
    {
      id: 'excel-to-pdf',
      title: t('tools.pdf.excelToPdf'),
      description: t('tools.pdf.excelToPdfDesc'),
      icon: Upload,
      popular: false,
      endpoint: '/api/pdf/from-excel',
      acceptedTypes: '.xls,.xlsx'
    },
    {
      id: 'pdf-to-powerpoint',
      title: t('tools.pdf.pdfToPowerpoint'),
      description: t('tools.pdf.pdfToPowerpointDesc'),
      icon: Edit,
      popular: false,
      endpoint: '/api/pdf/to-powerpoint',
      acceptedTypes: '.pdf'
    },
    {
      id: 'powerpoint-to-pdf',
      title: t('tools.pdf.powerpointToPdf'),
      description: t('tools.pdf.powerpointToPdfDesc'),
      icon: FileText,
      popular: false,
      endpoint: '/api/pdf/from-powerpoint',
      acceptedTypes: '.ppt,.pptx'
    }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setProcessedFileUrl('');
      setExtractedText('');
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

      // 检查是否是OCR工具（返回文本）
      if (selectedTool.id === 'pdf-ocr') {
        const data = await response.json();
        setExtractedText(data.text || t('common.noTextRecognized'));
      } else {
        // 其他工具返回文件
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setProcessedFileUrl(url);
      }
      
      toast.success(t('common.processingComplete'));
    } catch (error) {
      console.error('PDF处理错误:', error);
      toast.error(t('common.processingFailedRetry'));
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadFile = () => {
    if (processedFileUrl) {
      const link = document.createElement('a');
      link.href = processedFileUrl;
      link.download = `processed_${selectedTool?.id}_${Date.now()}.pdf`;
      link.click();
    }
  };

  const resetTool = () => {
    setSelectedTool(null);
    setFile(null);
    setProcessedFileUrl('');
    setExtractedText('');
    if (processedFileUrl) {
      URL.revokeObjectURL(processedFileUrl);
    }
  };

  const selectTool = (tool: PDFTool) => {
    setSelectedTool(tool);
    setFile(null);
    setProcessedFileUrl('');
    setExtractedText('');
  };

  if (selectedTool) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg">
                  <selectedTool.icon className="w-6 h-6 text-red-600" />
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
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors">
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
                    className="cursor-pointer text-red-600 hover:text-red-700 font-medium"
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
                  className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isProcessing ? t('common.processing') : t('common.startProcessing')}
                </button>
                {processedFileUrl && (
                  <button
                    onClick={downloadFile}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    {t('common.downloadFile')}
                  </button>
                )}
              </div>

              {extractedText && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('common.extractedText')}
                  </label>
                  <div className="bg-gray-50 rounded-lg p-4 border max-h-64 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800">
                      {extractedText}
                    </pre>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(extractedText)}
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
    <div className="min-h-screen bg-gray-50 py-12">
      <SEOHead seoKey="pdfTools" />
      <StructuredData type="SoftwareApplication" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('tools.pdf.title')}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('tools.pdf.pageDescription')}
          </p>
        </div>

        {/* Popular Tools Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('tools.pdf.popularTools')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pdfTools.filter(tool => tool.popular).map((tool) => {
              const IconComponent = tool.icon
              return (
                <div key={tool.title} onClick={() => selectTool(tool)} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer group">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                      <IconComponent className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                        {tool.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{tool.description}</p>
                  <button className="w-full bg-red-600 text-white hover:bg-red-700 py-2 rounded-md font-medium transition-colors">
                    {t('common.useTool')}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* All Tools Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('tools.pdf.allTools')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pdfTools.map((tool) => {
              const IconComponent = tool.icon
              return (
                <div key={tool.title} onClick={() => selectTool(tool)} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer group">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                      <IconComponent className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                        {tool.title}
                      </h3>
                      {tool.popular && (
                        <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t('tools.pdf.whyChoose')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold text-xl">✓</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('tools.pdf.highQuality')}</h3>
              <p className="text-gray-600 text-sm">{t('tools.pdf.highQualityDesc')}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">🔒</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('tools.pdf.secureProcessing')}</h3>
              <p className="text-gray-600 text-sm">{t('tools.pdf.secureProcessingDesc')}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-bold text-xl">⚡</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('tools.pdf.fastProcessing')}</h3>
              <p className="text-gray-600 text-sm">{t('tools.pdf.fastProcessingDesc')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PDFTools