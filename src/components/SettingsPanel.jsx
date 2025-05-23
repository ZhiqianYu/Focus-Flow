import React, { useState, useEffect } from 'react';
import '../styles/SettingsPanel.css';

const SettingsPanel = ({ config, onConfigChange }) => {
  const [localConfig, setLocalConfig] = useState(config);
  
  useEffect(() => {
    setLocalConfig(config);
  }, [config]);
  
  const handleInputChange = (section, field, value) => {
    const updatedConfig = {
      ...localConfig,
      [section]: {
        ...localConfig[section],
        [field]: parseInt(value) || 0
      }
    };
    
    setLocalConfig(updatedConfig);
    onConfigChange(updatedConfig);
  };
  
  return (
    <div className="settings-panel">
      <div className="setting-group">
        <div className="setting-label">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          总时间
        </div>
        <div className="time-inputs">
          <div className="time-input-group">
            <input 
              type="number" 
              className="time-input" 
              value={localConfig.totalTime.hours}
              onChange={(e) => handleInputChange('totalTime', 'hours', e.target.value)} 
              min="0" 
              max="23" 
            />
            <span className="time-unit">时</span>
          </div>
          <div className="time-input-group">
            <input 
              type="number" 
              className="time-input" 
              value={localConfig.totalTime.minutes}
              onChange={(e) => handleInputChange('totalTime', 'minutes', e.target.value)} 
              min="0" 
              max="59" 
            />
            <span className="time-unit">分</span>
          </div>
          <div className="time-input-group">
            <input 
              type="number" 
              className="time-input" 
              value={localConfig.totalTime.seconds}
              onChange={(e) => handleInputChange('totalTime', 'seconds', e.target.value)} 
              min="0" 
              max="59" 
            />
            <span className="time-unit">秒</span>
          </div>
        </div>
      </div>

      <div className="setting-group">
        <div className="setting-label">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          阶段时间
        </div>
        <div className="time-inputs">
          <div className="time-input-group">
            <input 
              type="number" 
              className="time-input" 
              value={localConfig.stageTime.hours}
              onChange={(e) => handleInputChange('stageTime', 'hours', e.target.value)} 
              min="0" 
              max="23" 
            />
            <span className="time-unit">时</span>
          </div>
          <div className="time-input-group">
            <input 
              type="number" 
              className="time-input" 
              value={localConfig.stageTime.minutes}
              onChange={(e) => handleInputChange('stageTime', 'minutes', e.target.value)} 
              min="0" 
              max="59" 
            />
            <span className="time-unit">分</span>
          </div>
          <div className="time-input-group">
            <input 
              type="number" 
              className="time-input" 
              value={localConfig.stageTime.seconds}
              onChange={(e) => handleInputChange('stageTime', 'seconds', e.target.value)} 
              min="0" 
              max="59" 
            />
            <span className="time-unit">秒</span>
          </div>
        </div>
      </div>

      <div className="setting-group">
        <div className="setting-label">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
          随机提醒间隔
        </div>
        <div className="time-inputs">
          <div className="time-input-group">
            <input 
              type="number" 
              className="time-input" 
              value={localConfig.randomReminder.min}
              onChange={(e) => handleInputChange('randomReminder', 'min', e.target.value)} 
              min="1" 
              max="60" 
            />
            <span className="time-unit">分钟</span>
          </div>
          <span style={{ margin: '0 10px' }}>-</span>
          <div className="time-input-group">
            <input 
              type="number" 
              className="time-input" 
              value={localConfig.randomReminder.max}
              onChange={(e) => handleInputChange('randomReminder', 'max', e.target.value)} 
              min="1" 
              max="60" 
            />
            <span className="time-unit">分钟</span>
          </div>
        </div>
      </div>

      <div className="setting-group">
        <div className="setting-label">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
          </svg>
          休息时间设置
        </div>
        <div style={{ marginLeft: '28px' }}>
          <div style={{ marginBottom: '10px' }}>
            <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>短休息：</span>
            <div className="time-inputs" style={{ display: 'inline-flex', marginLeft: '10px' }}>
              <div className="time-input-group">
                <input 
                  type="number" 
                  className="time-input" 
                  value={localConfig.shortBreak.minutes}
                  onChange={(e) => handleInputChange('shortBreak', 'minutes', e.target.value)} 
                  min="0" 
                  max="59" 
                />
                <span className="time-unit">分</span>
              </div>
              <div className="time-input-group">
                <input 
                  type="number" 
                  className="time-input" 
                  value={localConfig.shortBreak.seconds}
                  onChange={(e) => handleInputChange('shortBreak', 'seconds', e.target.value)} 
                  min="0" 
                  max="59" 
                />
                <span className="time-unit">秒</span>
              </div>
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>阶段休息：</span>
            <div className="time-inputs" style={{ display: 'inline-flex', marginLeft: '10px' }}>
              <div className="time-input-group">
                <input 
                  type="number" 
                  className="time-input" 
                  value={localConfig.stageBreak.minutes}
                  onChange={(e) => handleInputChange('stageBreak', 'minutes', e.target.value)} 
                  min="0" 
                  max="59" 
                />
                <span className="time-unit">分</span>
              </div>
              <div className="time-input-group">
                <input 
                  type="number" 
                  className="time-input" 
                  value={localConfig.stageBreak.seconds}
                  onChange={(e) => handleInputChange('stageBreak', 'seconds', e.target.value)} 
                  min="0" 
                  max="59" 
                />
                <span className="time-unit">秒</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;