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
import settingsManager from './utils/SettingsManager';

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

// 判断是否为横屏布局的hook
function useIsLandscape() {
  const { width, height } = useWindowSize();
  return width >= 769 && width > height;
}

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTimerSettingsOpen, setIsTimerSettingsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [currentActivePreset, setCurrentActivePreset] = useState(() => {
    return settingsManager.getActivePreset() || null;
  });
  const { width, height } = useWindowSize();
  const isLandscape = useIsLandscape();
  
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
    setCurrentActivePreset(preset);
    settingsManager.setActivePreset(preset);
    
    if (preset === 'custom') {
      // 如果选择自定义，打开计时器设置面板
      setIsTimerSettingsOpen(true);
      return;
    }
    
    const presetConfig = actions.loadPreset(preset);
    if (presetConfig) {
      showNotification(t('notifications.presetLoaded'), 'info');
    }
  }, [actions, showNotification, t]);

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
      showNotification(t('notifications.reset'), 'info');
    }
  }, [actions, showNotification]);

  // 处理配置更改
  const handleConfigChange = useCallback((newConfig) => {
    actions.saveConfig(newConfig);
  }, [actions]);

  // 处理恢复默认设置
  const handleResetToDefault = useCallback(() => {
    if (currentActivePreset && currentActivePreset !== 'custom') {
      // 删除当前预设的自定义配置，恢复默认
      settingsManager.removeCustomPresetConfig(currentActivePreset);
      // 重新加载预设
      const presetConfig = actions.loadPreset(currentActivePreset);
      if (presetConfig) {
        showNotification(t('notifications.resetToDefault'), 'info');
      }
    }
  }, [currentActivePreset, actions, showNotification, t]);

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
      <div className={`container ${isLandscape ? 'landscape-layout' : ''}`}>
        {isLandscape ? (
          // 横屏布局
          <>
            
            <div className="landscape-left">
              {/* 大时间显示 */}
              <div className="landscape-main-timer">
                {/* 音频设置按钮 - 左上角 */}
                <button className="settings-icon audio-settings-icon" onClick={() => setIsSettingsOpen(true)} title={t('audio.settings')}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                  </svg>
                </button>
                {/* 计时器设置按钮 - 右上角 */}
                <button className="settings-icon timer-settings-icon" onClick={() => setIsTimerSettingsOpen(true)} title={t('settings.title')}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </button>

                {/* 开始计时按钮 - 左下角 */}
                <button className={`control-btn start-pause-btn ${state.isRunning ? 'running' : ''}`} onClick={handleStartPause}>
                  {state.isRunning && !state.isPaused ? (
                    // 暂停图标
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                    </svg>
                  ) : (
                    // 播放图标
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  )}
                  <span className="control-btn-text">
                    {state.isRunning && !state.isPaused ? t('timer.pause') : t('timer.start')}
                  </span>
                </button>

                {/* 重置按钮 - 右下角 */}
                <button className={`control-btn reset-btn ${state.isRunning ? 'running' : ''}`} onClick={handleReset}>
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  <span className="control-btn-text">{t('timer.reset')}</span>
                </button>
                
                <div className="landscape-timer-main">
                  {utils.formatTime(state.totalTimeLeft)}
                </div>
                <div className="landscape-timer-status">
                  {getStatusText()}
                </div>
              </div>
              
              {/* 进度条区域 */}
              <div className="landscape-progress-area">
                <ProgressBar 
                  value={state.totalProgress}
                  label={t('progress.total')}
                />
                <ProgressBar 
                  value={state.stageProgress}
                  label={state.currentPhase === 'stage' ? t('progress.stage') : t('progress.break')}
                />
              </div>

            </div>
            
            <div className="landscape-right">
              {/* 语言切换器和标题区域 */}
              <div className="landscape-header-with-lang">
                <div className="landscape-lang-switcher">
                  <LanguageSwitcher />
                </div>
                <div className="landscape-header">
                  <h2>{t('app.name')}</h2>
                </div>
              </div>
              
              {/* 预设按钮 */}
              <PresetButtons onSelectPreset={handlePresetSelect} />
              
              {/* 阶段信息显示 */}
              <div className="landscape-stage-info-wrapper">
                <div className="landscape-stage-info">
                  <div className="landscape-info-item">
                    <span className="landscape-info-label">{t('timer.stageTime')}</span>
                    <span className="landscape-info-time">{utils.formatTime(state.stageTimeLeft)}</span>
                  </div>
                  <div className="landscape-info-item">
                    <span className="landscape-info-label">{t('timer.breakTime')}</span>
                    <div className="landscape-break-times">
                      <div className="landscape-break-item">
                        <span className="landscape-break-label">{t('settings.shortBreak')}</span>
                        <span className="landscape-break-time">{utils.formatTime(utils.calculateSeconds(state.config.shortBreak))}</span>
                      </div>
                      <div className="landscape-break-item">
                        <span className="landscape-break-label">{t('settings.stageBreak')}</span>
                        <span className="landscape-break-time">{utils.formatTime(utils.calculateSeconds(state.config.stageBreak))}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 关于和捐赠按钮 - 外部底部 */}
                <div className="landscape-stage-info-buttons">
                  <DonateButton />
                  <button className="landscape-about-link" onClick={() => setIsAboutOpen(true)}>
                    {t('footer.about')}
                  </button>
                </div>
              </div>
              
            </div>
          </>
        ) : (
          // 竖屏布局（原布局）
          <>
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
          </>
        )}

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
          activePreset={currentActivePreset}
          onResetToDefault={handleResetToDefault}
        />
        
        {/* 通知提示 */}
        <Notification
          message={notification?.message}
          type={notification?.type}
          duration={notification?.duration}
          onClose={() => setNotification(null)}
        />
        
        {/* 关于模态框 */}
        {isAboutOpen && (
          <div className="about-modal">
            <div className="about-modal-content">
              <button 
                className="close-about-modal"
                onClick={() => setIsAboutOpen(false)}
              >
                ×
              </button>
              
              <div className="about-info">
                <div className="info-header">
                  <h3>{t('about.title')}</h3>
                  <p>{t('about.description')}</p>
                </div>
                <div className="author-section">
                  <h4>{t('about.author')}</h4>
                  <p>{t('about.by')} <a href="https://github.com/ZhiqianYu" target="_blank" rel="noopener noreferrer">Zhiqian Yu</a> {t('about.develop')}</p>
                  <p>{t('about.contact')}: <a href="mailto:yu-zhiqian@outlook.com">{t('about.sendEmail')}</a></p>
                </div>
                <div className="license-section">
                  <h4>{t('about.licenseTitle')}</h4>
                  <p><a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer">MIT {t('about.license')} + {t('about.comD')}</a></p>
                </div>
                <div className="version-info">
                  <p>{t('about.version')}: v1.0.0</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>

  );
}

export default App;