import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import TimerDisplay from './components/TimerDisplay';
import SettingsPanel from './components/SettingsPanel';
import PresetButtons from './components/PresetButtons';
import ProgressBar from './components/ProgressBar';
import ControlButtons from './components/ControlButtons';
import AudioSettingsModal from './components/AudioSettingsModal';
import Notification from './components/Notification';
import useTimer from './hooks/useTimer';

import Footer from './components/Footer';
import DonateButton from './components/DonateButton';

import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './components/LanguageSwitcher';

import usePwaInstall from './hooks/usePwaInstall';
import InstallButton from './components/InstallButton';
import SafariInstallGuide from './components/SafariInstallGuide';

import DocumentHead from './components/DocumentHead';

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTimerSettingsOpen, setIsTimerSettingsOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const { width, height } = useWindowSize();
  
  const timer = useTimer();
  const { state, actions, utils } = timer;

  // PWA安装功能
  const { isInstallable, promptInstall } = usePwaInstall();

  // 国际化支持
  const { t } = useTranslation();
  
  // 模态框控制函数
  const openAudioSettings = useCallback(() => {
    setIsSettingsOpen(true);
  }, []);

  const closeAudioSettings = useCallback(() => {
    setIsSettingsOpen(false);
  }, []);

  const openTimerSettings = useCallback(() => {
    setIsTimerSettingsOpen(true);
  }, []);

  const closeTimerSettings = useCallback(() => {
    setIsTimerSettingsOpen(false);
  }, []);

  // 显示通知的函数
  const showNotification = useCallback((message, type = 'success', duration = 1500) => {
    setNotification({ message, type, duration });
  }, []);

  // 处理预设选择
  const handlePresetSelect = useCallback((preset) => {
    const presetConfig = actions.loadPreset(preset);
    if (presetConfig) {
      showNotification('预设已加载', 'info');
    }
  }, [actions, showNotification]);

  // 处理开始/暂停
  const handleStartPause = useCallback(() => {
    const result = actions.toggleTimer();
    
    if (result) {
      if (!state.isRunning) {
        // 刚开始计时
        showNotification(t('notifications.start'), 'success');
      } else if (state.isPaused) {
        // 从暂停状态恢复
        showNotification(t('notifications.resume'), 'info');
      } else {
        // 从运行状态暂停
        showNotification(t('notifications.pause'), 'info');
      }
    } else {
      showNotification(t('notifications.pleaseSetTime'), 'error');
    }
  }, [actions, state.isRunning, state.isPaused, showNotification, t]);

  // 处理重置
  const handleReset = useCallback(() => {
    if (confirm(t('notifications.confirmReset'))) {
      actions.resetTimer();
      showNotification(t('notification.reset'), 'info');
    }
  }, [actions, showNotification]);

  // 处理配置更改
  const handleConfigChange = useCallback((newConfig) => {
    actions.saveConfig(newConfig);
  }, [actions]);

  // 获取状态文本
  const getStatusText = useCallback(() => {
    return t(`timer.status.${state.currentPhase}`);
  }, [state.currentPhase, t]);
  
  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        handleStartPause();
      } else if (e.code === 'KeyR' && e.ctrlKey) {
        e.preventDefault();
        handleReset();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [state.isRunning, state.isPaused]);
  
  // 防止关闭页面
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (state.isRunning) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [state.isRunning]);
  
  return (
    <>
      <DocumentHead />
      <div className="container">
        {/* 语言切换器 - 放在容器顶部 */}
        <LanguageSwitcher />

        {/* 标题区域 */}
        <div className="header">
          <h1>{t('app.name')}</h1>
          <p>{t('app.tagline')}</p>
        </div>
        
        {/* 预设按钮 */}
        <PresetButtons onSelectPreset={handlePresetSelect} />
        
        {/* 主要内容区域 */}
        <div className="main-content">
          {/* 计时器显示 */}
          <TimerDisplay 
            mainTime={utils.formatTime(state.totalTimeLeft)}
            stageTime={utils.formatTime(state.stageTimeLeft)}
            breakTime={utils.formatTime(state.breakTimeLeft)}
            status={getStatusText()}
            phase={state.currentPhase}
            onOpenAudioSettings={() => setIsSettingsOpen(true)}
            onOpenTimerSettings={() => setIsTimerSettingsOpen(true)}
          />
        </div>
        
        {/* 进度条 */}
        <div className="progress-area">
          <ProgressBar 
            value={state.totalProgress}
            label={t('progress.total')}
          />
          
          <ProgressBar 
            value={state.stageProgress}
            label={state.currentPhase === 'stage' ? t('progress.stage') : t('progress.break')}
          />
        </div>
        
        {/* 控制按钮和打赏按钮的容器 */}
        <div className="action-buttons-container">
          {/* 控制按钮 - 靠左 */}
          <div className="control-buttons-wrapper">
            <ControlButtons 
              isRunning={state.isRunning}
              isPaused={state.isPaused}
              onStartPause={handleStartPause}
              onReset={handleReset}
            />
          </div>
          
          {/* 打赏按钮 - 靠右 */}
          <div className="donate-wrapper">
            <DonateButton />
          </div>
        </div>

        {/* 安装按钮 */}
        <InstallButton 
          isInstallable={isInstallable} 
          promptInstall={promptInstall} 
        />
        
        {/* Safari安装指南 */}
        <SafariInstallGuide />
        
        {/* 添加页脚 */}
        <Footer />

        {/* 音频设置模态框 */}
        <AudioSettingsModal 
          isOpen={isSettingsOpen}
          onClose={closeAudioSettings}
        />
        
        {/* 计时器设置模态框 */}
        <SettingsPanel 
          isOpen={isTimerSettingsOpen}
          onClose={closeTimerSettings}
          config={state.config}
          onConfigChange={handleConfigChange}
        />
        
        {/* 通知提示 */}
        <Notification
          message={notification?.message}
          type={notification?.type}
          duration={notification?.duration}
          onClose={() => setNotification(null)}
        />
      </div>
    </>

  );
}

export default App;