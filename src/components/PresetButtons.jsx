import React, { useState } from 'react';
import '../styles/PresetButtons.css';

const PresetButtons = ({ onSelectPreset }) => {
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
        番茄工作法
      </button>
      <button 
        className={`preset-btn ${activePreset === 'deepwork' ? 'active' : ''}`}
        onClick={() => handlePresetClick('deepwork')}
      >
        深度工作
      </button>
      <button 
        className={`preset-btn ${activePreset === 'study' ? 'active' : ''}`}
        onClick={() => handlePresetClick('study')}
      >
        考试复习
      </button>
      <button 
        className={`preset-btn ${activePreset === 'custom' ? 'active' : ''}`}
        onClick={() => handlePresetClick('custom')}
      >
        自定义
      </button>
    </div>
  );
};

export default PresetButtons;