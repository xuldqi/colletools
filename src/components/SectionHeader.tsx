import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface SectionHeaderProps {
  title: string
  subtitle: string
  backAction?: () => void
}

export default function SectionHeader({ title, subtitle, backAction }: SectionHeaderProps) {
  const { t, i18n } = useTranslation()
  const backLabel = t('common.backToHome', { defaultValue: i18n.language.startsWith('zh') ? '返回首页' : 'Back to Home' })

  return (
    <div className="mb-8">
      {backAction ? (
        <button
          onClick={backAction}
          className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </button>
      ) : (
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white/85 px-5 py-6 shadow-sm md:px-7 md:py-7">
        <h1
          className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl"
          style={{ fontFamily: '\'Sora\', \'Noto Sans SC\', sans-serif' }}
        >
          {title}
        </h1>
        <p className="mt-2 max-w-3xl text-base leading-relaxed text-slate-600 md:text-lg">{subtitle}</p>
      </div>
    </div>
  )
}
