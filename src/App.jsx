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

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  
  const timer = useTimer();
  const { state, actions, utils } = timer;
  
  // 显示通知
  const showNotification = (message, type = 'success', duration = 3000) => {
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
        showNotification('计时开始！', 'success');
      } else if (state.isPaused) {
        showNotification('计时已暂停', 'info');
      } else {
        showNotification('计时继续', 'info');
      }
    } else {
      showNotification('请设置总时间和阶段时间', 'error');
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
    const statusMap = {
      'ready': '准备开始',
      'stage': '专注学习中',
      'shortBreak': '短暂回顾',
      'stageBreak': '阶段休息'
    };
    return statusMap[state.currentPhase] || '准备开始';
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
        />
        
        {/* 设置面板 */}
        <SettingsPanel 
          config={state.config}
          onConfigChange={handleConfigChange}
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
      
      {/* 控制按钮 */}
      <ControlButtons 
        isRunning={state.isRunning}
        isPaused={state.isPaused}
        onStartPause={handleStartPause}
        onReset={handleReset}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
      
      {/* 音频设置模态框 */}
      <AudioSettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
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