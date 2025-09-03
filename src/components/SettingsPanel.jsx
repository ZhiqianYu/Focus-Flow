import React, { useState, useEffect } from 'react';
import '../styles/SettingsPanel.css';
import { useTranslation } from 'react-i18next';
import settingsManager from '../utils/SettingsManager';

const SettingsPanel = ({ isOpen, onClose, config, onConfigChange, activePreset, onResetToDefault }) => {
  const [localConfig, setLocalConfig] = useState(config);
  const [presetName, setPresetName] = useState('');
  const [showCreatePreset, setShowCreatePreset] = useState(false);
  const { t } = useTranslation();
  
  useEffect(() => {
    // 使用 JSON 序列化进行深度比较,只在配置真正变化时更新
    if (JSON.stringify(localConfig) !== JSON.stringify(config)) {
      setLocalConfig(config);
    }
  }, [config]);
  
  const handleInputChange = (section, field, value) => {
    // 允许空字符串以便可以删除0
    let newValue = value === '' ? '' : parseInt(value, 10);
    
    // 应用最大值限制
    if (typeof newValue === 'number' && !isNaN(newValue)) {
      if (field === 'hours' && newValue > 23) newValue = 23;
      if ((field === 'minutes' || field === 'seconds') && newValue > 59) newValue = 59;
      if ((section === 'randomReminder') && (field === 'min' || field === 'max') && newValue > 60) newValue = 60;
    }
    
    const updatedConfig = {
      ...localConfig,
      [section]: {
        ...localConfig[section],
        [field]: newValue
      }
    };
    
    setLocalConfig(updatedConfig);
    // 立即应用更改
    onConfigChange(updatedConfig);
  };

  // 添加新方法处理失去焦点事件
  const handleBlur = (section, field) => {
    const updatedConfig = {
      ...localConfig
    };
    
    // 当输入框为空时，恢复为0
    if (localConfig[section][field] === '' || localConfig[section][field] === null) {
      updatedConfig[section] = {
        ...updatedConfig[section],
        [field]: 0
      };
      setLocalConfig(updatedConfig);
    }
    
    // 应用更改
    onConfigChange(updatedConfig);
  };

  const handleSave = () => {
    // 确保最后一次应用更改
    onConfigChange(localConfig);
    onClose();
  };

  const handleResetToDefault = () => {
    if (confirm(t('settings.confirmReset'))) {
      onResetToDefault();
    }
  };

  const handleCreatePreset = () => {
    if (!presetName.trim()) {
      alert(t('settings.nameRequired'));
      return;
    }
    
    if (presetName.length > 4) {
      alert(t('settings.nameTooLong'));
      return;
    }

    const userPresets = settingsManager.getUserCustomPresets();
    if (userPresets.length >= 2) {
      alert(t('settings.maxPresets'));
      return;
    }

    const presetId = `custom_${Date.now()}`;
    const newPreset = {
      id: presetId,
      name: presetName.trim(),
      config: localConfig
    };

    if (settingsManager.addUserCustomPreset(newPreset)) {
      setPresetName('');
      setShowCreatePreset(false);
      onConfigChange(localConfig);
      onClose();
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="settings-modal">
      <div className="settings-modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{t('settings.title')}</h2>
          <button className="close-btn" onClick={onClose}>
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </button>
        </div>
        
        <div className="settings-panel">
          {/* 预设名称编辑 - 仅在非custom模式显示 */}
          {activePreset && activePreset !== 'custom' && (
            <div className="setting-group">
              <div className="setting-label">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                </svg>
                {t('settings.presetName')}
              </div>
              <div style={{ color: '#6b7280', fontSize: '0.9rem', marginLeft: '28px' }}>
                {t(`presets.${activePreset}`)}
              </div>
            </div>
          )}

          {/* 自定义预设创建 - 仅在custom模式显示 */}
          {activePreset === 'custom' && (
            <div className="setting-group">
              <div className="setting-label">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                {t('settings.createPreset')}
              </div>
              {!showCreatePreset ? (
                <button 
                  className="btn btn-secondary"
                  style={{ marginLeft: '28px', padding: '6px 12px', fontSize: '0.9rem' }}
                  onClick={() => setShowCreatePreset(true)}
                >
                  {t('settings.createPreset')}
                </button>
              ) : (
                <div style={{ marginLeft: '28px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    placeholder={t('settings.presetName')}
                    maxLength="4"
                    style={{
                      padding: '6px 8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '0.9rem',
                      width: '80px'
                    }}
                  />
                  <button 
                    className="btn btn-primary"
                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                    onClick={handleCreatePreset}
                  >
                    ✓
                  </button>
                  <button 
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                    onClick={() => setShowCreatePreset(false)}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="setting-group">
            <div className="setting-label">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {t('settings.totalTime')}
            </div>
            <div className="time-inputs">
              <div className="time-input-group">
                <input 
                  type="number" 
                  className="time-input" 
                  value={localConfig.totalTime.hours}
                  onChange={(e) => handleInputChange('totalTime', 'hours', e.target.value)} 
                  onBlur={() => handleBlur('totalTime', 'hours')}
                  min="0" 
                  max="23" 
                />
                <span className="time-unit">{t('time.hour')}</span>
              </div>
              <div className="time-input-group">
                <input 
                  type="number" 
                  className="time-input" 
                  value={localConfig.totalTime.minutes}
                  onChange={(e) => handleInputChange('totalTime', 'minutes', e.target.value)} 
                  onBlur={() => handleBlur('totalTime', 'minutes')}
                  min="0" 
                  max="59" 
                />
                <span className="time-unit">{t('time.minute')}</span>
              </div>
              <div className="time-input-group">
                <input 
                  type="number" 
                  className="time-input" 
                  value={localConfig.totalTime.seconds}
                  onChange={(e) => handleInputChange('totalTime', 'seconds', e.target.value)} 
                  onBlur={() => handleBlur('totalTime', 'seconds')}
                  min="0" 
                  max="59" 
                />
                <span className="time-unit">{t('time.second')}</span>
              </div>
            </div>
          </div>

          <div className="setting-group">
            <div className="setting-label">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              {t('settings.stageTime')}
            </div>
            <div className="time-inputs">
              <div className="time-input-group">
                <input 
                  type="number" 
                  className="time-input" 
                  value={localConfig.stageTime.hours}
                  onChange={(e) => handleInputChange('stageTime', 'hours', e.target.value)} 
                  onBlur={() => handleBlur('totalTime', 'hours')}
                  min="0" 
                  max="23" 
                />
                <span className="time-unit">{t('time.hour')}</span>
              </div>
              <div className="time-input-group">
                <input 
                  type="number" 
                  className="time-input" 
                  value={localConfig.stageTime.minutes}
                  onChange={(e) => handleInputChange('stageTime', 'minutes', e.target.value)} 
                  onBlur={() => handleBlur('totalTime', 'minutes')}
                  min="0" 
                  max="59" 
                />
                <span className="time-unit">{t('time.minute')}</span>
              </div>
              <div className="time-input-group">
                <input 
                  type="number" 
                  className="time-input" 
                  value={localConfig.stageTime.seconds}
                  onChange={(e) => handleInputChange('stageTime', 'seconds', e.target.value)} 
                  onBlur={() => handleBlur('totalTime', 'seconds')}
                  min="0" 
                  max="59" 
                />
                <span className="time-unit">{t('time.second')}</span>
              </div>
            </div>
          </div>

          <div className="setting-group">
            <div className="setting-label">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
              {t('settings.randomReminder')}
            </div>
            <div className="time-inputs">
              <div className="time-input-group">
                <input 
                  type="number" 
                  className="time-input" 
                  value={localConfig.randomReminder.min}
                  onChange={(e) => handleInputChange('randomReminder', 'min', e.target.value)} 
                  onBlur={() => handleBlur('totalTime', 'min')}
                  min="1" 
                  max="60" 
                />
                <span className="time-unit">{t('time.minutes')}</span>
              </div>
              <span style={{ margin: '0 10px' }}>-</span>
              <div className="time-input-group">
                <input 
                  type="number" 
                  className="time-input" 
                  value={localConfig.randomReminder.max}
                  onChange={(e) => handleInputChange('randomReminder', 'max', e.target.value)} 
                  onBlur={() => handleBlur('totalTime', 'max')}
                  min="1" 
                  max="60" 
                />
                <span className="time-unit">{t('time.minutes')}</span>
              </div>
            </div>
          </div>

          <div className="setting-group">
            <div className="setting-label">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
              </svg>
              {t('settings.breakSettings')}
            </div>
            <div style={{ marginLeft: '28px' }}>
              <div style={{ marginBottom: '10px' }}>
                <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>{t('settings.shortBreak')}：</span>
                <div className="time-inputs" style={{ display: 'inline-flex', marginLeft: '10px' }}>
                  <div className="time-input-group">
                    <input 
                      type="number" 
                      className="time-input" 
                      value={localConfig.shortBreak.minutes}
                      onChange={(e) => handleInputChange('shortBreak', 'minutes', e.target.value)} 
                      onBlur={() => handleBlur('totalTime', 'minutes')}
                      min="0" 
                      max="59" 
                    />
                    <span className="time-unit">{t('time.minute')}</span>
                  </div>
                  <div className="time-input-group">
                    <input 
                      type="number" 
                      className="time-input" 
                      value={localConfig.shortBreak.seconds}
                      onChange={(e) => handleInputChange('shortBreak', 'seconds', e.target.value)} 
                      onBlur={() => handleBlur('totalTime', 'seconds')}
                      min="0" 
                      max="59" 
                    />
                    <span className="time-unit">{t('time.second')}</span>
                  </div>
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>{t('settings.stageBreak')}：</span>
                <div className="time-inputs" style={{ display: 'inline-flex', marginLeft: '10px' }}>
                  <div className="time-input-group">
                    <input 
                      type="number" 
                      className="time-input" 
                      value={localConfig.stageBreak.minutes}
                      onChange={(e) => handleInputChange('stageBreak', 'minutes', e.target.value)} 
                      onBlur={() => handleBlur('totalTime', 'minutes')}
                      min="0" 
                      max="59" 
                    />
                    <span className="time-unit">{t('time.minute')}</span>
                  </div>
                  <div className="time-input-group">
                    <input 
                      type="number" 
                      className="time-input" 
                      value={localConfig.stageBreak.seconds}
                      onChange={(e) => handleInputChange('stageBreak', 'seconds', e.target.value)} 
                      onBlur={() => handleBlur('totalTime', 'hours')}
                      min="0" 
                      max="59" 
                    />
                    <span className="time-unit">{t('time.second')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={handleResetToDefault}>
            {t('settings.resetToDefault')}
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            {t('settings.save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;