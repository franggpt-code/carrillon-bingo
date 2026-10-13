/**
 * Motor de sonido Web Audio API para Carillón / Metalófono Escolar
 * y Acompañamiento de Acordes Armónicos en Tiempo Real.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.carillonGain = null;
    this.backingGain = null;
    this.sfxGain = null;
    this.isMuted = false;
    this.backingEnabled = true;
    this.reverbNode = null;

    // Frecuencias base de los acordes de acompañamiento
    this.chordFrequencies = {
      'C': [130.81, 196.00, 261.63, 329.63],      // C3, G3, C4, E4
      'F': [174.61, 220.00, 261.63, 349.23],      // F3, A3, C4, F4
      'G': [196.00, 246.94, 293.66, 392.00],      // G3, B3, D4, G4
      'Am': [110.00, 220.00, 261.63, 329.63]      // A2, A3, C4, E4
    };
  }

  /**
   * Inicializa el contexto de audio tras el primer clic o pulsación del usuario
   */
  async init() {
    if (this.ctx && this.ctx.state !== 'closed') {
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
      return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContextClass();

    // Ganancia Master
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);

    // Canales independientes
    this.carillonGain = this.ctx.createGain();
    this.carillonGain.gain.setValueAtTime(1.0, this.ctx.currentTime);

    this.backingGain = this.ctx.createGain();
    this.backingGain.gain.setValueAtTime(0.65, this.ctx.currentTime);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

    // Conectar canales al master
    this.carillonGain.connect(this.masterGain);
    this.backingGain.connect(this.masterGain);
    this.sfxGain.connect(this.masterGain);

    // Compresor de salida para que nunca distorsione
    const compressor = this.ctx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-12, this.ctx.currentTime);
    compressor.knee.setValueAtTime(20, this.ctx.currentTime);
    compressor.ratio.setValueAtTime(4, this.ctx.currentTime);
    compressor.attack.setValueAtTime(0.005, this.ctx.currentTime);
    compressor.release.setValueAtTime(0.1, this.ctx.currentTime);

    this.masterGain.connect(compressor);
    compressor.connect(this.ctx.destination);

    // Crear reverberación algorítmica suave para brillo metálico
    this.createReverb();
  }

  /**
   * Crea un sintetizador de reverberación para dar realismo espacial al carillón
   */
  createReverb() {
    try {
      const length = this.ctx.sampleRate * 1.5;
      const decay = 2.0;
      const impulse = this.ctx.createBuffer(2, length, this.ctx.sampleRate);
      const left = impulse.getChannelData(0);
      const right = impulse.getChannelData(1);

      for (let i = 0; i < length; i++) {
        const t = i / length;
        const n = (Math.random() * 2 - 1) * Math.pow(1 - t, decay);
        left[i] = n;
        right[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, decay);
      }

      this.reverbNode = this.ctx.createConvolver();
      this.reverbNode.buffer = impulse;

      const reverbGain = this.ctx.createGain();
      reverbGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

      this.reverbNode.connect(reverbGain);
      reverbGain.connect(this.masterGain);
    } catch (e) {
      console.warn("Reverb no soportado:", e);
    }
  }

  /**
   * Toca una placa del Carillón con síntesis acústica de barra de metal
   * @param {number} freq Frecuencia fundamental en Hz
   * @param {number} velocity Volumen de la pulsación (0.0 a 1.0)
   */
  playCarillonNote(freq, velocity = 0.9) {
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const now = this.ctx.currentTime;
    const dur = 2.2; // Duración de resonancia de la placa

    // Nodo mezclador para esta nota
    const noteGain = this.ctx.createGain();
    noteGain.gain.setValueAtTime(velocity, now);
    noteGain.connect(this.carillonGain);

    if (this.reverbNode) {
      noteGain.connect(this.reverbNode);
    }

    // 1. FUNDAMENTAL (Cuerpo principal de la placa)
    const oscFund = this.ctx.createOscillator();
    const gainFund = this.ctx.createGain();
    oscFund.type = 'sine';
    oscFund.frequency.setValueAtTime(freq, now);

    gainFund.gain.setValueAtTime(0.001, now);
    gainFund.gain.linearRampToValueAtTime(0.7, now + 0.004); // Ataque ultra rápido
    gainFund.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    oscFund.connect(gainFund);
    gainFund.connect(noteGain);
    oscFund.start(now);
    oscFund.stop(now + dur);

    // 2. MODO METÁLICO 1 (Armónico inarmónico típico de placas metálicas ~ 2.76x)
    const oscPart1 = this.ctx.createOscillator();
    const gainPart1 = this.ctx.createGain();
    oscPart1.type = 'sine';
    oscPart1.frequency.setValueAtTime(freq * 2.756, now);

    gainPart1.gain.setValueAtTime(0.001, now);
    gainPart1.gain.linearRampToValueAtTime(0.35, now + 0.002);
    gainPart1.gain.exponentialRampToValueAtTime(0.0001, now + 0.45); // Se extingue rápido

    oscPart1.connect(gainPart1);
    gainPart1.connect(noteGain);
    oscPart1.start(now);
    oscPart1.stop(now + 0.5);

    // 3. MODO METÁLICO 2 (Brillo campana / "Chime" de alta frecuencia ~ 5.40x)
    const oscPart2 = this.ctx.createOscillator();
    const gainPart2 = this.ctx.createGain();
    oscPart2.type = 'sine';
    oscPart2.frequency.setValueAtTime(freq * 5.404, now);

    gainPart2.gain.setValueAtTime(0.001, now);
    gainPart2.gain.linearRampToValueAtTime(0.18, now + 0.002);
    gainPart2.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

    oscPart2.connect(gainPart2);
    gainPart2.connect(noteGain);
    oscPart2.start(now);
    oscPart2.stop(now + 0.25);

    // 4. GOLPE DE BAQUETA (Mallet transient / "Click" de madera/fieltro)
    this.playMalletClick(freq, now, noteGain);
  }

  /**
   * Genera el chasquido inicial del percutor al golpear la placa
   */
  playMalletClick(freq, time, destGain) {
    const bufferSize = this.ctx.sampleRate * 0.015; // 15 ms
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(Math.min(freq * 3, 5000), time);
    filter.Q.setValueAtTime(2.0, time);

    const clickGain = this.ctx.createGain();
    clickGain.gain.setValueAtTime(0.25, time);

    noise.connect(filter);
    filter.connect(clickGain);
    clickGain.connect(destGain);

    noise.start(time);
  }

  /**
   * Toca un acorde de acompañamiento alegre (guitarra acústica / ukelele sintetizado)
   * @param {string} chordName 'C', 'F', 'G', 'Am'
   * @param {number} beatType 1 (bajo+acorde), 2 (rasgueo), 3 (bajo+acorde), 4 (rasgueo)
   */
  playBackingChord(chordName = 'C', beatType = 1) {
    if (!this.backingEnabled || !this.ctx) return;

    const freqs = this.chordFrequencies[chordName] || this.chordFrequencies['C'];
    const now = this.ctx.currentTime;
    const dur = 0.55;

    // 1. Tocar bajo en pulsos 1 y 3
    if (beatType === 1 || beatType === 3) {
      const bassFreq = freqs[0];
      const oscBass = this.ctx.createOscillator();
      const gainBass = this.ctx.createGain();
      const filterBass = this.ctx.createBiquadFilter();

      oscBass.type = 'triangle';
      oscBass.frequency.setValueAtTime(bassFreq, now);

      filterBass.type = 'lowpass';
      filterBass.frequency.setValueAtTime(320, now);

      gainBass.gain.setValueAtTime(0.3, now);
      gainBass.gain.exponentialRampToValueAtTime(0.001, now + dur);

      oscBass.connect(filterBass);
      filterBass.connect(gainBass);
      gainBass.connect(this.backingGain);

      oscBass.start(now);
      oscBass.stop(now + dur);
    }

    // 2. Rasgueo armónico de las cuerdas/notas del acorde (con sutil arpegio humano)
    freqs.slice(1).forEach((freq, idx) => {
      const strumDelay = idx * 0.015; // 15 ms de desfase imitando rasgueo
      const noteTime = now + strumDelay;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, noteTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, noteTime);
      filter.frequency.exponentialRampToValueAtTime(600, noteTime + 0.35);

      gain.gain.setValueAtTime(0.001, noteTime);
      gain.gain.linearRampToValueAtTime(0.09, noteTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.backingGain);

      osc.start(noteTime);
      osc.stop(noteTime + 0.45);
    });

    // 3. Percusión rítmica infantil (shaker / bombo suave)
    this.playPercussionBeat(beatType, now);
  }

  /**
   * Percusión ligera para el ritmo alegre de la canción
   */
  playPercussionBeat(beatType, time) {
    if (!this.backingEnabled || !this.ctx) return;

    if (beatType === 1 || beatType === 3) {
      // Bombo suave acústico
      const oscKick = this.ctx.createOscillator();
      const gainKick = this.ctx.createGain();
      oscKick.frequency.setValueAtTime(110, time);
      oscKick.frequency.exponentialRampToValueAtTime(45, time + 0.12);

      gainKick.gain.setValueAtTime(0.28, time);
      gainKick.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

      oscKick.connect(gainKick);
      gainKick.connect(this.backingGain);
      oscKick.start(time);
      oscKick.stop(time + 0.16);
    } else {
      // Shaker / palmada suave
      const dur = 0.06;
      const bufferSize = this.ctx.sampleRate * dur;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(3500, time);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.12, time);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.backingGain);

      noise.start(time);
    }
  }

  /**
   * Sonido de metrónomo / cuenta atrás (Ready... 1... 2...)
   */
  playTick(isAccent = false) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(isAccent ? 1200 : 800, now);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  /**
   * Efecto de acierto al tocar la nota correcta a tiempo
   */
  playSuccessChime() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [880, 1174.66]; // A5 -> D6

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + idx * 0.06;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.3);
    });
  }

  /**
   * Fanfarria de victoria al completar la canción
   */
  playVictoryFanfare() {
    if (!this.ctx) return;
    const chords = [
      { notes: [523.25, 659.25, 783.99], delay: 0 },       // C
      { notes: [587.33, 698.46, 880.00], delay: 0.2 },     // Dm
      { notes: [659.25, 783.99, 987.77], delay: 0.4 },     // Em
      { notes: [783.99, 987.77, 1046.50], delay: 0.65 }    // C alto
    ];

    const now = this.ctx.currentTime;
    chords.forEach(c => {
      c.notes.forEach(f => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + c.delay;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t);

        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(t);
        osc.stop(t + 0.65);
      });
    });
  }

  /**
   * Ajuste de volumen maestro
   */
  setMasterVolume(val) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, val)), this.ctx.currentTime);
    }
  }

  /**
   * Activar/desactivar acompañamiento
   */
  toggleBacking(enabled) {
    this.backingEnabled = enabled;
  }
}

export const soundEngine = new SoundEngine();
