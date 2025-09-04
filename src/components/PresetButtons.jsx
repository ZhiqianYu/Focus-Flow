import React, { useState, useEffect } from 'react';
import '../styles/PresetButtons.css';
import settingsManager from '../utils/SettingsManager';
import { useTranslation } from 'react-i18next';

const PresetButtons = ({ onSelectPreset }) => {

  const { t } = useTranslation();

  const [activePreset, setActivePreset] = useState(() => {
    return settingsManager.getActivePreset();
  });

  const [userPresets, setUserPresets] = useState(() => {
    return settingsManager.getUserCustomPresets();
  });
  
  // 监听用户自定义预设的变化
  useEffect(() => {
    const updateUserPresets = () => {
      setUserPresets(settingsManager.getUserCustomPresets());
    };
    
    // 定期检查用户预设是否有变化
    const interval = setInterval(updateUserPresets, 500);
    
    return () => clearInterval(interval);
  }, []);
  
  const handlePresetClick = (preset) => {
    setActivePreset(preset);
    settingsManager.setActivePreset(preset);
    onSelectPreset(preset);
  };

  // 渲染预设按钮
  const renderPresetButtons = () => {
    const buttons = [];
    
    // 添加固定的三个预设
    buttons.push(
      <button 
        key="pomodoro"
        className={`preset-btn ${activePreset === 'pomodoro' ? 'active' : ''}`}
        onClick={() => handlePresetClick('pomodoro')}
      >
        {t('presets.pomodoro')}
      </button>
    );
    
    buttons.push(
      <button 
        key="deepwork"
        className={`preset-btn ${activePreset === 'deepwork' ? 'active' : ''}`}
        onClick={() => handlePresetClick('deepwork')}
      >
        {t('presets.deepwork')}
      </button>
    );
    
    buttons.push(
      <button 
        key="study"
        className={`preset-btn ${activePreset === 'study' ? 'active' : ''}`}
        onClick={() => handlePresetClick('study')}
      >
        {t('presets.study')}
      </button>
    );
    
    // 添加用户自定义预设
    userPresets.forEach(preset => {
      buttons.push(
        <button 
          key={preset.id}
          className={`preset-btn ${activePreset === preset.id ? 'active' : ''}`}
          onClick={() => handlePresetClick(preset.id)}
        >
          {preset.name}
        </button>
      );
    });
    
    // 不再显示自定义按钮，用户通过设置面板添加预设
    
    return buttons;
  };
  
  return (
    <div className="presets">
      {renderPresetButtons()}
    </div>
  );
};

export default PresetButtons;