import { useState, useEffect, useRef, useCallback } from 'react';
import audioGenerator from '../utils/AudioGenerator';

const DEFAULT_CONFIG = {
  totalTime: { hours: 2, minutes: 0, seconds: 0 },
  stageTime: { hours: 0, minutes: 25, seconds: 0 },
  randomReminder: { min: 3, max: 5 },
  shortBreak: { minutes: 0, seconds: 10 },
  stageBreak: { minutes: 5, seconds: 0 }
};

// 预设配置
const PRESETS = {
  pomodoro: {
    totalTime: { hours: 2, minutes: 0, seconds: 0 },
    stageTime: { hours: 0, minutes: 25, seconds: 0 },
    randomReminder: { min: 3, max: 5 },
    shortBreak: { minutes: 0, seconds: 10 },
    stageBreak: { minutes: 5, seconds: 0 }
  },
  deepwork: {
    totalTime: { hours: 4, minutes: 0, seconds: 0 },
    stageTime: { hours: 1, minutes: 30, seconds: 0 },
    randomReminder: { min: 5, max: 10 },
    shortBreak: { minutes: 0, seconds: 15 },
    stageBreak: { minutes: 15, seconds: 0 }
  },
  study: {
    totalTime: { hours: 3, minutes: 0, seconds: 0 },
    stageTime: { hours: 0, minutes: 45, seconds: 0 },
    randomReminder: { min: 4, max: 7 },
    shortBreak: { minutes: 0, seconds: 10 },
    stageBreak: { minutes: 10, seconds: 0 }
  }
};

const useTimer = () => {
  // 计时器状态
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('ready'); // ready, stage, shortBreak, stageBreak
  const [totalTimeLeft, setTotalTimeLeft] = useState(0);
  const [stageTimeLeft, setStageTimeLeft] = useState(0);
  const [breakTimeLeft, setBreakTimeLeft] = useState(0);
  const [nextReminderTime, setNextReminderTime] = useState(0);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [totalProgress, setTotalProgress] = useState(0);
  const [stageProgress, setStageProgress] = useState(0);
  
  // 引用保存定时器
  const timerRef = useRef(null);
  
  // 计算时间总秒数
  const calculateSeconds = useCallback((timeObj) => {
    return (timeObj.hours || 0) * 3600 + 
           (timeObj.minutes || 0) * 60 + 
           (timeObj.seconds || 0);
  }, []);
  
  // 格式化时间显示
  const formatTime = useCallback((seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }, []);
  
  // 加载预设
  const loadPreset = useCallback((presetName) => {
    if (presetName === 'custom') {
      return;
    }

    const preset = PRESETS[presetName];
    if (!preset) return;
    
    setConfig(preset);
    return preset;
  }, []);
  
  // 开始/暂停计时器
  const toggleTimer = useCallback(() => {
    if (!isRunning) {
      // 开始计时
      const totalSeconds = calculateSeconds(config.totalTime);
      const stageSeconds = calculateSeconds(config.stageTime);
      
      if (totalSeconds === 0 || stageSeconds === 0) {
        return false;
      }
      
      setTotalTimeLeft(totalSeconds);
      setStageTimeLeft(stageSeconds);
      setBreakTimeLeft(0);
      setCurrentPhase('stage');
      setIsRunning(true);
      setIsPaused(false);
      
      // 设置下次随机提醒时间
      const minSeconds = config.randomReminder.min * 60;
      const maxSeconds = config.randomReminder.max * 60;
      setNextReminderTime(Math.floor(Math.random() * (maxSeconds - minSeconds + 1)) + minSeconds);
      
      audioGenerator.playSound('start');
      return true;
    } else if (!isPaused) {
      // 暂停
      setIsPaused(true);
      return true;
    } else {
      // 继续
      setIsPaused(false);
      return true;
    }
  }, [isRunning, isPaused, config, calculateSeconds]);
  
  // 重置计时器
  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setCurrentPhase('ready');
    setTotalTimeLeft(0);
    setStageTimeLeft(0);
    setBreakTimeLeft(0);
    setNextReminderTime(0);
    setTotalProgress(0);
    setStageProgress(0);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  
  // 更新进度
  useEffect(() => {
    if (isRunning) {
      // 更新总进度
      const totalSeconds = calculateSeconds(config.totalTime);
      const totalProgressValue = totalSeconds > 0 ? 
        ((totalSeconds - totalTimeLeft) / totalSeconds * 100) : 0;
      setTotalProgress(totalProgressValue);
      
      // 更新阶段进度
      if (currentPhase === 'stage') {
        const stageSeconds = calculateSeconds(config.stageTime);
        const stageProgressValue = stageSeconds > 0 ? 
          ((stageSeconds - stageTimeLeft) / stageSeconds * 100) : 0;
        setStageProgress(stageProgressValue);
      } else if (currentPhase === 'shortBreak' || currentPhase === 'stageBreak') {
        const breakType = currentPhase === 'shortBreak' ? 'shortBreak' : 'stageBreak';
        const breakSeconds = calculateSeconds(config[breakType]);
        const breakProgressValue = breakSeconds > 0 ? 
          ((breakSeconds - breakTimeLeft) / breakSeconds * 100) : 0;
        setStageProgress(breakProgressValue);
      }
    }
  }, [isRunning, totalTimeLeft, stageTimeLeft, breakTimeLeft, currentPhase, config, calculateSeconds]);
  
  // 计时器逻辑
  useEffect(() => {
    if (isRunning && !isPaused) {
      timerRef.current = setInterval(() => {
        setTotalTimeLeft(prev => {
          if (prev > 0) return prev - 1;
          return 0;
        });
        
        if (currentPhase === 'stage') {
          setStageTimeLeft(prev => {
            if (prev > 0) return prev - 1;
            return 0;
          });
          
          setNextReminderTime(prev => {
            if (prev > 0) return prev - 1;
            return 0;
          });
        } else if (currentPhase === 'shortBreak' || currentPhase === 'stageBreak') {
          setBreakTimeLeft(prev => {
            if (prev > 0) return prev - 1;
            return 0;
          });
        }
      }, 1000);
      
      return () => {
        clearInterval(timerRef.current);
      };
    }
  }, [isRunning, isPaused, currentPhase]);
  
  // 处理阶段转换
  useEffect(() => {
    if (isRunning && !isPaused) {
      // 检查随机提醒
      if (currentPhase === 'stage' && nextReminderTime <= 0 && stageTimeLeft > 0) {
        audioGenerator.playSound('random');
        setCurrentPhase('shortBreak');
        setBreakTimeLeft(calculateSeconds(config.shortBreak));
      }
      
      // 检查阶段结束
      if (currentPhase === 'stage' && stageTimeLeft <= 0) {
        audioGenerator.playSound('stageBreak');
        setCurrentPhase('stageBreak');
        setBreakTimeLeft(calculateSeconds(config.stageBreak));
      }
      
      // 检查休息结束
      if (currentPhase === 'shortBreak' && breakTimeLeft <= 0) {
        audioGenerator.playSound('start');
        setCurrentPhase('stage');
        // 重新设置随机提醒时间
        const minSeconds = config.randomReminder.min * 60;
        const maxSeconds = config.randomReminder.max * 60;
        setNextReminderTime(Math.floor(Math.random() * (maxSeconds - minSeconds + 1)) + minSeconds);
      }
      
      // 检查阶段休息结束
      if (currentPhase === 'stageBreak' && breakTimeLeft <= 0 && totalTimeLeft > 0) {
        audioGenerator.playSound('start');
        setCurrentPhase('stage');
        setStageTimeLeft(calculateSeconds(config.stageTime));
        // 重新设置随机提醒时间
        const minSeconds = config.randomReminder.min * 60;
        const maxSeconds = config.randomReminder.max * 60;
        setNextReminderTime(Math.floor(Math.random() * (maxSeconds - minSeconds + 1)) + minSeconds);
      }
      
      // 检查总时间结束
      if (totalTimeLeft <= 0) {
        audioGenerator.playSound('end');
        resetTimer();
      }
    }
  }, [
    isRunning, 
    isPaused, 
    currentPhase, 
    nextReminderTime, 
    stageTimeLeft, 
    breakTimeLeft, 
    totalTimeLeft, 
    config, 
    calculateSeconds, 
    resetTimer
  ]);
  
  // 保存和加载配置
  const saveConfig = useCallback(async (newConfig) => {
    setConfig(newConfig);
    
    // 如果在Electron环境中，保存到本地文件
    if (window.electronAPI) {
      try {
        await window.electronAPI.saveConfig(newConfig);
      } catch (error) {
        console.error('保存配置失败:', error);
      }
    } else {
      // 在浏览器环境中使用localStorage
      localStorage.setItem('timerConfig', JSON.stringify(newConfig));
    }
  }, []);
  
  const loadSavedConfig = useCallback(async () => {
    let savedConfig = null;
    
    // 如果在Electron环境中，从本地文件加载
    if (window.electronAPI) {
      try {
        savedConfig = await window.electronAPI.loadConfig();
      } catch (error) {
        console.error('加载配置失败:', error);
      }
    } else {
      // 在浏览器环境中使用localStorage
      const saved = localStorage.getItem('timerConfig');
      if (saved) {
        savedConfig = JSON.parse(saved);
      }
    }
    
    if (savedConfig) {
      setConfig(savedConfig);
    }
  }, []);
  
  // Electron事件监听
  useEffect(() => {
    if (window.electronAPI) {
      // 监听来自主进程的消息
      window.electronAPI.onToggleTimer(() => toggleTimer());
      window.electronAPI.onResetTimer(() => {
        if (confirm('确定要重置计时器吗？')) {
          resetTimer();
        }
      });
      
      return () => {
        // 清理事件监听
        window.electronAPI.removeAllListeners('toggle-timer');
        window.electronAPI.removeAllListeners('reset-timer');
      };
    }
  }, [toggleTimer, resetTimer]);
  
  // 组件加载时加载配置
  useEffect(() => {
    loadSavedConfig();
  }, [loadSavedConfig]);
  
  return {
    state: {
      isRunning,
      isPaused,
      currentPhase,
      totalTimeLeft,
      stageTimeLeft,
      breakTimeLeft,
      totalProgress,
      stageProgress,
      config
    },
    actions: {
      toggleTimer,
      resetTimer,
      loadPreset,
      saveConfig,
      setConfig
    },
    utils: {
      formatTime,
      calculateSeconds
    }
  };
};

export default useTimer;