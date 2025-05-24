import { useState, useEffect } from 'react';

const usePwaInstall = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [showSafariGuide, setShowSafariGuide] = useState(false);
  
  // 检测是否是Safari浏览器
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  
  useEffect(() => {
    // 检查是否已安装为PWA
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true) {
      setIsAppInstalled(true);
      return;
    }
    
    // 在iOS Safari上显示安装指南
    if (isIOS && isSafari && !window.navigator.standalone) {
      setShowSafariGuide(true);
    }
    
    // 处理安装提示事件
    const handler = (e) => {
      // 阻止Chrome 67及更早版本自动显示安装提示
      e.preventDefault();
      // 保存事件以便稍后触发
      setInstallPrompt(e);
      console.log('可以安装PWA');
    };
    
    window.addEventListener('beforeinstallprompt', handler);
    
    // 监听应用安装
    window.addEventListener('appinstalled', () => {
      setIsAppInstalled(true);
      setInstallPrompt(null);
      console.log('PWA已安装');
    });
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, [isIOS, isSafari]);
  
  // 触发安装提示
  const promptInstall = async () => {
    if (!installPrompt) {
      return;
    }
    
    // 显示安装提示
    installPrompt.prompt();
    
    // 等待用户响应
    const { outcome } = await installPrompt.userChoice;
    console.log(`用户选择: ${outcome}`);
    
    // 无论结果如何，都清除保存的提示
    setInstallPrompt(null);
  };
  
  return {
    isInstallable: !!installPrompt,
    isAppInstalled,
    promptInstall,
    showSafariGuide
  };
};

export default usePwaInstall;