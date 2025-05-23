import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // 可选：保存用户语言偏好
    localStorage.setItem('userLanguage', lng);
  };
  
  return (
    <div className="language-switcher">
      <button 
        className={i18n.language === 'en' ? 'active' : ''} 
        onClick={() => changeLanguage('en')}
      >
        EN
      </button>
      <button 
        className={i18n.language === 'zh' ? 'active' : ''} 
        onClick={() => changeLanguage('zh')}
      >
        中文
      </button>
      {/* 添加其他语言按钮 */}
    </div>
  );
};

export default LanguageSwitcher;