import React, { useState, useEffect } from 'react';
import '../styles/PresetButtons.css';
import settingsManager from '../utils/SettingsManager';
import { useTranslation } from 'react-i18next';

const PresetButtons = ({ onSelectPreset }) => {

  const { t } = useTranslation();

  const [activePreset, setActivePreset] = useState(() => {
    return settingsManager.getActivePreset();
  });
  
  const handlePresetClick = (preset) => {
    setActivePreset(preset);
    settingsManager.setActivePreset(preset);
    onSelectPreset(preset);
  };
  
  return (
    <div className="presets">
      <button 
        className={`preset-btn ${activePreset === 'pomodoro' ? 'active' : ''}`}
        onClick={() => handlePresetClick('pomodoro')}
      >
        {t('presets.pomodoro')}
      </button>
      <button 
        className={`preset-btn ${activePreset === 'deepwork' ? 'active' : ''}`}
        onClick={() => handlePresetClick('deepwork')}
      >
        {t('presets.deepwork')}
      </button>
      <button 
        className={`preset-btn ${activePreset === 'study' ? 'active' : ''}`}
        onClick={() => handlePresetClick('study')}
      >
        {t('presets.study')}
      </button>
      <button 
        className={`preset-btn ${activePreset === 'custom' ? 'active' : ''}`}
        onClick={() => handlePresetClick('custom')}
      >
        {t('presets.custom')}
      </button>
    </div>
  );
};

export default PresetButtons;