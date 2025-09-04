import React, { useState, useEffect } from 'react';
import '../styles/AudioSettingsModal.css';
import audioGenerator from '../utils/AudioGenerator';
import settingsManager from '../utils/SettingsManager';
import { useTranslation } from 'react-i18next';

const AudioSettingsModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  const [activePreset, setActivePreset] = useState(() => {
    // 只支持钢琴音效
    const audioSettings = settingsManager.getAudioSettings();
    settingsManager.setAudioSettings({ preset: 'piano' });
    return 'piano';
  });
  const [volume, setVolume] = useState(() => {
    const audioSettings = settingsManager.getAudioSettings();
    return audioSettings.volume;
  });

  const [whiteNoiseType, setWhiteNoiseType] = useState(() => {
    const whiteNoiseSettings = settingsManager.getWhiteNoiseSettings();
    const currentType = whiteNoiseSettings.type;
    // 如果当前设置是已废弃的rain、forest或ocean，重置为off
    if (currentType === 'rain' || currentType === 'forest' || currentType === 'ocean') {
      settingsManager.setWhiteNoiseSettings({ type: 'off' });
      return 'off';
    }
    return currentType;
  });

  const [whiteNoiseVolume, setWhiteNoiseVolume] = useState(() => {
    const whiteNoiseSettings = settingsManager.getWhiteNoiseSettings();
    return whiteNoiseSettings.volume;
  });

  const handlePresetChange = (preset) => {
    setActivePreset(preset);
    audioGenerator.setPreset(preset);
    settingsManager.setAudioSettings({ preset });
  };
  
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioGenerator.setVolume(newVolume);
    settingsManager.setAudioSettings({ volume: newVolume });
  };
  
  const playSound = (type) => {
    audioGenerator.playSound(type);
  };

  const handleWhiteNoiseTypeChange = (type) => {
    setWhiteNoiseType(type);
    audioGenerator.setWhiteNoiseType(type);
    settingsManager.setWhiteNoiseSettings({ type });
  };

  const handleWhiteNoiseVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setWhiteNoiseVolume(newVolume);
    audioGenerator.setWhiteNoiseVolume(newVolume);
    settingsManager.setWhiteNoiseSettings({ volume: newVolume });
  };

  const previewWhiteNoise = () => {
    if (whiteNoiseType === 'off') return;
    audioGenerator.startWhiteNoise();
    // 3秒后停止预览
    setTimeout(() => {
      audioGenerator.stopWhiteNoise();
    }, 3000);
  };

  useEffect(() => {
    audioGenerator.setPreset(activePreset);
    audioGenerator.setVolume(volume);
    audioGenerator.setWhiteNoiseType(whiteNoiseType);
    audioGenerator.setWhiteNoiseVolume(whiteNoiseVolume);
  }, [activePreset, volume, whiteNoiseType, whiteNoiseVolume]);
  
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
          <h3 style={{ marginBottom: '15px', fontSize: '1rem', color: '#4b5563', width: '100%' }}>提示音设置</h3>
          
          <label className="audio-option">
            <input 
              type="radio" 
              name="preset" 
              checked={true} 
              readOnly
            />
            <div>
              <span className="audio-option-title">{t('audio.piano')}</span>
              <span className="audio-option-desc">{t('audio.piano_desc')}</span>
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

        {/* 白噪声设置 */}
        <div className="white-noise-settings">
          <h3 style={{ marginBottom: '15px', fontSize: '1rem', color: '#4b5563' }}>{t('audio.whiteNoiseSettings')}</h3>
          
          <div className="white-noise-toggle-grid">
            {/* 关闭选项 */}
            <div className="white-noise-toggle-item">
              <button
                className={`white-noise-toggle ${whiteNoiseType === 'off' ? 'active' : ''}`}
                onClick={() => handleWhiteNoiseTypeChange('off')}
              >
                <span className="toggle-label">{t('audio.whiteNoiseTypes.off')}</span>
              </button>
            </div>

            {/* 各种白噪声类型 */}
            {['classic', 'pink', 'brown'].map(type => (
              <div key={type} className="white-noise-toggle-item">
                <button
                  className={`white-noise-toggle ${whiteNoiseType === type ? 'active' : ''}`}
                  onClick={() => handleWhiteNoiseTypeChange(type)}
                >
                  <span className="toggle-label">{t(`audio.whiteNoiseTypes.${type}`)}</span>
                </button>
                {whiteNoiseType === type && (
                  <button
                    className="preview-btn"
                    onClick={previewWhiteNoise}
                    title={t('audio.preview')}
                  >
                    ▶
                  </button>
                )}
              </div>
            ))}
          </div>

          {whiteNoiseType !== 'off' && (
            <div className="volume-control" style={{ marginTop: '20px' }}>
              <p>{t('audio.whiteNoiseVolume')}：{Math.round(whiteNoiseVolume * 100)}%</p>
              <input 
                type="range"
                className="volume-slider"
                min="0"
                max="1"
                step="0.01"
                value={whiteNoiseVolume}
                onChange={handleWhiteNoiseVolumeChange}
              />
            </div>
          )}
        </div>
        
        <div className="audio-list">
          <h3 style={{ marginBottom: '15px', fontSize: '1rem', color: '#4b5563' }}>{t('audio.preview')}</h3>
          
          <div className="audio-item">
            <div className="audio-info">
              <span className="audio-name">{t('audio.startSound')}</span>
              <span className="audio-desc">上行钢琴琶音</span>
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
              <span className="audio-desc">柔和钢琴和弦</span>
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
              <span className="audio-desc">和弦分解钢琴声</span>
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
              <span className="audio-desc">下行钢琴音阶</span>
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