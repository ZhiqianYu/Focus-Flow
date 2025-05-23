import React, { useState } from 'react';
import '../styles/AudioSettingsModal.css';
import audioGenerator from '../utils/AudioGenerator';

const AudioSettingsModal = ({ isOpen, onClose }) => {
  const [activePreset, setActivePreset] = useState('electronic');
  const [volume, setVolume] = useState(0.3);
  
  const handlePresetChange = (preset) => {
    setActivePreset(preset);
    audioGenerator.setPreset(preset);
  };
  
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioGenerator.setVolume(newVolume);
  };
  
  const playSound = (type) => {
    audioGenerator.playSound(type);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="modal show">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">音频设置</h2>
          <button className="close-btn" onClick={onClose}>
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </button>
        </div>
        
        <div className="audio-presets">
          <label className="audio-option">
            <input 
              type="radio" 
              name="preset" 
              checked={activePreset === 'electronic'} 
              onChange={() => handlePresetChange('electronic')} 
            />
            <span>电子音效</span>
          </label>
          <label className="audio-option">
            <input 
              type="radio" 
              name="preset" 
              checked={activePreset === 'piano'} 
              onChange={() => handlePresetChange('piano')} 
            />
            <span>钢琴音效</span>
          </label>
          <label className="audio-option">
            <input 
              type="radio" 
              name="preset" 
              checked={activePreset === 'nature'} 
              onChange={() => handlePresetChange('nature')} 
            />
            <span>自然音效</span>
          </label>
        </div>
        
        <div className="volume-control">
          <p>音量：{Math.round(volume * 100)}%</p>
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
          <p style={{ color: '#6b7280', marginBottom: '15px' }}>预览音效</p>
          <div className="audio-item">
            <span className="audio-name">开始提醒音</span>
            <div className="audio-controls">
              <button 
                className="btn btn-secondary" 
                style={{ padding: '6px 12px', fontSize: '0.9rem' }}
                onClick={() => playSound('start')}
              >
                播放
              </button>
            </div>
          </div>
          <div className="audio-item">
            <span className="audio-name">随机提醒音</span>
            <div className="audio-controls">
              <button 
                className="btn btn-secondary" 
                style={{ padding: '6px 12px', fontSize: '0.9rem' }}
                onClick={() => playSound('random')}
              >
                播放
              </button>
            </div>
          </div>
          <div className="audio-item">
            <span className="audio-name">阶段休息音</span>
            <div className="audio-controls">
              <button 
                className="btn btn-secondary" 
                style={{ padding: '6px 12px', fontSize: '0.9rem' }}
                onClick={() => playSound('stageBreak')}
              >
                播放
              </button>
            </div>
          </div>
          <div className="audio-item">
            <span className="audio-name">结束提醒音</span>
            <div className="audio-controls">
              <button 
                className="btn btn-secondary" 
                style={{ padding: '6px 12px', fontSize: '0.9rem' }}
                onClick={() => playSound('end')}
              >
                播放
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioSettingsModal;