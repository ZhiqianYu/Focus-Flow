import React, { useState, useEffect } from 'react';
import '../styles/SafariInstallGuide.css';
import usePwaInstall from '../hooks/usePwaInstall';

const SafariInstallGuide = () => {
  const [dismissed, setDismissed] = useState(false);
  const { showSafariGuide } = usePwaInstall();
  
  // 检查是否已经关闭过指南
  useEffect(() => {
    const guideDismissed = localStorage.getItem('safari-guide-dismissed');
    if (guideDismissed) {
      setDismissed(true);
    }
  }, []);
  
  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('safari-guide-dismissed', 'true');
  };
  
  // 如果不显示指南，则返回null
  if (!showSafariGuide || dismissed) return null;
  
  return (
    <div className="safari-guide">
      <div className="safari-guide-content">
        <button className="guide-close" onClick={handleDismiss}>×</button>
          <h3>{t('install.guide.title')}</h3>
          <p>{t('install.guide.message')}</p>
          <div className="guide-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div>{t('install.guide.step1')}</div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div>{t('install.guide.step2')}</div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div>{t('install.guide.step3')}</div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default SafariInstallGuide;