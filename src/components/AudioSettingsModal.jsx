import React, { useState, useEffect } from 'react';
import '../styles/AudioSettingsModal.css';
import audioGenerator from '../utils/AudioGenerator';

const AudioSettingsModal = ({ isOpen, onClose }) => {
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
          <h2 className="modal-title">音频设置</h2>
          <button className="close-btn" onClick={onClose}>
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </button>
        </div>
        
        <div className="audio-presets">
          <h3 style={{ marginBottom: '15px', fontSize: '1rem', color: '#4b5563', width: '100%' }}>声音主题</h3>
          
          <label className="audio-option">
            <input 
              type="radio" 
              name="preset" 
              checked={activePreset === 'electronic'} 
              onChange={() => handlePresetChange('electronic')} 
            />
            <div>
              <span className="audio-option-title">电子音效</span>
              <span className="audio-option-desc">现代合成器音效，适合科技风格的学习环境</span>
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
              <span className="audio-option-title">钢琴音效</span>
              <span className="audio-option-desc">柔和的钢琴和弦与琶音，营造平静的学习氛围</span>
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
              <span className="audio-option-title">自然音效</span>
              <span className="audio-option-desc">自然环境音效，包括鸟鸣、流水和风铃声</span>
            </div>
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
          <h3 style={{ marginBottom: '15px', fontSize: '1rem', color: '#4b5563' }}>音效预览</h3>
          
          <div className="audio-item">
            <div className="audio-info">
              <span className="audio-name">开始提醒音</span>
              <span className="audio-desc">
                {activePreset === 'electronic' && '上升的电子音调序列'}
                {activePreset === 'piano' && '上行钢琴琶音'}
                {activePreset === 'nature' && '轻柔的鸟鸣声'}
              </span>
            </div>
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
            <div className="audio-info">
              <span className="audio-name">随机提醒音</span>
              <span className="audio-desc">
                {activePreset === 'electronic' && '电子和弦提醒'}
                {activePreset === 'piano' && '柔和钢琴和弦'}
                {activePreset === 'nature' && '流水声提醒'}
              </span>
            </div>
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
            <div className="audio-info">
              <span className="audio-name">阶段休息音</span>
              <span className="audio-desc">
                {activePreset === 'electronic' && '电子扫频音效'}
                {activePreset === 'piano' && '和弦分解钢琴声'}
                {activePreset === 'nature' && '舒缓的风声'}
              </span>
            </div>
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
            <div className="audio-info">
              <span className="audio-name">结束提醒音</span>
              <span className="audio-desc">
                {activePreset === 'electronic' && '电子胜利序列'}
                {activePreset === 'piano' && '下行钢琴音阶'}
                {activePreset === 'nature' && '和谐的风铃声'}
              </span>
            </div>
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