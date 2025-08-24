import React from 'react';
import { Link } from 'react-router-dom';
import { Type, Hash, RotateCcw, AlignLeft, List, ArrowUpDown, Trash2, GitCompare, Calculator } from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  popular?: boolean;
}

const TextTools: React.FC = () => {
  const tools: Tool[] = [
    {
      id: 'word-counter',
      name: '字数统计',
      description: '统计文本中的字数、字符数、段落数和行数',
      icon: <Calculator className="w-8 h-8" />,
      popular: true
    },
    {
      id: 'character-counter',
      name: '字符计数',
      description: '精确计算文本字符数，包含或不包含空格',
      icon: <Hash className="w-8 h-8" />,
      popular: true
    },
    {
      id: 'case-converter',
      name: '大小写转换',
      description: '转换文本为大写、小写、标题格式或句子格式',
      icon: <Type className="w-8 h-8" />,
      popular: true
    },
    {
      id: 'text-formatter',
      name: '文本格式化',
      description: '格式化文本，移除多余空格和换行符',
      icon: <AlignLeft className="w-8 h-8" />
    },
    {
      id: 'line-counter',
      name: '行数统计',
      description: '统计文本的总行数和非空行数',
      icon: <List className="w-8 h-8" />
    },
    {
      id: 'text-reverser',
      name: '文本反转',
      description: '反转文本内容，支持按字符或按单词反转',
      icon: <RotateCcw className="w-8 h-8" />
    },
    {
      id: 'text-sorter',
      name: '文本排序',
      description: '对文本行进行字母顺序或数字顺序排序',
      icon: <ArrowUpDown className="w-8 h-8" />
    },
    {
      id: 'duplicate-remover',
      name: '重复行删除',
      description: '删除文本中的重复行，保留唯一内容',
      icon: <Trash2 className="w-8 h-8" />
    },
    {
      id: 'text-diff',
      name: '文本差异检查',
      description: '比较两个文本的差异，高亮显示不同之处',
      icon: <GitCompare className="w-8 h-8" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            文本工具
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            强大的文本处理工具集合，帮您轻松处理各种文本操作需求
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
                <div className="text-blue-600 group-hover:text-blue-700 transition-colors">
                  {tool.icon}
                </div>
                {tool.popular && (
                  <span className="bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    热门
                  </span>
                )}
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                {tool.name}
              </h3>
              
              <p className="text-gray-600 text-sm leading-relaxed">
                {tool.description}
              </p>
              
              <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
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
              为什么选择我们的文本工具？
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">快速处理</h3>
                  <p className="text-gray-600 text-sm">即时处理文本，无需等待</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">完全免费</h3>
                  <p className="text-gray-600 text-sm">所有工具完全免费使用</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">隐私安全</h3>
                  <p className="text-gray-600 text-sm">文本处理完全在本地进行</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">易于使用</h3>
                  <p className="text-gray-600 text-sm">简洁直观的用户界面</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextTools;