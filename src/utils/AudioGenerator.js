class AudioGenerator {
  constructor() {
    this.audioContext = null;
    this.masterVolume = 0.3;
    this.presets = {
      electronic: {
        start: { type: 'sawtooth', freqs: [220, 440, 880], duration: 1.5, pattern: 'arpeggio' },
        random: { type: 'square', freqs: [523.25, 659.25, 783.99], duration: 1, pattern: 'chord' },
        stageBreak: { type: 'triangle', freqs: [261.63, 329.63, 392.00], duration: 1, pattern: 'sweep' },
        end: { type: 'square', freqs: [523.25, 659.25, 783.99, 1046.5], duration: 2, pattern: 'sequence' }
        },
      piano: {
        start: { type: 'sine', freqs: [261.63, 329.63, 392.00, 523.25], duration: 1.5, pattern: 'arpeggio-up' },
        random: { type: 'sine', freqs: [440, 554.37, 659.25], duration: 1, pattern: 'chord-soft' },
        stageBreak: { type: 'sine', freqs: [329.63, 392.00, 493.88, 587.33], duration: 1, pattern: 'chord-arp' },
        end: { type: 'sine', freqs: [523.25, 659.25, 783.99, 880, 1046.5], duration: 2, pattern: 'scale-down' }
        },
      nature: {
        start: { type: 'sine', freqs: [396, 440, 498], duration: 1.5, pattern: 'bird' },
        random: { type: 'sine', freqs: [220, 330, 440], duration: 1, pattern: 'water' },
        stageBreak: { type: 'sine', freqs: [174.61, 220, 293.66], duration: 1, pattern: 'wind' },
        end: { type: 'sine', freqs: [261.63, 329.63, 392.00, 493.88], duration: 2, pattern: 'chimes' }
        }
    };
    this.currentPreset = 'electronic';
  }

  init() {
  if (!this.audioContext) {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      console.log('Audio context initialized successfully');
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
  
  // 基于预设类型使用不同的播放方法
  if (this.currentPreset === 'electronic') {
    this.playElectronicSound(type, preset, now);
  } else if (this.currentPreset === 'piano') {
    this.playPianoSound(type, preset, now);
  } else if (this.currentPreset === 'nature') {
    this.playNatureSound(type, preset, now);
  }
  }

  // 播放钢琴音效
playPianoSound(type, preset, now) {
  // 钢琴音效使用衰减更快的正弦波，添加噪声模拟钢琴音色
  const attack = preset.attack || 0.02;
  const decay = preset.decay || 0.5;
  
  switch (preset.pattern) {
    case 'arpeggio-up':
      // 上行琶音
      preset.freqs.forEach((freq, index) => {
        const delay = index * (preset.duration / preset.freqs.length);
        this.playPianoTone(freq, now + delay, preset.duration / preset.freqs.length * 1.2, attack, decay);
      });
      break;
      
    case 'chord-soft':
      // 柔和和弦
      preset.freqs.forEach((freq, index) => {
        const delay = index * 0.02; // 轻微延迟制造真实感
        this.playPianoTone(freq, now + delay, preset.duration, attack, decay, this.masterVolume * 0.2);
      });
      break;
      
    case 'chord-arp':
      // 和弦分解
      preset.freqs.forEach((freq, index) => {
        const delay = index * 0.15;
        this.playPianoTone(freq, now + delay, preset.duration - delay, attack, decay, this.masterVolume * 0.3);
      });
      break;
      
    case 'scale-down':
      // 下行音阶
      const scale = [...preset.freqs].reverse();
      scale.forEach((freq, index) => {
        const delay = index * (preset.duration / scale.length);
        this.playPianoTone(freq, now + delay, preset.duration / scale.length * 1.2, attack, decay);
      });
      break;
  }
}

// 单个钢琴音调播放函数
playPianoTone(freq, startTime, duration, attack = 0.02, decay = 0.5, volume = this.masterVolume) {
  const osc = this.audioContext.createOscillator();
  const gain = this.audioContext.createGain();
  
  osc.type = 'sine';
  osc.frequency.value = freq;
  
  osc.connect(gain);
  gain.connect(this.audioContext.destination);
  
  // 模拟钢琴的包络
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + attack);
  gain.gain.exponentialRampToValueAtTime(volume * 0.3, startTime + attack + decay * 0.3);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  
  osc.start(startTime);
  osc.stop(startTime + duration);
}

// 播放自然音效
playNatureSound(type, preset, now) {
  switch (preset.pattern) {
    case 'bird':
      // 模拟鸟叫声
      for (let i = 0; i < 3; i++) {
        const chirpTime = now + i * 0.2;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.type = 'sine';
        
        // 频率调制模拟鸟叫
        osc.frequency.setValueAtTime(preset.freqs[0] + Math.random() * 50, chirpTime);
        osc.frequency.linearRampToValueAtTime(preset.freqs[1] + Math.random() * 100, chirpTime + 0.1);
        osc.frequency.linearRampToValueAtTime(preset.freqs[0], chirpTime + 0.2);
        
        gain.gain.setValueAtTime(0, chirpTime);
        gain.gain.linearRampToValueAtTime(this.masterVolume * 0.7, chirpTime + 0.05);
        gain.gain.linearRampToValueAtTime(0, chirpTime + 0.2);
        
        osc.start(chirpTime);
        osc.stop(chirpTime + 0.3);
      }
      break;
      
    case 'water':
      // 模拟流水声
      for (let i = 0; i < 10; i++) {
        const dropTime = now + i * 0.1 * Math.random();
        const osc = this.audioContext.createOscillator();
        const filter = this.audioContext.createBiquadFilter();
        const gain = this.audioContext.createGain();
        
        filter.type = 'lowpass';
        filter.frequency.value = 400 + Math.random() * 600;
        filter.Q.value = 0.5;
        
        osc.type = 'triangle';
        osc.frequency.value = 100 + Math.random() * 150;
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioContext.destination);
        
        gain.gain.setValueAtTime(0, dropTime);
        gain.gain.linearRampToValueAtTime(this.masterVolume * 0.3 * Math.random(), dropTime + 0.05);
        gain.gain.linearRampToValueAtTime(0, dropTime + 0.3 + Math.random() * 0.2);
        
        osc.start(dropTime);
        osc.stop(dropTime + 0.5);
      }
      break;
      
    case 'wind':
      // 模拟风声
      const noise = this.audioContext.createOscillator();
      const filter = this.audioContext.createBiquadFilter();
      const gain = this.audioContext.createGain();
      const lfo = this.audioContext.createOscillator();
      const lfoGain = this.audioContext.createGain();
      
      noise.type = 'sawtooth';
      noise.frequency.value = 50;
      
      filter.type = 'bandpass';
      filter.frequency.value = 250;
      filter.Q.value = 1.5;
      
      lfo.frequency.value = 0.2;
      lfoGain.gain.value = 150;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioContext.destination);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(this.masterVolume * 0.5, now + 0.5);
      gain.gain.linearRampToValueAtTime(this.masterVolume * 0.5, now + preset.duration - 0.5);
      gain.gain.linearRampToValueAtTime(0, now + preset.duration);
      
      lfo.start(now);
      noise.start(now);
      lfo.stop(now + preset.duration);
      noise.stop(now + preset.duration);
      break;
      
    case 'chimes':
      // 模拟风铃声
      for (let i = 0; i < preset.freqs.length; i++) {
        const chimeTime = now + i * 0.15;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = preset.freqs[i];
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        gain.gain.setValueAtTime(0, chimeTime);
        gain.gain.linearRampToValueAtTime(this.masterVolume * 0.3, chimeTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, chimeTime + 1.5);
        
        osc.start(chimeTime);
        osc.stop(chimeTime + 2);
      }
      break;
  }
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