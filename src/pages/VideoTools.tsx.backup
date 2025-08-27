import { Video, Upload, Scissors, Minimize2, RotateCw, Volume2, FileVideo } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'
import StructuredData from '../components/StructuredData'

const VideoTools = () => {
  const { t } = useTranslation()
  const videoTools = [
    {
      id: 'video-convert',
      title: t('tools.video.videoConverter'),
      description: t('tools.video.videoConverterDesc'),
      icon: Video,
      popular: true
    },
    {
      id: 'video-compress',
      title: t('tools.video.videoCompressor'),
      description: t('tools.video.videoCompressorDesc'),
      icon: Minimize2,
      popular: true
    },
    {
      id: 'video-trimmer',
      title: t('tools.video.videoTrimmer'),
      description: t('tools.video.videoTrimmerDesc'),
      icon: Scissors,
      popular: true
    },
    {
      id: 'gif-maker',
      title: t('tools.video.videoToGif'),
      description: t('tools.video.videoToGifDesc'),
      icon: FileVideo,
      popular: true
    },
    {
      id: 'video-rotator',
      title: t('tools.video.videoRotator'),
      description: t('tools.video.videoRotatorDesc'),
      icon: RotateCw,
      popular: false
    },
    {
      id: 'audio-extractor',
      title: t('tools.video.audioExtractor'),
      description: t('tools.video.audioExtractorDesc'),
      icon: Volume2,
      popular: false
    },
    {
      id: 'video-merger',
      title: t('tools.video.videoMerger'),
      description: t('tools.video.videoMergerDesc'),
      icon: Upload,
      popular: false
    }
  ]

  return (
    <>
      <SEOHead seoKey="videoTools" />
      <StructuredData type="SoftwareApplication" />
      <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('tools.video.title')}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('tools.video.pageDescription')}
          </p>
        </div>

        {/* Popular Tools Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('common.mostPopularTools')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {videoTools.filter(tool => tool.popular).map((tool) => {
              const IconComponent = tool.icon
              return (
                <Link key={tool.id} to={`/tool/${tool.id}`} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer group block">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                      {tool.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">{tool.description}</p>
                    <div className="w-full bg-blue-600 text-white hover:bg-blue-700 py-2 rounded-md font-medium transition-colors text-center">
                      {t('common.useTool')}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* All Tools Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('common.allTools')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoTools.map((tool) => {
              const IconComponent = tool.icon
              return (
                <Link key={tool.id} to={`/tool/${tool.id}`} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer group block">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                      <IconComponent className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {tool.title}
                      </h3>
                      {tool.popular && (
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {t('common.popular')}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{tool.description}</p>
                  <div className="w-full bg-gray-600 text-white hover:bg-gray-700 py-2 rounded-md font-medium transition-colors text-center">
                    {t('common.useTool')}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t('tools.video.professionalProcessing')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 font-bold text-xl">🎬</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('common.allFormats')}</h3>
              <p className="text-gray-600 text-sm">{t('tools.video.supportedFormats')}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-yellow-600 font-bold text-xl">⚡</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('common.fastProcessing')}</h3>
              <p className="text-gray-600 text-sm">{t('tools.video.fastProcessingDesc')}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold text-xl">🔒</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('common.securePrivate')}</h3>
              <p className="text-gray-600 text-sm">{t('tools.video.secureProcessing')}</p>
            </div>
          </div>
        </div>

        {/* Supported Formats */}
        <div className="mt-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-8 text-white">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">{t('tools.video.supportedFormats')}</h2>
            <p className="text-blue-100">{t('tools.video.supportedFormatsDesc')}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-center">
            {['MP4', 'AVI', 'MOV', 'WMV', 'FLV', 'MKV', 'WEBM', '3GP', 'M4V', 'ASF', 'VOB', 'OGV'].map((format) => (
              <div key={format} className="bg-blue-400 bg-opacity-30 rounded-lg py-3 px-4">
                <span className="font-semibold">{format}</span>
              </div>
            ))}
          </div>
        </div>


      </div>
    </div>
    </>
  )
}

export default VideoTools