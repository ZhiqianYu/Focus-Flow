import React, { useState, useEffect } from 'react';
import '../styles/AudioSettingsModal.css';
import audioGenerator from '../utils/AudioGenerator';
import { useTranslation } from 'react-i18next';

const AudioSettingsModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  const [activePreset, setActivePreset] = useState(() => {
    // 从本地存储加载预设，默认为electronic
    return localStorage.getItem('audioPreset') || 'electronic';
  });
  const [volume, setVolume] = useState(() => {
    // 从本地存储加载音量，默认为0.3
    return parseFloat(localStorage.getItem('audioVolume') || '0.3');
  });

  const handlePresetChange = (preset) => {
    setActivePreset(preset);
    audioGenerator.setPreset(preset);
    localStorage.setItem('audioPreset', preset);
  };
  
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioGenerator.setVolume(newVolume);
    localStorage.setItem('audioVolume', newVolume.toString());
  };
  
  const playSound = (type) => {
    audioGenerator.playSound(type);
  };

  useEffect(() => {
    audioGenerator.setPreset(activePreset);
    audioGenerator.setVolume(volume);
  }, [activePreset, volume]);
  
  if (!isOpen) return null;
  
  return (
    <div className="modal show">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{t('audio.settings')}</h2>
          <button className="close-btn" onClick={onClose}>
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </button>
        </div>
        
        <div className="audio-presets">
          <h3 style={{ marginBottom: '15px', fontSize: '1rem', color: '#4b5563', width: '100%' }}>{t('audio.theme')}</h3>
          
          <label className="audio-option">
            <input 
              type="radio" 
              name="preset" 
              checked={activePreset === 'electronic'} 
              onChange={() => handlePresetChange('electronic')} 
            />
            <div>
              <span className="audio-option-title">{t('audio.electronic')}</span>
              <span className="audio-option-desc">{t('audio.electronic_desc')}</span>
            </div>
          </label>
          
          <label className="audio-option">
            <input 
              type="radio" 
              name="preset" 
              checked={activePreset === 'piano'} 
              onChange={() => handlePresetChange('piano')} 
            />
            <div>
              <span className="audio-option-title">{t('audio.piano')}</span>
              <span className="audio-option-desc">{t('audio.piano_desc')}</span>
            </div>
          </label>
          
          <label className="audio-option">
            <input 
              type="radio" 
              name="preset" 
              checked={activePreset === 'nature'} 
              onChange={() => handlePresetChange('nature')} 
            />
            <div>
              <span className="audio-option-title">{t('audio.nature')}</span>
              <span className="audio-option-desc">{t('audio.nature_desc')}</span>
            </div>
          </label>
        </div>

        <div className="volume-control">
          <p>{t('audio.volume')}：{Math.round(volume * 100)}%</p>
          <input 
            type="range"
            className="volume-slider"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
          />
        </div>
        
        <div className="audio-list">
          <h3 style={{ marginBottom: '15px', fontSize: '1rem', color: '#4b5563' }}>{t('audio.preview')}</h3>
          
          <div className="audio-item">
            <div className="audio-info">
              <span className="audio-name">{t('audio.startSound')}</span>
              <span className="audio-desc">
                {activePreset === 'electronic' && t('audio.descriptions.electronic.start')}
                {activePreset === 'piano' && t('audio.descriptions.piano.start')}
                {activePreset === 'nature' && t('audio.descriptions.nature.start')}
              </span>
            </div>
            <div className="audio-controls">
              <button 
                className="btn btn-secondary" 
                style={{ padding: '6px 12px', fontSize: '0.9rem' }}
                onClick={() => playSound('start')}
              >
                {t('audio.play')}
              </button>
            </div>
          </div>
          
          <div className="audio-item">
            <div className="audio-info">
              <span className="audio-name">{t('audio.reminderSound')}</span>
              <span className="audio-desc">
                {activePreset === 'electronic' && t('audio.descriptions.electronic.reminder')}
                {activePreset === 'piano' && t('audio.descriptions.piano.reminder')}
                {activePreset === 'nature' && t('audio.descriptions.nature.reminder')}
              </span>
            </div>
            <div className="audio-controls">
              <button 
                className="btn btn-secondary" 
                style={{ padding: '6px 12px', fontSize: '0.9rem' }}
                onClick={() => playSound('random')}
              >
                {t('audio.play')}
              </button>
            </div>
          </div>
          
          <div className="audio-item">
            <div className="audio-info">
              <span className="audio-name">{t('audio.breakSound')}</span>
              <span className="audio-desc">
                {activePreset === 'electronic' && t('audio.descriptions.electronic.stageBreak')}
                {activePreset === 'piano' && t('audio.descriptions.piano.stageBreak')}
                {activePreset === 'nature' && t('audio.descriptions.nature.stageBreak')}
              </span>
            </div>
            <div className="audio-controls">
              <button 
                className="btn btn-secondary" 
                style={{ padding: '6px 12px', fontSize: '0.9rem' }}
                onClick={() => playSound('stageBreak')}
              >
                {t('audio.play')}
              </button>
            </div>
          </div>
          
          <div className="audio-item">
            <div className="audio-info">
              <span className="audio-name">{t('audio.endSound')}</span>
              <span className="audio-desc">
                {activePreset === 'electronic' && t('audio.descriptions.electronic.end')}
                {activePreset === 'piano' && t('audio.descriptions.piano.end')}
                {activePreset === 'nature' && t('audio.descriptions.nature.end')}
              </span>
            </div>
            <div className="audio-controls">
              <button 
                className="btn btn-secondary" 
                style={{ padding: '6px 12px', fontSize: '0.9rem' }}
                onClick={() => playSound('end')}
              >
                {t('audio.play')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioSettingsModal;