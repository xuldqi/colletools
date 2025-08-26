import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { getAllLanguagePaths } from './LocalizedRouter';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
  seoKey?: string; // 用于从翻译文件获取SEO信息的键
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  image = '/og-image.jpg',
  url,
  type = 'website',
  noIndex = false,
  seoKey
}) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  
  const currentLanguage = i18n.language;
  const baseUrl = 'https://colletools.com';
  const currentUrl = url || `${baseUrl}${location.pathname}`;
  
  // 获取当前页面的所有语言版本
  const languagePaths = getAllLanguagePaths(location.pathname);
  
  // 生成hreflang标签
  const hreflangLinks = languagePaths.map(({ lang, url }) => ({
    rel: 'alternate',
    hreflang: lang,
    href: `${baseUrl}${url}`
  }));
  
  // 添加x-default hreflang
  hreflangLinks.push({
    rel: 'alternate',
    hreflang: 'x-default',
    href: `${baseUrl}/zh${location.pathname.replace(/^\/[a-z]{2}/, '')}`
  });
  
  // 如果提供了seoKey，从翻译文件获取SEO信息
  const seoTitle = seoKey ? t(`seo.${seoKey}.title`) : title;
  const seoDescription = seoKey ? t(`seo.${seoKey}.description`) : description;
  const seoKeywords = seoKey ? t(`seo.${seoKey}.keywords`) : keywords;
  
  // Default values
  const defaultTitle = t('seo.defaultTitle', 'ColleTools - Free Online Tools');
  const defaultDescription = t('seo.defaultDescription', 'Free online tools for PDF, image, video processing and more. Convert, compress, merge files easily.');
  const defaultKeywords = t('seo.defaultKeywords', 'online tools, PDF converter, image editor, video converter, free tools');
  
  const finalTitle = seoTitle ? `${seoTitle} | ColleTools` : defaultTitle;
  const finalDescription = seoDescription || defaultDescription;
  const finalKeywords = seoKeywords || defaultKeywords;
  const finalImage = image.startsWith('http') ? image : `${baseUrl}${image}`;
  
  // Generate alternate language URLs
  // const alternateUrls = getAllLanguagePaths(location.pathname);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="author" content="ColleTools" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Language and Locale */}
      <html lang={currentLanguage} />
      <meta name="language" content={currentLanguage} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Hreflang Links */}
      {hreflangLinks.map((link, index) => (
        <link key={index} rel={link.rel} hrefLang={link.hreflang} href={link.href} />
      ))}
      
      {/* Open Graph Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content="ColleTools" />
      <meta property="og:locale" content={currentLanguage === 'zh' ? 'zh_CN' : currentLanguage === 'ja' ? 'ja_JP' : 'en_US'} />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />
      <meta name="twitter:site" content="@colletools" />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
      <meta name="googlebot" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
      <meta name="theme-color" content="#3B82F6" />
      
      {/* Favicon and Icons */}
      <link rel="icon" type="image/svg+xml" href="/vite.svg" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      
      {/* Preconnect for Performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </Helmet>
  );
};

export default SEOHead;