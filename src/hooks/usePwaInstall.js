import { useState, useEffect } from 'react';

const usePwaInstall = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  
  // 监听beforeinstallprompt事件
  useEffect(() => {
    const handler = (e) => {
      // 阻止Chrome 67及更早版本自动显示安装提示
      e.preventDefault();
      // 保存事件以便稍后触发
      setInstallPrompt(e);
    };
    
    window.addEventListener('beforeinstallprompt', handler);
    
    // 检查应用是否已安装
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true) {
      setIsAppInstalled(true);
    }
    
    // 监听应用安装
    window.addEventListener('appinstalled', () => {
      setIsAppInstalled(true);
      setInstallPrompt(null);
    });
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);
  
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
    promptInstall
  };
};

export default usePwaInstall;