class AudioGenerator {
  constructor() {
    this.audioContext = null;
    this.masterVolume = 0.3;
    this.whiteNoiseVolume = 0.2;
    this.whiteNoiseType = 'off';
    this.whiteNoiseSource = null;
    this.whiteNoiseGain = null;
    this.presets = {
      piano: {
        start: { type: 'sine', freqs: [261.63, 329.63, 392.00, 523.25], duration: 1.5, pattern: 'arpeggio-up' },
        random: { type: 'sine', freqs: [440, 554.37, 659.25], duration: 1, pattern: 'chord-soft' },
        stageBreak: { type: 'sine', freqs: [329.63, 392.00, 493.88, 587.33], duration: 1, pattern: 'chord-arp' },
        end: { type: 'sine', freqs: [523.25, 659.25, 783.99, 880, 1046.5], duration: 2, pattern: 'scale-down' }
        }
    };
    this.currentPreset = 'piano';
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
  
  const preset = this.presets.piano[type];
  if (!preset) return;

  const now = this.audioContext.currentTime;
  
  // 只播放钢琴音效
  this.playPianoSound(type, preset, now);
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


  setPreset(preset) {
    // 只支持钢琴音效
    this.currentPreset = 'piano';
  }

  setVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  // 白噪声相关方法
  setWhiteNoiseType(type) {
    this.whiteNoiseType = type;
    if (this.whiteNoiseSource && type === 'off') {
      this.stopWhiteNoise();
    }
  }

  setWhiteNoiseVolume(volume) {
    this.whiteNoiseVolume = Math.max(0, Math.min(1, volume));
    if (this.whiteNoiseGain) {
      this.whiteNoiseGain.gain.value = this.whiteNoiseVolume;
    }
  }

  startWhiteNoise() {
    if (this.whiteNoiseType === 'off') return;
    
    this.init();
    if (!this.audioContext) return;

    // 停止现有的白噪声
    this.stopWhiteNoise();

    try {
      if (this.whiteNoiseType === 'classic' || this.whiteNoiseType === 'pink' || this.whiteNoiseType === 'brown') {
        this.createGeneratedNoise();
      } else {
        this.createNaturalNoise();
      }
    } catch (e) {
      console.error('Failed to start white noise:', e);
    }
  }

  createGeneratedNoise() {
    const bufferSize = this.audioContext.sampleRate * 2; // 2秒缓冲
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const output = buffer.getChannelData(0);

    // 生成不同类型的噪声
    if (this.whiteNoiseType === 'classic') {
      // 白噪声
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
    } else if (this.whiteNoiseType === 'pink') {
      // 粉红噪声 (1/f噪声)
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    } else if (this.whiteNoiseType === 'brown') {
      // 棕色噪声
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // 调整音量
      }
    }

    this.whiteNoiseSource = this.audioContext.createBufferSource();
    this.whiteNoiseGain = this.audioContext.createGain();
    
    this.whiteNoiseSource.buffer = buffer;
    this.whiteNoiseSource.loop = true;
    
    this.whiteNoiseSource.connect(this.whiteNoiseGain);
    this.whiteNoiseGain.connect(this.audioContext.destination);
    
    this.whiteNoiseGain.gain.value = this.whiteNoiseVolume;
    this.whiteNoiseSource.start();
  }

  createNaturalNoise() {
    // 创建自然音效的复合音频
    this.whiteNoiseGain = this.audioContext.createGain();
    this.whiteNoiseGain.connect(this.audioContext.destination);
    this.whiteNoiseGain.gain.value = this.whiteNoiseVolume;

    if (this.whiteNoiseType === 'rain') {
      this.createRainSound();
    } else if (this.whiteNoiseType === 'ocean') {
      this.createOceanSound();
    } else if (this.whiteNoiseType === 'forest') {
      this.createForestSound();
    }
  }

  createRainSound() {
    // 雨声：高频白噪声 + 随机点击声
    const noise = this.audioContext.createOscillator();
    const filter = this.audioContext.createBiquadFilter();
    
    noise.type = 'sawtooth';
    noise.frequency.value = 100;
    
    filter.type = 'highpass';
    filter.frequency.value = 1000;
    filter.Q.value = 0.5;
    
    noise.connect(filter);
    filter.connect(this.whiteNoiseGain);
    
    noise.start();
    this.whiteNoiseSource = noise;

    // 添加随机雨滴声
    this.createRandomDrops();
  }

  createOceanSound() {
    // 海浪声：低频振荡 + 白噪声
    const noise = this.audioContext.createOscillator();
    const filter = this.audioContext.createBiquadFilter();
    const lfo = this.audioContext.createOscillator();
    const lfoGain = this.audioContext.createGain();
    
    noise.type = 'sawtooth';
    noise.frequency.value = 50;
    
    filter.type = 'bandpass';
    filter.frequency.value = 400;
    filter.Q.value = 1;
    
    lfo.frequency.value = 0.1;
    lfoGain.gain.value = 200;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    
    noise.connect(filter);
    filter.connect(this.whiteNoiseGain);
    
    lfo.start();
    noise.start();
    this.whiteNoiseSource = noise;
  }

  createForestSound() {
    // 森林声：低频噪声 + 偶尔的鸟叫
    const noise = this.audioContext.createOscillator();
    const filter = this.audioContext.createBiquadFilter();
    
    noise.type = 'triangle';
    noise.frequency.value = 80;
    
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    filter.Q.value = 0.8;
    
    noise.connect(filter);
    filter.connect(this.whiteNoiseGain);
    
    noise.start();
    this.whiteNoiseSource = noise;

    // 添加偶尔的鸟叫声
    this.createRandomBirds();
  }

  createRandomDrops() {
    // 每隔一段时间创建雨滴声
    const createDrop = () => {
      if (this.whiteNoiseType !== 'rain' || !this.whiteNoiseGain) return;
      
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = 1000 + Math.random() * 2000;
      
      osc.connect(gain);
      gain.connect(this.whiteNoiseGain);
      
      gain.gain.setValueAtTime(0, this.audioContext.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.audioContext.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
      
      osc.start();
      osc.stop(this.audioContext.currentTime + 0.1);
      
      // 随机间隔创建下一个雨滴
      setTimeout(createDrop, Math.random() * 200 + 50);
    };
    
    createDrop();
  }

  createRandomBirds() {
    // 每隔一段时间创建鸟叫声
    const createBird = () => {
      if (this.whiteNoiseType !== 'forest' || !this.whiteNoiseGain) return;
      
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.type = 'sine';
      const baseFreq = 400 + Math.random() * 800;
      
      osc.connect(gain);
      gain.connect(this.whiteNoiseGain);
      
      // 鸟叫的频率变化
      osc.frequency.setValueAtTime(baseFreq, this.audioContext.currentTime);
      osc.frequency.linearRampToValueAtTime(baseFreq * 1.5, this.audioContext.currentTime + 0.1);
      osc.frequency.linearRampToValueAtTime(baseFreq, this.audioContext.currentTime + 0.2);
      
      gain.gain.setValueAtTime(0, this.audioContext.currentTime);
      gain.gain.linearRampToValueAtTime(0.005, this.audioContext.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);
      
      osc.start();
      osc.stop(this.audioContext.currentTime + 0.3);
      
      // 随机间隔创建下一个鸟叫
      setTimeout(createBird, Math.random() * 10000 + 5000);
    };
    
    createBird();
  }

  stopWhiteNoise() {
    if (this.whiteNoiseSource) {
      try {
        this.whiteNoiseSource.stop();
      } catch (e) {
        // ignore errors when stopping
      }
      this.whiteNoiseSource = null;
    }
    if (this.whiteNoiseGain) {
      this.whiteNoiseGain.disconnect();
      this.whiteNoiseGain = null;
    }
  }
}

// 导出单例
const audioGenerator = new AudioGenerator();
export default audioGenerator;