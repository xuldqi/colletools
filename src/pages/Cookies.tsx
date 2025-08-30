import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Cookie, Settings, Shield, BarChart, CheckCircle, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Cookies: React.FC = () => {
  const { t } = useTranslation();
  const [cookieSettings, setCookieSettings] = useState({
    necessary: true,
    functional: true,
    analytics: false,
    marketing: false
  });

  const handleCookieToggle = (type: keyof typeof cookieSettings) => {
    if (type === 'necessary') return; // Necessary cookies cannot be disabled
    setCookieSettings(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const saveCookieSettings = () => {
    // Here you can add logic to save cookie settings
    localStorage.setItem('cookieSettings', JSON.stringify(cookieSettings));
    alert(t('cookies.settingsSaved'));
  };

  const cookieTypes = [
    {
      id: 'necessary',
      name: t('cookies.necessary.name'),
      icon: Shield,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: t('cookies.necessary.description'),
      examples: [
        t('cookies.necessary.examples.session'),
        t('cookies.necessary.examples.security'),
        t('cookies.necessary.examples.basic'),
        t('cookies.necessary.examples.monitoring')
      ],
      enabled: cookieSettings.necessary,
      required: true
    },
    {
      id: 'functional',
      name: t('cookies.functional.name'),
      icon: Settings,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: t('cookies.functional.description'),
      examples: [
        t('cookies.functional.examples.language'),
        t('cookies.functional.examples.theme'),
        t('cookies.functional.examples.preferences'),
        t('cookies.functional.examples.forms')
      ],
      enabled: cookieSettings.functional,
      required: false
    },
    {
      id: 'analytics',
      name: t('cookies.analytics.name'),
      icon: BarChart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: t('cookies.analytics.description'),
      examples: [
        t('cookies.analytics.examples.pageViews'),
        t('cookies.analytics.examples.behavior'),
        t('cookies.analytics.examples.performance'),
        t('cookies.analytics.examples.tracking')
      ],
      enabled: cookieSettings.analytics,
      required: false
    },
    {
      id: 'marketing',
      name: t('cookies.marketing.name'),
      icon: Cookie,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: t('cookies.marketing.description'),
      examples: [
        t('cookies.marketing.examples.personalization'),
        t('cookies.marketing.examples.conversion'),
        t('cookies.marketing.examples.retargeting'),
        t('cookies.marketing.examples.social')
      ],
      enabled: cookieSettings.marketing,
      required: false
    }
  ];

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
            <Cookie className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('cookies.title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('cookies.lastUpdated')}
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t('cookies.whatAreCookies')}
          </h2>
          <div className="space-y-4 text-gray-600">
            <p>{t('cookies.intro.p1')}</p>
            <p>{t('cookies.intro.p2')}</p>
          </div>
        </div>

        {/* Cookie Types */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {t('cookies.cookieTypes')}
          </h2>
          
          <div className="space-y-6">
            {cookieTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <div key={type.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <div className={`w-10 h-10 ${type.bgColor} rounded-lg flex items-center justify-center mr-3`}>
                          <IconComponent className={`w-5 h-5 ${type.color}`} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {type.name}
                        </h3>
                        {type.required && (
                          <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                            {t('cookies.required')}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-4">
                        {type.description}
                      </p>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">{t('cookies.examplesTitle')}</h4>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {type.examples.map((example, index) => (
                            <li key={index}>{example}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="ml-6">
                      <button
                        onClick={() => handleCookieToggle(type.id as keyof typeof cookieSettings)}
                        disabled={type.required}
                        className={`flex items-center justify-center w-12 h-6 rounded-full transition-colors ${
                          type.enabled
                            ? 'bg-blue-600'
                            : 'bg-gray-300'
                        } ${type.required ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transform transition-transform ${
                          type.enabled ? 'translate-x-3' : 'translate-x-1'
                        }`} />
                      </button>
                      <div className="flex items-center mt-2">
                        {type.enabled ? (
                          <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600 mr-1" />
                        )}
                        <span className="text-xs text-gray-500">
                          {type.enabled ? t('cookies.enabled') : t('cookies.disabled')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={saveCookieSettings}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('cookies.saveSettings')}
            </button>
          </div>
        </div>

        {/* Third Party Cookies */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t('cookies.thirdParty.title')}
          </h2>
          <div className="space-y-4 text-gray-600">
            <p>{t('cookies.thirdParty.intro')}</p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>{t('cookies.thirdParty.ga.title')}：</strong>{t('cookies.thirdParty.ga.desc')}</li>
              <li><strong>{t('cookies.thirdParty.cdn.title')}：</strong>{t('cookies.thirdParty.cdn.desc')}</li>
              <li><strong>{t('cookies.thirdParty.social.title')}：</strong>{t('cookies.thirdParty.social.desc')}</li>
            </ul>
            <p>{t('cookies.thirdParty.note')}</p>
          </div>
        </div>

        {/* Cookie Management */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t('cookies.management.title')}
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('cookies.management.browserSettings')}</h3>
              <p className="text-gray-600 mb-4">{t('cookies.management.desc')}</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Chrome</h4>
                  <p className="text-sm text-gray-600">
                    {t('cookies.management.chrome')}
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Firefox</h4>
                  <p className="text-sm text-gray-600">
                    {t('cookies.management.firefox')}
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Safari</h4>
                  <p className="text-sm text-gray-600">
                    {t('cookies.management.safari')}
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Edge</h4>
                  <p className="text-sm text-gray-600">
                    {t('cookies.management.edge')}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">网站设置</h3>
              <p className="text-gray-600 mb-4">
                您可以使用上方的Cookie设置面板来控制我们网站上的Cookie使用。
                您的选择将被保存，并在您下次访问时应用。
              </p>
            </div>
          </div>
        </div>

        {/* Cookie Retention */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Cookie保留期限
          </h2>
          <div className="space-y-4 text-gray-600">
            <p>我们使用的Cookie有不同的保留期限：</p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>会话Cookie：</strong>在您关闭浏览器时自动删除</li>
              <li><strong>持久Cookie：</strong>在设定的到期日期或您手动删除时删除</li>
              <li><strong>必要Cookie：</strong>通常保留1年或直到您清除浏览器数据</li>
              <li><strong>分析Cookie：</strong>通常保留2年，用于长期趋势分析</li>
            </ul>
          </div>
        </div>

        {/* Policy Updates */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            政策更新
          </h2>
          <div className="space-y-4 text-gray-600">
            <p>
              我们可能会不时更新本Cookie政策，以反映我们做法的变化或其他运营、法律或监管原因。
              我们建议您定期查看本政策以了解最新信息。
            </p>
            <p>
              重大变更将通过网站公告或其他适当方式通知您。继续使用我们的网站即表示您同意更新后的Cookie政策。
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            联系我们
          </h2>
          <div className="space-y-4 text-gray-600">
            <p>
              如果您对我们的Cookie使用有任何疑问或需要更多信息，请联系我们：
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>邮箱：privacy@tinywow.com</li>
              <li>地址：中国上海市浦东新区</li>
            </ul>
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                联系我们
              </Link>
              <Link
                to="/privacy"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors"
              >
                查看隐私政策
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cookies;