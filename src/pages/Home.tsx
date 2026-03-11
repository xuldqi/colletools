import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowRight,
  Calendar,
  Calculator,
  FileText,
  Gauge,
  Headphones,
  Image,
  LayoutGrid,
  Link2,
  Mail,
  Quote,
  Rocket,
  Scan,
  Settings,
  ShieldCheck,
  Sparkles,
  Shuffle,
  Video
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import SEOHead from '../components/SEOHead'

interface HomeTool {
  title?: string
  titleKey?: string
  href: string
  icon: LucideIcon
  color: string
}

interface HomeCategory {
  id: string
  titleKey: string
  tools: HomeTool[]
}

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
] satisfies HomeCategory[]

const CATEGORY_DECOR: Record<string, { badge: string; card: string; icon: string }> = {
  study: {
    badge: 'bg-rose-100 text-rose-700',
    card: 'from-rose-50 to-orange-50 border-rose-100 hover:border-rose-200',
    icon: 'bg-rose-500'
  },
  document: {
    badge: 'bg-blue-100 text-blue-700',
    card: 'from-blue-50 to-cyan-50 border-blue-100 hover:border-blue-200',
    icon: 'bg-blue-500'
  },
  media: {
    badge: 'bg-emerald-100 text-emerald-700',
    card: 'from-emerald-50 to-teal-50 border-emerald-100 hover:border-emerald-200',
    icon: 'bg-emerald-500'
  },
  data: {
    badge: 'bg-indigo-100 text-indigo-700',
    card: 'from-indigo-50 to-slate-50 border-indigo-100 hover:border-indigo-200',
    icon: 'bg-indigo-600'
  },
  ai: {
    badge: 'bg-amber-100 text-amber-700',
    card: 'from-amber-50 to-yellow-50 border-amber-100 hover:border-amber-200',
    icon: 'bg-amber-500'
  }
}

export default function Home() {
  const { t, i18n } = useTranslation()
  const isZh = i18n.language.startsWith('zh')
  const copy = {
    badge: isZh ? '工具入口升级版' : 'Upgraded Tool Hub',
    openAllTools: isZh ? '打开全站入口' : 'Open All Tools',
    startWithStudy: isZh ? '先用学生工具' : 'Start with Study Tools',
    unifiedEntry: isZh ? '统一入口，快速直达' : 'Unified entry, fast access',
    startHereTitle: isZh ? '今天从这里开始' : 'Start Here Today',
    startHereSub: isZh ? '核心工具一屏直达' : 'Core tools in one screen',
    newFeature: isZh ? '新增能力' : 'New',
    newFeatureDesc: isZh ? '外部站点与站内工具统一入口已接入' : 'External sites and internal tools are now in one hub',
    viewNow: isZh ? '立即查看' : 'View Now',
    collectionTag: isZh ? '工具分类' : 'Tool Collections',
    toolCollections: isZh ? '分类入口' : 'Tool Collections',
    viewAllTools: isZh ? '查看所有工具' : 'View All Tools',
    value1: isZh ? '价值 01' : 'Value 01',
    value2: isZh ? '价值 02' : 'Value 02',
    value3: isZh ? '价值 03' : 'Value 03'
  }

  const featureItems = [
    { icon: ShieldCheck, text: t('home.features.secure.title') },
    { icon: Gauge, text: t('home.features.fast.title') },
    { icon: Link2, text: copy.unifiedEntry }
  ]

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,#eff6ff_0%,#f8fafc_45%,#fefce8_100%)]">
      <SEOHead seoKey="home" />

      <section className="relative overflow-hidden px-4 pt-12 pb-10 md:pt-16">
        <div className="absolute -left-12 -top-20 h-56 w-56 rounded-full bg-emerald-200/35 blur-3xl home-float" />
        <div className="absolute right-2 top-4 h-52 w-52 rounded-full bg-sky-200/40 blur-3xl home-float delay-2" />
        <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-[1.15fr_0.85fr] items-start">
          <div className="home-reveal">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-300/70 bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-700">
              <Rocket className="h-3.5 w-3.5 text-emerald-600" />
              {copy.badge}
            </div>
            <h1
              className="mt-4 text-[clamp(2rem,5vw,4rem)] font-extrabold leading-[1.03] tracking-tight text-slate-900"
              style={{ fontFamily: '\'Sora\', \'Noto Sans SC\', sans-serif' }}
            >
              ColleTools
              <span className="block mt-1 text-slate-700 text-[clamp(1.2rem,2.6vw,1.8rem)] font-semibold">
                {t('home.heroSubtitle')}
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-base md:text-lg text-slate-600 leading-relaxed">
              {t('home.heroDescription')}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/all-tools"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <LayoutGrid className="h-4 w-4" />
                {copy.openAllTools}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/grade-calc"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
              >
                {copy.startWithStudy}
              </Link>
            </div>
            <div className="mt-8 grid gap-2 sm:grid-cols-3">
              {featureItems.map((item, idx) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.text}
                    className={`home-reveal delay-${idx + 1} rounded-lg border border-slate-200 bg-white/70 px-3 py-2 text-sm text-slate-700`}
                  >
                    <Icon className="mb-1 h-4 w-4 text-slate-900" />
                    {item.text}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="home-reveal delay-1 rounded-2xl border border-slate-200 bg-white/80 p-5 md:p-6 shadow-[0_14px_40px_-28px_rgba(15,23,42,0.45)]">
            <div className="text-sm font-semibold text-slate-800">{copy.startHereTitle}</div>
            <p className="mt-1 text-sm text-slate-500">{copy.startHereSub}</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link to="/grade-calc" className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-left hover:bg-white transition">
                <Calculator className="h-5 w-5 text-indigo-600" />
                <p className="mt-2 text-sm font-semibold text-slate-900">GPA</p>
              </Link>
              <Link to="/email-gen" className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-left hover:bg-white transition">
                <Mail className="h-5 w-5 text-violet-600" />
                <p className="mt-2 text-sm font-semibold text-slate-900">Email</p>
              </Link>
              <Link to="/pdf-tools" className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-left hover:bg-white transition">
                <FileText className="h-5 w-5 text-red-600" />
                <p className="mt-2 text-sm font-semibold text-slate-900">PDF</p>
              </Link>
              <Link to="/ai-writing" className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-left hover:bg-white transition">
                <Sparkles className="h-5 w-5 text-amber-600" />
                <p className="mt-2 text-sm font-semibold text-slate-900">AI</p>
              </Link>
            </div>
            <div className="mt-5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-700 px-4 py-3 text-white">
              <p className="text-xs text-slate-300">{copy.newFeature}</p>
              <p className="mt-1 text-sm font-semibold">{copy.newFeatureDesc}</p>
              <Link to="/all-tools" className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 hover:text-emerald-200">
                {copy.viewNow}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4 home-reveal delay-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{copy.collectionTag}</p>
              <h2
                className="mt-1 text-2xl md:text-3xl font-extrabold text-slate-900"
                style={{ fontFamily: '\'Sora\', \'Noto Sans SC\', sans-serif' }}
              >
                {copy.toolCollections}
              </h2>
            </div>
            <Link to="/all-tools" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400">
              {copy.viewAllTools}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-7">
            {CATEGORIES.map((cat) => (
              <div key={cat.id} className="home-reveal rounded-2xl border border-slate-200 bg-white/70 p-4 md:p-5 shadow-[0_10px_28px_-24px_rgba(15,23,42,0.45)]">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="text-lg font-bold text-slate-900">{t(cat.titleKey)}</h3>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${CATEGORY_DECOR[cat.id].badge}`}>
                    {cat.tools.length} {isZh ? '个工具' : 'tools'}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {cat.tools.map((tool, idx) => {
                    const Icon = tool.icon
                    const title = 'titleKey' in tool ? t(tool.titleKey) : tool.title
                    return (
                      <Link
                        key={tool.href}
                        to={tool.href}
                        className={`group rounded-xl border bg-gradient-to-br p-3.5 transition duration-300 hover:-translate-y-0.5 ${CATEGORY_DECOR[cat.id].card} home-reveal delay-${Math.min((idx % 4) + 1, 3)}`}
                      >
                        <div className={`mb-3 h-9 w-9 rounded-lg ${CATEGORY_DECOR[cat.id].icon} flex items-center justify-center shadow-sm`}>
                          <Icon className="h-4.5 w-4.5 text-white" />
                        </div>
                        <span className="block text-sm font-semibold leading-snug text-slate-800 group-hover:text-slate-900">
                          {title}
                        </span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white/70 px-4 py-8">
        <div className="max-w-6xl mx-auto grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            <p className="text-xs text-slate-500">{copy.value1}</p>
            <p className="mt-1 font-semibold">{t('home.features.free.title')}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            <p className="text-xs text-slate-500">{copy.value2}</p>
            <p className="mt-1 font-semibold">{t('home.features.secure.title')}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            <p className="text-xs text-slate-500">{copy.value3}</p>
            <p className="mt-1 font-semibold">{t('home.features.fast.title')}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
