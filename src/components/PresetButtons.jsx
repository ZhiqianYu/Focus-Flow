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

  const [forceUpdate, setForceUpdate] = useState(0);

  // 内置预设列表
  const BUILT_IN_PRESETS = ['pomodoro', 'deepwork', 'study'];
  
  // 监听用户自定义预设和内置预设隐藏状态的变化
  useEffect(() => {
    const updatePresets = () => {
      setUserPresets(settingsManager.getUserCustomPresets());
      // 强制重新渲染以更新内置预设的显示状态
      setForceUpdate(prev => prev + 1);
    };
    
    // 定期检查预设状态变化
    const interval = setInterval(updatePresets, 500);
    
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
    
    // 添加未隐藏的内置预设
    BUILT_IN_PRESETS.forEach(presetKey => {
      if (!settingsManager.isBuiltinPresetHidden(presetKey)) {
        buttons.push(
          <button 
            key={presetKey}
            className={`preset-btn ${activePreset === presetKey ? 'active' : ''}`}
            onClick={() => handlePresetClick(presetKey)}
          >
            {settingsManager.getCustomPresetName(presetKey) || t(`presets.${presetKey}`)}
          </button>
        );
      }
    });
    
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