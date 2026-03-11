import { Link } from 'react-router-dom'
import { FileText, Image, Settings, Sparkles, Mail } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const CATEGORIES = [
  { key: 'all-tools', href: '/all-tools', icon: null, label: '' },
  { key: 'study', href: '/grade-calc', icon: null, label: '' },
  { key: 'document', href: '/pdf-tools', icon: FileText, label: '' },
  { key: 'media', href: '/image-tools', icon: Image, label: '' },
  { key: 'data', href: '/document-data-tools', icon: Settings, label: '' },
  { key: 'ai', href: '/ai-writing', icon: Sparkles, label: '' },
]

export default function Footer() {
  const { t, i18n } = useTranslation()
  const isZh = i18n.language.startsWith('zh')

  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="font-bold">C</span>
              </div>
              <span className="font-bold">ColleTools</span>
            </div>
            <p className="text-gray-400 text-sm">{t('footer.description')}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-sm">{t('footer.toolCategories')}</h3>
            <ul className="space-y-2">
              {CATEGORIES.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.key}>
                    <Link to={item.href} className="text-gray-400 hover:text-white text-sm flex items-center gap-2">
                      {Icon && <Icon className="w-4 h-4" />}
                      {item.key === 'all-tools'
                        ? t('nav.categories.allTools', { defaultValue: isZh ? '全站入口' : 'All Tools' })
                        : item.label || t(`nav.categories.${item.key}`)}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-sm">{t('footer.contactUs')}</h3>
            <a href="mailto:novemeber11@gmail.com" className="text-gray-400 hover:text-white text-sm flex items-center gap-2">
              <Mail className="w-4 h-4" />
              novemeber11@gmail.com
            </a>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <span>{t('footer.copyright')}</span>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-white">{t('footer.privacyPolicy')}</Link>
            <Link to="/terms" className="hover:text-white">{t('footer.termsOfService')}</Link>
            <Link to="/cookies" className="hover:text-white">{t('footer.cookiePolicy')}</Link>
            <Link to="/sitemap" className="hover:text-white">{t('footer.sitemap')}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
