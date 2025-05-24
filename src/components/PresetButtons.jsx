import React, { useState } from 'react';
import '../styles/PresetButtons.css';
import { useTranslation } from 'react-i18next';

const PresetButtons = ({ onSelectPreset }) => {

  const { t } = useTranslation();

  const [activePreset, setActivePreset] = useState(null);
  
  const handlePresetClick = (preset) => {
    setActivePreset(preset);
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