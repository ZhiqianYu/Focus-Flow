class AudioGenerator {
  constructor() {
    this.audioContext = null;
    this.masterVolume = 0.3;
    this.presets = {
      electronic: {
        start: { type: 'square', freqs: [440, 880], duration: 0.3 },
        random: { type: 'sine', freqs: [523.25, 659.25, 783.99], duration: 0.5 },
        stageBreak: { type: 'triangle', freqs: [261.63, 329.63, 392.00], duration: 1 },
        end: { type: 'square', freqs: [523.25, 659.25, 783.99, 1046.5], duration: 0.8 }
      },
      piano: {
        start: { type: 'sine', freqs: [261.63, 329.63, 392.00, 523.25], duration: 0.5 },
        random: { type: 'sine', freqs: [440, 554.37, 659.25], duration: 0.4 },
        stageBreak: { type: 'sine', freqs: [329.63, 392.00, 493.88], duration: 0.8 },
        end: { type: 'sine', freqs: [523.25, 659.25, 783.99, 1046.5], duration: 1 }
      },
      nature: {
        start: { type: 'sine', freqs: [396, 528, 639], duration: 0.6 },
        random: { type: 'sine', freqs: [417, 528, 639], duration: 0.5 },
        stageBreak: { type: 'sine', freqs: [174.61, 285, 396], duration: 1.2 },
        end: { type: 'sine', freqs: [528, 639, 741, 852], duration: 1.5 }
      }
    };
    this.currentPreset = 'electronic';
  }

  init() {
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        console.error('Web Audio API not supported:', e);
      }
    }
  }

  playSound(type) {
    this.init();
    if (!this.audioContext) return;
    
    const preset = this.presets[this.currentPreset][type];
    if (!preset) return;

    const now = this.audioContext.currentTime;
    
    if (type === 'random') {
      // 随机提醒音 - 柔和的钟声效果
      preset.freqs.forEach((freq, index) => {
        this.playTone(freq, now + index * 0.1, 0.15, preset.type, 0.5);
      });
    } else if (type === 'start') {
      // 开始音 - 上升音调
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      
      osc.type = preset.type;
      osc.frequency.setValueAtTime(preset.freqs[0], now);
      osc.frequency.exponentialRampToValueAtTime(preset.freqs[1], now + preset.duration);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(this.masterVolume, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + preset.duration);
      
      osc.start(now);
      osc.stop(now + preset.duration);
    } else if (type === 'stageBreak') {
      // 休息音 - 和弦
      preset.freqs.forEach(freq => {
        this.playTone(freq, now, this.masterVolume * 0.5, preset.type, preset.duration);
      });
    } else if (type === 'end') {
      // 结束音 - 胜利旋律
      preset.freqs.forEach((freq, index) => {
        const delay = index * 0.2;
        this.playTone(freq, now + delay, this.masterVolume * 0.7, preset.type, 0.2);
      });
    }
  }

  playTone(frequency, startTime, volume, type, duration) {
    if (!this.audioContext) return;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    
    osc.type = type;
    osc.frequency.value = frequency;
    
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.02);
    gain.gain.linearRampToValueAtTime(volume, startTime + duration - 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    
    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  setPreset(preset) {
    if (this.presets[preset]) {
      this.currentPreset = preset;
    }
  }

  setVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }
}

// 导出单例
const audioGenerator = new AudioGenerator();
export default audioGenerator;