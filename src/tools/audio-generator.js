// 使用 Web Audio API 生成内置音效
class AudioGenerator {
  constructor() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.sounds = {
      start: this.generateStartSound.bind(this),
      reminder: this.generateReminderSound.bind(this),
      break: this.generateBreakSound.bind(this),
      complete: this.generateCompleteSound.bind(this)
    };
  }

  // 开始音：上升的音调
  generateStartSound() {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(880, this.audioContext.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  // 提醒音：柔和的钟声
  generateReminderSound() {
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
    
    frequencies.forEach((freq, index) => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.value = freq;
      oscillator.type = 'sine';
      
      const startTime = this.audioContext.currentTime + index * 0.1;
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.5);
    });
  }

  // 休息音：舒缓的和弦
  generateBreakSound() {
    const chord = [261.63, 329.63, 392.00]; // C4, E4, G4
    
    chord.forEach(freq => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.value = freq;
      oscillator.type = 'triangle';
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.15, this.audioContext.currentTime + 0.2);
      gainNode.gain.linearRampToValueAtTime(0.15, this.audioContext.currentTime + 0.8);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 1);
    });
  }

  // 完成音：胜利的旋律
  generateCompleteSound() {
    const melody = [
      { freq: 523.25, time: 0 },    // C5
      { freq: 523.25, time: 0.1 },  // C5
      { freq: 523.25, time: 0.2 },  // C5
      { freq: 659.25, time: 0.3 },  // E5
      { freq: 783.99, time: 0.5 },  // G5
    ];
    
    melody.forEach(note => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.value = note.freq;
      oscillator.type = 'square';
      
      const startTime = this.audioContext.currentTime + note.time;
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.02);
      gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.08);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.1);
    });
  }

  play(soundType) {
    if (this.sounds[soundType]) {
      this.sounds[soundType]();
    }
  }
}

// 导出单例
export default new AudioGenerator();