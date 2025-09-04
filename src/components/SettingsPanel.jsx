import React, { useState, useEffect } from 'react';
import '../styles/SettingsPanel.css';
import { useTranslation } from 'react-i18next';
import settingsManager from '../utils/SettingsManager';

// 内置预设配置
const BUILT_IN_PRESETS = {
  pomodoro: {
    totalTime: { hours: 3, minutes: 0, seconds: 0 },
    stageTime: { hours: 0, minutes: 25, seconds: 0 },
    randomReminder: { min: 3, max: 5 },
    shortBreak: { minutes: 0, seconds: 10 },
    stageBreak: { minutes: 5, seconds: 0 }
  },
  deepwork: {
    totalTime: { hours: 6, minutes: 0, seconds: 0 },
    stageTime: { hours: 1, minutes: 30, seconds: 0 },
    randomReminder: { min: 5, max: 10 },
    shortBreak: { minutes: 0, seconds: 15 },
    stageBreak: { minutes: 15, seconds: 0 }
  },
  study: {
    totalTime: { hours: 8, minutes: 0, seconds: 0 },
    stageTime: { hours: 1, minutes: 30, seconds: 0 },
    randomReminder: { min: 3, max: 5 },
    shortBreak: { minutes: 0, seconds: 12 },
    stageBreak: { minutes: 15, seconds: 0 }
  }
};

const SettingsPanel = ({ isOpen, onClose, config, onConfigChange, activePreset, onResetToDefault }) => {
  const [localConfig, setLocalConfig] = useState(config);
  const [presetName, setPresetName] = useState('');
  const [showCreatePreset, setShowCreatePreset] = useState(false);
  const [userPresets, setUserPresets] = useState(() => settingsManager.getUserCustomPresets());
  const [editingPresetName, setEditingPresetName] = useState('');
  const [forceUpdateCounter, setForceUpdateCounter] = useState(0);
  const [isEditingName, setIsEditingName] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(activePreset);
  const { t } = useTranslation();
  
  // 强制重新渲染函数
  const forceUpdate = () => setForceUpdateCounter(prev => prev + 1);
  
  // 监听用户预设变化
  useEffect(() => {
    if (isOpen) {
      setUserPresets(settingsManager.getUserCustomPresets());
      setSelectedPreset(activePreset);
    }
  }, [isOpen, activePreset]);
  
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
    // 如果正在编辑内置预设，保存为自定义配置
    const builtinPresets = ['pomodoro', 'deepwork', 'study'];
    if (selectedPreset && builtinPresets.includes(selectedPreset)) {
      // 检查配置是否与默认不同
      const defaultConfig = BUILT_IN_PRESETS[selectedPreset];
      if (JSON.stringify(localConfig) !== JSON.stringify(defaultConfig)) {
        // 保存对内置预设的修改
        settingsManager.setCustomPresetConfig(selectedPreset, localConfig);
      }
    }
    
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

    const currentUserPresets = settingsManager.getUserCustomPresets();
    if (currentUserPresets.length >= 3) {
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
      setUserPresets(settingsManager.getUserCustomPresets()); // 更新本地状态
      onConfigChange(localConfig);
      // 不自动关闭设置页面，让用户可以继续调整设置
    }
  };

  const handleDeletePreset = (presetId) => {
    if (confirm(t('settings.confirmDeletePreset'))) {
      if (settingsManager.removeUserCustomPreset(presetId)) {
        setUserPresets(settingsManager.getUserCustomPresets()); // 更新本地状态
        // 如果删除的是当前选中的预设，清空选中状态
        if (selectedPreset === presetId) {
          setSelectedPreset(null);
        }
      }
    }
  };

  // 加载预设配置
  const handleLoadPreset = (presetId) => {
    let presetConfig;
    
    // 检查是否是内置预设
    if (BUILT_IN_PRESETS[presetId]) {
      // 先检查是否有自定义配置
      const customConfig = settingsManager.getCustomPresetConfig(presetId);
      presetConfig = customConfig || BUILT_IN_PRESETS[presetId];
    } else {
      // 检查用户自定义预设
      const userPreset = userPresets.find(p => p.id === presetId);
      if (userPreset) {
        presetConfig = userPreset.config;
      }
    }
    
    if (presetConfig) {
      setLocalConfig(presetConfig);
      setSelectedPreset(presetId);
      onConfigChange(presetConfig);
    }
  };

  // 开始编辑预设名称
  const handleStartEditingName = (presetId, currentName) => {
    setEditingPresetName(currentName);
    setIsEditingName(presetId);
  };

  // 保存预设名称
  const handleSavePresetName = (presetId) => {
    if (!editingPresetName.trim()) {
      alert(t('settings.nameRequired'));
      return;
    }
    
    if (editingPresetName.length > 4) {
      alert(t('settings.nameTooLong'));
      return;
    }

    const currentPresets = settingsManager.getUserCustomPresets();
    const updatedPresets = currentPresets.map(p => 
      p.id === presetId ? { ...p, name: editingPresetName.trim() } : p
    );
    
    if (settingsManager.setSetting('userCustomPresets', updatedPresets)) {
      setUserPresets(updatedPresets);
      setIsEditingName(false);
      setEditingPresetName('');
    }
  };

  // 取消编辑预设名称
  const handleCancelEditingName = () => {
    setIsEditingName(false);
    setEditingPresetName('');
  };

  // 保存内置预设名称修改
  const handleSaveBuiltinPresetName = (presetId) => {
    if (!editingPresetName.trim()) {
      alert(t('settings.nameRequired'));
      return;
    }
    
    if (editingPresetName.length > 4) {
      alert(t('settings.nameTooLong'));
      return;
    }

    // 保存内置预设的自定义名称
    settingsManager.setCustomPresetName(presetId, editingPresetName.trim());
    setIsEditingName(false);
    setEditingPresetName('');
    // 强制重新渲染 - 正确的方式
    forceUpdate();
  };

  // 删除内置预设（重置为默认）
  const handleDeleteBuiltinPreset = (presetId) => {
    if (confirm(t('settings.confirmResetBuiltinPreset'))) {
      // 删除内置预设的所有自定义配置
      settingsManager.removeCustomPresetConfig(presetId);
      settingsManager.removeCustomPresetName(presetId);
      // 如果当前选中的是被重置的预设，重新加载默认配置
      if (selectedPreset === presetId) {
        const defaultConfig = BUILT_IN_PRESETS[presetId];
        setLocalConfig(defaultConfig);
        onConfigChange(defaultConfig);
      }
      // 强制重新渲染 - 正确的方式
      forceUpdate();
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
          {/* 统一预设列表 */}
          <div className="setting-group">
            <div className="setting-label">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
              </svg>
              {t('settings.presetList')}
            </div>
            <div className="preset-list-container">
              {/* 内置预设 */}
              {Object.keys(BUILT_IN_PRESETS).map(presetKey => (
                <div key={presetKey} className="preset-item">
                  <button
                    className={`preset-item-btn ${selectedPreset === presetKey ? 'active' : ''}`}
                    onClick={() => handleLoadPreset(presetKey)}
                  >
                    <div className="preset-item-content">
                      {isEditingName === presetKey ? (
                        <input
                          type="text"
                          value={editingPresetName}
                          onChange={(e) => setEditingPresetName(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSaveBuiltinPresetName(presetKey)}
                          onBlur={() => handleSaveBuiltinPresetName(presetKey)}
                          maxLength="4"
                          className="preset-name-input"
                          autoFocus
                        />
                      ) : (
                        <span className="preset-name">
                          {settingsManager.getCustomPresetName(presetKey) || t(`presets.${presetKey}`)}
                        </span>
                      )}
                      <span className="preset-type">{t('settings.builtin')}</span>
                    </div>
                    {/* 编辑按钮 - 右上角 */}
                    <button 
                      className="preset-edit-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartEditingName(presetKey, settingsManager.getCustomPresetName(presetKey) || t(`presets.${presetKey}`));
                      }}
                    >
                      <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                      </svg>
                    </button>
                    {/* 删除按钮 - 右下角 */}
                    <button 
                      className="preset-delete-corner-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBuiltinPreset(presetKey);
                      }}
                    >
                      <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                      </svg>
                    </button>
                  </button>
                </div>
              ))}
              
              {/* 用户自定义预设 */}
              {userPresets.map(preset => (
                <div key={preset.id} className="preset-item">
                  <button
                    className={`preset-item-btn ${selectedPreset === preset.id ? 'active' : ''}`}
                    onClick={() => handleLoadPreset(preset.id)}
                  >
                    <div className="preset-item-content">
                      {isEditingName === preset.id ? (
                        <input
                          type="text"
                          value={editingPresetName}
                          onChange={(e) => setEditingPresetName(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSavePresetName(preset.id)}
                          onBlur={() => handleSavePresetName(preset.id)}
                          maxLength="4"
                          className="preset-name-input"
                          autoFocus
                        />
                      ) : (
                        <span className="preset-name" onDoubleClick={() => handleStartEditingName(preset.id, preset.name)}>
                          {preset.name}
                        </span>
                      )}
                      <span className="preset-type">{t('settings.custom')}</span>
                    </div>
                    {/* 编辑按钮 - 右上角 */}
                    <button 
                      className="preset-edit-corner-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartEditingName(preset.id, preset.name);
                      }}
                    >
                      <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                      </svg>
                    </button>
                    {/* 删除按钮 - 右下角 */}
                    <button 
                      className="preset-delete-corner-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePreset(preset.id);
                      }}
                    >
                      <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                      </svg>
                    </button>
                  </button>
                </div>
              ))}
              
              {/* 添加预设按钮 */}
              {userPresets.length < 3 && (
                <div className="preset-item add-preset-item">
                  {!showCreatePreset ? (
                    <button className="add-preset-btn" onClick={() => setShowCreatePreset(true)}>
                      <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                      </svg>
                      <span>{t('settings.addPreset')}</span>
                    </button>
                  ) : (
                    <div className="create-preset-form">
                      <input
                        type="text"
                        value={presetName}
                        onChange={(e) => setPresetName(e.target.value)}
                        placeholder={t('settings.presetName')}
                        maxLength="4"
                        className="preset-name-input"
                      />
                      <div className="form-buttons">
                        <button className="save-preset-btn" onClick={handleCreatePreset}>
                          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                          </svg>
                        </button>
                        <button className="cancel-preset-btn" onClick={() => setShowCreatePreset(false)}>
                          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 仅在选择了预设时显示配置选项 */}
          {selectedPreset && (
            <>
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
                      onBlur={() => handleBlur('stageTime', 'hours')}
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
                      onBlur={() => handleBlur('stageTime', 'minutes')}
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
                      onBlur={() => handleBlur('stageTime', 'seconds')}
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
                      onBlur={() => handleBlur('randomReminder', 'min')}
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
                      onBlur={() => handleBlur('randomReminder', 'max')}
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
                          onBlur={() => handleBlur('shortBreak', 'minutes')}
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
                          onBlur={() => handleBlur('shortBreak', 'seconds')}
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
                          onBlur={() => handleBlur('stageBreak', 'minutes')}
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
                          onBlur={() => handleBlur('stageBreak', 'seconds')}
                          min="0" 
                          max="59" 
                        />
                        <span className="time-unit">{t('time.second')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
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