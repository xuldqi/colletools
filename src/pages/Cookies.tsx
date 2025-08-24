import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Cookie, Settings, Shield, BarChart, CheckCircle, XCircle } from 'lucide-react';

const Cookies: React.FC = () => {
  const [cookieSettings, setCookieSettings] = useState({
    necessary: true,
    functional: true,
    analytics: false,
    marketing: false
  });

  const handleCookieToggle = (type: keyof typeof cookieSettings) => {
    if (type === 'necessary') return; // 必要Cookie不能关闭
    setCookieSettings(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const saveCookieSettings = () => {
    // 这里可以添加保存Cookie设置的逻辑
    localStorage.setItem('cookieSettings', JSON.stringify(cookieSettings));
    alert('Cookie设置已保存');
  };

  const cookieTypes = [
    {
      id: 'necessary',
      name: '必要Cookie',
      icon: Shield,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: '这些Cookie对于网站的基本功能是必需的，无法禁用。',
      examples: [
        '会话管理',
        '安全验证',
        '基本网站功能',
        '错误监控'
      ],
      enabled: cookieSettings.necessary,
      required: true
    },
    {
      id: 'functional',
      name: '功能Cookie',
      icon: Settings,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: '这些Cookie用于增强网站功能和个性化体验。',
      examples: [
        '语言偏好',
        '主题设置',
        '用户偏好',
        '表单数据保存'
      ],
      enabled: cookieSettings.functional,
      required: false
    },
    {
      id: 'analytics',
      name: '分析Cookie',
      icon: BarChart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: '这些Cookie帮助我们了解访问者如何使用网站，以便改进服务。',
      examples: [
        '页面访问统计',
        '用户行为分析',
        '性能监控',
        '错误跟踪'
      ],
      enabled: cookieSettings.analytics,
      required: false
    },
    {
      id: 'marketing',
      name: '营销Cookie',
      icon: Cookie,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: '这些Cookie用于跟踪访问者的网站活动，目的是显示相关和个性化的广告。',
      examples: [
        '广告个性化',
        '转化跟踪',
        '重定向广告',
        '社交媒体集成'
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
            返回首页
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
            Cookie 政策
          </h1>
          <p className="text-lg text-gray-600">
            最后更新时间：2024年1月
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            什么是Cookie？
          </h2>
          <div className="space-y-4 text-gray-600">
            <p>
              Cookie是存储在您设备上的小型文本文件，当您访问网站时由网站发送到您的浏览器。
              Cookie使网站能够记住您的操作和偏好（如登录、语言、字体大小和其他显示偏好），
              这样您就不必在每次返回网站或浏览网站页面时重新输入这些信息。
            </p>
            <p>
              我们使用Cookie来改善您的浏览体验，分析网站使用情况，并提供个性化内容。
              本政策解释了我们如何使用Cookie以及您如何控制它们。
            </p>
          </div>
        </div>

        {/* Cookie Types */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            我们使用的Cookie类型
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
                            必需
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-4">
                        {type.description}
                      </p>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">用途示例：</h4>
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
                          {type.enabled ? '已启用' : '已禁用'}
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
              保存Cookie设置
            </button>
          </div>
        </div>

        {/* Third Party Cookies */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            第三方Cookie
          </h2>
          <div className="space-y-4 text-gray-600">
            <p>
              我们的网站可能包含来自第三方服务提供商的Cookie，这些服务帮助我们分析网站使用情况或提供额外功能：
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Google Analytics：</strong>用于网站流量分析和用户行为统计</li>
              <li><strong>CDN服务：</strong>用于加速内容传输和提高网站性能</li>
              <li><strong>社交媒体插件：</strong>用于社交分享功能</li>
            </ul>
            <p>
              这些第三方服务有自己的Cookie政策，我们建议您查阅相关政策以了解详情。
            </p>
          </div>
        </div>

        {/* Cookie Management */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            如何管理Cookie
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">浏览器设置</h3>
              <p className="text-gray-600 mb-4">
                大多数浏览器允许您控制Cookie设置。您可以设置浏览器拒绝Cookie，或在设置Cookie时通知您。
                但是，如果您禁用Cookie，网站的某些功能可能无法正常工作。
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Chrome</h4>
                  <p className="text-sm text-gray-600">
                    设置 → 隐私设置和安全性 → Cookie及其他网站数据
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Firefox</h4>
                  <p className="text-sm text-gray-600">
                    选项 → 隐私与安全 → Cookie和网站数据
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Safari</h4>
                  <p className="text-sm text-gray-600">
                    偏好设置 → 隐私 → Cookie和网站数据
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Edge</h4>
                  <p className="text-sm text-gray-600">
                    设置 → Cookie和站点权限 → Cookie和存储的数据
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