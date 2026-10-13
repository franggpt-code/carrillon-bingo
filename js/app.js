/**
 * Controlador principal de la Aplicación Carillón Mágico (Bingo Play-Along)
 * Enlaza la interfaz de usuario, eventos táctiles/teclado, animaciones y motor de juego.
 */

import { NOTES_MAP, CARILLON_BARS, VERSE_PHRASES } from './songData.js';
import { soundEngine } from './audio.js';
import { practiceEngine } from './practiceEngine.js';

// Elementos del DOM
const carillonContainer = document.getElementById('carillon-bars-container');
const btnPlay = document.getElementById('btn-play');
const playBtnIcon = document.getElementById('play-btn-icon');
const playBtnLabel = document.getElementById('play-btn-label');
const btnStop = document.getElementById('btn-stop');
const selectMode = document.getElementById('select-mode');
const selectNotation = document.getElementById('select-notation');
const selectSpeed = document.getElementById('select-speed');
const btnToggleBacking = document.getElementById('btn-toggle-backing');
const btnHelp = document.getElementById('btn-help');
const btnFullscreen = document.getElementById('btn-fullscreen');

const countinOverlay = document.getElementById('countin-overlay');
const hitFeedback = document.getElementById('hit-feedback');
const malletMarker = document.getElementById('mallet-marker');
const lyricsEn = document.getElementById('lyrics-en');
const lyricsEs = document.getElementById('lyrics-es');
const progressBar = document.getElementById('song-progress-bar');
const hudPhrase = document.getElementById('hud-phrase-info');
const valScore = document.getElementById('val-score');
const valCombo = document.getElementById('val-combo');

const modalVictory = document.getElementById('modal-victory');
const btnVictoryReplay = document.getElementById('btn-victory-replay');
const btnVictoryClose = document.getElementById('btn-victory-close');
const modalGuide = document.getElementById('modal-guide');
const btnGuideClose = document.getElementById('btn-guide-close');

// Estado visual
let currentNotation = 'both'; // 'both' | 'solfege' | 'letters'
let currentPhraseIndex = 0;
let currentVerseIndex = 1;
let bellElements = [];

// Inicialización de la aplicación
function initApp() {
  renderCarillonBars();
  cacheBellElements();
  updatePhraseBells(0, 1);
  setupEventListeners();
  setupPracticeEngineCallbacks();
}

/**
 * Renderiza las 8 placas metálicas del carillón
 */
function renderCarillonBars() {
  carillonContainer.innerHTML = '';

  CARILLON_BARS.forEach((noteId) => {
    const note = NOTES_MAP[noteId];
    const bar = document.createElement('div');
    bar.className = 'carillon-bar';
    bar.dataset.note = noteId;
    bar.style.backgroundColor = note.color;
    bar.style.backgroundImage = `linear-gradient(135deg, ${note.colorLight} 0%, ${note.color} 50%, rgba(0,0,0,0.15) 100%)`;

    bar.innerHTML = `
      <div class="bar-pin"></div>
      <div class="bar-label-group">
        <span class="bar-letter">${note.name}</span>
        <span class="bar-solfege">${note.solfege}</span>
        <span class="bar-key-shortcut">${note.key}</span>
      </div>
      <div class="bar-pin"></div>
    `;

    // Eventos táctiles y de puntero ultra rápidos (baja latencia)
    bar.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      triggerBarHit(noteId, true);
    });

    carillonContainer.appendChild(bar);
  });

  updateNotationDisplay();
}

/**
 * Guarda las referencias a las 4 campanas del compás
 */
function cacheBellElements() {
  bellElements = [0, 1, 2, 3].map(i => ({
    root: document.getElementById(`bell-${i}`),
    letter: document.getElementById(`letter-${i}`),
    solfege: document.getElementById(`solfege-${i}`),
    chord: document.getElementById(`chord-${i}`)
  }));
}

/**
 * Actualiza las 4 campanas del camino según la frase actual
 */
function updatePhraseBells(phraseIdx, verseNum = 1) {
  const phrase = VERSE_PHRASES[phraseIdx] || VERSE_PHRASES[0];
  currentPhraseIndex = phraseIdx;
  currentVerseIndex = verseNum;

  phrase.notes.forEach((noteId, i) => {
    const note = NOTES_MAP[noteId];
    const bell = bellElements[i];
    if (!bell || !note) return;

    bell.root.style.backgroundColor = note.color;
    bell.letter.textContent = note.name;
    bell.solfege.textContent = note.solfege;
    bell.chord.textContent = phrase.chordProgression[i] || phrase.chord;
    bell.root.classList.remove('active-beat', 'hit-success');
  });

  // Posicionar el percutor en la primera campana
  positionMalletMarker(0);
}

/**
 * Posiciona suavemente el marcador (perrito/percutor) sobre la campana activa
 */
function positionMalletMarker(beatIdx) {
  const targetBellObj = bellElements[beatIdx];
  const targetBell = targetBellObj ? targetBellObj.root : null;
  if (!targetBell) return;

  const trackRect = document.getElementById('bells-track').getBoundingClientRect();
  const bellRect = targetBell.getBoundingClientRect();
  const centerRel = (bellRect.left + bellRect.width / 2) - trackRect.left;

  malletMarker.style.left = `${centerRel}px`;
}

/**
 * Disparo físico de una placa del carillón
 */
function triggerBarHit(noteId, isUser = false) {
  const bar = carillonContainer.querySelector(`[data-note="${noteId}"]`);
  if (bar) {
    bar.classList.remove('struck');
    void bar.offsetWidth; // Force reflow
    bar.classList.add('struck');
    setTimeout(() => bar.classList.remove('struck'), 150);
  }

  if (isUser) {
    practiceEngine.onUserPlayBar(noteId);
  }
}

/**
 * Resalta la placa esperada para guiar al alumno
 */
function highlightTargetBar(noteId) {
  // Quitar resaltados previos
  carillonContainer.querySelectorAll('.carillon-bar').forEach(b => {
    b.classList.remove('target-prompt');
  });

  if (noteId) {
    const bar = carillonContainer.querySelector(`[data-note="${noteId}"]`);
    if (bar) bar.classList.add('target-prompt');
  }
}

/**
 * Configura los callbacks que emite el motor de práctica hacia la interfaz
 */
function setupPracticeEngineCallbacks() {
  practiceEngine.setListener('onStateChange', (state) => {
    if (state === 'playing') {
      btnPlay.classList.add('active');
      playBtnIcon.textContent = '⏸';
      playBtnLabel.textContent = 'Pausar';
      btnStop.style.display = 'inline-flex';
    } else if (state === 'paused') {
      playBtnIcon.textContent = '▶';
      playBtnLabel.textContent = 'Continuar';
    } else {
      btnPlay.classList.remove('active');
      playBtnIcon.textContent = '▶';
      playBtnLabel.textContent = 'Tocar Canción';
      btnStop.style.display = 'none';
      highlightTargetBar(null);
      countinOverlay.style.display = 'none';
    }
  });

  practiceEngine.setListener('onCountIn', (verse, label) => {
    countinOverlay.textContent = label;
    countinOverlay.style.display = 'block';
    setTimeout(() => {
      countinOverlay.style.display = 'none';
    }, 900);
  });

  practiceEngine.setListener('onPhraseChange', (phraseIdx, lyEn, lyEs) => {
    updatePhraseBells(phraseIdx, currentVerseIndex);
    lyricsEn.textContent = lyEn;
    lyricsEs.textContent = lyEs;
    hudPhrase.textContent = `📜 Estrofa ${currentVerseIndex} · Frase ${phraseIdx + 1}/6`;
  });

  practiceEngine.setListener('onNoteTarget', (event, isAutoPlay) => {
    // Activar campana en el camino
    bellElements.forEach((b, idx) => {
      if (idx === event.beatIndex) {
        b.root.classList.add('active-beat');
      } else {
        b.root.classList.remove('active-beat');
      }
    });

    positionMalletMarker(event.beatIndex);

    if (isAutoPlay) {
      triggerBarHit(event.noteId, false);
      highlightTargetBar(null);
    } else {
      highlightTargetBar(event.noteId);
    }
  });

  practiceEngine.setListener('onNoteEvaluated', (res) => {
    valScore.textContent = res.score;
    valCombo.textContent = res.combo;

    // Mostrar feedback flotante
    hitFeedback.className = 'hit-feedback-popup';
    if (res.success) {
      hitFeedback.textContent = res.message;
      hitFeedback.classList.add('feedback-perfect', 'show');
      if (practiceEngine.currentExpectedNote && bellElements[practiceEngine.currentExpectedNote.beatIndex]) {
        bellElements[practiceEngine.currentExpectedNote.beatIndex].root.classList.add('hit-success');
      }
    } else if (res.type === 'miss') {
      hitFeedback.textContent = res.message;
      hitFeedback.classList.add('feedback-miss', 'show');
    } else {
      hitFeedback.textContent = res.message;
      hitFeedback.classList.add('feedback-wrong', 'show');
    }

    setTimeout(() => {
      hitFeedback.classList.remove('show');
    }, 600);
  });

  practiceEngine.setListener('onSongProgress', (ratio) => {
    progressBar.style.width = `${ratio * 100}%`;
  });

  practiceEngine.setListener('onSongFinish', (stats) => {
    openVictoryModal(stats);
  });
}

/**
 * Muestra el modal de felicitación con estrellas y confeti
 */
function openVictoryModal(stats) {
  document.getElementById('stat-score').textContent = stats.score;
  document.getElementById('stat-accuracy').textContent = `${stats.accuracy}%`;
  document.getElementById('stat-hits').textContent = `${stats.hits} / ${stats.totalNotes}`;
  document.getElementById('stat-combo').textContent = `x${stats.maxCombo}`;

  const s1 = document.getElementById('star-1');
  const s2 = document.getElementById('star-2');
  const s3 = document.getElementById('star-3');

  s1.classList.toggle('filled', stats.stars >= 1);
  s2.classList.toggle('filled', stats.stars >= 2);
  s3.classList.toggle('filled', stats.stars >= 3);

  modalVictory.classList.add('open');

  // Lanzar confeti si la librería está disponible
  if (typeof window.confetti === 'function') {
    window.confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}

/**
 * Actualiza la visualización de notación (Do-Re-Mi vs C-D-E)
 */
function updateNotationDisplay() {
  const bars = carillonContainer.querySelectorAll('.carillon-bar');
  bars.forEach(bar => {
    const letter = bar.querySelector('.bar-letter');
    const solfege = bar.querySelector('.bar-solfege');

    if (currentNotation === 'solfege') {
      letter.style.display = 'none';
      solfege.style.display = 'block';
      solfege.style.fontSize = '1.25rem';
    } else if (currentNotation === 'letters') {
      letter.style.display = 'block';
      letter.style.fontSize = '1.5rem';
      solfege.style.display = 'none';
    } else {
      letter.style.display = 'block';
      letter.style.fontSize = '1.35rem';
      solfege.style.display = 'block';
      solfege.style.fontSize = '0.85rem';
    }
  });

  bellElements.forEach(bell => {
    if (currentNotation === 'solfege') {
      bell.letter.style.display = 'none';
      bell.solfege.style.display = 'block';
      bell.solfege.style.fontSize = '1.1rem';
    } else if (currentNotation === 'letters') {
      bell.letter.style.display = 'block';
      bell.letter.style.fontSize = '1.45rem';
      bell.solfege.style.display = 'none';
    } else {
      bell.letter.style.display = 'block';
      bell.letter.style.fontSize = '1.35rem';
      bell.solfege.style.display = 'block';
      bell.solfege.style.fontSize = '0.72rem';
    }
  });
}

/**
 * Configuración de eventos de botones y teclado
 */
function setupEventListeners() {
  // Botón Play / Pause
  btnPlay.addEventListener('click', () => {
    if (practiceEngine.status === 'playing') {
      practiceEngine.pause();
    } else {
      practiceEngine.start();
    }
  });

  // Botón Detener
  btnStop.addEventListener('click', () => {
    practiceEngine.stop();
    progressBar.style.width = '0%';
  });

  // Selector de modo
  selectMode.addEventListener('change', (e) => {
    practiceEngine.stop();
    practiceEngine.setMode(e.target.value);
  });

  // Selector de notación
  selectNotation.addEventListener('change', (e) => {
    currentNotation = e.target.value;
    updateNotationDisplay();
  });

  // Selector de velocidad
  selectSpeed.addEventListener('change', (e) => {
    practiceEngine.setBpm(parseInt(e.target.value, 10));
  });

  // Toggle de acompañamiento
  btnToggleBacking.addEventListener('click', () => {
    const isEnabled = !soundEngine.backingEnabled;
    soundEngine.toggleBacking(isEnabled);
    btnToggleBacking.classList.toggle('active', isEnabled);
    btnToggleBacking.querySelector('span').textContent = isEnabled ? '🎸 Acordes: ON' : '🎸 Acordes: OFF';
  });

  // Guía / Ayuda
  btnHelp.addEventListener('click', () => modalGuide.classList.add('open'));
  btnGuideClose.addEventListener('click', () => modalGuide.classList.remove('open'));
  modalGuide.addEventListener('click', (e) => {
    if (e.target === modalGuide) modalGuide.classList.remove('open');
  });

  // Acciones de modal de victoria
  btnVictoryReplay.addEventListener('click', () => {
    modalVictory.classList.remove('open');
    practiceEngine.start();
  });
  btnVictoryClose.addEventListener('click', () => {
    modalVictory.classList.remove('open');
  });

  // Pantalla completa
  btnFullscreen.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });

  // Teclado del ordenador (1-8 y A-K)
  window.addEventListener('keydown', (e) => {
    if (e.repeat) return;

    if (e.code === 'Space') {
      e.preventDefault();
      btnPlay.click();
      return;
    }

    // Buscar si corresponde a alguna placa
    for (const [noteId, note] of Object.entries(NOTES_MAP)) {
      if (note.keyboardKeys.includes(e.key)) {
        triggerBarHit(noteId, true);
        break;
      }
    }
  });

  // Redimensionado de ventana para recentrar el marcador
  window.addEventListener('resize', () => {
    if (bellElements[0]) {
      positionMalletMarker(0);
    }
  });
}

// Iniciar al cargar el DOM
document.addEventListener('DOMContentLoaded', initApp);
