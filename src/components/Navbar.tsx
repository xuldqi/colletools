import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'

const NAV_ITEMS = [
  { key: 'study', href: '/grade-calc' },
  { key: 'document', href: '/pdf-tools' },
  { key: 'media', href: '/image-tools' },
  { key: 'data', href: '/document-data-tools' },
  { key: 'ai', href: '/ai-writing' },
]

export default function Navbar() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-slate-900 shadow-lg border-b border-slate-800/50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-14">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center shadow-soft">
              <span className="text-white font-bold">C</span>
            </div>
            <span className="text-white font-bold">ColleTools</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                to={item.href}
                className="text-slate-300 hover:text-white px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800 transition-colors"
              >
                {t(`nav.categories.${item.key}`)}
              </Link>
            ))}
            <LanguageSwitcher />
          </div>

          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <button onClick={() => setOpen(!open)} className="text-white p-2">
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 py-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              to={item.href}
              className="block text-slate-300 hover:text-white py-2 text-sm"
              onClick={() => setOpen(false)}
            >
              {t(`nav.categories.${item.key}`)}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
