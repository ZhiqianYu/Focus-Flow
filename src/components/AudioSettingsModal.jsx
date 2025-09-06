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
    <div className="modern-modal-overlay">
      <div className="modern-modal-content">
        {/* 头部 */}
        <div className="modern-modal-header">
          <div className="modal-header-icon">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
          </div>
          <div>
            <h2 className="modern-modal-title">{t('audio.settings')}</h2>
            <p className="modern-modal-subtitle">调整提示音和背景声音</p>
          </div>
          <button className="modern-close-btn" onClick={onClose}>
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </button>
        </div>
        
        <div className="modern-modal-body">
          {/* 提示音区域 */}
          <div className="settings-section">
            <div className="section-header">
              <h3>提示音设置</h3>
              <span className="section-desc">计时器的各种提示音效</span>
            </div>
            
            <div className="volume-card">
              <div className="volume-header">
                <span>音量</span>
                <span className="volume-value">{Math.round(volume * 100)}%</span>
              </div>
              <div className="modern-volume-control">
                <input 
                  type="range"
                  className="modern-volume-slider"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                />
              </div>
            </div>

            <div className="sound-preview-grid">
              {[
                { key: 'start', name: '开始计时', desc: '上行钢琴琶音', icon: '▶️' },
                { key: 'random', name: '阶段提醒', desc: '柔和钢琴和弦', icon: '🔔' },
                { key: 'stageBreak', name: '休息时间', desc: '和弦分解钢琴声', icon: '☕' },
                { key: 'end', name: '结束计时', desc: '下行钢琴音阶', icon: '🎯' }
              ].map(sound => (
                <div key={sound.key} className="sound-card">
                  <div className="sound-icon">{sound.icon}</div>
                  <div className="sound-info">
                    <span className="sound-name">{sound.name}</span>
                    <span className="sound-desc">{sound.desc}</span>
                  </div>
                  <button 
                    className="play-button" 
                    onClick={() => playSound(sound.key)}
                  >
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 白噪声区域 */}
          <div className="settings-section">
            <div className="section-header">
              <h3>背景声音</h3>
              <span className="section-desc">专注时的背景白噪声</span>
            </div>
            
            <div className="noise-type-grid">
              {[
                { type: 'off', name: '关闭', desc: '无背景声音', icon: '🔇' },
                { type: 'classic', name: '经典白噪声', desc: '均匀频谱噪声', icon: '📻' },
                { type: 'pink', name: '粉红噪声', desc: '柔和低频噪声', icon: '🌸' },
                { type: 'brown', name: '棕色噪声', desc: '深沉低频噪声', icon: '🌰' }
              ].map(noise => (
                <div key={noise.type} 
                     className={`noise-card ${whiteNoiseType === noise.type ? 'active' : ''}`}
                     onClick={() => handleWhiteNoiseTypeChange(noise.type)}>
                  <div className="noise-icon">{noise.icon}</div>
                  <div className="noise-info">
                    <span className="noise-name">{noise.name}</span>
                    <span className="noise-desc">{noise.desc}</span>
                  </div>
                  {whiteNoiseType === noise.type && noise.type !== 'off' && (
                    <button
                      className="preview-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        previewWhiteNoise();
                      }}
                    >
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>

            {whiteNoiseType !== 'off' && (
              <div className="volume-card" style={{ marginTop: '16px' }}>
                <div className="volume-header">
                  <span>背景音量</span>
                  <span className="volume-value">{Math.round(whiteNoiseVolume * 100)}%</span>
                </div>
                <div className="modern-volume-control">
                  <input 
                    type="range"
                    className="modern-volume-slider"
                    min="0"
                    max="1"
                    step="0.01"
                    value={whiteNoiseVolume}
                    onChange={handleWhiteNoiseVolumeChange}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioSettingsModal;