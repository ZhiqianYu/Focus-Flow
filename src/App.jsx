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

// 判断是否为横屏布局的hook - 基于屏幕宽高比
function useIsLandscape() {
  const { width, height } = useWindowSize();
  return width > height; // 只需要宽度大于高度即为横屏
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
    
    // 检查是否是用户自定义预设
    const userPresets = settingsManager.getUserCustomPresets();
    const userPreset = userPresets.find(p => p.id === preset);
    
    if (userPreset) {
      // 加载用户自定义预设配置
      actions.saveConfig(userPreset.config);
      showNotification(t('notifications.presetLoaded'), 'info');
      return;
    }
    
    // 加载内置预设
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
    if (currentActivePreset) {
      // 检查是否是内置预设
      const builtinPresets = ['pomodoro', 'deepwork', 'study'];
      if (builtinPresets.includes(currentActivePreset)) {
        // 删除当前预设的自定义配置，恢复默认
        settingsManager.removeCustomPresetConfig(currentActivePreset);
        // 重新加载预设
        const presetConfig = actions.loadPreset(currentActivePreset);
        if (presetConfig) {
          showNotification(t('notifications.resetToDefault'), 'info');
        }
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
  
  // 计算容器类名
  const containerClasses = [
    'container',
    isLandscape ? 'landscape-layout' : 'portrait-layout',
    state.isRunning && !state.isPaused ? 'timer-running' : ''
  ].filter(Boolean).join(' ');

  return (
    <>
      <DocumentHead />
      <div className={containerClasses}>
        {isLandscape ? (
          // 横屏双列布局
          <>
            <div className="landscape-left">
              {/* 主计时器区域 */}
              <div className="timer-section">
                {/* 音频和计时器设置按钮 */}
                <button className="icon-btn" style={{position: 'absolute', top: '16px', left: '16px'}} 
                        onClick={() => setIsSettingsOpen(true)} title={t('audio.settings')}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                  </svg>
                </button>
                <button className="icon-btn" style={{position: 'absolute', top: '16px', right: '16px'}} 
                        onClick={() => setIsTimerSettingsOpen(true)} title={t('settings.title')}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </button>
                
                {/* 主计时显示 */}
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                  <div className="landscape-timer-main">
                    {utils.formatTime(state.totalTimeLeft)}
                  </div>
                  <div className="landscape-timer-status">
                    {getStatusText()}
                  </div>
                </div>

                {/* 控制按钮 */}
                <div style={{position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '16px'}}>
                  <button className="btn-primary" onClick={handleStartPause}>
                    {state.isRunning && !state.isPaused ? t('timer.pause') : t('timer.start')}
                  </button>
                  <button className="btn-secondary" onClick={handleReset}>
                    {t('timer.reset')}
                  </button>
                </div>
              </div>
              
              {/* 进度区域 */}
              <div className="progress-section">
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
              {/* 上半部分内容 */}
              <div className="landscape-right-content">
                {/* 标题区域 */}
                <div className="header-section">
                  <div className="language-switcher">
                    <LanguageSwitcher />
                  </div>
                  <h1>{t('app.name')}</h1>
                </div>
                
                {/* 预设区域 */}
                <div className="presets-section">
                  <PresetButtons onSelectPreset={handlePresetSelect} />
                </div>
                
                {/* 阶段信息 */}
                <div className="stage-info-block">
                  <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <span>{t('timer.stageTime')}</span>
                      <span style={{fontWeight: 600, color: 'var(--primary)'}}>
                        {utils.formatTime(state.stageTimeLeft)}
                      </span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <span>{t('settings.shortBreak')}</span>
                      <span style={{fontWeight: 600, color: 'var(--primary)'}}>
                        {state.currentPhase === 'shortBreak' ? 
                          utils.formatTime(state.breakTimeLeft) : 
                          utils.formatTime(utils.calculateSeconds(state.config.shortBreak))
                        }
                      </span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <span>{t('settings.stageBreak')}</span>
                      <span style={{fontWeight: 600, color: 'var(--primary)'}}>
                        {state.currentPhase === 'stageBreak' ? 
                          utils.formatTime(state.breakTimeLeft) : 
                          utils.formatTime(utils.calculateSeconds(state.config.stageBreak))
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 底部按钮区域 */}
              <div className="landscape-bottom-buttons">
                <DonateButton />
                <button className="btn-small" onClick={() => setIsAboutOpen(true)}>
                  {t('footer.about')}
                </button>
              </div>
            </div>
          </>
        ) : (
          // 竖屏模块化布局：3-1-4-2-5
          <>
            {/* 模块3: 语言+标题+模式选择 */}
            <div className="module-3 header-section">
              <div className="language-switcher">
                <LanguageSwitcher />
              </div>
              <h1>{t('app.name')}</h1>
              <div className="presets-container">
                <PresetButtons onSelectPreset={handlePresetSelect} />
              </div>
            </div>
            
            {/* 模块1: 大蓝色计时器 */}
            <div className="module-1 timer-section">
              <TimerDisplay 
                mainTime={utils.formatTime(state.totalTimeLeft)}
                stageTime={utils.formatTime(state.stageTimeLeft)}
                shortBreakTime={utils.formatTime(utils.calculateSeconds(state.config.shortBreak))}
                stageBreakTime={utils.formatTime(utils.calculateSeconds(state.config.stageBreak))}
                currentBreakTime={utils.formatTime(state.breakTimeLeft)}
                status={getStatusText()}
                phase={state.currentPhase}
                isPortrait={!isLandscape}
                isTimerRunning={state.isRunning}
                onOpenAudioSettings={() => setIsSettingsOpen(true)}
                onOpenTimerSettings={() => setIsTimerSettingsOpen(true)}
              />
            </div>
            
            {/* 模块4: 阶段时间信息 */}
            <div className="module-4 stage-info-block">
              <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span>{t('timer.stageTime')}</span>
                  <span style={{fontWeight: 600, color: 'var(--primary)'}}>
                    {utils.formatTime(state.stageTimeLeft)}
                  </span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span>{t('settings.shortBreak')}</span>
                  <span style={{fontWeight: 600, color: 'var(--primary)'}}>
                    {state.currentPhase === 'shortBreak' ? 
                      utils.formatTime(state.breakTimeLeft) : 
                      utils.formatTime(utils.calculateSeconds(state.config.shortBreak))
                    }
                  </span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span>{t('settings.stageBreak')}</span>
                  <span style={{fontWeight: 600, color: 'var(--primary)'}}>
                    {state.currentPhase === 'stageBreak' ? 
                      utils.formatTime(state.breakTimeLeft) : 
                      utils.formatTime(utils.calculateSeconds(state.config.stageBreak))
                    }
                  </span>
                </div>
              </div>
            </div>
            
            {/* 模块2: 两个进度条 */}
            <div className="module-2 progress-section">
              <ProgressBar 
                value={state.totalProgress}
                label={t('progress.total')}
              />
              <ProgressBar 
                value={state.stageProgress}
                label={state.currentPhase === 'stage' ? t('progress.stage') : t('progress.break')}
              />
            </div>
            
            {/* 模块5: 捐赠+关于+控制按钮 */}
            <div className="module-5 controls-section">
              <div className="left-controls">
                <ControlButtons 
                  isRunning={state.isRunning}
                  isPaused={state.isPaused}
                  onStartPause={handleStartPause}
                  onReset={handleReset}
                />
              </div>
              <div className="right-controls">
                <DonateButton />
                <button className="btn-small" onClick={() => setIsAboutOpen(true)}>
                  {t('footer.about')}
                </button>
              </div>
            </div>
          </>
        )}

        {/* 模态框 */}
        <AudioSettingsModal 
          isOpen={isSettingsOpen}
          onClose={closeAudioSettings}
        />
        
        <SettingsPanel 
          isOpen={isTimerSettingsOpen}
          onClose={closeTimerSettings}
          config={state.config}
          onConfigChange={handleConfigChange}
          activePreset={currentActivePreset}
          onResetToDefault={handleResetToDefault}
        />
        
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
              <button className="close-about-modal" onClick={() => setIsAboutOpen(false)}>×</button>
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