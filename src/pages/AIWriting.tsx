import { PenTool, FileText, BookOpen, MessageSquare, CheckCircle, Lightbulb, Globe, Zap } from 'lucide-react'

const AIWriting = () => {
  const aiTools = [
    {
      title: 'AI Writer',
      description: 'Generate high-quality content with AI assistance',
      icon: PenTool,
      popular: true
    },
    {
      title: 'Grammar Checker',
      description: 'Check and fix grammar, spelling, and punctuation errors',
      icon: CheckCircle,
      popular: true
    },
    {
      title: 'Paraphraser',
      description: 'Rewrite text while maintaining the original meaning',
      icon: MessageSquare,
      popular: true
    },
    {
      title: 'Summarizer',
      description: 'Create concise summaries of long texts and articles',
      icon: FileText,
      popular: true
    },
    {
      title: 'Essay Writer',
      description: 'Generate well-structured essays on any topic',
      icon: BookOpen,
      popular: false
    },
    {
      title: 'Content Ideas',
      description: 'Get creative ideas and inspiration for your content',
      icon: Lightbulb,
      popular: false
    },
    {
      title: 'Translator',
      description: 'Translate text between multiple languages accurately',
      icon: Globe,
      popular: false
    },
    {
      title: 'Text Enhancer',
      description: 'Improve text clarity, tone, and readability',
      icon: Zap,
      popular: false
    },
    {
      title: 'Plagiarism Checker',
      description: 'Check for plagiarism and ensure content originality',
      icon: CheckCircle,
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <PenTool className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Writing Tools</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Enhance your writing with AI-powered tools for grammar checking, content generation, 
            paraphrasing, and more. Perfect for students, professionals, and content creators.
          </p>
        </div>

        {/* Popular Tools Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Most Popular AI Writing Tools</h2>
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
                      Use Tool
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* All Tools Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All AI Writing Tools</h2>
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
                          Popular
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{tool.description}</p>
                  <button className="w-full bg-gray-600 text-white hover:bg-gray-700 py-2 rounded-md font-medium transition-colors">
                    Use Tool
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Powered by Advanced AI</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">🧠</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Smart AI</h3>
              <p className="text-gray-600 text-sm">Powered by state-of-the-art language models for accurate results</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold text-xl">🌍</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Multi-Language</h3>
              <p className="text-gray-600 text-sm">Support for 50+ languages with native-level accuracy</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-bold text-xl">✨</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Context Aware</h3>
              <p className="text-gray-600 text-sm">Understands context and tone for better writing suggestions</p>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-8 text-white">
            <h3 className="text-xl font-bold mb-4">For Students</h3>
            <ul className="space-y-2 text-purple-100">
              <li>• Essay writing assistance</li>
              <li>• Grammar and spell checking</li>
              <li>• Research paper summarization</li>
              <li>• Citation and reference help</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-8 text-white">
            <h3 className="text-xl font-bold mb-4">For Professionals</h3>
            <ul className="space-y-2 text-blue-100">
              <li>• Business content creation</li>
              <li>• Email and document editing</li>
              <li>• Marketing copy generation</li>
              <li>• Report and proposal writing</li>
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Start Writing with AI Today</h2>
          <p className="text-purple-100 mb-6">Join millions of users who trust our AI writing tools</p>
          <button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors">
            Try AI Writer Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default AIWriting