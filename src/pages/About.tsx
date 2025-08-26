import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Target, Award, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEOHead from '../components/SEOHead';

const About: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead seoKey="about" />
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('about.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <div className="flex items-center mb-4">
              <Target className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">{t('about.mission.title')}</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {t('about.mission.description')}
            </p>
          </div>
          <div>
            <div className="flex items-center mb-4">
              <Globe className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">{t('about.vision.title')}</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {t('about.vision.description')}
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            {t('about.whyChooseUs')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('about.features.free.title')}</h3>
              <p className="text-gray-600">
                {t('about.features.free.description')}
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('about.features.easyToUse.title')}</h3>
              <p className="text-gray-600">
                {t('about.features.easyToUse.description')}
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('about.features.secure.title')}</h3>
              <p className="text-gray-600">
                {t('about.features.secure.description')}
              </p>
            </div>
          </div>
        </div>

        {/* Tools Overview */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            {t('about.tools.title')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{t('about.tools.pdf.title')}</h3>
              <p className="text-sm text-gray-600">
                {t('about.tools.pdf.description')}
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{t('about.tools.image.title')}</h3>
              <p className="text-sm text-gray-600">
                {t('about.tools.image.description')}
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{t('about.tools.video.title')}</h3>
              <p className="text-sm text-gray-600">
                {t('about.tools.video.description')}
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{t('about.tools.ocr.title')}</h3>
              <p className="text-sm text-gray-600">
                {t('about.tools.ocr.description')}
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{t('about.tools.document.title')}</h3>
              <p className="text-sm text-gray-600">
                {t('about.tools.document.description')}
              </p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t('about.contact.title')}
          </h2>
          <p className="text-gray-600 mb-6">
            {t('about.contact.description')}
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('about.contact.button')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;