import React from 'react';
import { Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Home from '../pages/Home';
import PDFTools from '../pages/PDFTools';
import ImageTools from '../pages/ImageTools';
import AIWriting from '../pages/AIWriting';
import VideoTools from '../pages/VideoTools';
import OCRTools from '../pages/OCRTools';
import DocumentDataTools from '../pages/DocumentDataTools';
import ToolDetail from '../pages/ToolDetail';
import About from '../pages/About';
import Privacy from '../pages/Privacy';
import Terms from '../pages/Terms';
import Contact from '../pages/Contact';
import Help from '../pages/Help';
import ApiDocs from '../pages/ApiDocs';
import Cookies from '../pages/Cookies';
import Sitemap from '../pages/Sitemap';
import { NotFound } from '../pages/NotFound';

// 支持的语言列表
const supportedLanguages = ['zh', 'en', 'ja', 'ko', 'es', 'fr', 'de', 'it', 'pt', 'ru'];

// 路由路径映射
const routeTranslations = {
  zh: {
    pdf: 'pdf-gongju',
    image: 'tupian-gongju',
    'ai-writing': 'ai-xiezuo',
    video: 'shipin-gongju',
    ocr: 'ocr-gongju',
    'document-data': 'wenjian-shuju',
    about: 'guanyu',
    privacy: 'yinsi',
    terms: 'tiaokuan',
    contact: 'lianxi',
    help: 'bangzhu',
    'api-docs': 'api-wendang',
    cookies: 'cookies',
    sitemap: 'wangzhan-ditu'
  },
  en: {
    pdf: 'pdf-tools',
    image: 'image-tools',
    'ai-writing': 'ai-writing',
    video: 'video-tools',
    ocr: 'ocr-tools',
    'document-data': 'document-data',
    about: 'about',
    privacy: 'privacy',
    terms: 'terms',
    contact: 'contact',
    help: 'help',
    'api-docs': 'api-docs',
    cookies: 'cookies',
    sitemap: 'sitemap'
  },
  ja: {
    pdf: 'pdf-tsuru',
    image: 'gazo-tsuru',
    'ai-writing': 'ai-sakubun',
    video: 'douga-tsuru',
    ocr: 'ocr-tsuru',
    'document-data': 'bunsho-deta',
    about: 'ni-tsuite',
    privacy: 'puraibashi',
    terms: 'riyou-kiyaku',
    contact: 'otoiawase',
    help: 'herupu',
    'api-docs': 'api-dokyumento',
    cookies: 'kukki',
    sitemap: 'saito-mappu'
  }
};

// 语言检测和重定向组件
const LanguageDetector: React.FC = () => {
  const location = useLocation();
  // const { i18n } = useTranslation();
  
  // 检测浏览器语言
  const detectLanguage = () => {
    const browserLang = navigator.language.split('-')[0];
    return supportedLanguages.includes(browserLang) ? browserLang : 'zh';
  };
  
  // 如果当前路径没有语言前缀，重定向到带语言前缀的路径
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const firstSegment = pathSegments[0];
  
  if (!supportedLanguages.includes(firstSegment)) {
    const detectedLang = detectLanguage();
    const newPath = `/${detectedLang}${location.pathname}`;
    return <Navigate to={newPath} replace />;
  }
  
  return null;
};

// 本地化路由包装器
const LocalizedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();
  
  // 更新i18n语言
  React.useEffect(() => {
    if (lang && supportedLanguages.includes(lang) && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);
  
  // 如果语言不支持，重定向到默认语言
  if (!lang || !supportedLanguages.includes(lang)) {
    return <Navigate to="/zh" replace />;
  }
  
  return <>{children}</>;
};

// 获取本地化路径
export const getLocalizedPath = (path: string, lang: string = 'zh'): string => {
  const translations = routeTranslations[lang as keyof typeof routeTranslations] || routeTranslations.zh;
  const pathKey = path.replace('/', '') as keyof typeof translations;
  const localizedPath = translations[pathKey] || path.replace('/', '');
  return `/${lang}/${localizedPath}`;
};

// 获取所有语言的路径（用于hreflang）
export const getAllLanguagePaths = (path: string): Array<{ lang: string; url: string }> => {
  return supportedLanguages.map(lang => ({
    lang,
    url: getLocalizedPath(path, lang)
  }));
};

// 主要的本地化路由组件
export const LocalizedRouter: React.FC = () => {
  return (
    <Routes>
      {/* 语言检测和重定向 */}
      <Route path="/*" element={<LanguageDetector />} />
      
      {/* 本地化路由 */}
      <Route path="/:lang/*" element={
        <LocalizedRoute>
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* PDF工具路由 */}
            <Route path="/pdf-tools" element={<PDFTools />} />
            <Route path="/pdf-gongju" element={<PDFTools />} />
            <Route path="/pdf-tsuru" element={<PDFTools />} />
            
            {/* 图片工具路由 */}
            <Route path="/image-tools" element={<ImageTools />} />
            <Route path="/tupian-gongju" element={<ImageTools />} />
            <Route path="/gazo-tsuru" element={<ImageTools />} />
            
            {/* AI写作路由 */}
            <Route path="/ai-writing" element={<AIWriting />} />
            <Route path="/ai-xiezuo" element={<AIWriting />} />
            <Route path="/ai-sakubun" element={<AIWriting />} />
            
            {/* 视频工具路由 */}
            <Route path="/video-tools" element={<VideoTools />} />
            <Route path="/shipin-gongju" element={<VideoTools />} />
            <Route path="/douga-tsuru" element={<VideoTools />} />
            
            {/* OCR工具路由 */}
            <Route path="/ocr-tools" element={<OCRTools />} />
            <Route path="/ocr-gongju" element={<OCRTools />} />
            <Route path="/ocr-tsuru" element={<OCRTools />} />
            
            {/* 文档数据工具路由 */}
            <Route path="/document-data" element={<DocumentDataTools />} />
            <Route path="/wenjian-shuju" element={<DocumentDataTools />} />
            <Route path="/bunsho-deta" element={<DocumentDataTools />} />
            
            {/* 工具详情路由 */}
            <Route path="/tool/:toolId" element={<ToolDetail />} />
            <Route path="/gongju/:toolId" element={<ToolDetail />} />
            <Route path="/tsuru/:toolId" element={<ToolDetail />} />
            
            {/* 关于页面路由 */}
            <Route path="/about" element={<About />} />
            <Route path="/guanyu" element={<About />} />
            <Route path="/ni-tsuite" element={<About />} />
            
            {/* 隐私政策路由 */}
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/yinsi" element={<Privacy />} />
            <Route path="/puraibashi" element={<Privacy />} />
            
            {/* 服务条款路由 */}
            <Route path="/terms" element={<Terms />} />
            <Route path="/tiaokuan" element={<Terms />} />
            <Route path="/riyou-kiyaku" element={<Terms />} />
            
            {/* 联系我们路由 */}
            <Route path="/contact" element={<Contact />} />
            <Route path="/lianxi" element={<Contact />} />
            <Route path="/otoiawase" element={<Contact />} />
            
            {/* 帮助页面路由 */}
            <Route path="/help" element={<Help />} />
            <Route path="/bangzhu" element={<Help />} />
            <Route path="/herupu" element={<Help />} />
            
            {/* API文档路由 */}
            <Route path="/api-docs" element={<ApiDocs />} />
            <Route path="/api-wendang" element={<ApiDocs />} />
            <Route path="/api-dokyumento" element={<ApiDocs />} />
            
            {/* Cookies政策路由 */}
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/kukki" element={<Cookies />} />
            
            {/* 网站地图路由 */}
            <Route path="/sitemap" element={<Sitemap />} />
            <Route path="/wangzhan-ditu" element={<Sitemap />} />
            <Route path="/saito-mappu" element={<Sitemap />} />
            
            {/* 404页面 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </LocalizedRoute>
      } />
      
      {/* 兜底404页面 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default LocalizedRouter;