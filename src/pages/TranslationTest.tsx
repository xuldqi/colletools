import React from 'react';
import { useTranslation } from 'react-i18next';

const TranslationTest = () => {
  const { t, i18n } = useTranslation();

  const testKeys = [
    'tools.pdf.title',
    'tools.image.title',
    'tools.video.title',
    'tools.ocr.title',
    'tools.documentData.title',
    'home.heroTitle',
    'nav.home'
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">翻译测试页面</h1>
      
      <div className="mb-4">
        <p><strong>当前语言:</strong> {i18n.language}</p>
        <p><strong>可用语言:</strong> {Object.keys(i18n.store.data).join(', ')}</p>
      </div>
      
      <div className="mb-4">
        <button 
          onClick={() => i18n.changeLanguage('en')}
          className="mr-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          English
        </button>
        <button 
          onClick={() => i18n.changeLanguage('zh')}
          className="mr-2 px-4 py-2 bg-green-500 text-white rounded"
        >
          中文
        </button>
      </div>
      
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">翻译键测试:</h2>
        {testKeys.map(key => {
          const translation = t(key);
          const isTranslated = translation !== key;
          
          return (
            <div key={key} className={`p-2 border rounded ${
              isTranslated ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'
            }`}>
              <div className="font-mono text-sm text-gray-600">{key}</div>
              <div className={`font-medium ${
                isTranslated ? 'text-green-800' : 'text-red-800'
              }`}>
                {translation}
              </div>
              <div className="text-xs">
                状态: {isTranslated ? '✅ 已翻译' : '❌ 未翻译'}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">原始数据检查:</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
          {JSON.stringify({
            currentLanguage: i18n.language,
            availableLanguages: Object.keys(i18n.store.data),
            sampleTranslations: {
              'tools.pdf.title': t('tools.pdf.title'),
              'tools.image.title': t('tools.image.title'),
              'home.heroTitle': t('home.heroTitle')
            }
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default TranslationTest;