import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, ArrowLeft, Search } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import StructuredData from '../components/StructuredData';

export const NotFound: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <SEOHead
        title={t('notFound.title', '页面未找到 - 404')}
        description={t('notFound.description', '抱歉，您访问的页面不存在。请检查URL或返回首页继续使用我们的在线工具。')}
        keywords={t('notFound.keywords', '404,页面未找到,错误页面')}
      />
      <StructuredData type="WebPage" />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          {/* 404 数字 */}
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-blue-600 mb-4">404</h1>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>
          
          {/* 错误信息 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {t('notFound.heading', '页面未找到')}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {t('notFound.message', '抱歉，您访问的页面不存在或已被移动。请检查URL是否正确，或使用下面的链接返回。')}
            </p>
          </div>
          
          {/* 操作按钮 */}
          <div className="space-y-4">
            <Link
              to="/"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Home className="w-5 h-5 mr-2" />
              {t('notFound.backHome', '返回首页')}
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {t('notFound.goBack', '返回上一页')}
            </button>
          </div>
          
          {/* 推荐工具 */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {t('notFound.popularTools', '热门工具')}
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Link
                to="/pdf-tools"
                className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 text-gray-700 hover:text-blue-600"
              >
                {t('nav.pdfTools', 'PDF工具')}
              </Link>
              <Link
                to="/image-tools"
                className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 text-gray-700 hover:text-blue-600"
              >
                {t('nav.imageTools', '图片工具')}
              </Link>
              <Link
                to="/video-tools"
                className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 text-gray-700 hover:text-blue-600"
              >
                {t('nav.videoTools', '视频工具')}
              </Link>
              <Link
                to="/ocr-tools"
                className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 text-gray-700 hover:text-blue-600"
              >
                {t('nav.ocrTools', 'OCR工具')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};