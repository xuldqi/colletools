import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, MapPin, Send, MessageCircle, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEOHead from '../components/SEOHead';

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 这里可以添加表单提交逻辑
    alert(t('common.submitSuccess'));
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead seoKey="contact" />
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('contact.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t('contact.contactInfo.title')}
            </h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="w-6 h-6 text-blue-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{t('contact.contactInfo.email.title')}</h3>
                    <p className="text-gray-600">support@tinywow.com</p>
                    <p className="text-sm text-gray-500 mt-1">{t('contact.contactInfo.email.description')}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MessageCircle className="w-6 h-6 text-green-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{t('contact.contactInfo.chat.title')}</h3>
                    <p className="text-gray-600">{t('contact.contactInfo.chat.description')}</p>
                    <p className="text-sm text-gray-500 mt-1">{t('contact.contactInfo.chat.hours')}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="w-6 h-6 text-red-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{t('contact.contactInfo.address.title')}</h3>
                    <p className="text-gray-600">{t('contact.contactInfo.address.line1')}</p>
                    <p className="text-gray-600">{t('contact.contactInfo.address.line2')}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="w-6 h-6 text-purple-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{t('contact.contactInfo.hours.title')}</h3>
                    <p className="text-gray-600">{t('contact.contactInfo.hours.weekdays')}</p>
                    <p className="text-gray-600">{t('contact.contactInfo.hours.saturday')}</p>
                    <p className="text-sm text-gray-500 mt-1">{t('contact.contactInfo.hours.timezone')}</p>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">{t('contact.quickLinks.title')}</h3>
                <div className="space-y-2">
                  <Link to="/help" className="block text-blue-600 hover:text-blue-800 transition-colors">
                    {t('contact.quickLinks.helpCenter')}
                  </Link>
                  <Link to="/api-docs" className="block text-blue-600 hover:text-blue-800 transition-colors">
                    {t('contact.quickLinks.apiDocs')}
                  </Link>
                  <Link to="/privacy" className="block text-blue-600 hover:text-blue-800 transition-colors">
                    {t('contact.quickLinks.privacy')}
                  </Link>
                  <Link to="/terms" className="block text-blue-600 hover:text-blue-800 transition-colors">
                    {t('contact.quickLinks.terms')}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t('contact.form.title')}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.name')} *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder={t('contact.form.namePlaceholder')}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.email')} *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder={t('contact.form.emailPlaceholder')}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.form.subject')} *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="">{t('contact.form.subjectPlaceholder')}</option>
                    <option value="general">{t('contact.form.subjects.general')}</option>
                    <option value="technical">{t('contact.form.subjects.technical')}</option>
                    <option value="bug">{t('contact.form.subjects.bug')}</option>
                    <option value="feature">{t('contact.form.subjects.feature')}</option>
                    <option value="business">{t('contact.form.subjects.business')}</option>
                    <option value="other">{t('contact.form.subjects.other')}</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.form.message')} *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical"
                    placeholder={t('contact.form.messagePlaceholder')}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full md:w-auto inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {t('contact.form.submit')}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            {t('contact.faq.title')}
          </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {t('contact.faq.questions.howToUse.question')}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t('contact.faq.questions.howToUse.answer')}
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {t('contact.faq.questions.security.question')}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t('contact.faq.questions.security.answer')}
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {t('contact.faq.questions.formats.question')}
                </h3>
                <p className="text-gray-600">
                  {t('contact.faq.questions.formats.answer')}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {t('contact.faq.questions.fileSize.question')}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t('contact.faq.questions.fileSize.answer')}
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {t('contact.faq.questions.processingTime.question')}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t('contact.faq.questions.processingTime.answer')}
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {t('contact.faq.questions.support.question')}
                </h3>
                <p className="text-gray-600">
                  {t('contact.faq.questions.support.answer')}
                </p>
              </div>
            </div>

            <div className="text-center mt-8">
              <Link
                to="/help"
                className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                {t('contact.faq.moreHelp')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;