/**
 * Configuración de notas y estructura musical de la canción "B-I-N-G-O"
 * Adaptada exactamente al arreglo del vídeo educativo de Boomy Tunes
 * (Deskbells & Boomwhackers Play-Along)
 */

export const NOTES_MAP = {
  G4: {
    id: 'G4',
    name: 'G',
    solfege: 'Sol',
    octave: 4,
    freq: 392.00,
    color: '#059669', // Verde esmeralda oscuro
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
    color: '#6366f1', // Púrpura índigo
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
    color: '#d946ef', // Magenta / Fucsia
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
    color: '#ef4444', // Rojo brillante
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
    color: '#f97316', // Naranja
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
    color: '#eab308', // Amarillo
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
    color: '#84cc16', // Verde lima claro
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
    color: '#10b981', // Verde bosque
    colorLight: '#6ee7b7',
    key: '8',
    shortcut: '8 / K',
    keyboardKeys: ['8', 'k', 'K']
  }
};

// Placas del carillón ordenadas de izquierda a derecha (grave a agudo)
export const CARILLON_BARS = ['G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5'];

/**
 * Frases de una estrofa de B-I-N-G-O según el arreglo de Boomy Tunes:
 * Cada frase tiene 4 notas (4 pulsos de negra):
 * Frase 1: C - C - A - G  ("There was a farmer had a dog")
 * Frase 2: C - D - E - C  ("and BINGO was his name - O")
 * Frase 3: E - E - F - F  ("B - I - N - G - O!")
 * Frase 4: D - D - E - E  ("B - I - N - G - O!")
 * Frase 5: C - C - D - D  ("B - I - N - G - O!")
 * Frase 6: B - A - C - C  ("and BINGO was his name - O")
 */
export const VERSE_PHRASES = [
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

/**
 * Genera la lista completa de eventos para la canción
 * @param {number} versesCount Número de estrofas (1 a 3)
 * @param {number} bpm Pulsos por minuto (por defecto 96)
 */
export function buildSongTimeline(versesCount = 3, bpm = 60) {
  const beatDuration = 60 / bpm; // segundos por pulso (a 60 BPM = 1.0 segundo por pulso)
  const timeline = [];

  let currentTime = 0;

  for (let v = 0; v < versesCount; v++) {
    const verseNum = v + 1;

    // Cuenta atrás previa a cada estrofa (como en el vídeo: READY -> 1 -> 2 -> 3)
    timeline.push({
      type: 'countin',
      verse: verseNum,
      label: '¡LISTOS!',
      startTime: currentTime,
      duration: beatDuration * 2
    });
    currentTime += beatDuration * 2;

    VERSE_PHRASES.forEach((phrase, phraseIdx) => {
      // Diferenciar letras por estrofa (palmadas en estrofas 2 y 3)
      let lyricsEn = phrase.lyricsEn;
      let lyricsEs = phrase.lyricsEs;

      if (verseNum === 2 && (phraseIdx === 2 || phraseIdx === 3 || phraseIdx === 4)) {
        lyricsEn = '(clap) - I - N - G - O !';
        lyricsEs = '(👏) - I - N - G - O !';
      } else if (verseNum === 3 && (phraseIdx === 2 || phraseIdx === 3 || phraseIdx === 4)) {
        lyricsEn = '(clap) - (clap) - N - G - O !';
        lyricsEs = '(👏) - (👏) - N - G - O !';
      }

      phrase.notes.forEach((noteId, beatIdx) => {
        const chord = phrase.chordProgression[beatIdx];
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
      });
    });

    // Pequeña pausa de 1 pulso entre estrofas
    currentTime += beatDuration;
  }

  return {
    totalDuration: currentTime,
    beatDuration,
    bpm,
    timeline
  };
}
