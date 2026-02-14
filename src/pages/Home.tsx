import { Link } from 'react-router-dom'
import { FileText, Image, Video, Scan, Settings, Calculator, Mail, Calendar, Quote, Headphones, Shuffle, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import SEOHead from '../components/SEOHead'

const CATEGORIES = [
  {
    id: 'study',
    titleKey: 'nav.categories.study',
    tools: [
      { title: 'Grade Calculator', href: '/grade-calc', icon: Calculator, color: 'bg-indigo-500' },
      { title: 'Email Gen', href: '/email-gen', icon: Mail, color: 'bg-violet-500' },
      { title: 'Deadlines', href: '/deadlines', icon: Calendar, color: 'bg-pink-500' },
      { title: 'Citation', href: '/citation', icon: Quote, color: 'bg-primary-500' },
      { title: 'Pomodoro', href: '/pomodoro', icon: Headphones, color: 'bg-amber-500' },
      { title: 'Decision', href: '/decision', icon: Shuffle, color: 'bg-emerald-500' },
    ],
  },
  {
    id: 'document',
    titleKey: 'nav.categories.document',
    tools: [
      { href: '/pdf-tools', icon: FileText, color: 'bg-red-500', titleKey: 'nav.pdfTools' },
      { href: '/ocr-tools', icon: Scan, color: 'bg-purple-500', titleKey: 'nav.ocrTools' },
    ],
  },
  {
    id: 'media',
    titleKey: 'nav.categories.media',
    tools: [
      { href: '/image-tools', icon: Image, color: 'bg-green-500', titleKey: 'nav.imageTools' },
      { href: '/video-tools', icon: Video, color: 'bg-primary-500', titleKey: 'nav.videoTools' },
    ],
  },
  {
    id: 'data',
    titleKey: 'nav.categories.data',
    tools: [
      { href: '/document-data-tools', icon: Settings, color: 'bg-indigo-600', titleKey: 'nav.documentDataTools' },
    ],
  },
  {
    id: 'ai',
    titleKey: 'nav.categories.ai',
    tools: [
      { href: '/ai-writing', icon: Sparkles, color: 'bg-amber-500', titleKey: 'nav.aiTools' },
    ],
  },
]

export default function Home() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen">
      <SEOHead seoKey="home" />
      {/* Hero - 精简现代 */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight">
            ColleTools
            <span className="block text-primary-300 text-xl md:text-2xl font-normal mt-2">{t('home.heroSubtitle')}</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">{t('home.heroDescription')}</p>
        </div>
      </section>

      {/* 统一工具网格 - 按分类 */}
      <section className="py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-10">
            {CATEGORIES.map((cat) => (
              <div key={cat.id}>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  {t(cat.titleKey)}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {cat.tools.map((tool) => {
                    const Icon = tool.icon
                    const title = 'titleKey' in tool ? t(tool.titleKey) : tool.title
                    return (
                      <Link
                        key={tool.href}
                        to={tool.href}
                        className="flex flex-col items-center p-4 rounded-xl bg-white border border-slate-100 hover:border-primary-200 hover:shadow-soft hover:-translate-y-0.5 transition-all"
                      >
                        <div className={`w-10 h-10 ${tool.color} rounded-lg flex items-center justify-center mb-2`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 text-center">{title}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 特性 - 单行 */}
      <section className="py-8 px-4 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-8 text-center text-sm text-gray-600">
          <span>🆓 {t('home.features.free.title')}</span>
          <span>🔒 {t('home.features.secure.title')}</span>
          <span>⚡ {t('home.features.fast.title')}</span>
        </div>
      </section>
    </div>
  )
}
