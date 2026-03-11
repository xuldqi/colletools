import { PenTool, FileText, BookOpen, MessageSquare, CheckCircle, Lightbulb, Globe, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import PageHero from '../components/PageHero'

const AIWriting = () => {
  const { i18n } = useTranslation()
  const isZh = i18n.language.startsWith('zh')
  const aiTools = [
    {
      title: isZh ? 'AI 写作助手' : 'AI Writer',
      description: isZh ? '用 AI 快速生成高质量内容' : 'Generate high-quality content with AI assistance',
      icon: PenTool,
      popular: true
    },
    {
      title: isZh ? '语法检查' : 'Grammar Checker',
      description: isZh ? '检查并修复语法、拼写与标点错误' : 'Check and fix grammar, spelling, and punctuation errors',
      icon: CheckCircle,
      popular: true
    },
    {
      title: isZh ? '改写器' : 'Paraphraser',
      description: isZh ? '在保持原意的前提下改写文本' : 'Rewrite text while maintaining the original meaning',
      icon: MessageSquare,
      popular: true
    },
    {
      title: isZh ? '摘要生成' : 'Summarizer',
      description: isZh ? '将长文本快速提炼成摘要' : 'Create concise summaries of long texts and articles',
      icon: FileText,
      popular: true
    },
    {
      title: isZh ? '作文生成' : 'Essay Writer',
      description: isZh ? '围绕任意主题生成结构化文章' : 'Generate well-structured essays on any topic',
      icon: BookOpen,
      popular: false
    },
    {
      title: isZh ? '灵感推荐' : 'Content Ideas',
      description: isZh ? '获取内容创作灵感与选题建议' : 'Get creative ideas and inspiration for your content',
      icon: Lightbulb,
      popular: false
    },
    {
      title: isZh ? '翻译器' : 'Translator',
      description: isZh ? '多语言文本准确翻译' : 'Translate text between multiple languages accurately',
      icon: Globe,
      popular: false
    },
    {
      title: isZh ? '文本润色' : 'Text Enhancer',
      description: isZh ? '提升文本清晰度、语气和可读性' : 'Improve text clarity, tone, and readability',
      icon: Zap,
      popular: false
    },
    {
      title: isZh ? '查重检测' : 'Plagiarism Checker',
      description: isZh ? '检测重复内容并提升原创性' : 'Check for plagiarism and ensure content originality',
      icon: CheckCircle,
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHero
          title={isZh ? 'AI 写作工具' : 'AI Writing Tools'}
          subtitle={isZh ? '用于写作生成、润色、改写与语法检查的 AI 工具集合。' : 'A set of AI tools for writing, rewriting, grammar, and polishing.'}
          icon={PenTool}
          iconBgClassName="bg-purple-100"
          iconTextClassName="text-purple-700"
        />

        {/* Popular Tools Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{isZh ? '热门 AI 写作工具' : 'Most Popular AI Writing Tools'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aiTools.filter(tool => tool.popular).map((tool) => {
              const IconComponent = tool.icon
              return (
                <div key={tool.title} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer group">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors mb-2">
                      {tool.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">{tool.description}</p>
                    <button className="w-full bg-purple-600 text-white hover:bg-purple-700 py-2 rounded-md font-medium transition-colors">
                      {isZh ? '使用工具' : 'Use Tool'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* All Tools Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{isZh ? '全部 AI 写作工具' : 'All AI Writing Tools'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiTools.map((tool) => {
              const IconComponent = tool.icon
              return (
                <div key={tool.title} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer group">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                      <IconComponent className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                        {tool.title}
                      </h3>
                      {tool.popular && (
                        <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                          {isZh ? '热门' : 'Popular'}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{tool.description}</p>
                  <button className="w-full bg-gray-600 text-white hover:bg-gray-700 py-2 rounded-md font-medium transition-colors">
                    {isZh ? '使用工具' : 'Use Tool'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{isZh ? '由先进 AI 驱动' : 'Powered by Advanced AI'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-600 font-bold text-xl">🧠</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{isZh ? '智能模型' : 'Smart AI'}</h3>
              <p className="text-gray-600 text-sm">{isZh ? '基于先进语言模型，提供稳定准确结果' : 'Powered by state-of-the-art language models for accurate results'}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold text-xl">🌍</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{isZh ? '多语言支持' : 'Multi-Language'}</h3>
              <p className="text-gray-600 text-sm">{isZh ? '支持多语言写作与翻译场景' : 'Support for 50+ languages with native-level accuracy'}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-bold text-xl">✨</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{isZh ? '上下文理解' : 'Context Aware'}</h3>
              <p className="text-gray-600 text-sm">{isZh ? '理解上下文与语气，建议更贴合场景' : 'Understands context and tone for better writing suggestions'}</p>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-8 text-white">
            <h3 className="text-xl font-bold mb-4">{isZh ? '学生场景' : 'For Students'}</h3>
            <ul className="space-y-2 text-purple-100">
              <li>• {isZh ? '作文与论文写作辅助' : 'Essay writing assistance'}</li>
              <li>• {isZh ? '语法与拼写检查' : 'Grammar and spell checking'}</li>
              <li>• {isZh ? '文献与论文摘要' : 'Research paper summarization'}</li>
              <li>• {isZh ? '引用与参考格式辅助' : 'Citation and reference help'}</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg p-8 text-white">
            <h3 className="text-xl font-bold mb-4">{isZh ? '职场场景' : 'For Professionals'}</h3>
            <ul className="space-y-2 text-primary-100">
              <li>• {isZh ? '商业内容创作' : 'Business content creation'}</li>
              <li>• {isZh ? '邮件与文档润色' : 'Email and document editing'}</li>
              <li>• {isZh ? '营销文案生成' : 'Marketing copy generation'}</li>
              <li>• {isZh ? '报告与提案撰写' : 'Report and proposal writing'}</li>
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">{isZh ? '立即开始 AI 写作' : 'Start Writing with AI Today'}</h2>
          <p className="text-purple-100 mb-6">{isZh ? '让写作更快、更清晰、更专业' : 'Join millions of users who trust our AI writing tools'}</p>
          <button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors">
            {isZh ? '立即体验' : 'Try AI Writer Now'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AIWriting
