import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Lock, FileText } from 'lucide-react';

const Privacy: React.FC = () => {
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
            <Shield className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            隐私政策
          </h1>
          <p className="text-lg text-gray-600">
            最后更新时间：2024年1月
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Eye className="w-6 h-6 mr-2 text-blue-600" />
              信息收集
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                我们致力于保护您的隐私。当您使用我们的服务时，我们可能会收集以下信息：
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>文件信息：</strong>您上传的文件仅用于处理目的，处理完成后会自动删除</li>
                <li><strong>使用数据：</strong>匿名的使用统计信息，用于改进我们的服务</li>
                <li><strong>技术信息：</strong>IP地址、浏览器类型、设备信息等技术数据</li>
                <li><strong>Cookie：</strong>用于改善用户体验的必要Cookie</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <FileText className="w-6 h-6 mr-2 text-blue-600" />
              信息使用
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>我们收集的信息仅用于以下目的：</p>
              <ul className="list-disc list-inside space-y-2">
                <li>提供和维护我们的服务</li>
                <li>处理您上传的文件</li>
                <li>改进我们的服务质量</li>
                <li>分析服务使用情况</li>
                <li>防止滥用和欺诈行为</li>
                <li>遵守法律法规要求</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Lock className="w-6 h-6 mr-2 text-blue-600" />
              数据保护
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>我们采取以下措施保护您的数据安全：</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>自动删除：</strong>上传的文件在处理完成后1小时内自动删除</li>
                <li><strong>加密传输：</strong>所有数据传输均采用SSL/TLS加密</li>
                <li><strong>访问控制：</strong>严格限制对用户数据的访问权限</li>
                <li><strong>安全监控：</strong>持续监控系统安全状态</li>
                <li><strong>定期审计：</strong>定期进行安全审计和漏洞扫描</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              第三方服务
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>我们可能使用以下第三方服务来改善用户体验：</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>分析服务：</strong>用于了解网站使用情况的匿名分析工具</li>
                <li><strong>CDN服务：</strong>用于加速内容传输的内容分发网络</li>
                <li><strong>云存储：</strong>用于临时存储处理文件的安全云服务</li>
              </ul>
              <p className="mt-4">
                这些第三方服务都有自己的隐私政策，我们建议您查阅相关政策。
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              您的权利
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>根据适用的数据保护法律，您享有以下权利：</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>访问权：</strong>了解我们收集了您的哪些个人信息</li>
                <li><strong>更正权：</strong>要求更正不准确的个人信息</li>
                <li><strong>删除权：</strong>要求删除您的个人信息</li>
                <li><strong>限制处理权：</strong>在特定情况下限制对您信息的处理</li>
                <li><strong>数据可携权：</strong>以结构化格式获取您的个人信息</li>
                <li><strong>反对权：</strong>反对我们处理您的个人信息</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Cookie 政策
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>我们使用Cookie来改善您的浏览体验：</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>必要Cookie：</strong>确保网站正常运行所必需的Cookie</li>
                <li><strong>功能Cookie：</strong>记住您的偏好设置</li>
                <li><strong>分析Cookie：</strong>帮助我们了解网站使用情况</li>
              </ul>
              <p className="mt-4">
                您可以通过浏览器设置管理Cookie偏好。详细信息请查看我们的
                <Link to="/cookies" className="text-blue-600 hover:text-blue-800 underline">
                  Cookie政策
                </Link>
                。
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              政策更新
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                我们可能会不时更新本隐私政策。重大变更将通过网站公告或其他适当方式通知您。
                建议您定期查看本政策以了解最新信息。
              </p>
              <p>
                继续使用我们的服务即表示您同意更新后的隐私政策。
              </p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              联系我们
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                如果您对本隐私政策有任何疑问或需要行使您的权利，请通过以下方式联系我们：
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>邮箱：privacy@tinywow.com</li>
                <li>地址：中国上海市浦东新区</li>
              </ul>
              <p className="mt-4">
                我们将在收到您的请求后30天内回复。
              </p>
              <div className="mt-6">
                <Link
                  to="/contact"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  联系我们
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