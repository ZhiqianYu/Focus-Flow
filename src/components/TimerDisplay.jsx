import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/TimerDisplay.css';

const TimerDisplay = ({ 
  mainTime, 
  stageTime, 
  breakTime, 
  status, 
  phase,
  onOpenAudioSettings,
  onOpenTimerSettings
}) => {

  const { t } = useTranslation();
  
  return (
    <div className="timer-display">
      {/* 音频设置按钮 - 左上角 */}
      <button className="settings-icon audio-settings-icon" onClick={onOpenAudioSettings} title={t('audio.settings')}>
        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
        </svg>
      </button>
      
      {/* 计时器设置按钮 - 右上角 */}
      <button className="settings-icon timer-settings-icon" onClick={onOpenTimerSettings} title={t('settings.title')}>
        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
      </button>
      
      <div className="timer-main">{mainTime}</div>
      <div className="timer-status">{status}</div>
      <div className="timer-sub">
        <div className="timer-item">
          <div className="timer-item-label">{t('timer.stageTime')}</div>
          <div className="timer-item-time">{stageTime}</div>
        </div>
        <div className="timer-item">
          <div className="timer-item-label">{t('timer.breakTime')}</div>
          <div className="timer-item-time">{breakTime}</div>
        </div>
      </div>
    </div>
  );
};

export default TimerDisplay;