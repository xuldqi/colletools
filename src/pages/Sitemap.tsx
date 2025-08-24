import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Map, FileText, Image, Video, Database, Eye, Wrench, Home, Info, Shield, Phone, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Sitemap: React.FC = () => {
  const { t } = useTranslation();
  const siteStructure = [
    {
      category: t('sitemap.categories.main.title'),
      icon: Home,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      links: [
        { name: t('sitemap.categories.main.links.home.name'), path: '/', description: t('sitemap.categories.main.links.home.description') },
        { name: t('sitemap.categories.main.links.about.name'), path: '/about', description: t('sitemap.categories.main.links.about.description') },
        { name: t('sitemap.categories.main.links.contact.name'), path: '/contact', description: t('sitemap.categories.main.links.contact.description') },
        { name: t('sitemap.categories.main.links.help.name'), path: '/help', description: t('sitemap.categories.main.links.help.description') },
        { name: t('sitemap.categories.main.links.apiDocs.name'), path: '/api-docs', description: t('sitemap.categories.main.links.apiDocs.description') }
      ]
    },
    {
      category: t('sitemap.categories.pdf.title'),
      icon: FileText,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      links: [
        { name: t('sitemap.categories.pdf.links.pdfToWord.name'), path: '/pdf-to-word', description: t('sitemap.categories.pdf.links.pdfToWord.description') },
        { name: t('sitemap.categories.pdf.links.pdfToExcel.name'), path: '/pdf-to-excel', description: t('sitemap.categories.pdf.links.pdfToExcel.description') },
        { name: t('sitemap.categories.pdf.links.pdfToPpt.name'), path: '/pdf-to-ppt', description: t('sitemap.categories.pdf.links.pdfToPpt.description') },
        { name: t('sitemap.categories.pdf.links.pdfToImage.name'), path: '/pdf-to-image', description: t('sitemap.categories.pdf.links.pdfToImage.description') },
        { name: t('sitemap.categories.pdf.links.wordToPdf.name'), path: '/word-to-pdf', description: t('sitemap.categories.pdf.links.wordToPdf.description') },
        { name: t('sitemap.categories.pdf.links.excelToPdf.name'), path: '/excel-to-pdf', description: t('sitemap.categories.pdf.links.excelToPdf.description') },
        { name: t('sitemap.categories.pdf.links.pptToPdf.name'), path: '/ppt-to-pdf', description: t('sitemap.categories.pdf.links.pptToPdf.description') },
        { name: t('sitemap.categories.pdf.links.imageToPdf.name'), path: '/image-to-pdf', description: t('sitemap.categories.pdf.links.imageToPdf.description') },
        { name: t('sitemap.categories.pdf.links.mergePdf.name'), path: '/merge-pdf', description: t('sitemap.categories.pdf.links.mergePdf.description') },
        { name: t('sitemap.categories.pdf.links.splitPdf.name'), path: '/split-pdf', description: t('sitemap.categories.pdf.links.splitPdf.description') },
        { name: t('sitemap.categories.pdf.links.compressPdf.name'), path: '/compress-pdf', description: t('sitemap.categories.pdf.links.compressPdf.description') },
        { name: t('sitemap.categories.pdf.links.pdfOcr.name'), path: '/pdf-ocr', description: t('sitemap.categories.pdf.links.pdfOcr.description') },
        { name: t('sitemap.categories.pdf.links.pdfSignature.name'), path: '/pdf-signature', description: t('sitemap.categories.pdf.links.pdfSignature.description') }
      ]
    },
    {
      category: t('sitemap.categories.image.title'),
      icon: Image,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      links: [
        { name: t('sitemap.categories.image.links.imageConverter.name'), path: '/image-converter', description: t('sitemap.categories.image.links.imageConverter.description') },
        { name: t('sitemap.categories.image.links.compressImage.name'), path: '/compress-image', description: t('sitemap.categories.image.links.compressImage.description') },
        { name: t('sitemap.categories.image.links.resizeImage.name'), path: '/resize-image', description: t('sitemap.categories.image.links.resizeImage.description') },
        { name: t('sitemap.categories.image.links.cropImage.name'), path: '/crop-image', description: t('sitemap.categories.image.links.cropImage.description') },
        { name: t('sitemap.categories.image.links.rotateImage.name'), path: '/rotate-image', description: t('sitemap.categories.image.links.rotateImage.description') },
        { name: t('sitemap.categories.image.links.removeBackground.name'), path: '/remove-background', description: t('sitemap.categories.image.links.removeBackground.description') },
        { name: t('sitemap.categories.image.links.removeWatermark.name'), path: '/remove-watermark', description: t('sitemap.categories.image.links.removeWatermark.description') },
        { name: t('sitemap.categories.image.links.enhanceImage.name'), path: '/enhance-image', description: t('sitemap.categories.image.links.enhanceImage.description') },
        { name: t('sitemap.categories.image.links.imageFilters.name'), path: '/image-filters', description: t('sitemap.categories.image.links.imageFilters.description') },
        { name: t('sitemap.categories.image.links.mergeImages.name'), path: '/merge-images', description: t('sitemap.categories.image.links.mergeImages.description') },
        { name: t('sitemap.categories.image.links.addWatermark.name'), path: '/add-watermark', description: t('sitemap.categories.image.links.addWatermark.description') },
        { name: t('sitemap.categories.image.links.imageBorder.name'), path: '/image-border', description: t('sitemap.categories.image.links.imageBorder.description') },
        { name: t('sitemap.categories.image.links.blurImage.name'), path: '/blur-image', description: t('sitemap.categories.image.links.blurImage.description') }
      ]
    },
    {
      category: t('sitemap.categories.video.title'),
      icon: Video,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      links: [
        { name: t('sitemap.categories.video.links.compressVideo.name'), path: '/compress-video', description: t('sitemap.categories.video.links.compressVideo.description') },
        { name: t('sitemap.categories.video.links.videoConverter.name'), path: '/video-converter', description: t('sitemap.categories.video.links.videoConverter.description') },
        { name: t('sitemap.categories.video.links.trimVideo.name'), path: '/trim-video', description: t('sitemap.categories.video.links.trimVideo.description') },
        { name: t('sitemap.categories.video.links.mergeVideos.name'), path: '/merge-videos', description: t('sitemap.categories.video.links.mergeVideos.description') },
        { name: t('sitemap.categories.video.links.rotateVideo.name'), path: '/rotate-video', description: t('sitemap.categories.video.links.rotateVideo.description') },
        { name: t('sitemap.categories.video.links.extractAudio.name'), path: '/extract-audio', description: t('sitemap.categories.video.links.extractAudio.description') },
        { name: t('sitemap.categories.video.links.videoToGif.name'), path: '/video-to-gif', description: t('sitemap.categories.video.links.videoToGif.description') },
        { name: t('sitemap.categories.video.links.editVideo.name'), path: '/edit-video', description: t('sitemap.categories.video.links.editVideo.description') },
        { name: t('sitemap.categories.video.links.videoInfo.name'), path: '/video-info', description: t('sitemap.categories.video.links.videoInfo.description') }
      ]
    },
    {
      category: t('sitemap.categories.documentData'),
      icon: Database,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      links: [
        { name: t('sitemap.tools.csvToExcel'), path: '/csv-to-excel', description: t('sitemap.descriptions.csvToExcel') },
        { name: t('sitemap.tools.excelToCsv'), path: '/excel-to-csv', description: t('sitemap.descriptions.excelToCsv') },
        { name: t('sitemap.tools.jsonToCsv'), path: '/json-to-csv', description: t('sitemap.descriptions.jsonToCsv') },
        { name: t('sitemap.tools.csvToJson'), path: '/csv-to-json', description: t('sitemap.descriptions.csvToJson') },
        { name: t('sitemap.tools.xmlToJson'), path: '/xml-to-json', description: t('sitemap.descriptions.xmlToJson') },
        { name: t('sitemap.tools.jsonToXml'), path: '/json-to-xml', description: t('sitemap.descriptions.jsonToXml') },
        { name: t('sitemap.tools.splitCsv'), path: '/split-csv', description: t('sitemap.descriptions.splitCsv') },
        { name: t('sitemap.tools.splitExcel'), path: '/split-excel', description: t('sitemap.descriptions.splitExcel') },
        { name: t('sitemap.tools.wordCounter'), path: '/word-counter', description: t('sitemap.descriptions.wordCounter') },
        { name: t('sitemap.tools.caseConverter'), path: '/case-converter', description: t('sitemap.descriptions.caseConverter') },
        { name: t('sitemap.tools.textFormatter'), path: '/text-formatter', description: t('sitemap.descriptions.textFormatter') },
        { name: t('sitemap.tools.hashGenerator'), path: '/hash-generator', description: t('sitemap.descriptions.hashGenerator') },
        { name: t('sitemap.tools.base64Encoder'), path: '/base64-encoder', description: t('sitemap.descriptions.base64Encoder') },
        { name: t('sitemap.tools.urlEncoder'), path: '/url-encoder', description: t('sitemap.descriptions.urlEncoder') },
        { name: t('sitemap.tools.jsonFormatter'), path: '/json-formatter', description: t('sitemap.descriptions.jsonFormatter') },
        { name: t('sitemap.tools.qrGenerator'), path: '/qr-generator', description: t('sitemap.descriptions.qrGenerator') },
        { name: t('sitemap.tools.passwordGenerator'), path: '/password-generator', description: t('sitemap.descriptions.passwordGenerator') },
        { name: t('sitemap.tools.uuidGenerator'), path: '/uuid-generator', description: t('sitemap.descriptions.uuidGenerator') },
        { name: t('sitemap.tools.colorPicker'), path: '/color-picker', description: t('sitemap.descriptions.colorPicker') },
        { name: t('sitemap.tools.unitConverter'), path: '/unit-converter', description: t('sitemap.descriptions.unitConverter') },
        { name: t('sitemap.tools.currencyConverter'), path: '/currency-converter', description: t('sitemap.descriptions.currencyConverter') },
        { name: t('sitemap.tools.timezoneConverter'), path: '/timezone-converter', description: t('sitemap.descriptions.timezoneConverter') },
        { name: t('sitemap.tools.dateCalculator'), path: '/date-calculator', description: t('sitemap.descriptions.dateCalculator') },
        { name: t('sitemap.tools.percentageCalculator'), path: '/percentage-calculator', description: t('sitemap.descriptions.percentageCalculator') },
        { name: t('sitemap.tools.loanCalculator'), path: '/loan-calculator', description: t('sitemap.descriptions.loanCalculator') },
        { name: t('sitemap.tools.bmiCalculator'), path: '/bmi-calculator', description: t('sitemap.descriptions.bmiCalculator') },
        { name: t('sitemap.tools.ageCalculator'), path: '/age-calculator', description: t('sitemap.descriptions.ageCalculator') },
        { name: t('sitemap.tools.randomGenerator'), path: '/random-generator', description: t('sitemap.descriptions.randomGenerator') },
        { name: t('sitemap.tools.textDiff'), path: '/text-diff', description: t('sitemap.descriptions.textDiff') },
        { name: t('sitemap.tools.regexTester'), path: '/regex-tester', description: t('sitemap.descriptions.regexTester') },
        { name: t('sitemap.tools.htmlToText'), path: '/html-to-text', description: t('sitemap.descriptions.htmlToText') },
        { name: t('sitemap.tools.markdownToHtml'), path: '/markdown-to-html', description: t('sitemap.descriptions.markdownToHtml') },
        { name: t('sitemap.tools.htmlFormatter'), path: '/html-formatter', description: t('sitemap.descriptions.htmlFormatter') },
        { name: t('sitemap.tools.cssFormatter'), path: '/css-formatter', description: t('sitemap.descriptions.cssFormatter') },
        { name: t('sitemap.tools.jsFormatter'), path: '/js-formatter', description: t('sitemap.descriptions.jsFormatter') },
        { name: t('sitemap.tools.sqlFormatter'), path: '/sql-formatter', description: t('sitemap.descriptions.sqlFormatter') },
        { name: t('sitemap.tools.fileHash'), path: '/file-hash', description: t('sitemap.descriptions.fileHash') }
      ]
    },
    {
      category: t('sitemap.categories.ocrTools'),
      icon: Eye,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      links: [
        { name: t('sitemap.tools.imageToText'), path: '/image-to-text', description: t('sitemap.descriptions.imageToText') },
        { name: t('sitemap.tools.pdfTextRecognition'), path: '/pdf-text-recognition', description: t('sitemap.descriptions.pdfTextRecognition') },
        { name: t('sitemap.tools.handwritingRecognition'), path: '/handwriting-recognition', description: t('sitemap.descriptions.handwritingRecognition') },
        { name: t('sitemap.tools.documentScanner'), path: '/document-scanner', description: t('sitemap.descriptions.documentScanner') },
        { name: t('sitemap.tools.tableRecognition'), path: '/table-recognition', description: t('sitemap.descriptions.tableRecognition') },
        { name: t('sitemap.tools.idCardRecognition'), path: '/id-card-recognition', description: t('sitemap.descriptions.idCardRecognition') },
        { name: t('sitemap.tools.bankCardRecognition'), path: '/bank-card-recognition', description: t('sitemap.descriptions.bankCardRecognition') },
        { name: t('sitemap.tools.licensePlateRecognition'), path: '/license-plate-recognition', description: t('sitemap.descriptions.licensePlateRecognition') },
        { name: t('sitemap.tools.invoiceRecognition'), path: '/invoice-recognition', description: t('sitemap.descriptions.invoiceRecognition') }
      ]
    },
    {
      category: t('sitemap.categories.legalPolicy'),
      icon: Shield,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      links: [
        { name: t('sitemap.tools.privacyPolicy'), path: '/privacy', description: t('sitemap.descriptions.privacyPolicy') },
        { name: t('sitemap.tools.termsOfService'), path: '/terms', description: t('sitemap.descriptions.termsOfService') },
        { name: t('sitemap.tools.cookiePolicy'), path: '/cookies', description: t('sitemap.descriptions.cookiePolicy') }
      ]
    }
  ];

  const totalTools = siteStructure.reduce((total, category) => {
    return total + category.links.length;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
{t('common.backToHome')}
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Map className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('sitemap.title')}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            {t('sitemap.subtitle')}
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full">
            <Wrench className="w-4 h-4 mr-2" />
{t('sitemap.totalCount', { count: totalTools })}
          </div>
        </div>

        {/* Site Structure */}
        <div className="space-y-12">
          {siteStructure.map((section, sectionIndex) => {
            const IconComponent = section.icon;
            return (
              <div key={sectionIndex} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Section Header */}
                <div className={`${section.bgColor} px-6 py-4 border-b border-gray-200`}>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-4">
                      <IconComponent className={`w-5 h-5 ${section.color}`} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {section.category}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {t('sitemap.itemCount', { count: section.links.length })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section Links */}
                <div className="p-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {section.links.map((link, linkIndex) => (
                      <Link
                        key={linkIndex}
                        to={link.path}
                        className="group block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                              {link.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                              {link.description}
                            </p>
                          </div>
                          <ArrowLeft className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transform rotate-180 transition-colors" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              {t('sitemap.stats.title')}
            </h2>
            <p className="text-blue-100 mb-6">
              {t('sitemap.stats.description', { count: totalTools })}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold">{siteStructure.find(s => s.category === t('sitemap.categories.pdfTools'))?.links.length || 0}</div>
                <div className="text-blue-200 text-sm">{t('sitemap.categories.pdfTools')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{siteStructure.find(s => s.category === t('sitemap.categories.imageTools'))?.links.length || 0}</div>
                <div className="text-blue-200 text-sm">{t('sitemap.categories.imageTools')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{siteStructure.find(s => s.category === t('sitemap.categories.videoTools'))?.links.length || 0}</div>
                <div className="text-blue-200 text-sm">{t('sitemap.categories.videoTools')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{siteStructure.find(s => s.category === t('sitemap.categories.documentData'))?.links.length || 0}</div>
                <div className="text-blue-200 text-sm">{t('sitemap.categories.documentData')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Tip */}
        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-yellow-800 mb-2">
                {t('sitemap.searchTip.title')}
              </h3>
              <p className="text-yellow-700 text-sm mb-3">
                {t('sitemap.searchTip.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  <Home className="w-4 h-4 mr-2" />
                  {t('sitemap.searchTip.backToHome')}
                </Link>
                <Link
                  to="/help"
                  className="inline-flex items-center px-4 py-2 bg-white text-yellow-600 text-sm font-medium rounded-lg border border-yellow-600 hover:bg-yellow-50 transition-colors"
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  {t('sitemap.searchTip.viewHelp')}
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center px-4 py-2 bg-white text-yellow-600 text-sm font-medium rounded-lg border border-yellow-600 hover:bg-yellow-50 transition-colors"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  {t('sitemap.searchTip.contactUs')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;