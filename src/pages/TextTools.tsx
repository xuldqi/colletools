import React, { useState } from 'react';
import { 
  Type, Hash, RotateCcw, AlignLeft, List, ArrowUpDown, Trash2, GitCompare, Calculator,
  Upload, ArrowLeft, Copy
} from 'lucide-react';
import { toast } from 'sonner';
import SEOHead from '../components/SEOHead';
import StructuredData from '../components/StructuredData';
import { useTranslation } from 'react-i18next';

interface TextTool {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  popular?: boolean;
  inputType: 'single' | 'double';
  processingFunction: (input: string, input2?: string) => Promise<{ result: string; }>;
}

const TextTools: React.FC = () => {
  const { t } = useTranslation();
  const [selectedTool, setSelectedTool] = useState<TextTool | null>(null);
  const [textInput, setTextInput] = useState<string>('');
  const [textInput2, setTextInput2] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string>('');

  // 字数统计
  const processWordCounter = async (input: string) => {
    const words = input.trim().split(/\s+/).filter(word => word.length > 0);
    const characters = input.length;
    const charactersNoSpaces = input.replace(/\s/g, '').length;
    const lines = input.split('\n').length;
    const paragraphs = input.split(/\n\s*\n/).filter(p => p.trim()).length;
    const sentences = input.split(/[.!?]+/).filter(s => s.trim()).length;
    
    const result = `📊 文字统计结果\n\n• 字数：${words.length}\n• 字符数（含空格）：${characters}\n• 字符数（不含空格）：${charactersNoSpaces}\n• 行数：${lines}\n• 段落数：${paragraphs}\n• 句子数：${sentences}\n\n• 平均每行字数：${Math.round(words.length / lines)}\n• 平均每段字数：${Math.round(words.length / paragraphs)}\n• 平均每句字数：${Math.round(words.length / sentences)}`;
    
          toast.success(t('tools.text.wordCountComplete'));
    return { result };
  };

  // 字符计数
  const processCharacterCounter = async (input: string) => {
    const totalChars = input.length;
    const charsNoSpaces = input.replace(/\s/g, '').length;
    const spaces = input.split(' ').length - 1;
    const tabs = input.split('\t').length - 1;
    const newlines = input.split('\n').length - 1;
    const alphanumeric = input.replace(/[^a-zA-Z0-9]/g, '').length;
    const letters = input.replace(/[^a-zA-Z]/g, '').length;
    const numbers = input.replace(/[^0-9]/g, '').length;
    const punctuation = input.replace(/[a-zA-Z0-9\s]/g, '').length;
    
    const result = `🔢 字符统计详情\n\n📊 基础统计：\n• 总字符数：${totalChars}\n• 不含空格：${charsNoSpaces}\n• 空格数：${spaces}\n• 制表符：${tabs}\n• 换行符：${newlines}\n\n📝 字符类型：\n• 字母+数字：${alphanumeric}\n• 纯字母：${letters}\n• 纯数字：${numbers}\n• 标点符号：${punctuation}\n\n📈 占比分析：\n• 字母占比：${((letters/totalChars)*100).toFixed(1)}%\n• 数字占比：${((numbers/totalChars)*100).toFixed(1)}%\n• 空格占比：${((spaces/totalChars)*100).toFixed(1)}%`;
    
          toast.success(t('tools.text.characterCountComplete'));
    return { result };
  };

  // 大小写转换
  const processCaseConverter = async (input: string) => {
    const conversions = {
      uppercase: input.toUpperCase(),
      lowercase: input.toLowerCase(),
      titlecase: input.replace(/\w\S*/g, (txt) => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      ),
      sentencecase: input.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (match) => 
        match.toUpperCase()
      ),
      camelcase: input.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      }).replace(/\s+/g, ''),
      pascalcase: input.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => {
        return word.toUpperCase();
      }).replace(/\s+/g, ''),
      snakecase: input.toLowerCase().replace(/\s+/g, '_'),
      kebabcase: input.toLowerCase().replace(/\s+/g, '-')
    };
    
    const result = `🔄 大小写转换结果\n\n📝 基础格式：\n• 全部大写：\n${conversions.uppercase}\n\n• 全部小写：\n${conversions.lowercase}\n\n• 标题格式：\n${conversions.titlecase}\n\n• 句子格式：\n${conversions.sentencecase}\n\n💻 编程格式：\n• 驼峰命名：\n${conversions.camelcase}\n\n• 帕斯卡命名：\n${conversions.pascalcase}\n\n• 下划线命名：\n${conversions.snakecase}\n\n• 连字符命名：\n${conversions.kebabcase}`;
    
          toast.success(t('tools.text.caseConversionComplete'));
    return { result };
  };

  // 文本格式化
  const processTextFormatter = async (input: string) => {
    // 移除多余空格
    const removeExtraSpaces = input.replace(/[ \t]+/g, ' ');
    
    // 移除多余换行
    const removeExtraLines = input.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // 修正标点符号间距
    const fixPunctuation = input.replace(/\s+([,.!?;:])/g, '$1').replace(/([,.!?;:])/g, '$1 ');
    
    // 统一换行符
    const uniformLines = input.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    // 完全清理版本
    const fullyClean = input
      .replace(/[ \t]+/g, ' ')
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .replace(/\s+([,.!?;:])/g, '$1')
      .replace(/([,.!?;:])/g, '$1 ')
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .trim();
    
    const result = `🎯 文本格式化结果\n\n📝 移除多余空格：\n${removeExtraSpaces}\n\n📄 移除多余换行：\n${removeExtraLines}\n\n✏️ 修正标点间距：\n${fixPunctuation}\n\n🔄 统一换行符：\n${uniformLines}\n\n✨ 完全清理版：\n${fullyClean}\n\n📊 优化效果：\n• 原始长度：${input.length}\n• 清理后长度：${fullyClean.length}\n• 减少字符：${input.length - fullyClean.length}`;
    
          toast.success(t('tools.text.textFormattingComplete'));
    return { result };
  };

  // 行数统计
  const processLineCounter = async (input: string) => {
    const allLines = input.split('\n');
    const nonEmptyLines = allLines.filter(line => line.trim().length > 0);
    const emptyLines = allLines.length - nonEmptyLines.length;
    const longestLine = allLines.reduce((max, line) => line.length > max.length ? line : max, '');
    const shortestLine = nonEmptyLines.reduce((min, line) => line.length < min.length ? line : min, nonEmptyLines[0] || '');
    const avgLength = Math.round(nonEmptyLines.reduce((sum, line) => sum + line.length, 0) / nonEmptyLines.length);
    
    const result = `📏 行数统计详情\n\n📊 基础统计：\n• 总行数：${allLines.length}\n• 非空行数：${nonEmptyLines.length}\n• 空行数：${emptyLines}\n\n📈 行长度分析：\n• 最长行：${longestLine.length} 字符\n• 最短行：${shortestLine.length} 字符\n• 平均长度：${avgLength} 字符\n\n📝 最长行内容：\n${longestLine.substring(0, 100)}${longestLine.length > 100 ? '...' : ''}\n\n📝 最短行内容：\n${shortestLine}`;
    
          toast.success(t('tools.text.lineCountComplete'));
    return { result };
  };

  // 文本反转
  const processTextReverser = async (input: string) => {
    // 字符反转
    const charReverse = input.split('').reverse().join('');
    
    // 单词反转（保持单词内字母顺序）
    const wordReverse = input.split(' ').reverse().join(' ');
    
    // 行反转
    const lineReverse = input.split('\n').reverse().join('\n');
    
    // 句子反转
    const sentenceReverse = input.split(/([.!?]+)/).filter(s => s.trim()).reverse().join('');
    
    const result = `🔄 文本反转结果\n\n🔤 字符反转：\n${charReverse}\n\n📝 单词反转：\n${wordReverse}\n\n📄 行反转：\n${lineReverse}\n\n📚 句子反转：\n${sentenceReverse}\n\n📊 反转统计：\n• 原始长度：${input.length}\n• 反转长度：${charReverse.length}\n• 单词数量：${input.split(' ').length}\n• 行数：${input.split('\n').length}`;
    
          toast.success(t('tools.text.textReverseComplete'));
    return { result };
  };

  // 文本排序
  const processTextSorter = async (input: string) => {
    const lines = input.split('\n').filter(line => line.trim());
    
    // 字母升序
    const alphabetAsc = [...lines].sort((a, b) => a.localeCompare(b));
    
    // 字母降序
    const alphabetDesc = [...lines].sort((a, b) => b.localeCompare(a));
    
    // 长度升序
    const lengthAsc = [...lines].sort((a, b) => a.length - b.length);
    
    // 长度降序
    const lengthDesc = [...lines].sort((a, b) => b.length - a.length);
    
    // 数字排序（如果是数字）
    const numberAsc = [...lines].sort((a, b) => {
      const numA = parseFloat(a);
      const numB = parseFloat(b);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.localeCompare(b);
    });
    
    const result = `📊 文本排序结果\n\n🔤 字母升序：\n${alphabetAsc.join('\n')}\n\n🔽 字母降序：\n${alphabetDesc.join('\n')}\n\n📏 长度升序：\n${lengthAsc.join('\n')}\n\n📐 长度降序：\n${lengthDesc.join('\n')}\n\n🔢 数字排序：\n${numberAsc.join('\n')}\n\n📈 排序统计：\n• 总行数：${lines.length}\n• 最短行：${lengthAsc[0]?.length || 0} 字符\n• 最长行：${lengthDesc[0]?.length || 0} 字符`;
    
          toast.success(t('tools.text.textSortComplete'));
    return { result };
  };

  // 重复行删除
  const processDuplicateRemover = async (input: string) => {
    const lines = input.split('\n');
    const uniqueLines = [...new Set(lines)];
    const duplicateLines = lines.filter((line, index) => lines.indexOf(line) !== index);
    const uniqueDuplicates = [...new Set(duplicateLines)];
    
    const result = `🗑️ 重复行删除结果\n\n✅ 去重后文本：\n${uniqueLines.join('\n')}\n\n📊 处理统计：\n• 原始行数：${lines.length}\n• 去重后行数：${uniqueLines.length}\n• 删除重复行：${lines.length - uniqueLines.length}\n• 重复内容种类：${uniqueDuplicates.length}\n\n🔍 发现的重复内容：\n${uniqueDuplicates.slice(0, 10).join('\n')}${uniqueDuplicates.length > 10 ? '\n...(仅显示前10个)' : ''}`;
    
          toast.success(t('tools.text.duplicateRemovalComplete'));
    return { result };
  };

  // 文本差异检查
  const processTextDiff = async (input: string, input2?: string) => {
    if (!input2) {
      throw new Error('需要两个文本进行比较');
    }
    
    const lines1 = input.split('\n');
    const lines2 = input2.split('\n');
    const maxLines = Math.max(lines1.length, lines2.length);
    
    const differences = [];
    let sameLines = 0;
    let differentLines = 0;
    
    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i] || '[空行]';
      const line2 = lines2[i] || '[空行]';
      
      if (line1 === line2) {
        sameLines++;
      } else {
        differentLines++;
        differences.push(`第${i + 1}行：\n< ${line1}\n> ${line2}\n`);
      }
    }
    
    const similarity = ((sameLines / maxLines) * 100).toFixed(1);
    
    const result = `🔍 文本差异分析\n\n📊 比较统计：\n• 总行数：${maxLines}\n• 相同行数：${sameLines}\n• 不同行数：${differentLines}\n• 相似度：${similarity}%\n\n📝 差异详情：\n${differences.slice(0, 20).join('\n')}${differences.length > 20 ? '\n...(仅显示前20个差异)' : ''}\n\n📈 文本长度对比：\n• 文本1：${input.length} 字符\n• 文本2：${input2.length} 字符\n• 长度差：${Math.abs(input.length - input2.length)} 字符`;
    
          toast.success(t('tools.text.textDiffComplete'));
    return { result };
  };

  const tools: TextTool[] = [
    {
      id: 'word-counter',
      name: '字数统计',
      description: '统计文本中的字数、字符数、段落数和行数',
      icon: Calculator,
      popular: true,
      inputType: 'single',
      processingFunction: processWordCounter
    },
    {
      id: 'character-counter',
      name: '字符计数',
      description: '精确计算文本字符数，包含详细分类统计',
      icon: Hash,
      popular: true,
      inputType: 'single',
      processingFunction: processCharacterCounter
    },
    {
      id: 'case-converter',
      name: '大小写转换',
      description: '转换文本为大写、小写、标题格式等多种格式',
      icon: Type,
      popular: true,
      inputType: 'single',
      processingFunction: processCaseConverter
    },
    {
      id: 'text-formatter',
      name: '文本格式化',
      description: '格式化文本，移除多余空格和换行符',
      icon: AlignLeft,
      inputType: 'single',
      processingFunction: processTextFormatter
    },
    {
      id: 'line-counter',
      name: '行数统计',
      description: '统计文本的总行数、非空行数及行长度分析',
      icon: List,
      inputType: 'single',
      processingFunction: processLineCounter
    },
    {
      id: 'text-reverser',
      name: '文本反转',
      description: '反转文本内容，支持字符、单词、行等多种反转',
      icon: RotateCcw,
      inputType: 'single',
      processingFunction: processTextReverser
    },
    {
      id: 'text-sorter',
      name: '文本排序',
      description: '对文本行进行多种排序方式（字母、长度、数字）',
      icon: ArrowUpDown,
      inputType: 'single',
      processingFunction: processTextSorter
    },
    {
      id: 'duplicate-remover',
      name: '重复行删除',
      description: '删除文本中的重复行，保留唯一内容',
      icon: Trash2,
      inputType: 'single',
      processingFunction: processDuplicateRemover
    },
    {
      id: 'text-diff',
      name: '文本差异检查',
      description: '比较两个文本的差异，显示详细差异信息',
      icon: GitCompare,
      inputType: 'double',
      processingFunction: processTextDiff
    }
  ];

  const handleProcess = async () => {
    if (!selectedTool) {
      toast.error(t('tools.text.selectToolFirst'));
      return;
    }

    if (!textInput.trim()) {
      toast.error(t('tools.text.enterText'));
      return;
    }

    if (selectedTool.inputType === 'double' && !textInput2.trim()) {
      toast.error(t('tools.text.enterSecondText'));
      return;
    }

    setIsProcessing(true);

    try {
      const processResult = await selectedTool.processingFunction(
        textInput, 
        selectedTool.inputType === 'double' ? textInput2 : undefined
      );
      setResult(processResult.result);
    } catch (error) {
      console.error(t('tools.text.processingErrorLog'), error);
      toast.error((error as Error).message || t('common.processingFailedRetry'));
    } finally {
      setIsProcessing(false);
    }
  };

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      toast.success(t('tools.text.copySuccess'));
    }
  };

  const resetTool = () => {
    setSelectedTool(null);
    setTextInput('');
    setTextInput2('');
    setResult('');
  };

  const selectTool = (tool: TextTool) => {
    setSelectedTool(tool);
    setTextInput('');
    setTextInput2('');
    setResult('');
  };

  if (selectedTool) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                  <selectedTool.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedTool.name}
                  </h2>
                  <p className="text-gray-600">{selectedTool.description}</p>
                </div>
              </div>
              <button
                onClick={resetTool}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('common.back')}</span>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('tools.text.inputText')}
                </label>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('tools.text.enterTextPlaceholder')}
                />
              </div>

              {selectedTool.inputType === 'double' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('tools.text.inputSecondText')}
                  </label>
                  <textarea
                    value={textInput2}
                    onChange={(e) => setTextInput2(e.target.value)}
                    className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('tools.text.enterSecondTextPlaceholder')}
                  />
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={handleProcess}
                  disabled={isProcessing || !textInput.trim() || (selectedTool.inputType === 'double' && !textInput2.trim())}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isProcessing ? t('common.processing') : t('common.startProcessing')}
                </button>
              </div>

              {result && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{t('tools.text.processingResult')}</h3>
                    <button
                      onClick={copyResult}
                      className="flex items-center space-x-2 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      <span>{t('tools.text.copy')}</span>
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border max-h-80 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800">
                      {result}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead seoKey="textTools" />
      <StructuredData type="SoftwareApplication" />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Type className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">文本工具</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              强大的文本处理工具集合，帮您轻松处理各种文本操作需求
            </p>
          </div>

          {/* Popular Tools Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🔥 热门工具</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.filter(tool => tool.popular).map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <div
                    key={tool.id}
                    onClick={() => selectTool(tool)}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer group"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {tool.name}
                        </h3>
                        {tool.popular && (
                          <span className="text-sm text-blue-600">热门工具</span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{tool.description}</p>
                    <button className="w-full bg-blue-600 text-white hover:bg-blue-700 py-2 rounded-md font-medium transition-colors">
                      使用工具
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* All Tools Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">所有文本工具</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <div
                    key={tool.id}
                    onClick={() => selectTool(tool)}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 border border-gray-100 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <IconComponent className="w-6 h-6 text-blue-600 group-hover:text-blue-700 transition-colors" />
                      {tool.popular && (
                        <span className="bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          热门
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                      {tool.name}
                    </h3>
                    
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {tool.description}
                    </p>
                    
                    <div className="flex items-center text-blue-600 text-sm font-medium">
                      <span>使用工具</span>
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">为什么选择我们的文本工具？</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">精确统计</h3>
                <p className="text-gray-600 text-sm">
                  提供详细的文本统计信息，包括字数、字符、行数等
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Type className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">格式转换</h3>
                <p className="text-gray-600 text-sm">
                  支持多种文本格式转换，满足不同场景需求
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Hash className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">实时处理</h3>
                <p className="text-gray-600 text-sm">
                  即时处理文本，无需等待，本地化处理保护隐私
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ArrowUpDown className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">智能排序</h3>
                <p className="text-gray-600 text-sm">
                  多种排序方式，支持字母、长度、数字等排序
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TextTools;