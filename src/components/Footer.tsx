import { Link } from 'react-router-dom'
import { FileText, Image, Video, Scan, Settings, Mail } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const Footer = () => {
  const { t } = useTranslation()
  const toolCategories = [
    { name: 'PDF', href: '/pdf', icon: FileText },
    { name: 'Image', href: '/image', icon: Image },
    { name: 'Video', href: '/video', icon: Video },
    { name: 'OCR', href: '/ocr', icon: Scan },
    { name: 'Document & Data', href: '/document-data', icon: Settings }
  ]

  const usefulLinks = [
    { name: 'zipic', href: 'https://zipic.online', external: true },
    { name: 'dropshare', href: 'https://dropshare.tech', external: true }
  ]



  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold">ColleTools</span>
            </div>
            <p className="text-gray-300 mb-4 text-sm leading-relaxed">
              {t('footer.description')}
            </p>

          </div>

          {/* Tool Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.toolCategories')}</h3>
            <ul className="space-y-2">
              {toolCategories.map((category) => {
                const IconComponent = category.icon
                return (
                  <li key={category.name}>
                    <Link
                      to={category.href}
                      className="text-gray-300 hover:text-white transition-colors flex items-center text-sm"
                    >
                      <IconComponent className="w-4 h-4 mr-2" />
                      {t(`nav.${category.name.toLowerCase()}Tools`)}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.usefulLinks')}</h3>
            <ul className="space-y-2">
              {usefulLinks.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white transition-colors text-sm"
                    >
                      {t(`footer.${link.name}`)}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-white transition-colors text-sm"
                    >
                      {t(`footer.${link.name}`)}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.contactUs')}</h3>
            <p className="text-gray-300 text-sm mb-4">
              {t('footer.contactDescription')}
            </p>
            <div className="flex items-center space-x-2 text-sm">
              <Mail className="w-4 h-4 text-gray-400" />
              <a 
                href="mailto:novemeber11@gmail.com"
                className="text-gray-300 hover:text-white transition-colors"
              >
                novemeber11@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              <p>{t('footer.copyright')}</p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                {t('footer.privacyPolicy')}
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                {t('footer.termsOfService')}
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors">
                {t('footer.cookiePolicy')}
              </Link>
              <Link to="/sitemap" className="text-gray-400 hover:text-white transition-colors">
                {t('footer.sitemap')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer