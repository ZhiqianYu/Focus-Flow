import React, { useState, useEffect } from 'react';
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

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTimerSettingsOpen, setIsTimerSettingsOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  
  const timer = useTimer();
  const { state, actions, utils } = timer;

  // PWA安装功能
  const { isInstallable, promptInstall } = usePwaInstall();

  // 国际化支持
  const { t } = useTranslation();
  
  // 显示通知的函数
  const showNotification = (message, type = 'success', duration = 1500) => {
    setNotification({ message, type, duration });
  };
  
  // 处理预设选择
  const handlePresetSelect = (preset) => {
    const presetConfig = actions.loadPreset(preset);
    if (presetConfig) {
      showNotification('预设已加载', 'info');
    }
  };
  
  // 处理开始/暂停
  const handleStartPause = () => {
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
  };
  
  // 处理重置
  const handleReset = () => {
    if (confirm('确定要重置计时器吗？')) {
      actions.resetTimer();
      showNotification('计时器已重置', 'info');
    }
  };
  
  // 处理配置更改
  const handleConfigChange = (newConfig) => {
    actions.saveConfig(newConfig);
  };
  
  // 获取状态文本
  const getStatusText = () => {
    return t(`timer.status.${state.currentPhase}`);
  };
  
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
    <div className="container">
      {/* 语言切换器 - 放在容器顶部 */}
      <LanguageSwitcher />

      {/* 标题区域 */}
      <div className="header">
        <h1>Focus Flow</h1>
        <p>基于神经科学的智能学习计时器</p>
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
          label="总进度"
        />
        
        <ProgressBar 
          value={state.stageProgress}
          label={state.currentPhase === 'stage' ? '阶段进度' : '休息进度'}
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
        onClose={() => setIsSettingsOpen(false)}
      />
      
      {/* 计时器设置模态框 */}
      <SettingsPanel 
        isOpen={isTimerSettingsOpen}
        onClose={() => setIsTimerSettingsOpen(false)}
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
  );
}

export default App;