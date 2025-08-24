import { Link } from 'react-router-dom'
import { FileText, Image, Video, ArrowRight, Star, Scan, Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const Home = () => {
  const { t } = useTranslation()
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }
  
  const toolCategories = [
    {
      title: t('tools.pdf.title'),
      description: t('tools.pdf.description'),
      icon: FileText,
      href: '/pdf',
      color: 'bg-red-500',
      tools: [t('tools.pdf.pdfToWord'), t('tools.pdf.mergePdf'), t('tools.pdf.splitPdf'), t('tools.pdf.compressPdf')]
    },
    {
      title: t('tools.image.title'),
      description: t('tools.image.description'),
      icon: Image,
      href: '/image',
      color: 'bg-green-500',
      tools: [t('tools.image.imageConverter'), t('tools.image.backgroundRemover'), t('tools.image.imageCompressor'), t('tools.image.photoEnhancer')]
    },
    {
      title: t('tools.video.title'),
      description: t('tools.video.description'),
      icon: Video,
      href: '/video',
      color: 'bg-blue-500',
      tools: [t('tools.video.videoConverter'), t('tools.video.videoCompressor'), t('tools.video.videoTrimmer'), t('tools.video.videoToGif')]
    },
    {
      title: t('tools.ocr.title'),
      description: t('tools.ocr.description'),
      icon: Scan,
      href: '/ocr',
      color: 'bg-purple-500',
      tools: [t('tools.ocr.imageToText'), t('tools.ocr.pdfOcr'), t('tools.ocr.handwritingRecognition'), t('tools.ocr.qrCodeReader')]
    },
    {
      title: t('tools.documentData.title'),
      description: t('tools.documentData.description'),
      icon: Settings,
      href: '/document-data',
      color: 'bg-indigo-600',
      tools: [t('tools.documentData.wordCounter'), t('tools.documentData.hashGenerator'), t('tools.documentData.base64Encoder'), t('tools.documentData.csvSplit')]
    }
  ]

  const popularTools = [
    { name: t('tools.pdf.pdfToWord'), category: t('tools.pdf.title'), users: '2.5M' },
    { name: t('tools.image.backgroundRemover'), category: t('tools.image.title'), users: '1.8M' },
    { name: t('tools.video.videoConverter'), category: t('tools.video.title'), users: '1.2M' },
    { name: t('tools.image.imageCompressor'), category: t('tools.image.title'), users: '800K' },
    { name: t('tools.pdf.mergePdf'), category: t('tools.pdf.title'), users: '750K' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {t('home.heroTitle')}
            <span className="block text-primary-200">{t('home.heroSubtitle')}</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
            {t('home.heroDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => scrollToSection('tool-categories')}
              className="bg-white text-primary-800 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
            >
              {t('home.exploreTools')}
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="border-2 border-white text-white hover:bg-white hover:text-primary-800 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
            >
              {t('home.learnMore')}
            </button>
          </div>
        </div>
      </section>

      {/* Tool Categories */}
      <section id="tool-categories" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.chooseCategory')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('home.categoryDescription')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {toolCategories.map((category) => {
              const IconComponent = category.icon
              return (
                <Link
                  key={category.title}
                  to={category.href}
                  className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-primary-200"
                >
                  <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.title}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="space-y-1 mb-4">
                    {category.tools.slice(0, 3).map((tool) => (
                      <div key={tool} className="text-sm text-gray-500">• {tool}</div>
                    ))}
                  </div>
                  <div className="flex items-center text-primary-600 font-medium group-hover:text-primary-700">
                    {t('home.viewTools')}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Popular Tools */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.popularTools')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('home.popularDescription')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTools.map((tool) => (
              <div key={tool.name} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                    {tool.category}
                  </span>
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">4.9</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{tool.name}</h3>
                <p className="text-gray-600 text-sm mb-3">
                  {t('home.usedByUsers', { count: parseFloat(tool.users.replace(/[KM]/g, '')) })}
                </p>
                <button className="w-full bg-primary-600 text-white hover:bg-primary-700 py-2 rounded-md font-medium transition-colors">
                  {t('home.useTool')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🆓</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('home.features.free.title')}</h3>
              <p className="text-gray-600">
                {t('home.features.free.description')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('home.features.secure.title')}</h3>
              <p className="text-gray-600">
                {t('home.features.secure.description')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('home.features.fast.title')}</h3>
              <p className="text-gray-600">
                {t('home.features.fast.description')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home