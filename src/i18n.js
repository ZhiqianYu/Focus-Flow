import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 导入翻译文件
import enTranslation from './locales/en/translation.json';
import zhTranslation from './locales/zh/translation.json';
// 导入其他语言...

// 配置i18next
i18n
  .use(LanguageDetector) // 自动检测用户浏览器语言
  .use(initReactI18next) // 将i18n实例传递给react-i18next
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      zh: {
        translation: zhTranslation
      },
      // 其他语言...
    },
    fallbackLng: 'en', // 找不到翻译时使用英语
    debug: process.env.NODE_ENV === 'development', // 开发环境启用调试
    interpolation: {
      escapeValue: false // React已经安全处理了
    }
  });

export default i18n;