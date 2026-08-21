export class AudioEngine {
  private ctx: AudioContext | null = null;

  init() {
    if (typeof window === 'undefined') return;
    
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playPositive() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    const playTone = (freq: number, startTime: number) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.08, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);
      
      osc.start(startTime);
      osc.stop(startTime + 0.15);
    };

    // Quick arpeggio: C5 -> G5 -> C6
    playTone(523.25, now);
    playTone(783.99, now + 0.08);
    playTone(1046.50, now + 0.16);
  }

  playNegative() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    
    // Low pitched descending thud
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.05, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    
    osc.start(now);
    osc.stop(now + 0.3);
  }
}

export const audioEngine = new AudioEngine();
