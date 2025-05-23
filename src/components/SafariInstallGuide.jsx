import React, { useState, useEffect } from 'react';
import '../styles/SafariInstallGuide.css';

const SafariInstallGuide = () => {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  
  useEffect(() => {
    // 检测是否是iOS设备
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(iOS);
    
    // 检测是否已经以standalone模式运行
    const standalone = window.navigator.standalone === true;
    setIsStandalone(standalone);
  }, []);
  
  // 只在iOS设备上且不是standalone模式时显示
  if (!isIOS || isStandalone || !showGuide) return null;
  
  return (
    <div className="safari-guide">
      <div className="safari-guide-content">
        <button className="guide-close" onClick={() => setShowGuide(false)}>×</button>
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