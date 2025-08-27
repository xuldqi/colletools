import React, { useState } from 'react';
import { Upload, FileText, Camera, CreditCard, Car, QrCode, Receipt, Scan, Table } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next'
import SEOHead from '../components/SEOHead'
import StructuredData from '../components/StructuredData';

interface OCRTool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  acceptedTypes: string;
  endpoint: string;
}

  const OCRTools: React.FC = () => {
  const { t } = useTranslation();

  const ocrTools: OCRTool[] = [
    {
      id: 'image-to-text',
      name: t('tools.ocr.imageToText'),
      description: t('tools.ocr.imageToTextDesc'),
      icon: <FileText className="w-8 h-8" />,
      acceptedTypes: 'image/*',
      endpoint: '/api/tools/image-to-text/process'
    },
    {
      id: 'pdf-ocr',
      name: t('tools.ocr.pdfOcr'),
      description: t('tools.ocr.pdfOcrDesc'),
      icon: <Scan className="w-8 h-8" />,
      acceptedTypes: '.pdf',
      endpoint: '/api/tools/pdf-ocr/process'
    },
    {
      id: 'handwriting-recognition',
      name: t('tools.ocr.handwritingRecognition'),
      description: t('tools.ocr.handwritingRecognitionDesc'),
      icon: <Camera className="w-8 h-8" />,
      acceptedTypes: 'image/*',
      endpoint: '/api/tools/handwriting-recognition/process'
    },
    {
      id: 'document-scanner',
      name: t('tools.ocr.documentScanner'),
      description: t('tools.ocr.documentScannerDesc'),
      icon: <Scan className="w-8 h-8" />,
      acceptedTypes: 'image/*',
      endpoint: '/api/tools/document-scanner/process'
    },
    {
      id: 'table-extractor',
      name: t('tools.ocr.tableExtractor'),
      description: t('tools.ocr.tableExtractorDesc'),
      icon: <Table className="w-8 h-8" />,
      acceptedTypes: 'image/*,.pdf',
      endpoint: '/api/tools/table-extractor/process'
    },
    {
      id: 'receipt-scanner',
      name: t('tools.ocr.receiptScanner'),
      description: t('tools.ocr.receiptScannerDesc'),
      icon: <Receipt className="w-8 h-8" />,
      acceptedTypes: 'image/*',
      endpoint: '/api/tools/receipt-scanner/process'
    },
    {
      id: 'business-card-scanner',
      name: t('tools.ocr.businessCardScanner'),
      description: t('tools.ocr.businessCardScannerDesc'),
      icon: <CreditCard className="w-8 h-8" />,
      acceptedTypes: 'image/*',
      endpoint: '/api/tools/business-card-scanner/process'
    },
    {
      id: 'license-plate-reader',
      name: t('tools.ocr.licensePlateReader'),
      description: t('tools.ocr.licensePlateReaderDesc'),
      icon: <Car className="w-8 h-8" />,
      acceptedTypes: 'image/*',
      endpoint: '/api/tools/license-plate-reader/process'
    },
    {
      id: 'qr-code-reader',
      name: t('tools.ocr.qrCodeReader'),
      description: t('tools.ocr.qrCodeReaderDesc'),
      icon: <QrCode className="w-8 h-8" />,
      acceptedTypes: 'image/*',
      endpoint: '/api/tools/qr-code-reader/process'
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
      setResult(data.text || data.result || t('tools.ocr.recognitionComplete'));
      toast.success(data.message || t('tools.ocr.ocrComplete'));
    } catch (error) {
      console.error(t('tools.ocr.processingError'), error);
      toast.error(error.message || t('tools.ocr.ocrError'));
    } finally {
      setIsProcessing(false);
    }
  };

  const resetTool = () => {
    setSelectedTool(null);
    setFile(null);
    setResult('');
  };

  return (
    <>
      <SEOHead seoKey="ocrTools" />
      <StructuredData type="SoftwareApplication" />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('tools.ocr.title')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('tools.ocr.pageDescription')}
          </p>
        </div>

        {!selectedTool ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ocrTools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => setSelectedTool(tool)}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 p-6"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-4 mx-auto">
                  <div className="text-blue-600">{tool.icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                  {tool.name}
                </h3>
                <p className="text-gray-600 text-center">{tool.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                    <div className="text-blue-600">{selectedTool.icon}</div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedTool.name}
                    </h2>
                    <p className="text-gray-600">{selectedTool.description}</p>
                  </div>
                </div>
                <button
                  onClick={resetTool}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  {t('common.back')}
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('tools.ocr.selectFile')}
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
                      {t('tools.ocr.clickToSelectFile')}
                    </label>
                    <p className="text-gray-500 text-sm mt-2">
                      {t('tools.ocr.supportedFormats')}: {selectedTool.acceptedTypes}
                    </p>
                    {file && (
                      <p className="text-green-600 text-sm mt-2">
                        {t('common.selectedFile')} {file.name}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleProcess}
                  disabled={!file || isProcessing}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isProcessing ? t('tools.ocr.recognizing') : t('tools.ocr.startRecognition')}
                </button>

                {result && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('tools.ocr.recognitionResult')}
                    </label>
                    <div className="bg-gray-50 rounded-lg p-4 border">
                      <pre className="whitespace-pre-wrap text-sm text-gray-800">
                        {result}
                      </pre>
                    </div>
                    <button
                      onClick={() => navigator.clipboard.writeText(result)}
                      className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      {t('tools.ocr.copyResult')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default OCRTools;