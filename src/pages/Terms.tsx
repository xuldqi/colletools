import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const Terms: React.FC = () => {
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
            <FileText className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            使用条款
          </h1>
          <p className="text-lg text-gray-600">
            最后更新时间：2024年1月
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. 服务条款接受
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                欢迎使用TinyWow在线工具平台。通过访问或使用我们的服务，您同意受本使用条款的约束。
                如果您不同意这些条款，请不要使用我们的服务。
              </p>
              <p>
                我们保留随时修改这些条款的权利。重大变更将通过网站公告通知用户。
                继续使用服务即表示您接受修改后的条款。
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-6 h-6 mr-2 text-green-600" />
              2. 服务描述
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>TinyWow提供以下在线工具服务：</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>PDF工具：</strong>PDF转换、合并、分割、压缩、OCR识别等</li>
                <li><strong>图像工具：</strong>图像转换、压缩、背景移除、水印处理等</li>
                <li><strong>视频工具：</strong>视频压缩、转换、剪辑、合并、GIF制作等</li>
                <li><strong>OCR工具：</strong>图像文字识别、PDF OCR、手写识别等</li>
                <li><strong>文档数据工具：</strong>Excel、CSV、JSON转换，文本处理等</li>
              </ul>
              <p>
                所有服务均为免费提供，我们努力确保服务的可用性和准确性，但不保证服务不会中断或完全无错误。
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. 用户责任
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>使用我们的服务时，您同意：</p>
              <ul className="list-disc list-inside space-y-2">
                <li>仅上传您拥有合法权利的文件</li>
                <li>不上传包含恶意软件、病毒或有害代码的文件</li>
                <li>不上传侵犯他人版权、商标或其他知识产权的内容</li>
                <li>不上传非法、诽谤、骚扰或不当的内容</li>
                <li>不尝试破坏或干扰我们的服务</li>
                <li>不使用自动化工具过度使用我们的服务</li>
                <li>遵守所有适用的法律法规</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <XCircle className="w-6 h-6 mr-2 text-red-600" />
              4. 禁止行为
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>以下行为是被严格禁止的：</p>
              <ul className="list-disc list-inside space-y-2">
                <li>上传包含个人敏感信息的文件（如身份证、护照等）</li>
                <li>上传受版权保护的材料（除非您拥有相应权利）</li>
                <li>上传包含暴力、色情或其他不当内容的文件</li>
                <li>尝试逆向工程、反编译或破解我们的服务</li>
                <li>使用我们的服务进行任何商业用途（除非另有协议）</li>
                <li>创建虚假账户或冒充他人</li>
                <li>传播垃圾邮件或进行其他形式的滥用</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. 知识产权
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                我们的服务、网站设计、代码、商标和所有相关知识产权均归TinyWow所有。
                未经明确授权，您不得复制、修改、分发或以其他方式使用这些材料。
              </p>
              <p>
                您上传的文件仍归您所有。通过使用我们的服务，您授予我们处理这些文件的临时许可，
                仅用于提供您请求的服务。文件处理完成后将自动删除。
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2 text-yellow-600" />
              6. 免责声明
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                我们的服务按"现状"提供，不提供任何明示或暗示的保证，包括但不限于：
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>服务的可用性、准确性或可靠性</li>
                <li>处理结果的质量或完整性</li>
                <li>服务不会中断或出现错误</li>
                <li>服务满足您的特定需求</li>
              </ul>
              <p>
                在法律允许的最大范围内，我们不对因使用或无法使用我们的服务而造成的任何直接、
                间接、偶然、特殊或后果性损害承担责任。
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. 服务限制
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>为确保服务质量，我们可能实施以下限制：</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>文件大小：</strong>单个文件最大100MB</li>
                <li><strong>处理时间：</strong>复杂任务可能需要较长处理时间</li>
                <li><strong>使用频率：</strong>可能限制单个用户的使用频率</li>
                <li><strong>文件类型：</strong>仅支持特定的文件格式</li>
                <li><strong>存储时间：</strong>文件处理完成后1小时内自动删除</li>
              </ul>
              <p>
                我们保留随时修改这些限制的权利，恕不另行通知。
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. 服务终止
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                我们保留在以下情况下暂停或终止您使用服务的权利：
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>违反本使用条款</li>
                <li>滥用我们的服务</li>
                <li>从事非法或有害活动</li>
                <li>技术维护或升级需要</li>
              </ul>
              <p>
                服务终止后，本条款中关于知识产权、免责声明和争议解决的条款仍然有效。
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. 适用法律
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                本条款受中华人民共和国法律管辖。因本条款引起的任何争议应通过友好协商解决。
                如协商不成，应提交至有管辖权的人民法院解决。
              </p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              联系我们
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                如果您对本使用条款有任何疑问，请联系我们：
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>邮箱：legal@tinywow.com</li>
                <li>地址：中国上海市浦东新区</li>
              </ul>
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

export default Terms;