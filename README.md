# 🔔 Carillón Mágico · Práctica de la Canción B-I-N-G-O

Aplicación web interactiva y educativa diseñada para que los alumnos practiquen tocar el **carillón escolar (metalófono / xilófono / campanas)** con la canción **"B-I-N-G-O"**, basada exactamente en el arreglo musical y visual del vídeo educativo de Boomy Tunes:
📺 [Bingo – SUPER EASY Boomwhackers & Deskbells PLAY ALONG (YouTube)](https://www.youtube.com/watch?v=LVfsaRZJZxY)

---

## 🎵 Arreglo Musical y Acordes

El carillón está afinado en escala diatónica y utiliza la codificación de colores estándar internacional (Boomwhackers & Deskbells):

| Nota (Letra) | Nota (Solfeo) | Color | Tecla de Teclado |
|---|---|---|---|
| **G4** | Sol (grave) | 🟢 Verde Esmeralda | `1` o `A` |
| **A4** | La | 🟣 Púrpura Índigo | `2` o `S` |
| **B4** | Si | 🌸 Fucsia / Rosa | `3` o `D` |
| **C5** | Do | 🔴 Rojo brillante | `4` o `F` |
| **D5** | Re | 🟠 Naranja | `5` o `G` |
| **E5** | Mi | 🟡 Amarillo | `6` o `H` |
| **F5** | Fa | 🍏 Verde lima | `7` o `J` |
| **G5** | Sol (agudo) | 🌲 Verde bosque | `8` o `K` |

### 🎼 Secuencia Exacta de la Canción (6 Frases de 4 Pulsos)

1. **Frase 1:** `Do - Do - La - Sol` (`C - C - A - G`)  
   *Letra:* "There was a farmer had a dog"  
   *Acordes de fondo:* Do Mayor (`C`) y Fa/Sol (`F - G`)
2. **Frase 2:** `Do - Re - Mi - Do` (`C - D - E - C`)  
   *Letra:* "and BINGO was his name - O"  
   *Acordes de fondo:* Do Mayor (`C`) y Sol/Do (`G - C`)
3. **Frase 3:** `Mi - Mi - Fa - Fa` (`E - E - F - F`)  
   *Letra:* "B - I - N - G - O !" *(En estrofa 2: 👏 - I - N - G - O)*  
   *Acordes de fondo:* Do Mayor (`C`) y Fa Mayor (`F`)
4. **Frase 4:** `Re - Re - Mi - Mi` (`D - D - E - E`)  
   *Letra:* "B - I - N - G - O !"  
   *Acordes de fondo:* Sol Mayor (`G`) y Do Mayor (`C`)
5. **Frase 5:** `Do - Do - Re - Re` (`C - C - D - D`)  
   *Letra:* "B - I - N - G - O !"  
   *Acordes de fondo:* La menor (`Am` / `C`) y Sol Mayor (`G`)
6. **Frase 6:** `Si - La - Do - Do` (`B - A - C - C`)  
   *Letra:* "and BINGO was his name - O"  
   *Acordes de fondo:* Sol Mayor (`G`) y Do Mayor (`C`)

---

## 🌟 Características y Modos de Aprendizaje

1. **🎯 Modo Práctica (Play-Along Interactivo):**
   - El camino musical muestra las 4 campanas del compás.
   - El percutor / perrito salta al compás de la música marcando el ritmo exacto.
   - La placa correspondiente en el carillón se ilumina para guiar al estudiante.
   - Evaluación en tiempo real: ¡Excelente!, ¡Bien!, ¡Casi!, con racha de combo y puntuación.
2. **👣 Modo Paso a Paso (Aprender Notas sin Prisa):**
   - Ideal para los primeros intentos: la canción espera a que el alumno pulse la placa correcta antes de avanzar.
3. **🎧 Modo Demostración (Auto-Play):**
   - La aplicación toca la melodía automáticamente con sonido de carillón y base armónica para que el alumno aprenda de oído.
4. **🎹 Modo Libre:**
   - Permite tocar libremente cualquiera de las placas del carillón.
5. **🎸 Acompañamiento Armónico Real:**
   - Pista rítmica y acordes sintetizados en tiempo real con Web Audio API (botón ON/OFF).
6. **🔤 Selector de Notación:**
   - Permite alternar entre **Do - Re - Mi** (solfeo español), **C - D - E** (letras anglosajonas) o ambas a la vez.
7. **⏱ Control de Tempo / Velocidad:**
   - Modo tortuga (75 BPM) para aprender despacio, Normal (96 BPM, velocidad del vídeo original), y Rápido (115 BPM).
8. **📱 Compatible con Pantallas Táctiles y Teclado:**
   - Respuesta multitáctil de baja latencia para tablets (iPad, Android), móviles, ratón o teclado.

---

## 🚀 Cómo Ejecutar la Aplicación

No requiere instalación de librerías ni dependencias complejas. Puede abrirse directamente en cualquier navegador moderno:

### Opción 1: Abrir directamente el archivo
Haz doble clic en `index.html` en el explorador de archivos.

### Opción 2: Servidor local (Recomendado)
Abre un terminal en esta carpeta y ejecuta:
```bash
python -m http.server 3001
```
Y abre en tu navegador: [http://localhost:3001](http://localhost:3001)
