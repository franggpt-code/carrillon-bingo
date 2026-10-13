/**
 * ============================================================================
 * CARILLÓN MÁGICO · BINGO PLAY-ALONG (BUNDLE UNIVERSAL)
 * Compatible con iOS 12.5.8+ (Safari 12), iPad mini, iPhone y navegadores modernos.
 * ============================================================================
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. DATOS MUSICALES Y NOTAS (songData)
  // --------------------------------------------------------------------------
  var NOTES_MAP = {
    G4: {
      id: 'G4',
      name: 'G',
      solfege: 'Sol',
      octave: 4,
      freq: 392.00,
      color: '#059669',
      colorLight: '#34d399',
      key: '1',
      shortcut: '1 / A',
      keyboardKeys: ['1', 'a', 'A']
    },
    A4: {
      id: 'A4',
      name: 'A',
      solfege: 'La',
      octave: 4,
      freq: 440.00,
      color: '#6366f1',
      colorLight: '#818cf8',
      key: '2',
      shortcut: '2 / S',
      keyboardKeys: ['2', 's', 'S']
    },
    B4: {
      id: 'B4',
      name: 'B',
      solfege: 'Si',
      octave: 4,
      freq: 493.88,
      color: '#d946ef',
      colorLight: '#f472b6',
      key: '3',
      shortcut: '3 / D',
      keyboardKeys: ['3', 'd', 'D']
    },
    C5: {
      id: 'C5',
      name: 'C',
      solfege: 'Do',
      octave: 5,
      freq: 523.25,
      color: '#ef4444',
      colorLight: '#f87171',
      key: '4',
      shortcut: '4 / F',
      keyboardKeys: ['4', 'f', 'F']
    },
    D5: {
      id: 'D5',
      name: 'D',
      solfege: 'Re',
      octave: 5,
      freq: 587.33,
      color: '#f97316',
      colorLight: '#fb923c',
      key: '5',
      shortcut: '5 / G',
      keyboardKeys: ['5', 'g', 'G']
    },
    E5: {
      id: 'E5',
      name: 'E',
      solfege: 'Mi',
      octave: 5,
      freq: 659.25,
      color: '#eab308',
      colorLight: '#fde047',
      key: '6',
      shortcut: '6 / H',
      keyboardKeys: ['6', 'h', 'H']
    },
    F5: {
      id: 'F5',
      name: 'F',
      solfege: 'Fa',
      octave: 5,
      freq: 698.46,
      color: '#84cc16',
      colorLight: '#a3e635',
      key: '7',
      shortcut: '7 / J',
      keyboardKeys: ['7', 'j', 'J']
    },
    G5: {
      id: 'G5',
      name: 'G',
      solfege: 'Sol',
      octave: 5,
      freq: 783.99,
      color: '#10b981',
      colorLight: '#6ee7b7',
      key: '8',
      shortcut: '8 / K',
      keyboardKeys: ['8', 'k', 'K']
    }
  };

  var CARILLON_BARS = ['G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5'];

  var VERSE_PHRASES = [
    {
      id: 'phrase_1',
      title: 'Frase 1',
      lyricsEn: 'There was a farmer had a dog',
      lyricsEs: 'Había un granjero que tenía un perro',
      notes: ['C5', 'C5', 'A4', 'G4'],
      chord: 'C',
      chordProgression: ['C', 'C', 'F', 'G']
    },
    {
      id: 'phrase_2',
      title: 'Frase 2',
      lyricsEn: 'and BINGO was his name - O',
      lyricsEs: 'y BINGO se llamaba - O',
      notes: ['C5', 'D5', 'E5', 'C5'],
      chord: 'C',
      chordProgression: ['C', 'G', 'C', 'C']
    },
    {
      id: 'phrase_3',
      title: 'Frase 3',
      lyricsEn: 'B - I - N - G - O !',
      lyricsEs: '¡ B - I - N - G - O !',
      notes: ['E5', 'E5', 'F5', 'F5'],
      chord: 'F',
      chordProgression: ['C', 'C', 'F', 'F']
    },
    {
      id: 'phrase_4',
      title: 'Frase 4',
      lyricsEn: 'B - I - N - G - O !',
      lyricsEs: '¡ B - I - N - G - O !',
      notes: ['D5', 'D5', 'E5', 'E5'],
      chord: 'G',
      chordProgression: ['G', 'G', 'C', 'C']
    },
    {
      id: 'phrase_5',
      title: 'Frase 5',
      lyricsEn: 'B - I - N - G - O !',
      lyricsEs: '¡ B - I - N - G - O !',
      notes: ['C5', 'C5', 'D5', 'D5'],
      chord: 'Am',
      chordProgression: ['C', 'C', 'G', 'G']
    },
    {
      id: 'phrase_6',
      title: 'Frase 6',
      lyricsEn: 'and BINGO was his name - O',
      lyricsEs: '¡y BINGO se llamaba - O!',
      notes: ['B4', 'A4', 'C5', 'C5'],
      chord: 'C',
      chordProgression: ['G', 'F', 'C', 'C']
    }
  ];

  function buildSongTimeline(versesCount, bpm) {
    if (typeof versesCount === 'undefined') versesCount = 3;
    if (typeof bpm === 'undefined') bpm = 60;

    var beatDuration = 60 / bpm;
    var timeline = [];
    var currentTime = 0;

    for (var v = 0; v < versesCount; v++) {
      var verseNum = v + 1;

      timeline.push({
        type: 'countin',
        verse: verseNum,
        label: '¡LISTOS!',
        startTime: currentTime,
        duration: beatDuration * 2
      });
      currentTime += beatDuration * 2;

      for (var phraseIdx = 0; phraseIdx < VERSE_PHRASES.length; phraseIdx++) {
        var phrase = VERSE_PHRASES[phraseIdx];
        var lyricsEn = phrase.lyricsEn;
        var lyricsEs = phrase.lyricsEs;

        if (verseNum === 2 && (phraseIdx === 2 || phraseIdx === 3 || phraseIdx === 4)) {
          lyricsEn = '(clap) - I - N - G - O !';
          lyricsEs = '(👏) - I - N - G - O !';
        } else if (verseNum === 3 && (phraseIdx === 2 || phraseIdx === 3 || phraseIdx === 4)) {
          lyricsEn = '(clap) - (clap) - N - G - O !';
          lyricsEs = '(👏) - (👏) - N - G - O !';
        }

        for (var beatIdx = 0; beatIdx < phrase.notes.length; beatIdx++) {
          var noteId = phrase.notes[beatIdx];
          var chord = phrase.chordProgression[beatIdx] || phrase.chord;
          timeline.push({
            type: 'note',
            verse: verseNum,
            phraseIndex: phraseIdx,
            beatIndex: beatIdx,
            noteId: noteId,
            chord: chord,
            lyricsEn: lyricsEn,
            lyricsEs: lyricsEs,
            startTime: currentTime,
            duration: beatDuration,
            noteData: NOTES_MAP[noteId]
          });
          currentTime += beatDuration;
        }
      }

      currentTime += beatDuration;
    }

    return {
      totalDuration: currentTime,
      beatDuration: beatDuration,
      bpm: bpm,
      timeline: timeline
    };
  }

  // --------------------------------------------------------------------------
  // 2. MOTOR DE AUDIO COMPATIBLE CON IOS 12 (SoundEngine)
  // --------------------------------------------------------------------------
  function SoundEngine() {
    this.ctx = null;
    this.masterGain = null;
    this.carillonGain = null;
    this.backingGain = null;
    this.sfxGain = null;
    this.isMuted = false;
    this.backingEnabled = true;
    this.reverbNode = null;
    this.unlocked = false;

    this.chordFrequencies = {
      'C': [130.81, 196.00, 261.63, 329.63],
      'F': [174.61, 220.00, 261.63, 349.23],
      'G': [196.00, 246.94, 293.66, 392.00],
      'Am': [110.00, 220.00, 261.63, 329.63]
    };
  }

  SoundEngine.prototype.init = function () {
    var self = this;
    if (this.ctx && this.ctx.state !== 'closed') {
      if (this.ctx.state === 'suspended') {
        try { this.ctx.resume(); } catch (e) {}
      }
      return Promise.resolve();
    }

    var AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      console.warn("Web Audio API no soportado");
      return Promise.resolve();
    }

    try {
      this.ctx = new AudioContextClass();
    } catch (e) {
      console.warn("Error creando AudioContext:", e);
      return Promise.resolve();
    }

    // Ganancia Master
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);

    // Canales
    this.carillonGain = this.ctx.createGain();
    this.carillonGain.gain.setValueAtTime(1.0, this.ctx.currentTime);

    this.backingGain = this.ctx.createGain();
    this.backingGain.gain.setValueAtTime(0.65, this.ctx.currentTime);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

    this.carillonGain.connect(this.masterGain);
    this.backingGain.connect(this.masterGain);
    this.sfxGain.connect(this.masterGain);

    // Compresor de salida seguro
    try {
      var compressor = this.ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-12, this.ctx.currentTime);
      compressor.knee.setValueAtTime(20, this.ctx.currentTime);
      compressor.ratio.setValueAtTime(4, this.ctx.currentTime);
      compressor.attack.setValueAtTime(0.005, this.ctx.currentTime);
      compressor.release.setValueAtTime(0.1, this.ctx.currentTime);

      this.masterGain.connect(compressor);
      compressor.connect(this.ctx.destination);
    } catch (errComp) {
      this.masterGain.connect(this.ctx.destination);
    }

    this.unlock();
    return Promise.resolve();
  };

  /**
   * Rutina especial de desbloqueo de audio para Safari en iOS 12
   */
  SoundEngine.prototype.unlock = function () {
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      try { this.ctx.resume(); } catch (e) {}
    }

    try {
      var buffer = this.ctx.createBuffer(1, 1, 22050);
      var source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(this.ctx.destination);
      if (source.start) {
        source.start(0);
      } else if (source.noteOn) {
        source.noteOn(0);
      }
      this.unlocked = true;
    } catch (e) {
      // Ignorar si falla el dummy buffer
    }
  };

  /**
   * Toca una placa del carillón con sonido de metal
   */
  SoundEngine.prototype.playCarillonNote = function (freq, velocity) {
    if (typeof velocity === 'undefined') velocity = 0.9;
    if (!this.ctx) this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      try { this.ctx.resume(); } catch (e) {}
    }

    var now = this.ctx.currentTime;
    var dur = 2.0;

    var noteGain = this.ctx.createGain();
    noteGain.gain.setValueAtTime(velocity, now);
    noteGain.connect(this.carillonGain);

    // 1. Fundamental
    try {
      var oscFund = this.ctx.createOscillator();
      var gainFund = this.ctx.createGain();
      oscFund.type = 'sine';
      oscFund.frequency.setValueAtTime(freq, now);

      gainFund.gain.setValueAtTime(0.001, now);
      gainFund.gain.linearRampToValueAtTime(0.7, now + 0.004);
      gainFund.gain.exponentialRampToValueAtTime(0.0001, now + dur);

      oscFund.connect(gainFund);
      gainFund.connect(noteGain);
      oscFund.start(now);
      oscFund.stop(now + dur);
    } catch (e1) {}

    // 2. Parcial metálico 1 (2.756x)
    try {
      var oscPart1 = this.ctx.createOscillator();
      var gainPart1 = this.ctx.createGain();
      oscPart1.type = 'sine';
      oscPart1.frequency.setValueAtTime(freq * 2.756, now);

      gainPart1.gain.setValueAtTime(0.001, now);
      gainPart1.gain.linearRampToValueAtTime(0.35, now + 0.002);
      gainPart1.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      oscPart1.connect(gainPart1);
      gainPart1.connect(noteGain);
      oscPart1.start(now);
      oscPart1.stop(now + 0.5);
    } catch (e2) {}

    // 3. Parcial metálico 2 (5.404x - Brillo campana)
    try {
      var oscPart2 = this.ctx.createOscillator();
      var gainPart2 = this.ctx.createGain();
      oscPart2.type = 'sine';
      oscPart2.frequency.setValueAtTime(freq * 5.404, now);

      gainPart2.gain.setValueAtTime(0.001, now);
      gainPart2.gain.linearRampToValueAtTime(0.18, now + 0.002);
      gainPart2.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

      oscPart2.connect(gainPart2);
      gainPart2.connect(noteGain);
      oscPart2.start(now);
      oscPart2.stop(now + 0.25);
    } catch (e3) {}

    // 4. Chasquido de baqueta (mallet click)
    this.playMalletClick(freq, now, noteGain);
  };

  SoundEngine.prototype.playMalletClick = function (freq, time, destGain) {
    try {
      var bufferSize = Math.floor(this.ctx.sampleRate * 0.015);
      var buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      var data = buffer.getChannelData(0);

      for (var i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      var noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      var filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(Math.min(freq * 3, 5000), time);
      filter.Q.setValueAtTime(2.0, time);

      var clickGain = this.ctx.createGain();
      clickGain.gain.setValueAtTime(0.22, time);

      noise.connect(filter);
      filter.connect(clickGain);
      clickGain.connect(destGain);

      noise.start(time);
    } catch (e) {}
  };

  SoundEngine.prototype.playBackingChord = function (chordName, beatType) {
    if (!this.backingEnabled || !this.ctx) return;
    if (typeof beatType === 'undefined') beatType = 1;

    var freqs = this.chordFrequencies[chordName] || this.chordFrequencies['C'];
    var now = this.ctx.currentTime;
    var dur = 0.55;

    // Bajo en pulsos 1 y 3
    if (beatType === 1 || beatType === 3) {
      try {
        var bassFreq = freqs[0];
        var oscBass = this.ctx.createOscillator();
        var gainBass = this.ctx.createGain();
        var filterBass = this.ctx.createBiquadFilter();

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
      } catch (eb) {}
    }

    // Rasgueo de cuerdas
    var self = this;
    var chordNotes = freqs.slice(1);
    for (var idx = 0; idx < chordNotes.length; idx++) {
      (function (chordFreq, i) {
        try {
          var strumDelay = i * 0.015;
          var noteTime = now + strumDelay;

          var osc = self.ctx.createOscillator();
          var gain = self.ctx.createGain();
          var filter = self.ctx.createBiquadFilter();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(chordFreq, noteTime);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(1400, noteTime);
          filter.frequency.exponentialRampToValueAtTime(600, noteTime + 0.35);

          gain.gain.setValueAtTime(0.001, noteTime);
          gain.gain.linearRampToValueAtTime(0.09, noteTime + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.4);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(self.backingGain);

          osc.start(noteTime);
          osc.stop(noteTime + 0.45);
        } catch (ec) {}
      })(chordNotes[idx], idx);
    }

    this.playPercussionBeat(beatType, now);
  };

  SoundEngine.prototype.playPercussionBeat = function (beatType, time) {
    if (!this.backingEnabled || !this.ctx) return;

    if (beatType === 1 || beatType === 3) {
      try {
        var oscKick = this.ctx.createOscillator();
        var gainKick = this.ctx.createGain();
        oscKick.frequency.setValueAtTime(110, time);
        oscKick.frequency.exponentialRampToValueAtTime(45, time + 0.12);

        gainKick.gain.setValueAtTime(0.28, time);
        gainKick.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

        oscKick.connect(gainKick);
        gainKick.connect(this.backingGain);
        oscKick.start(time);
        oscKick.stop(time + 0.16);
      } catch (ek) {}
    } else {
      try {
        var dur = 0.06;
        var bufferSize = Math.floor(this.ctx.sampleRate * dur);
        var buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        var data = buffer.getChannelData(0);
        for (var i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
        }
        var noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        var filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(3500, time);

        var gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.12, time);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.backingGain);

        noise.start(time);
      } catch (es) {}
    }
  };

  SoundEngine.prototype.playTick = function (isAccent) {
    if (!this.ctx) return;
    try {
      var now = this.ctx.currentTime;
      var osc = this.ctx.createOscillator();
      var gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(isAccent ? 1200 : 800, now);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {}
  };

  SoundEngine.prototype.playSuccessChime = function () {
    if (!this.ctx) return;
    try {
      var now = this.ctx.currentTime;
      var notes = [880, 1174.66];
      var self = this;

      for (var i = 0; i < notes.length; i++) {
        (function (f, idx) {
          var osc = self.ctx.createOscillator();
          var gain = self.ctx.createGain();
          var t = now + idx * 0.06;

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, t);

          gain.gain.setValueAtTime(0.15, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

          osc.connect(gain);
          gain.connect(self.sfxGain);

          osc.start(t);
          osc.stop(t + 0.3);
        })(notes[i], i);
      }
    } catch (e) {}
  };

  SoundEngine.prototype.playVictoryFanfare = function () {
    if (!this.ctx) return;
    try {
      var chords = [
        { notes: [523.25, 659.25, 783.99], delay: 0 },
        { notes: [587.33, 698.46, 880.00], delay: 0.2 },
        { notes: [659.25, 783.99, 987.77], delay: 0.4 },
        { notes: [783.99, 987.77, 1046.50], delay: 0.65 }
      ];

      var now = this.ctx.currentTime;
      var self = this;
      for (var c = 0; c < chords.length; c++) {
        var chordItem = chords[c];
        for (var n = 0; n < chordItem.notes.length; n++) {
          (function (freq, delay) {
            var osc = self.ctx.createOscillator();
            var gain = self.ctx.createGain();
            var t = now + delay;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t);

            gain.gain.setValueAtTime(0.12, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

            osc.connect(gain);
            gain.connect(self.sfxGain);

            osc.start(t);
            osc.stop(t + 0.65);
          })(chordItem.notes[n], chordItem.delay);
        }
      }
    } catch (e) {}
  };

  SoundEngine.prototype.toggleBacking = function (enabled) {
    this.backingEnabled = enabled;
  };

  var soundEngine = new SoundEngine();

  // --------------------------------------------------------------------------
  // 3. MOTOR DE PRÁCTICA Y TIMING (PracticeEngine)
  // --------------------------------------------------------------------------
  function PracticeEngine() {
    this.mode = 'playalong';
    this.status = 'idle';
    this.bpm = 60; // Exactamente el ritmo del vídeo de Boomy Tunes
    this.versesCount = 3;

    this.timelineData = null;
    this.timeline = [];
    this.currentIndex = 0;

    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.hits = 0;
    this.misses = 0;
    this.totalNotes = 0;

    this.startTime = 0;
    this.pauseTime = 0;
    this.animFrameId = null;

    this.currentExpectedNote = null;
    this.expectedNoteHandled = false;
    this.toleranceMs = 600; // Tolerancia adaptada para niños a 60 BPM

    this.listeners = {
      onStateChange: function () {},
      onCountIn: function () {},
      onPhraseChange: function () {},
      onNoteTarget: function () {},
      onNoteEvaluated: function () {},
      onSongProgress: function () {},
      onSongFinish: function () {}
    };
  }

  PracticeEngine.prototype.setListener = function (event, callback) {
    if (this.listeners.hasOwnProperty(event)) {
      this.listeners[event] = callback;
    }
  };

  PracticeEngine.prototype.setBpm = function (newBpm) {
    this.bpm = newBpm;
    if (this.status === 'playing' || this.status === 'paused') {
      var currentProgressRatio = this.currentIndex / (this.timeline.length || 1);
      this.prepareSong();
      this.currentIndex = Math.min(
        this.timeline.length - 1,
        Math.floor(currentProgressRatio * this.timeline.length)
      );
    }
  };

  PracticeEngine.prototype.setMode = function (newMode) {
    this.mode = newMode;
  };

  PracticeEngine.prototype.prepareSong = function () {
    this.timelineData = buildSongTimeline(this.versesCount, this.bpm);
    this.timeline = this.timelineData.timeline;
    this.currentIndex = 0;
    this.totalNotes = 0;
    for (var i = 0; i < this.timeline.length; i++) {
      if (this.timeline[i].type === 'note') this.totalNotes++;
    }
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.hits = 0;
    this.misses = 0;
  };

  PracticeEngine.prototype.start = function () {
    var self = this;
    soundEngine.init().then(function () {
      if (self.status === 'paused') {
        self.resume();
        return;
      }

      self.stop();
      self.prepareSong();
      self.status = 'playing';
      self.startTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
      self.currentIndex = 0;
      self.listeners.onStateChange(self.status);

      if (self.mode === 'stepbystep') {
        self.stepNextNote();
      } else {
        self.loop();
      }
    });
  };

  PracticeEngine.prototype.pause = function () {
    if (this.status !== 'playing') return;
    this.status = 'paused';
    this.pauseTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.listeners.onStateChange(this.status);
  };

  PracticeEngine.prototype.resume = function () {
    if (this.status !== 'paused') return;
    this.status = 'playing';
    var nowTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    var pauseDuration = nowTime - this.pauseTime;
    this.startTime += pauseDuration;
    this.listeners.onStateChange(this.status);

    if (this.mode === 'stepbystep') {
      this.stepNextNote();
    } else {
      this.loop();
    }
  };

  PracticeEngine.prototype.stop = function () {
    this.status = 'idle';
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.currentExpectedNote = null;
    this.expectedNoteHandled = false;
    this.currentIndex = 0;
    this.listeners.onStateChange(this.status);
  };

  PracticeEngine.prototype.loop = function () {
    if (this.status !== 'playing') return;

    var self = this;
    var nowTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    var elapsedSec = (nowTime - this.startTime) / 1000;

    var totalDuration = this.timelineData.totalDuration;
    var progress = Math.min(1, elapsedSec / totalDuration);
    this.listeners.onSongProgress(progress, elapsedSec, totalDuration);

    while (this.currentIndex < this.timeline.length) {
      var eventItem = this.timeline[this.currentIndex];
      if (elapsedSec >= eventItem.startTime) {
        this.processEvent(eventItem);
        this.currentIndex++;
      } else {
        break;
      }
    }

    if (this.currentExpectedNote && !this.expectedNoteHandled && this.mode === 'playalong') {
      var noteEndTime = this.currentExpectedNote.startTime + (this.toleranceMs / 1000);
      if (elapsedSec > noteEndTime) {
        this.evaluateUserHit(null);
      }
    }

    if (this.currentIndex >= this.timeline.length && !this.currentExpectedNote) {
      this.finishSong();
      return;
    }

    this.animFrameId = requestAnimationFrame(function () {
      self.loop();
    });
  };

  PracticeEngine.prototype.processEvent = function (eventItem) {
    if (eventItem.type === 'countin') {
      soundEngine.playTick(true);
      this.listeners.onCountIn(eventItem.verse, eventItem.label);
    } else if (eventItem.type === 'note') {
      soundEngine.playBackingChord(eventItem.chord, eventItem.beatIndex + 1);

      if (eventItem.beatIndex === 0) {
        this.listeners.onPhraseChange(eventItem.phraseIndex, eventItem.lyricsEn, eventItem.lyricsEs);
      }

      if (this.mode === 'autoplay') {
        soundEngine.playCarillonNote(eventItem.noteData.freq, 0.95);
        this.listeners.onNoteTarget(eventItem, true);
      } else {
        this.currentExpectedNote = eventItem;
        this.expectedNoteHandled = false;
        this.listeners.onNoteTarget(eventItem, false);
      }
    }
  };

  PracticeEngine.prototype.stepNextNote = function () {
    var self = this;
    if (this.currentIndex >= this.timeline.length) {
      this.finishSong();
      return;
    }

    var eventItem = this.timeline[this.currentIndex];

    if (eventItem.type === 'countin') {
      this.listeners.onCountIn(eventItem.verse, eventItem.label);
      this.currentIndex++;
      setTimeout(function () {
        self.stepNextNote();
      }, 1000);
      return;
    }

    if (eventItem.type === 'note') {
      this.currentExpectedNote = eventItem;
      this.expectedNoteHandled = false;

      soundEngine.playBackingChord(eventItem.chord, eventItem.beatIndex + 1);

      if (eventItem.beatIndex === 0) {
        this.listeners.onPhraseChange(eventItem.phraseIndex, eventItem.lyricsEn, eventItem.lyricsEs);
      }

      this.listeners.onNoteTarget(eventItem, false);
    }
  };

  PracticeEngine.prototype.onUserPlayBar = function (playedNoteId) {
    var noteData = NOTES_MAP[playedNoteId];
    if (noteData) {
      soundEngine.playCarillonNote(noteData.freq, 0.95);
    }

    if (this.status !== 'playing') return;

    if (this.mode === 'playalong' || this.mode === 'stepbystep') {
      this.evaluateUserHit(playedNoteId);
    }
  };

  PracticeEngine.prototype.evaluateUserHit = function (playedNoteId) {
    if (!this.currentExpectedNote || this.expectedNoteHandled) return;

    var expected = this.currentExpectedNote;
    var self = this;

    if (playedNoteId === expected.noteId) {
      this.expectedNoteHandled = true;
      this.hits++;
      this.combo++;
      if (this.combo > this.maxCombo) this.maxCombo = this.combo;

      var points = 50 + Math.min(50, this.combo * 5);
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
        setTimeout(function () {
          self.stepNextNote();
        }, 450);
      }
    } else if (playedNoteId === null) {
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
      this.combo = 0;

      this.listeners.onNoteEvaluated({
        success: false,
        type: 'wrong',
        message: 'Era ' + expected.noteData.solfege + ' (' + expected.noteData.name + ')',
        expectedNote: expected.noteId,
        playedNote: playedNoteId,
        score: this.score,
        combo: 0
      });

      if (this.mode !== 'stepbystep') {
        this.expectedNoteHandled = true;
        this.misses++;
        this.currentExpectedNote = null;
      }
    }
  };

  PracticeEngine.prototype.finishSong = function () {
    this.status = 'finished';
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    var accuracy = this.totalNotes > 0 ? Math.round((this.hits / this.totalNotes) * 100) : 100;
    var stars = 1;
    if (accuracy >= 85) stars = 3;
    else if (accuracy >= 60) stars = 2;

    soundEngine.playVictoryFanfare();

    this.listeners.onSongFinish({
      score: this.score,
      hits: this.hits,
      misses: this.misses,
      totalNotes: this.totalNotes,
      accuracy: accuracy,
      stars: stars,
      maxCombo: this.maxCombo
    });

    this.listeners.onStateChange(this.status);
  };

  var practiceEngine = new PracticeEngine();

  // --------------------------------------------------------------------------
  // 4. INTERFAZ DE USUARIO Y CONTROLADOR (UI Controller)
  // --------------------------------------------------------------------------
  var carillonContainer;
  var btnPlay;
  var playBtnIcon;
  var playBtnLabel;
  var btnStop;
  var selectMode;
  var selectNotation;
  var selectSpeed;
  var btnToggleBacking;
  var btnHelp;
  var btnFullscreen;

  var countinOverlay;
  var hitFeedback;
  var malletMarker;
  var lyricsEn;
  var lyricsEs;
  var progressBar;
  var hudPhrase;
  var valScore;
  var valCombo;

  var modalVictory;
  var btnVictoryReplay;
  var btnVictoryClose;
  var modalGuide;
  var btnGuideClose;

  var currentNotation = 'both';
  var currentPhraseIndex = 0;
  var currentVerseIndex = 1;
  var bellElements = [];

  /**
   * Vincula un evento táctil y clic sin problemas de latencia ni eventos fantasma
   * Crucial para compatibilidad total con Safari en iOS 12.5.8
   */
  function bindTouchAndClick(element, handler) {
    if (!element) return;
    var hasTouch = false;

    element.addEventListener('touchstart', function (e) {
      hasTouch = true;
      soundEngine.unlock();
      if (e.cancelable) e.preventDefault();
      handler(e);
    }, { passive: false });

    element.addEventListener('click', function (e) {
      soundEngine.unlock();
      if (hasTouch) {
        hasTouch = false;
        return;
      }
      handler(e);
    });
  }

  function renderCarillonBars() {
    carillonContainer.innerHTML = '';

    for (var i = 0; i < CARILLON_BARS.length; i++) {
      var noteId = CARILLON_BARS[i];
      var note = NOTES_MAP[noteId];
      var bar = document.createElement('div');
      bar.className = 'carillon-bar';
      bar.setAttribute('data-note', noteId);
      bar.style.backgroundColor = note.color;
      bar.style.backgroundImage = 'linear-gradient(135deg, ' + note.colorLight + ' 0%, ' + note.color + ' 50%, rgba(0,0,0,0.15) 100%)';

      bar.innerHTML =
        '<div class="bar-pin"></div>' +
        '<div class="bar-label-group">' +
          '<span class="bar-letter">' + note.name + '</span>' +
          '<span class="bar-solfege">' + note.solfege + '</span>' +
          '<span class="bar-key-shortcut">' + note.key + '</span>' +
        '</div>' +
        '<div class="bar-pin"></div>';

      (function (nId, barEl) {
        bindTouchAndClick(barEl, function () {
          triggerBarHit(nId, true);
        });
      })(noteId, bar);

      carillonContainer.appendChild(bar);
    }

    updateNotationDisplay();
  }

  function cacheBellElements() {
    bellElements = [];
    for (var i = 0; i < 4; i++) {
      bellElements.push({
        root: document.getElementById('bell-' + i),
        letter: document.getElementById('letter-' + i),
        solfege: document.getElementById('solfege-' + i),
        chord: document.getElementById('chord-' + i)
      });
    }
  }

  function updatePhraseBells(phraseIdx, verseNum) {
    if (typeof verseNum === 'undefined') verseNum = 1;
    var phrase = VERSE_PHRASES[phraseIdx] || VERSE_PHRASES[0];
    currentPhraseIndex = phraseIdx;
    currentVerseIndex = verseNum;

    for (var i = 0; i < phrase.notes.length; i++) {
      var noteId = phrase.notes[i];
      var note = NOTES_MAP[noteId];
      var bell = bellElements[i];
      if (!bell || !note) continue;

      bell.root.style.backgroundColor = note.color;
      bell.letter.textContent = note.name;
      bell.solfege.textContent = note.solfege;
      bell.chord.textContent = phrase.chordProgression[i] || phrase.chord;
      bell.root.classList.remove('active-beat');
      bell.root.classList.remove('hit-success');
    }

    positionMalletMarker(0);
  }

  function positionMalletMarker(beatIdx) {
    var targetBellObj = bellElements[beatIdx];
    var targetBell = targetBellObj ? targetBellObj.root : null;
    if (!targetBell || !malletMarker) return;

    var trackEl = document.getElementById('bells-track');
    if (!trackEl) return;

    var trackRect = trackEl.getBoundingClientRect();
    var bellRect = targetBell.getBoundingClientRect();
    var centerRel = (bellRect.left + bellRect.width / 2) - trackRect.left;

    malletMarker.style.left = centerRel + 'px';
    malletMarker.classList.remove('jumping');
    void malletMarker.offsetWidth; // forzar reflow
    malletMarker.classList.add('jumping');
  }

  function triggerBarHit(noteId, isUser) {
    var bar = carillonContainer.querySelector('[data-note="' + noteId + '"]');
    if (bar) {
      bar.classList.remove('struck');
      void bar.offsetWidth;
      bar.classList.add('struck');
      setTimeout(function () {
        bar.classList.remove('struck');
      }, 150);
    }

    if (isUser) {
      practiceEngine.onUserPlayBar(noteId);
    }
  }

  function highlightTargetBar(noteId) {
    var bars = carillonContainer.querySelectorAll('.carillon-bar');
    for (var i = 0; i < bars.length; i++) {
      bars[i].classList.remove('target-prompt');
    }

    if (noteId) {
      var bar = carillonContainer.querySelector('[data-note="' + noteId + '"]');
      if (bar) bar.classList.add('target-prompt');
    }
  }

  function updateNotationDisplay() {
    var bars = carillonContainer.querySelectorAll('.carillon-bar');
    for (var i = 0; i < bars.length; i++) {
      var bar = bars[i];
      var letter = bar.querySelector('.bar-letter');
      var solfege = bar.querySelector('.bar-solfege');

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
    }

    for (var j = 0; j < bellElements.length; j++) {
      var bell = bellElements[j];
      if (!bell || !bell.letter) continue;

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
    }
  }

  function openVictoryModal(stats) {
    document.getElementById('stat-score').textContent = stats.score;
    document.getElementById('stat-accuracy').textContent = stats.accuracy + '%';
    document.getElementById('stat-hits').textContent = stats.hits + ' / ' + stats.totalNotes;
    document.getElementById('stat-combo').textContent = 'x' + stats.maxCombo;

    var s1 = document.getElementById('star-1');
    var s2 = document.getElementById('star-2');
    var s3 = document.getElementById('star-3');

    s1.classList.toggle('filled', stats.stars >= 1);
    s2.classList.toggle('filled', stats.stars >= 2);
    s3.classList.toggle('filled', stats.stars >= 3);

    modalVictory.classList.add('open');

    if (typeof window.confetti === 'function') {
      try {
        window.confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (errConf) {}
    }
  }

  function setupPracticeEngineCallbacks() {
    practiceEngine.setListener('onStateChange', function (state) {
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

    practiceEngine.setListener('onCountIn', function (verse, label) {
      countinOverlay.textContent = label;
      countinOverlay.style.display = 'block';
      setTimeout(function () {
        countinOverlay.style.display = 'none';
      }, 900);
    });

    practiceEngine.setListener('onPhraseChange', function (phraseIdx, lyEn, lyEs) {
      updatePhraseBells(phraseIdx, currentVerseIndex);
      lyricsEn.textContent = lyEn;
      lyricsEs.textContent = lyEs;
      hudPhrase.textContent = '📜 Estrofa ' + currentVerseIndex + ' · Frase ' + (phraseIdx + 1) + '/6';
    });

    practiceEngine.setListener('onNoteTarget', function (eventItem, isAutoPlay) {
      for (var idx = 0; idx < bellElements.length; idx++) {
        var b = bellElements[idx];
        if (idx === eventItem.beatIndex) {
          b.root.classList.add('active-beat');
        } else {
          b.root.classList.remove('active-beat');
        }
      }

      positionMalletMarker(eventItem.beatIndex);

      if (isAutoPlay) {
        triggerBarHit(eventItem.noteId, false);
        highlightTargetBar(null);
      } else {
        highlightTargetBar(eventItem.noteId);
      }
    });

    practiceEngine.setListener('onNoteEvaluated', function (res) {
      valScore.textContent = res.score;
      valCombo.textContent = res.combo;

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

      setTimeout(function () {
        hitFeedback.classList.remove('show');
      }, 600);
    });

    practiceEngine.setListener('onSongProgress', function (ratio) {
      progressBar.style.width = (ratio * 100) + '%';
    });

    practiceEngine.setListener('onSongFinish', function (stats) {
      openVictoryModal(stats);
    });
  }

  function setupEventListeners() {
    // Escuchar el primer toque en cualquier parte de la pantalla para desbloquear audio en iOS
    function onFirstTouch() {
      soundEngine.unlock();
      window.removeEventListener('touchstart', onFirstTouch, false);
      window.removeEventListener('click', onFirstTouch, false);
    }
    window.addEventListener('touchstart', onFirstTouch, false);
    window.addEventListener('click', onFirstTouch, false);

    bindTouchAndClick(btnPlay, function () {
      if (practiceEngine.status === 'playing') {
        practiceEngine.pause();
      } else {
        practiceEngine.start();
      }
    });

    bindTouchAndClick(btnStop, function () {
      practiceEngine.stop();
      progressBar.style.width = '0%';
    });

    selectMode.addEventListener('change', function (e) {
      practiceEngine.stop();
      practiceEngine.setMode(e.target.value);
    });

    selectNotation.addEventListener('change', function (e) {
      currentNotation = e.target.value;
      updateNotationDisplay();
    });

    selectSpeed.addEventListener('change', function (e) {
      practiceEngine.setBpm(parseInt(e.target.value, 10));
    });

    bindTouchAndClick(btnToggleBacking, function () {
      var isEnabled = !soundEngine.backingEnabled;
      soundEngine.toggleBacking(isEnabled);
      btnToggleBacking.classList.toggle('active', isEnabled);
      btnToggleBacking.querySelector('span').textContent = isEnabled ? '🎸 Acordes: ON' : '🎸 Acordes: OFF';
    });

    bindTouchAndClick(btnHelp, function () {
      modalGuide.classList.add('open');
    });

    bindTouchAndClick(btnGuideClose, function () {
      modalGuide.classList.remove('open');
    });

    modalGuide.addEventListener('click', function (e) {
      if (e.target === modalGuide) modalGuide.classList.remove('open');
    });

    bindTouchAndClick(btnVictoryReplay, function () {
      modalVictory.classList.remove('open');
      practiceEngine.start();
    });

    bindTouchAndClick(btnVictoryClose, function () {
      modalVictory.classList.remove('open');
    });

    // Pantalla completa segura para iOS
    bindTouchAndClick(btnFullscreen, function () {
      try {
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
          if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
          } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          }
        }
      } catch (errFs) {}
    });

    window.addEventListener('keydown', function (e) {
      if (e.repeat) return;

      if (e.code === 'Space' || e.keyCode === 32) {
        e.preventDefault();
        btnPlay.click();
        return;
      }

      for (var keyNoteId in NOTES_MAP) {
        if (NOTES_MAP.hasOwnProperty(keyNoteId)) {
          var note = NOTES_MAP[keyNoteId];
          if (note.keyboardKeys.indexOf(e.key) !== -1) {
            triggerBarHit(keyNoteId, true);
            break;
          }
        }
      }
    });

    window.addEventListener('resize', function () {
      if (bellElements[0]) {
        positionMalletMarker(0);
      }
    });
  }

  function initApp() {
    carillonContainer = document.getElementById('carillon-bars-container');
    btnPlay = document.getElementById('btn-play');
    playBtnIcon = document.getElementById('play-btn-icon');
    playBtnLabel = document.getElementById('play-btn-label');
    btnStop = document.getElementById('btn-stop');
    selectMode = document.getElementById('select-mode');
    selectNotation = document.getElementById('select-notation');
    selectSpeed = document.getElementById('select-speed');
    btnToggleBacking = document.getElementById('btn-toggle-backing');
    btnHelp = document.getElementById('btn-help');
    btnFullscreen = document.getElementById('btn-fullscreen');

    countinOverlay = document.getElementById('countin-overlay');
    hitFeedback = document.getElementById('hit-feedback');
    malletMarker = document.getElementById('mallet-marker');
    lyricsEn = document.getElementById('lyrics-en');
    lyricsEs = document.getElementById('lyrics-es');
    progressBar = document.getElementById('song-progress-bar');
    hudPhrase = document.getElementById('hud-phrase-info');
    valScore = document.getElementById('val-score');
    valCombo = document.getElementById('val-combo');

    modalVictory = document.getElementById('modal-victory');
    btnVictoryReplay = document.getElementById('btn-victory-replay');
    btnVictoryClose = document.getElementById('btn-victory-close');
    modalGuide = document.getElementById('modal-guide');
    btnGuideClose = document.getElementById('btn-guide-close');

    renderCarillonBars();
    cacheBellElements();
    updatePhraseBells(0, 1);
    setupEventListeners();
    setupPracticeEngineCallbacks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
