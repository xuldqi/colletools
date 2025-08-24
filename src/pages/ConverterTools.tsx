import React from 'react';
import { Link } from 'react-router-dom';
import { Ruler, DollarSign, Binary, Palette, Globe, Image, Music, FileText, Type } from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  popular?: boolean;
}

const ConverterTools: React.FC = () => {
  const tools: Tool[] = [
    {
      id: 'unit-converter',
      name: '单位转换器',
      description: '长度、重量、温度、面积等各种单位间的转换',
      icon: <Ruler className="w-8 h-8" />,
      popular: true
    },
    {
      id: 'currency-converter',
      name: '货币转换器',
      description: '实时汇率查询和货币转换计算',
      icon: <DollarSign className="w-8 h-8" />,
      popular: true
    },
    {
      id: 'number-base-converter',
      name: '进制转换器',
      description: '二进制、八进制、十进制、十六进制间转换',
      icon: <Binary className="w-8 h-8" />,
      popular: true
    },
    {
      id: 'color-converter',
      name: '颜色格式转换',
      description: 'RGB、HEX、HSL、CMYK等颜色格式转换',
      icon: <Palette className="w-8 h-8" />
    },
    {
      id: 'timezone-converter',
      name: '时区转换器',
      description: '不同时区间的时间转换和计算',
      icon: <Globe className="w-8 h-8" />
    },
    {
      id: 'image-format-converter',
      name: '图片格式转换',
      description: 'JPG、PNG、WebP、GIF等图片格式转换',
      icon: <Image className="w-8 h-8" />
    },
    {
      id: 'audio-format-converter',
      name: '音频格式转换',
      description: 'MP3、WAV、AAC、FLAC等音频格式转换',
      icon: <Music className="w-8 h-8" />
    },
    {
      id: 'document-format-converter',
      name: '文档格式转换',
      description: '扩展的文档格式转换，支持更多格式',
      icon: <FileText className="w-8 h-8" />
    },
    {
      id: 'encoding-converter',
      name: '编码转换器',
      description: 'UTF-8、GBK、ASCII等字符编码转换',
      icon: <Type className="w-8 h-8" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            转换工具
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            全面的格式转换工具集合，轻松处理各种数据格式转换需求
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
                <div className="text-green-600 group-hover:text-green-700 transition-colors">
                  {tool.icon}
                </div>
                {tool.popular && (
                  <span className="bg-gradient-to-r from-green-400 to-teal-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    热门
                  </span>
                )}
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">
                {tool.name}
              </h3>
              
              <p className="text-gray-600 text-sm leading-relaxed">
                {tool.description}
              </p>
              
              <div className="mt-4 flex items-center text-green-600 text-sm font-medium">
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
              强大的转换能力
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">精确转换</h3>
                  <p className="text-gray-600 text-sm">高精度的数据格式转换</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">多格式支持</h3>
                  <p className="text-gray-600 text-sm">支持主流的各种数据格式</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">批量处理</h3>
                  <p className="text-gray-600 text-sm">支持批量文件格式转换</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">实时预览</h3>
                  <p className="text-gray-600 text-sm">转换前后效果实时对比</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConverterTools;