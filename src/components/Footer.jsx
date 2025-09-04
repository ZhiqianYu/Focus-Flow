import React, { useState } from 'react';
import '../styles/Footer.css';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const Footer = ({ showAboutButton = true, onAboutClick = null }) => {
  const [showInfo, setShowInfo] = useState(false);
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();
  
  const handleAboutClick = () => {
    if (onAboutClick) {
      onAboutClick();
    } else {
      setShowInfo(!showInfo);
    }
  };
  
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="copyright">
          © {currentYear} Focus Flow {showAboutButton && (
            <>| <button className="info-button" onClick={handleAboutClick}>{t('footer.about')}</button></>
          )}
        </div>
        
        {showInfo && (
          <div className="author-info">
            <div className="info-card">
              <button className="close-info" onClick={() => setShowInfo(false)}>×</button>
                <div className="info-header">
                  <h3>{t('about.title')}</h3>
                  <p>{t('about.description')}</p>
                </div>
                <div className="author-section">
                  <h4>{t('about.author')}</h4>
                  <p>{t('about.by')} <a href="https://github.com/ZhiqianYu" target="_blank" rel="noopener noreferrer">Zhiqian Yu </a>{t('about.develop')}</p>
                  <p>{t('about.contact')}: <a href="mailto:yu-zhiqian@outlook.com">{t('about.sendEmail')}</a></p>
                </div>
                <div className="license-section">
                  <h4>{t('about.licenseTitle')}</h4>
                  <p><a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer">MIT{t('about.license')} + {t('about.comD')}</a></p>
                  {/*<p>{t('about.sourceCode')} <a href="https://github.com/zhiqianyu/focus-flow" target="_blank" rel="noopener noreferrer">GitHub</a> {t('about.get')}</p>*/}
                </div>
                <div className="version-info">
                  <p>{t('about.version')}: v1.0.0</p>
                </div>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;