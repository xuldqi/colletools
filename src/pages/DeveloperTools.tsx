import React from 'react';
import { Link } from 'react-router-dom';
import { Hash, Code, Link as LinkIcon, Braces, QrCode, Palette, Clock, Key, Lock } from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  popular?: boolean;
}

const DeveloperTools: React.FC = () => {
  const tools: Tool[] = [
    {
      id: 'hash-generator',
      name: 'Hash生成器',
      description: '生成MD5、SHA1、SHA256等多种哈希值',
      icon: <Hash className="w-8 h-8" />,
      popular: true
    },
    {
      id: 'base64-encoder',
      name: 'Base64编码/解码',
      description: '对文本进行Base64编码和解码操作',
      icon: <Code className="w-8 h-8" />,
      popular: true
    },
    {
      id: 'url-encoder',
      name: 'URL编码/解码',
      description: '对URL进行编码和解码，处理特殊字符',
      icon: <LinkIcon className="w-8 h-8" />,
      popular: true
    },
    {
      id: 'json-formatter',
      name: 'JSON格式化/验证',
      description: '格式化JSON数据并验证其有效性',
      icon: <Braces className="w-8 h-8" />
    },
    {
      id: 'qr-generator',
      name: '二维码生成器',
      description: '将文本或URL转换为二维码图片',
      icon: <QrCode className="w-8 h-8" />
    },
    {
      id: 'color-picker',
      name: '颜色选择器/转换',
      description: '在HEX、RGB、HSL等颜色格式间转换',
      icon: <Palette className="w-8 h-8" />
    },
    {
      id: 'timestamp-converter',
      name: '时间戳转换',
      description: 'Unix时间戳与日期时间格式互相转换',
      icon: <Clock className="w-8 h-8" />
    },
    {
      id: 'uuid-generator',
      name: 'UUID生成器',
      description: '生成各种版本的UUID唯一标识符',
      icon: <Key className="w-8 h-8" />
    },
    {
      id: 'password-generator',
      name: '密码生成器',
      description: '生成安全的随机密码，可自定义规则',
      icon: <Lock className="w-8 h-8" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            开发者工具
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            专为开发者设计的实用工具集合，提升您的开发效率
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              to={`/tool/${tool.id}`}
              className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-gray-600 group-hover:text-gray-700 transition-colors">
                  {tool.icon}
                </div>
                {tool.popular && (
                  <span className="bg-gradient-to-r from-green-400 to-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    热门
                  </span>
                )}
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-gray-600 transition-colors">
                {tool.name}
              </h3>
              
              <p className="text-gray-600 text-sm leading-relaxed">
                {tool.description}
              </p>
              
              <div className="mt-4 flex items-center text-gray-600 text-sm font-medium">
                <span>立即使用</span>
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              开发者的得力助手
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">高效便捷</h3>
                  <p className="text-gray-600 text-sm">一键完成常用开发任务</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">安全可靠</h3>
                  <p className="text-gray-600 text-sm">本地处理，保护代码安全</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">多格式支持</h3>
                  <p className="text-gray-600 text-sm">支持各种编码和数据格式</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">实时预览</h3>
                  <p className="text-gray-600 text-sm">即时查看处理结果</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperTools;