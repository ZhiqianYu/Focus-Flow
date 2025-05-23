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
        },
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
  
  // 基于预设类型使用不同的播放方法
  if (this.currentPreset === 'electronic') {
    this.playElectronicSound(type, preset, now);
  } else if (this.currentPreset === 'piano') {
    this.playPianoSound(type, preset, now);
  } else if (this.currentPreset === 'nature') {
    this.playNatureSound(type, preset, now);
  }
  }

  // 播放电子音效
  playElectronicSound(type, preset, now) {
    switch (preset.pattern) {
      case 'arpeggio':
        // 电子琶音
        preset.freqs.forEach((freq, index) => {
          const delay = index * (preset.duration / preset.freqs.length);
          const osc = this.audioContext.createOscillator();
          const gain = this.audioContext.createGain();
          
          osc.connect(gain);
          gain.connect(this.audioContext.destination);
          
          osc.type = preset.type;
          osc.frequency.value = freq;
          
          gain.gain.setValueAtTime(0, now + delay);
          gain.gain.linearRampToValueAtTime(this.masterVolume, now + delay + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.01, now + delay + (preset.duration / preset.freqs.length) * 0.9);
          
          osc.start(now + delay);
          osc.stop(now + delay + (preset.duration / preset.freqs.length));
        });
        break;
        
      case 'chord':
        // 电子和弦
        preset.freqs.forEach(freq => {
          const osc = this.audioContext.createOscillator();
          const gain = this.audioContext.createGain();
          const lfo = this.audioContext.createOscillator();
          const lfoGain = this.audioContext.createGain();
          
          // 设置LFO (低频振荡器) 给电子感
          lfo.frequency.value = 8;
          lfoGain.gain.value = 10;
          lfo.connect(lfoGain);
          lfoGain.connect(osc.frequency);
          
          osc.connect(gain);
          gain.connect(this.audioContext.destination);
          
          osc.type = preset.type;
          osc.frequency.value = freq;
          
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(this.masterVolume * 0.3, now + 0.05);
          gain.gain.linearRampToValueAtTime(this.masterVolume * 0.3, now + preset.duration - 0.1);
          gain.gain.exponentialRampToValueAtTime(0.01, now + preset.duration);
          
          lfo.start(now);
          osc.start(now);
          lfo.stop(now + preset.duration);
          osc.stop(now + preset.duration);
        });
        break;
        
      case 'sweep':
        // 电子扫频
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.type = preset.type;
        osc.frequency.setValueAtTime(preset.freqs[0], now);
        osc.frequency.linearRampToValueAtTime(preset.freqs[preset.freqs.length - 1], now + preset.duration * 0.5);
        osc.frequency.linearRampToValueAtTime(preset.freqs[0], now + preset.duration);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(this.masterVolume, now + 0.05);
        gain.gain.linearRampToValueAtTime(this.masterVolume, now + preset.duration - 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + preset.duration);
        
        osc.start(now);
        osc.stop(now + preset.duration);
        break;
        
      case 'sequence':
        // 电子序列
        preset.freqs.forEach((freq, index) => {
          const delay = index * (preset.duration / preset.freqs.length);
          const osc = this.audioContext.createOscillator();
          const gain = this.audioContext.createGain();
          
          osc.connect(gain);
          gain.connect(this.audioContext.destination);
          
          osc.type = index % 2 === 0 ? preset.type : 'sine';
          osc.frequency.value = freq;
          
          gain.gain.setValueAtTime(0, now + delay);
          gain.gain.linearRampToValueAtTime(this.masterVolume, now + delay + 0.01);
          gain.gain.linearRampToValueAtTime(0, now + delay + (preset.duration / preset.freqs.length) * 0.8);
          
          osc.start(now + delay);
          osc.stop(now + delay + (preset.duration / preset.freqs.length));
        });
        break;
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

  // 播放自然音效
  playNatureSound(type, preset, now) {
    switch (preset.pattern) {
      case 'bird':
        // 鸟叫声
        this.playNatureTone('bird', preset, now);
        break;
        
      case 'water':
        // 流水声
        this.playNatureTone('water', preset, now);
        break;
        
      case 'wind':
        // 微风声
        this.playNatureTone('wind', preset, now);
        break;
        
      case 'chimes':
        // 风铃声
        this.playNatureTone('chimes', preset, now);
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