import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// 导入语言资源
import en from './locales/en.json'
import zh from './locales/zh.json'
import ja from './locales/ja.json'
import ko from './locales/ko.json'
import de from './locales/de.json'
import fr from './locales/fr.json'
import pt from './locales/pt.json'


const resources = {
  en: {
    translation: en
  },
  zh: {
    translation: zh
  },
  ja: {
    translation: ja
  },
  ko: {
    translation: ko
  },
  de: {
    translation: de
  },
  fr: {
    translation: fr
  },
  pt: {
    translation: pt
  },

}

const initI18n = i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    lng: 'zh', // 设置默认语言
    
    interpolation: {
      escapeValue: false // React已经默认转义
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,
      // 语言映射配置
      convertDetectedLanguage: (lng: string) => {
        // 将各种中文变体映射到 zh
        if (lng.startsWith('zh')) {
          return 'zh'
        }
        // 其他语言保持原样
        return lng
      }
    }
  })

// 确保初始化完成
export { initI18n }

export default i18n

// 支持的语言列表
export const supportedLanguages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },

  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' }
]