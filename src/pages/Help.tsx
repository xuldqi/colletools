import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, HelpCircle, FileText, Image, Video, Eye, Database, ChevronDown, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Help: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState<string[]>(['getting-started']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const toolCategories = [
    {
      id: 'pdf',
      name: t('help.categories.pdf.title'),
      icon: FileText,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      tools: [
        t('help.categories.pdf.tools.0'), t('help.categories.pdf.tools.1'), t('help.categories.pdf.tools.2'), t('help.categories.pdf.tools.3'),
        t('help.categories.pdf.tools.4'), t('help.categories.pdf.tools.5'), t('help.categories.pdf.tools.6'), t('help.categories.pdf.tools.7')
      ]
    },
    {
      id: 'image',
      name: t('help.categories.image.title'),
      icon: Image,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      tools: [
        t('help.categories.image.tools.0'), t('help.categories.image.tools.1'), t('help.categories.image.tools.2'), t('help.categories.image.tools.3'),
        t('help.categories.image.tools.4'), t('help.categories.image.tools.5'), t('help.categories.image.tools.6'), t('help.categories.image.tools.7')
      ]
    },
    {
      id: 'video',
      name: t('help.categories.video.title'),
      icon: Video,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      tools: [
        t('help.categories.video.tools.0'), t('help.categories.video.tools.1'), t('help.categories.video.tools.2'), t('help.categories.video.tools.3'),
        t('help.categories.video.tools.4'), t('help.categories.video.tools.5'), t('help.categories.video.tools.6'), t('help.categories.video.tools.7')
      ]
    },
    {
      id: 'ocr',
      name: t('help.categories.ocr.title'),
      icon: Eye,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      tools: [
        t('help.categories.ocr.tools.0'), t('help.categories.ocr.tools.1'), t('help.categories.ocr.tools.2'), t('help.categories.ocr.tools.3'),
        t('help.categories.ocr.tools.4'), t('help.categories.ocr.tools.5'), t('help.categories.ocr.tools.6'), t('help.categories.ocr.tools.7')
      ]
    },
    {
      id: 'document',
      name: t('help.categories.document.title'),
      icon: Database,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      tools: [
        t('help.categories.document.tools.0'), t('help.categories.document.tools.1'), t('help.categories.document.tools.2'), t('help.categories.document.tools.3'),
        t('help.categories.document.tools.4'), t('help.categories.document.tools.5'), t('help.categories.document.tools.6'), t('help.categories.document.tools.7')
      ]
    }
  ];

  const faqSections = [
    {
      id: 'getting-started',
      title: t('help.faq.sections.gettingStarted.title'),
      questions: [
        {
          q: t('help.faq.sections.gettingStarted.questions.howToStart.question'),
          a: t('help.faq.sections.gettingStarted.questions.howToStart.answer')
        },
        {
          q: t('help.faq.sections.gettingStarted.questions.supportedFormats.question'),
          a: t('help.faq.sections.gettingStarted.questions.supportedFormats.answer')
        },
        {
          q: t('help.faq.sections.gettingStarted.questions.fileSize.question'),
          a: t('help.faq.sections.gettingStarted.questions.fileSize.answer')
        }
      ]
    },
    {
      id: 'security',
      title: t('help.faq.sections.security.title'),
      questions: [
        {
          q: t('help.faq.sections.security.questions.fileSafety.question'),
          a: t('help.faq.sections.security.questions.fileSafety.answer')
        },
        {
          q: t('help.faq.sections.security.questions.fileStorage.question'),
          a: t('help.faq.sections.security.questions.fileStorage.answer')
        },
        {
          q: t('help.faq.sections.security.questions.sensitiveFiles.question'),
          a: t('help.faq.sections.security.questions.sensitiveFiles.answer')
        }
      ]
    },
    {
      id: 'technical',
      title: t('help.faq.sections.technical.title'),
      questions: [
        {
          q: t('help.faq.sections.technical.questions.processingFailed.question'),
          a: t('help.faq.sections.technical.questions.processingFailed.answer')
        },
        {
          q: t('help.faq.sections.technical.questions.slowProcessing.question'),
          a: t('help.faq.sections.technical.questions.slowProcessing.answer')
        },
        {
          q: t('help.faq.sections.technical.questions.contactSupport.question'),
          a: t('help.faq.sections.technical.questions.contactSupport.answer')
        }
      ]
    },
    {
      id: 'quality',
      title: t('help.faq.sections.quality.title'),
      questions: [
        {
          q: t('help.faq.sections.quality.questions.processingQuality.question'),
          a: t('help.faq.sections.quality.questions.processingQuality.answer')
        },
        {
          q: t('help.faq.sections.quality.questions.ocrAccuracy.question'),
          a: t('help.faq.sections.quality.questions.ocrAccuracy.answer')
        },
        {
          q: t('help.faq.sections.quality.questions.compressionQuality.question'),
          a: t('help.faq.sections.quality.questions.compressionQuality.answer')
        }
      ]
    }
  ];

  const filteredFAQ = faqSections.map(section => ({
    ...section,
    questions: section.questions.filter(
      item => 
        item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(section => section.questions.length > 0);

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
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <HelpCircle className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('help.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            {t('help.subtitle')}
          </p>
          
          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t('help.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Tool Categories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            {t('help.toolCategoriesTitle')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {toolCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <div key={category.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 ${category.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                    <IconComponent className={`w-6 h-6 ${category.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {category.name}
                  </h3>
                  <div className="space-y-1">
                    {category.tools.slice(0, 4).map((tool, index) => (
                      <p key={index} className="text-sm text-gray-600">
                        • {tool}
                      </p>
                    ))}
                    {category.tools.length > 4 && (
                      <p className="text-sm text-gray-500">
                        + {category.tools.length - 4} {t('help.moreTools')}
                      </p>
                    )}
                  </div>
                  <Link
                    to={`/${category.id}`}
                    className={`inline-block mt-4 text-sm font-medium ${category.color} hover:underline`}
                  >
                    {t('help.viewAllTools')} →
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            {t('help.faq.title')}
          </h2>
          
          <div className="space-y-6">
            {(searchTerm ? filteredFAQ : faqSections).map((section) => (
              <div key={section.id} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900">
                    {section.title}
                  </h3>
                  {expandedSections.includes(section.id) ? (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                
                {expandedSections.includes(section.id) && (
                  <div className="px-6 pb-4">
                    <div className="space-y-4">
                      {section.questions.map((item, index) => (
                        <div key={index} className="border-l-4 border-blue-200 pl-4">
                          <h4 className="font-medium text-gray-900 mb-2">
                            {item.q}
                          </h4>
                          <p className="text-gray-600 leading-relaxed">
                            {item.a}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {searchTerm && filteredFAQ.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">{t('help.noResults')}</p>
              <button
                onClick={() => setSearchTerm('')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {t('help.clearSearch')}
              </button>
            </div>
          )}
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <div className="bg-blue-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('help.contact.title')}
            </h2>
            <p className="text-gray-600 mb-6">
              {t('help.contact.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
{t('help.contact.supportButton')}
              </Link>
              <Link
                to="/api-docs"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors"
              >
{t('help.contact.apiDocsButton')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;