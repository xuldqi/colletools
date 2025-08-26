import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FileText, Split, ArrowRightLeft, Database, FileSpreadsheet, Code,
  Type, Hash, RotateCcw, AlignLeft, List, ArrowUpDown, Trash2, GitCompare, Calculator,
  Link as LinkIcon, Braces, QrCode, Palette, Clock, Key, Lock,
  Ruler, DollarSign, Binary, Globe, Image, Music
} from 'lucide-react';
import SEOHead from '../components/SEOHead';
import StructuredData from '../components/StructuredData';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  popular?: boolean;
  category: string;
}

const DocumentDataTools: React.FC = () => {
  const { t } = useTranslation();
  
  const tools: Tool[] = [
    // File Tools
    {
      id: 'csv-split',
      name: t('tools.documentData.csvSplit'),
      description: t('tools.documentData.csvSplitDesc'),
      icon: <Split className="w-6 h-6" />,
      popular: true,
      category: t('tools.documentData.fileProcessing')
    },
    {
      id: 'excel-split',
      name: t('tools.documentData.excelSplit'),
      description: t('tools.documentData.excelSplitDesc'),
      icon: <FileSpreadsheet className="w-6 h-6" />,
      popular: true,
      category: t('tools.documentData.fileProcessing')
    },
    {
      id: 'xml-to-excel',
      name: t('tools.documentData.xmlToExcel'),
      description: t('tools.documentData.xmlToExcelDesc'),
      icon: <ArrowRightLeft className="w-6 h-6" />,
      category: t('tools.documentData.fileProcessing')
    },
    {
      id: 'excel-to-xml',
      name: t('tools.documentData.excelToXml'),
      description: t('tools.documentData.excelToXmlDesc'),
      icon: <ArrowRightLeft className="w-6 h-6" />,
      category: t('tools.documentData.fileProcessing')
    },
    {
      id: 'csv-to-excel',
      name: t('tools.documentData.csvToExcel'),
      description: t('tools.documentData.csvToExcelDesc'),
      icon: <ArrowRightLeft className="w-6 h-6" />,
      popular: true,
      category: t('tools.documentData.fileProcessing')
    },
    {
      id: 'xml-to-csv',
      name: t('tools.documentData.xmlToCsv'),
      description: t('tools.documentData.xmlToCsvDesc'),
      icon: <ArrowRightLeft className="w-6 h-6" />,
      category: t('tools.documentData.fileProcessing')
    },
    {
      id: 'xml-to-json',
      name: t('tools.documentData.xmlToJson'),
      description: t('tools.documentData.xmlToJsonDesc'),
      icon: <Code className="w-6 h-6" />,
      popular: true,
      category: t('tools.documentData.fileProcessing')
    },
    {
      id: 'json-to-xml',
      name: t('tools.documentData.jsonToXml'),
      description: t('tools.documentData.jsonToXmlDesc'),
      icon: <Code className="w-6 h-6" />,
      category: t('tools.documentData.fileProcessing')
    },
    {
      id: 'csv-to-json',
      name: t('tools.documentData.csvToJson'),
      description: t('tools.documentData.csvToJsonDesc'),
      icon: <Database className="w-6 h-6" />,
      category: t('tools.documentData.fileProcessing')
    },
    
    // Text Tools
    {
      id: 'word-counter',
      name: t('tools.documentData.wordCounter'),
      description: t('tools.documentData.wordCounterDesc'),
      icon: <Calculator className="w-6 h-6" />,
      popular: true,
      category: t('tools.documentData.textProcessing')
    },
    {
      id: 'character-counter',
      name: t('tools.documentData.characterCounter'),
      description: t('tools.documentData.characterCounterDesc'),
      icon: <Hash className="w-6 h-6" />,
      popular: true,
      category: t('tools.documentData.textProcessing')
    },
    {
      id: 'case-converter',
      name: t('tools.documentData.caseConverter'),
      description: t('tools.documentData.caseConverterDesc'),
      icon: <Type className="w-6 h-6" />,
      popular: true,
      category: t('tools.documentData.textProcessing')
    },
    {
      id: 'text-formatter',
      name: t('tools.documentData.textFormatter'),
      description: t('tools.documentData.textFormatterDesc'),
      icon: <AlignLeft className="w-6 h-6" />,
      category: t('tools.documentData.textProcessing')
    },
    {
      id: 'line-counter',
      name: t('tools.documentData.lineCounter'),
      description: t('tools.documentData.lineCounterDesc'),
      icon: <List className="w-6 h-6" />,
      category: t('tools.documentData.textProcessing')
    },
    {
      id: 'text-reverser',
      name: t('tools.documentData.textReverser'),
      description: t('tools.documentData.textReverserDesc'),
      icon: <RotateCcw className="w-6 h-6" />,
      category: t('tools.documentData.textProcessing')
    },
    {
      id: 'text-sorter',
      name: t('tools.documentData.textSorter'),
      description: t('tools.documentData.textSorterDesc'),
      icon: <ArrowUpDown className="w-6 h-6" />,
      category: t('tools.documentData.textProcessing')
    },
    {
      id: 'duplicate-remover',
      name: t('tools.documentData.duplicateRemover'),
      description: t('tools.documentData.duplicateRemoverDesc'),
      icon: <Trash2 className="w-6 h-6" />,
      category: t('tools.documentData.textProcessing')
    },
    {
      id: 'text-diff',
      name: t('tools.documentData.textDiff'),
      description: t('tools.documentData.textDiffDesc'),
      icon: <GitCompare className="w-6 h-6" />,
      category: t('tools.documentData.textProcessing')
    },
    
    // Developer Tools
    {
      id: 'hash-generator',
      name: t('tools.documentData.hashGenerator'),
      description: t('tools.documentData.hashGeneratorDesc'),
      icon: <Hash className="w-6 h-6" />,
      popular: true,
      category: t('tools.documentData.developerTools')
    },
    {
      id: 'base64-encoder',
      name: t('tools.documentData.base64Encoder'),
      description: t('tools.documentData.base64EncoderDesc'),
      icon: <Code className="w-6 h-6" />,
      popular: true,
      category: t('tools.documentData.developerTools')
    },
    {
      id: 'url-encoder',
      name: t('tools.documentData.urlEncoder'),
      description: t('tools.documentData.urlEncoderDesc'),
      icon: <LinkIcon className="w-6 h-6" />,
      popular: true,
      category: t('tools.documentData.developerTools')
    },
    {
      id: 'json-formatter',
      name: t('tools.documentData.jsonFormatter'),
      description: t('tools.documentData.jsonFormatterDesc'),
      icon: <Braces className="w-6 h-6" />,
      category: t('tools.documentData.developerTools')
    },
    {
      id: 'qr-generator',
      name: t('tools.documentData.qrGenerator'),
      description: t('tools.documentData.qrGeneratorDesc'),
      icon: <QrCode className="w-6 h-6" />,
      category: t('tools.documentData.developerTools')
    },
    {
      id: 'color-picker',
      name: t('tools.documentData.colorPicker'),
      description: t('tools.documentData.colorPickerDesc'),
      icon: <Palette className="w-6 h-6" />,
      category: t('tools.documentData.developerTools')
    },
    {
      id: 'timestamp-converter',
      name: t('tools.documentData.timestampConverter'),
      description: t('tools.documentData.timestampConverterDesc'),
      icon: <Clock className="w-6 h-6" />,
      category: t('tools.documentData.developerTools')
    },
    {
      id: 'uuid-generator',
      name: t('tools.documentData.uuidGenerator'),
      description: t('tools.documentData.uuidGeneratorDesc'),
      icon: <Key className="w-6 h-6" />,
      category: t('tools.documentData.developerTools')
    },
    {
      id: 'password-generator',
      name: t('tools.documentData.passwordGenerator'),
      description: t('tools.documentData.passwordGeneratorDesc'),
      icon: <Lock className="w-6 h-6" />,
      category: t('tools.documentData.developerTools')
    },
    
    // Converter Tools
    {
      id: 'unit-converter',
      name: t('tools.documentData.unitConverter'),
      description: t('tools.documentData.unitConverterDesc'),
      icon: <Ruler className="w-6 h-6" />,
      popular: true,
      category: t('tools.documentData.converters')
    },
    {
      id: 'currency-converter',
      name: t('tools.documentData.currencyConverter'),
      description: t('tools.documentData.currencyConverterDesc'),
      icon: <DollarSign className="w-6 h-6" />,
      popular: true,
      category: t('tools.documentData.converters')
    },
    {
      id: 'number-base-converter',
      name: t('tools.documentData.numberBaseConverter'),
      description: t('tools.documentData.numberBaseConverterDesc'),
      icon: <Binary className="w-6 h-6" />,
      popular: true,
      category: t('tools.documentData.converters')
    },
    {
      id: 'color-converter',
      name: t('tools.documentData.colorConverter'),
      description: t('tools.documentData.colorConverterDesc'),
      icon: <Palette className="w-6 h-6" />,
      category: t('tools.documentData.converters')
    },
    {
      id: 'timezone-converter',
      name: t('tools.documentData.timezoneConverter'),
      description: t('tools.documentData.timezoneConverterDesc'),
      icon: <Globe className="w-6 h-6" />,
      category: t('tools.documentData.converters')
    },
    {
      id: 'image-format-converter',
      name: t('tools.documentData.imageFormatConverter'),
      description: t('tools.documentData.imageFormatConverterDesc'),
      icon: <Image className="w-6 h-6" />,
      category: t('tools.documentData.converters')
    },
    {
      id: 'audio-format-converter',
      name: t('tools.documentData.audioFormatConverter'),
      description: t('tools.documentData.audioFormatConverterDesc'),
      icon: <Music className="w-6 h-6" />,
      category: t('tools.documentData.converters')
    },
    {
      id: 'document-format-converter',
      name: t('tools.documentData.documentFormatConverter'),
      description: t('tools.documentData.documentFormatConverterDesc'),
      icon: <FileText className="w-6 h-6" />,
      category: t('tools.documentData.converters')
    },
    {
      id: 'encoding-converter',
      name: t('tools.documentData.encodingConverter'),
      description: t('tools.documentData.encodingConverterDesc'),
      icon: <Type className="w-6 h-6" />,
      category: t('tools.documentData.converters')
    }
  ];

  const categories = [t('tools.documentData.fileProcessing'), t('tools.documentData.textProcessing'), t('tools.documentData.developerTools'), t('tools.documentData.converters')];
  const popularTools = tools.filter(tool => tool.popular);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": t('tools.documentData.title'),
    "description": t('tools.documentData.description'),
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "permissions": "browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      t('tools.documentData.csvSplit'),
      t('tools.documentData.excelSplit'),
      t('tools.documentData.xmlToJson'),
      t('tools.documentData.wordCounter'),
      t('tools.documentData.characterCounter'),
      t('tools.documentData.caseConverter'),
      t('tools.documentData.hashGenerator'),
      t('tools.documentData.base64Encoder'),
      t('tools.documentData.urlEncoder'),
      t('tools.documentData.unitConverter'),
      t('tools.documentData.currencyConverter'),
      t('tools.documentData.numberBaseConverter')
    ]
  };

  return (
    <>
      <SEOHead seoKey="documentDataTools" />
      <StructuredData data={structuredData} />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {t('tools.documentData.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('tools.documentData.description')}
          </p>
        </div>

        {/* Popular Tools Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">🔥 {t('common.popularTools')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularTools.map((tool) => (
              <Link
                key={tool.id}
                to={`/tool/${tool.id}`}
                className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4 border border-gray-200 hover:border-purple-300"
              >
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <div className="text-purple-600">{tool.icon}</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                      {tool.name}
                    </h3>
                    <span className="text-xs text-purple-600 font-medium">{tool.category}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-xs mb-2">
                  {tool.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Tools by Category */}
        {categories.map((category) => {
          const categoryTools = tools.filter(tool => tool.category === category);
          return (
            <div key={category} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryTools.map((tool) => (
                  <Link
                    key={tool.id}
                    to={`/tool/${tool.id}`}
                    className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-purple-600 group-hover:text-purple-700 transition-colors">
                        {tool.icon}
                      </div>
                      {tool.popular && (
                        <span className="bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          {t('common.popular')}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                      {tool.name}
                    </h3>
                    
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {tool.description}
                    </p>
                    
                    <div className="flex items-center text-purple-600 text-sm font-medium">
                      <span>{t('common.useTool')}</span>
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}

        {/* Features Section */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t('common.whyChooseOurTools')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Split className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('common.smartProcessing')}</h3>
              <p className="text-gray-600 text-sm">
                {t('common.smartProcessingDesc')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ArrowRightLeft className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('common.formatConversion')}</h3>
              <p className="text-gray-600 text-sm">
                {t('common.formatConversionDesc')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Database className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('common.dataSecurity')}</h3>
              <p className="text-gray-600 text-sm">
                {t('common.dataSecurityDesc')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Code className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('common.developerFriendly')}</h3>
              <p className="text-gray-600 text-sm">
                {t('common.developerFriendlyDesc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default DocumentDataTools;