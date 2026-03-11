import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

interface PageHeroProps {
  title: string
  subtitle: string
  icon?: LucideIcon
  iconBgClassName?: string
  iconTextClassName?: string
  showBack?: boolean
  backTo?: string
  backLabel?: string
  action?: ReactNode
}

export default function PageHero({
  title,
  subtitle,
  icon: Icon,
  iconBgClassName = 'bg-primary-100',
  iconTextClassName = 'text-primary-700',
  showBack = false,
  backTo = '/',
  backLabel,
  action
}: PageHeroProps) {
  const { t, i18n } = useTranslation()
  const resolvedBackLabel = backLabel || t('common.backToHome', { defaultValue: i18n.language.startsWith('zh') ? '返回首页' : 'Back to Home' })

  return (
    <div className="mb-10">
      {showBack && (
        <Link
          to={backTo}
          className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          {resolvedBackLabel}
        </Link>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white/85 px-5 py-6 shadow-sm md:px-7 md:py-8">
        <div className="flex items-start gap-4">
          {Icon && (
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBgClassName}`}>
              <Icon className={`h-6 w-6 ${iconTextClassName}`} />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1
              className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl"
              style={{ fontFamily: '\'Sora\', \'Noto Sans SC\', sans-serif' }}
            >
              {title}
            </h1>
            <p className="mt-2 max-w-3xl text-base leading-relaxed text-slate-600 md:text-lg">{subtitle}</p>
            {action ? <div className="mt-5">{action}</div> : null}
          </div>
        </div>
      </div>
    </div>
  )
}
