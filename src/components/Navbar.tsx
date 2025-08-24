import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'

const Navbar = () => {
  const { t } = useTranslation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: t('nav.pdfTools'), href: '/pdf' },
    { name: t('nav.imageTools'), href: '/image' },
    { name: t('nav.videoTools'), href: '/video' },
    { name: t('nav.ocrTools'), href: '/ocr' },
    { name: t('nav.documentDataTools'), href: '/document-data' },
  ]

  return (
    <nav className="bg-primary-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
                  <span className="text-primary-800 font-bold text-lg">C</span>
                </div>
                <span className="text-white text-xl font-bold">ColleTools</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-white hover:text-primary-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <LanguageSwitcher />
          </div>



          {/* Mobile menu button and language switcher */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSwitcher />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-primary-200 p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-primary-900">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-white hover:text-primary-200 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar