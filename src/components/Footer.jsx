import React, { useState } from 'react';
import '../styles/Footer.css';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const [showInfo, setShowInfo] = useState(false);
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="copyright">
          © {currentYear} Focus Flow | <button className="info-button" onClick={() => setShowInfo(!showInfo)}>关于</button>
        </div>
        
        {showInfo && (
          <div className="author-info">
            <div className="info-card">
              <button className="close-info" onClick={() => setShowInfo(false)}>×</button>
              <h3>关于 Focus Flow</h3>
              <p>Focus Flow是一款基于神经科学原理的智能学习计时器，通过随机提醒促进大脑回顾和记忆巩固。</p>
              <div className="author-section">
                <h4>作者信息</h4>
                <p>由 <a href="https://github.com/ZhiqianYu" target="_blank" rel="noopener noreferrer">Zhiqian Yu</a> 开发</p>
                <p>联系方式: <a href="mailto:yu-zhiqian@outlook.com">Click to send E-Mail</a></p>
              </div>
              <div className="license-section">
                <h4>版权信息</h4>
                <p>本应用采用 <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer">MIT许可证 + Com Details</a></p>
                <p>源代码可在 <a href="https://github.com/zhiqianyu/focus-flow" target="_blank" rel="noopener noreferrer">GitHub</a> 获取</p>
              </div>
              <div className="version-info">
                <p>当前版本: v1.0.0</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;