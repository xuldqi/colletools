import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Lock, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Privacy: React.FC = () => {
  const { t } = useTranslation();
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Shield className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('privacy.title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('privacy.lastUpdated')}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Eye className="w-6 h-6 mr-2 text-blue-600" />
              {t('privacy.dataCollection.title')}
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                {t('privacy.dataCollection.description')}
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>{t('privacy.dataCollection.fileInfo')}：</strong>{t('privacy.dataCollection.fileInfoDesc')}</li>
                <li><strong>{t('privacy.dataCollection.usageData')}：</strong>{t('privacy.dataCollection.usageDataDesc')}</li>
                <li><strong>{t('privacy.dataCollection.technicalInfo')}：</strong>{t('privacy.dataCollection.technicalInfoDesc')}</li>
                <li><strong>{t('privacy.dataCollection.cookies')}：</strong>{t('privacy.dataCollection.cookiesDesc')}</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <FileText className="w-6 h-6 mr-2 text-blue-600" />
              {t('privacy.dataUsage.title')}
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>{t('privacy.dataUsage.description')}</p>
              <ul className="list-disc list-inside space-y-2">
                <li>{t('privacy.dataUsage.provideServices')}</li>
                <li>{t('privacy.dataUsage.processFiles')}</li>
                <li>{t('privacy.dataUsage.improveQuality')}</li>
                <li>{t('privacy.dataUsage.analyzeUsage')}</li>
                <li>{t('privacy.dataUsage.preventAbuse')}</li>
                <li>{t('privacy.dataUsage.complyLaws')}</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Lock className="w-6 h-6 mr-2 text-blue-600" />
              {t('privacy.dataProtection.title')}
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>{t('privacy.dataProtection.description')}</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>{t('privacy.dataProtection.autoDelete')}：</strong>{t('privacy.dataProtection.autoDeleteDesc')}</li>
                <li><strong>{t('privacy.dataProtection.encryption')}：</strong>{t('privacy.dataProtection.encryptionDesc')}</li>
                <li><strong>{t('privacy.dataProtection.accessControl')}：</strong>{t('privacy.dataProtection.accessControlDesc')}</li>
                <li><strong>{t('privacy.dataProtection.securityMonitoring')}：</strong>{t('privacy.dataProtection.securityMonitoringDesc')}</li>
                <li><strong>{t('privacy.dataProtection.regularAudit')}：</strong>{t('privacy.dataProtection.regularAuditDesc')}</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('privacy.thirdPartyServices.title')}
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>{t('privacy.thirdPartyServices.description')}</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>{t('privacy.thirdPartyServices.analytics')}：</strong>{t('privacy.thirdPartyServices.analyticsDesc')}</li>
                <li><strong>{t('privacy.thirdPartyServices.cdn')}：</strong>{t('privacy.thirdPartyServices.cdnDesc')}</li>
                <li><strong>{t('privacy.thirdPartyServices.cloudStorage')}：</strong>{t('privacy.thirdPartyServices.cloudStorageDesc')}</li>
              </ul>
              <p className="mt-4">
                {t('privacy.thirdPartyServices.note')}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('privacy.yourRights.title')}
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>{t('privacy.yourRights.description')}</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>{t('privacy.yourRights.access')}：</strong>{t('privacy.yourRights.accessDesc')}</li>
                <li><strong>{t('privacy.yourRights.correction')}：</strong>{t('privacy.yourRights.correctionDesc')}</li>
                <li><strong>{t('privacy.yourRights.deletion')}：</strong>{t('privacy.yourRights.deletionDesc')}</li>
                <li><strong>{t('privacy.yourRights.restriction')}：</strong>{t('privacy.yourRights.restrictionDesc')}</li>
                <li><strong>{t('privacy.yourRights.portability')}：</strong>{t('privacy.yourRights.portabilityDesc')}</li>
                <li><strong>{t('privacy.yourRights.objection')}：</strong>{t('privacy.yourRights.objectionDesc')}</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('privacy.cookiePolicy.title')}
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>{t('privacy.cookiePolicy.description')}</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>{t('privacy.cookiePolicy.necessary')}：</strong>{t('privacy.cookiePolicy.necessaryDesc')}</li>
                <li><strong>{t('privacy.cookiePolicy.functional')}：</strong>{t('privacy.cookiePolicy.functionalDesc')}</li>
                <li><strong>{t('privacy.cookiePolicy.analytics')}：</strong>{t('privacy.cookiePolicy.analyticsDesc')}</li>
              </ul>
              <p className="mt-4">
                {t('privacy.cookiePolicy.management')}
                <Link to="/cookies" className="text-blue-600 hover:text-blue-800 underline">
                  {t('privacy.cookiePolicy.link')}
                </Link>
                。
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('privacy.policyUpdates.title')}
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                {t('privacy.policyUpdates.description')}
              </p>
              <p>
                {t('privacy.policyUpdates.agreement')}
              </p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('privacy.contactUs.title')}
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                {t('privacy.contactUs.description')}
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>{t('privacy.contactUs.email')}</li>
                <li>{t('privacy.contactUs.address')}</li>
              </ul>
              <p className="mt-4">
                {t('privacy.contactUs.responseTime')}
              </p>
              <div className="mt-6">
                <Link
                  to="/contact"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t('privacy.contactUs.button')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Privacy;