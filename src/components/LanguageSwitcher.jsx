import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('userLanguage', lng);
    setDropdownOpen(false);
  };
  
  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // 显示当前语言的名称
  const getCurrentLanguageName = () => {
    switch(i18n.language) {
      case 'zh': return '中文';
      case 'en': return 'English';
      default: return 'Language';
    }
  };
  
  return (
    <div className="language-switcher" ref={dropdownRef}>
      <button 
        className="language-toggle"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-label="切换语言"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
        <span className="current-language">{getCurrentLanguageName()}</span>
      </button>
      
      {dropdownOpen && (
        <div className="language-dropdown">
          <button 
            className={i18n.language === 'zh' ? 'active' : ''} 
            onClick={() => changeLanguage('zh')}
          >
            中文
          </button>
          <button 
            className={i18n.language === 'en' ? 'active' : ''} 
            onClick={() => changeLanguage('en')}
          >
            English
          </button>
          <button 
            className={i18n.language === 'de' ? 'active' : ''} 
            onClick={() => changeLanguage('de')}
          >
            German
          </button>
          {/* 可以添加更多语言选项 */}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;