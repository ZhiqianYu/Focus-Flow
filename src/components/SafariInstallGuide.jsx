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
        <h3>安装到主屏幕</h3>
        <p>在Safari中，点击分享按钮 <span className="share-icon">▲</span> 然后选择"添加到主屏幕"，即可将应用安装到设备。</p>
        <div className="guide-steps">
          <div className="step">
            <div className="step-number">1</div>
            <div>点击分享按钮</div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div>滚动并选择"添加到主屏幕"</div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div>点击"添加"完成安装</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafariInstallGuide;