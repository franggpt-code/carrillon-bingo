/**
 * Motor de Práctica y Aprendizaje Interactivo para la Canción B-I-N-G-O
 * Gestiona el tiempo, sincronización de notas, evaluación de aciertos y modos de juego.
 */

import { buildSongTimeline, NOTES_MAP } from './songData.js';
import { soundEngine } from './audio.js';

export class PracticeEngine {
  constructor() {
    this.mode = 'playalong'; // 'playalong' | 'stepbystep' | 'autoplay' | 'free'
    this.status = 'idle'; // 'idle' | 'countin' | 'playing' | 'paused' | 'finished'
    this.bpm = 96;
    this.versesCount = 3;

    this.timelineData = null;
    this.timeline = [];
    this.currentIndex = 0;

    // Métricas de práctica
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.hits = 0;
    this.misses = 0;
    this.totalNotes = 0;

    // Temporización precisa con requestAnimationFrame
    this.startTime = 0;
    this.pauseTime = 0;
    this.animFrameId = null;

    // Estado del pulso actual y ventana de tolerancia
    this.currentExpectedNote = null;
    this.expectedNoteHandled = false;
    this.toleranceMs = 380; // Ventana de tolerancia para niños

    // Callbacks a la UI
    this.listeners = {
      onStateChange: () => {},
      onCountIn: () => {},
      onPhraseChange: () => {},
      onNoteTarget: () => {},
      onNoteEvaluated: () => {},
      onSongProgress: () => {},
      onSongFinish: () => {}
    };
  }

  setListener(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = callback;
    }
  }

  setBpm(newBpm) {
    this.bpm = newBpm;
    if (this.status === 'playing' || this.status === 'paused') {
      // Reconstruir timeline manteniendo el progreso aproximado
      const currentProgressRatio = this.currentIndex / (this.timeline.length || 1);
      this.prepareSong();
      this.currentIndex = Math.min(
        this.timeline.length - 1,
        Math.floor(currentProgressRatio * this.timeline.length)
      );
    }
  }

  setMode(newMode) {
    this.mode = newMode;
  }

  setVersesCount(count) {
    this.versesCount = count;
  }

  /**
   * Prepara los datos de la canción según BPM y versos seleccionados
   */
  prepareSong() {
    this.timelineData = buildSongTimeline(this.versesCount, this.bpm);
    this.timeline = this.timelineData.timeline;
    this.currentIndex = 0;
    this.totalNotes = this.timeline.filter(e => e.type === 'note').length;
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Inicia la práctica o reproducción
   */
  async start() {
    await soundEngine.init();

    if (this.status === 'paused') {
      this.resume();
      return;
    }

    this.stop();
    this.prepareSong();
    this.status = 'playing';
    this.startTime = performance.now();
    this.currentIndex = 0;
    this.listeners.onStateChange(this.status);

    if (this.mode === 'stepbystep') {
      this.stepNextNote();
    } else {
      this.loop();
    }
  }

  pause() {
    if (this.status !== 'playing') return;
    this.status = 'paused';
    this.pauseTime = performance.now();
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.listeners.onStateChange(this.status);
  }

  resume() {
    if (this.status !== 'paused') return;
    this.status = 'playing';
    const pauseDuration = performance.now() - this.pauseTime;
    this.startTime += pauseDuration;
    this.listeners.onStateChange(this.status);

    if (this.mode === 'stepbystep') {
      this.stepNextNote();
    } else {
      this.loop();
    }
  }

  stop() {
    this.status = 'idle';
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.currentExpectedNote = null;
    this.expectedNoteHandled = false;
    this.currentIndex = 0;
    this.listeners.onStateChange(this.status);
  }

  /**
   * Bucle principal de sincronización para Play-Along y Demostración
   */
  loop() {
    if (this.status !== 'playing') return;

    const now = performance.now();
    const elapsedSec = (now - this.startTime) / 1000;

    // Notificar progreso continuo
    const totalDuration = this.timelineData.totalDuration;
    const progress = Math.min(1, elapsedSec / totalDuration);
    this.listeners.onSongProgress(progress, elapsedSec, totalDuration);

    // Procesar eventos en el timeline
    while (this.currentIndex < this.timeline.length) {
      const event = this.timeline[this.currentIndex];

      if (elapsedSec >= event.startTime) {
        this.processEvent(event);
        this.currentIndex++;
      } else {
        break;
      }
    }

    // Verificar si se pasó el tiempo para la nota esperada sin tocar
    if (this.currentExpectedNote && !this.expectedNoteHandled && this.mode === 'playalong') {
      const noteEndTime = this.currentExpectedNote.startTime + (this.toleranceMs / 1000);
      if (elapsedSec > noteEndTime) {
        this.evaluateUserHit(null); // Fallo por no tocar
      }
    }

    // Comprobar si la canción ha terminado
    if (this.currentIndex >= this.timeline.length && !this.currentExpectedNote) {
      this.finishSong();
      return;
    }

    this.animFrameId = requestAnimationFrame(() => this.loop());
  }

  /**
   * Ejecuta la acción de un evento en el momento preciso
   */
  processEvent(event) {
    if (event.type === 'countin') {
      soundEngine.playTick(true);
      this.listeners.onCountIn(event.verse, event.label);
    } else if (event.type === 'note') {
      // 1. Acompañamiento armónico y rítmico
      soundEngine.playBackingChord(event.chord, event.beatIndex + 1);

      // 2. Notificar cambio de frase/letra si es el primer pulso
      if (event.beatIndex === 0) {
        this.listeners.onPhraseChange(event.phraseIndex, event.lyricsEn, event.lyricsEs);
      }

      // 3. Modo Demostración: toca la nota automáticamente
      if (this.mode === 'autoplay') {
        soundEngine.playCarillonNote(event.noteData.freq, 0.95);
        this.listeners.onNoteTarget(event, true);
      } else {
        // Modo Práctica: registrar como la nota esperada
        this.currentExpectedNote = event;
        this.expectedNoteHandled = false;
        this.listeners.onNoteTarget(event, false);
      }
    }
  }

  /**
   * Modo Paso a Paso: salta a la siguiente nota y espera la pulsación del alumno
   */
  stepNextNote() {
    if (this.currentIndex >= this.timeline.length) {
      this.finishSong();
      return;
    }

    const event = this.timeline[this.currentIndex];

    if (event.type === 'countin') {
      this.listeners.onCountIn(event.verse, event.label);
      this.currentIndex++;
      setTimeout(() => this.stepNextNote(), 1000);
      return;
    }

    if (event.type === 'note') {
      this.currentExpectedNote = event;
      this.expectedNoteHandled = false;

      // Sonar acorde de fondo para armonía
      soundEngine.playBackingChord(event.chord, event.beatIndex + 1);

      if (event.beatIndex === 0) {
        this.listeners.onPhraseChange(event.phraseIndex, event.lyricsEn, event.lyricsEs);
      }

      this.listeners.onNoteTarget(event, false);
    }
  }

  /**
   * Recibe la pulsación del usuario desde la interfaz (teclado, clic o táctil)
   * @param {string} playedNoteId Identificador de nota pulsada ('C5', 'G4', etc.)
   */
  onUserPlayBar(playedNoteId) {
    // En modo libre o de fondo, siempre suena
    const noteData = NOTES_MAP[playedNoteId];
    if (noteData) {
      soundEngine.playCarillonNote(noteData.freq, 0.95);
    }

    if (this.status !== 'playing') return;

    if (this.mode === 'playalong' || this.mode === 'stepbystep') {
      this.evaluateUserHit(playedNoteId);
    }
  }

  /**
   * Evalúa la precisión de la nota tocada por el alumno
   */
  evaluateUserHit(playedNoteId) {
    if (!this.currentExpectedNote || this.expectedNoteHandled) return;

    const expected = this.currentExpectedNote;

    if (playedNoteId === expected.noteId) {
      // ¡Acierto!
      this.expectedNoteHandled = true;
      this.hits++;
      this.combo++;
      if (this.combo > this.maxCombo) this.maxCombo = this.combo;

      const points = 50 + Math.min(50, this.combo * 5);
      this.score += points;

      soundEngine.playSuccessChime();

      this.listeners.onNoteEvaluated({
        success: true,
        type: 'perfect',
        message: '¡Excelente!',
        expectedNote: expected.noteId,
        playedNote: playedNoteId,
        score: this.score,
        combo: this.combo
      });

      this.currentExpectedNote = null;

      if (this.mode === 'stepbystep') {
        this.currentIndex++;
        setTimeout(() => this.stepNextNote(), 450);
      }
    } else if (playedNoteId === null) {
      // Se pasó el tiempo sin tocar
      this.expectedNoteHandled = true;
      this.misses++;
      this.combo = 0;

      this.listeners.onNoteEvaluated({
        success: false,
        type: 'miss',
        message: '¡Se pasó!',
        expectedNote: expected.noteId,
        playedNote: null,
        score: this.score,
        combo: 0
      });

      this.currentExpectedNote = null;
    } else {
      // Tocó una nota equivocada
      this.combo = 0;

      this.listeners.onNoteEvaluated({
        success: false,
        type: 'wrong',
        message: `Era ${expected.noteData.solfege} (${expected.noteData.name})`,
        expectedNote: expected.noteId,
        playedNote: playedNoteId,
        score: this.score,
        combo: 0
      });

      // En modo paso a paso, no avanzamos hasta que acierte
      if (this.mode !== 'stepbystep') {
        this.expectedNoteHandled = true;
        this.misses++;
        this.currentExpectedNote = null;
      }
    }
  }

  /**
   * Finaliza la canción y calcula puntuación y estrellas
   */
  finishSong() {
    this.status = 'finished';
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    const accuracy = this.totalNotes > 0 ? Math.round((this.hits / this.totalNotes) * 100) : 100;
    let stars = 1;
    if (accuracy >= 85) stars = 3;
    else if (accuracy >= 60) stars = 2;

    soundEngine.playVictoryFanfare();

    this.listeners.onSongFinish({
      score: this.score,
      hits: this.hits,
      misses: this.misses,
      totalNotes: this.totalNotes,
      accuracy,
      stars,
      maxCombo: this.maxCombo
    });

    this.listeners.onStateChange(this.status);
  }
}

export const practiceEngine = new PracticeEngine();
