/**
 * Normaliza una palabra para el crucigrama.
 * Convierte a mayúsculas, elimina espacios y normaliza tildes conservando la Ñ.
 */
export function normalizeWord(rawWord) {
  if (!rawWord) return '';
  return rawWord
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, (match, offset, str) => {
      // Preservar la virgulilla de la Ñ (U+0303)
      if (str[offset - 1] === 'N' || str[offset - 1] === 'n') {
        return match;
      }
      return '';
    })
    .normalize('NFC')
    .replace(/[^A-ZÑ]/g, '');
}

/**
 * Representación de la orientación de una palabra.
 */
export const DIRECTION = {
  ACROSS: 'across', // Horizontal (izquierda a derecha)
  DOWN: 'down'      // Vertical (arriba hacia abajo)
};

/**
 * Valida estrictamente si una palabra puede colocarse en una posición dada en la cuadrícula.
 * REGLAS ESTRICTAS:
 * 1. Debe cruzarse obligatoriamente con al menos una palabra existente (intersections >= 1).
 * 2. NO se permite que corran palabras paralelas adyacentes a lo largo de las celdas (vecinos perpendiculares limpios).
 * 3. Las celdas inmediatamente anteriores y posteriores a la palabra en su dirección deben estar vacías.
 * 4. Las esquinas diagonales anterior y posterior deben estar limpias para evitar contactos esquineros confusos.
 * 5. Si una celda ya está ocupada, la letra debe coincidir exactamente y su dirección debe ser perpendicular.
 */
function canPlaceWord(gridMap, word, startX, startY, direction) {
  const dx = direction === DIRECTION.ACROSS ? 1 : 0;
  const dy = direction === DIRECTION.DOWN ? 1 : 0;
  
  // Vector perpendicular correcto:
  // Si ACROSS (dx=1, dy=0) -> perpDx=0, perpDy=1 (revisa arriba y abajo)
  // Si DOWN   (dx=0, dy=1) -> perpDx=1, perpDy=0 (revisa izquierda y derecha)
  const perpDx = dy;
  const perpDy = dx;

  const len = word.length;

  // 1. Verificar celda previa al inicio (debe estar vacía) y con margen
  const preKey = `${startX - dx},${startY - dy}`;
  if (gridMap.has(preKey)) return false;

  const preKey2 = `${startX - 2 * dx},${startY - 2 * dy}`;
  if (gridMap.has(preKey2)) {
    const existing = gridMap.get(preKey2);
    // Evitar dos palabras en la misma línea con solo 1 casilla de separación
    if (existing.directions.includes(direction)) return false;
  }

  // 2. Verificar celda posterior al final (debe estar vacía) y con margen
  const postKey = `${startX + len * dx},${startY + len * dy}`;
  if (gridMap.has(postKey)) return false;

  const postKey2 = `${startX + (len + 1) * dx},${startY + (len + 1) * dy}`;
  if (gridMap.has(postKey2)) {
    const existing = gridMap.get(postKey2);
    if (existing.directions.includes(direction)) return false;
  }

  // 3. Verificar esquinas de inicio y final para evitar contactos diagonales confusos
  const preCorner1 = `${startX - dx + perpDx},${startY - dy + perpDy}`;
  const preCorner2 = `${startX - dx - perpDx},${startY - dy - perpDy}`;
  if (gridMap.has(preCorner1) || gridMap.has(preCorner2)) {
    // Si la esquina tiene letra que corre paralela, descartar
    const c1 = gridMap.get(preCorner1);
    const c2 = gridMap.get(preCorner2);
    if (c1?.directions.includes(direction) || c2?.directions.includes(direction)) {
      return false;
    }
  }

  const endX = startX + (len - 1) * dx;
  const endY = startY + (len - 1) * dy;
  const postCorner1 = `${endX + dx + perpDx},${endY + dy + perpDy}`;
  const postCorner2 = `${endX + dx - perpDx},${endY + dy - perpDy}`;
  if (gridMap.has(postCorner1) || gridMap.has(postCorner2)) {
    const c1 = gridMap.get(postCorner1);
    const c2 = gridMap.get(postCorner2);
    if (c1?.directions.includes(direction) || c2?.directions.includes(direction)) {
      return false;
    }
  }

  let intersections = 0;

  for (let i = 0; i < len; i++) {
    const x = startX + i * dx;
    const y = startY + i * dy;
    const key = `${x},${y}`;
    const targetLetter = word[i];

    if (gridMap.has(key)) {
      const existing = gridMap.get(key);
      // Conflicto de letra
      if (existing.letter !== targetLetter) {
        return false;
      }
      // No se permite cruzar dos palabras en la misma dirección (debe ser cruce perpendicular obligatorio)
      if (existing.directions.includes(direction)) {
        return false;
      }
      intersections++;
    } else {
      // Si la celda está vacía, sus vecinos perpendiculares DEBEN ESTAR VACÍOS
      // para evitar absolutamente que dos palabras corran en paralelo una al lado de la otra.
      const perp1Key = `${x + perpDx},${y + perpDy}`;
      const perp2Key = `${x - perpDx},${y - perpDy}`;

      if (gridMap.has(perp1Key) || gridMap.has(perp2Key)) {
        return false;
      }
    }
  }

  // Obligatorio: debe cruzar al menos con una palabra existente
  if (intersections === 0) {
    return false;
  }

  return { isValid: true, intersections };
}

/**
 * Calcula el tamaño de la caja contenedora (bounding box)
 */
function getBoundingBox(gridMap) {
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;

  for (const [key] of gridMap.entries()) {
    const [x, y] = key.split(',').map(Number);
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }

  if (minX === Infinity) {
    return { minX: 0, maxX: 0, minY: 0, maxY: 0, width: 0, height: 0, area: 0 };
  }

  const width = maxX - minX + 1;
  const height = maxY - minY + 1;
  return { minX, maxX, minY, maxY, width, height, area: width * height };
}

/**
 * Realiza un intento de generación de crucigrama con una lista de palabras ordenada.
 */
function generateAttempt(wordsList) {
  const gridMap = new Map(); // key: "x,y" => { letter, directions: [] }
  const placedWords = [];
  const unplacedWords = [];

  if (wordsList.length === 0) {
    return { gridMap, placedWords, unplacedWords, score: 0 };
  }

  // 1. Colocar la primera palabra horizontalmente en el origen (0, 0)
  const first = wordsList[0];
  for (let i = 0; i < first.cleanWord.length; i++) {
    gridMap.set(`${i},0`, {
      letter: first.cleanWord[i],
      directions: [DIRECTION.ACROSS]
    });
  }
  placedWords.push({
    ...first,
    x: 0,
    y: 0,
    direction: DIRECTION.ACROSS
  });

  // 2. Colocar las siguientes palabras buscando cruces válidos
  for (let w = 1; w < wordsList.length; w++) {
    const current = wordsList[w];
    const candidatePositions = [];

    // Buscar coincidencias de letras con las ya colocadas
    for (let i = 0; i < current.cleanWord.length; i++) {
      const letter = current.cleanWord[i];

      // Buscar en el tablero dónde aparece esta letra
      for (const [key, cell] of gridMap.entries()) {
        if (cell.letter === letter) {
          const [cx, cy] = key.split(',').map(Number);

          // Probar direcciones perpendiculares a las palabras que ya cruzan esta celda
          const possibleDirections = [];
          if (!cell.directions.includes(DIRECTION.ACROSS)) {
            possibleDirections.push(DIRECTION.ACROSS);
          }
          if (!cell.directions.includes(DIRECTION.DOWN)) {
            possibleDirections.push(DIRECTION.DOWN);
          }

          for (const dir of possibleDirections) {
            const dx = dir === DIRECTION.ACROSS ? 1 : 0;
            const dy = dir === DIRECTION.DOWN ? 1 : 0;
            const startX = cx - i * dx;
            const startY = cy - i * dy;

            const check = canPlaceWord(gridMap, current.cleanWord, startX, startY, dir);
            if (check && check.isValid) {
              candidatePositions.push({
                x: startX,
                y: startY,
                direction: dir,
                intersections: check.intersections
              });
            }
          }
        }
      }
    }

    if (candidatePositions.length > 0) {
      // Evaluar la mejor posición: más intersecciones y relación de aspecto balanceada
      let bestCandidate = null;
      let bestScore = -Infinity;

      for (const cand of candidatePositions) {
        // Simular colocación temporal
        const tempMap = new Map(gridMap);
        const dx = cand.direction === DIRECTION.ACROSS ? 1 : 0;
        const dy = cand.direction === DIRECTION.DOWN ? 1 : 0;

        for (let i = 0; i < current.cleanWord.length; i++) {
          const key = `${cand.x + i * dx},${cand.y + i * dy}`;
          const existing = tempMap.get(key);
          const dirs = existing ? [...existing.directions, cand.direction] : [cand.direction];
          tempMap.set(key, { letter: current.cleanWord[i], directions: dirs });
        }

        const bbox = getBoundingBox(tempMap);
        const ratioPenalty = Math.abs(bbox.width - bbox.height) * 2;
        // Puntuación: priorizar intersecciones (cruces), área compacta y forma cuadrada
        const score = (cand.intersections * 35) - bbox.area - ratioPenalty;

        if (score > bestScore) {
          bestScore = score;
          bestCandidate = cand;
        }
      }

      // Aplicar mejor posición
      const dx = bestCandidate.direction === DIRECTION.ACROSS ? 1 : 0;
      const dy = bestCandidate.direction === DIRECTION.DOWN ? 1 : 0;

      for (let i = 0; i < current.cleanWord.length; i++) {
        const key = `${bestCandidate.x + i * dx},${bestCandidate.y + i * dy}`;
        const existing = gridMap.get(key);
        const dirs = existing ? [...existing.directions, bestCandidate.direction] : [bestCandidate.direction];
        gridMap.set(key, { letter: current.cleanWord[i], directions: dirs });
      }

      placedWords.push({
        ...current,
        x: bestCandidate.x,
        y: bestCandidate.y,
        direction: bestCandidate.direction
      });
    } else {
      unplacedWords.push(current);
    }
  }

  const bbox = getBoundingBox(gridMap);
  // Puntuación global del intento: priorizar porcentaje de palabras colocadas
  const totalScore = (placedWords.length * 2000) - bbox.area - (Math.abs(bbox.width - bbox.height) * 25);

  return { gridMap, placedWords, unplacedWords, bbox, score: totalScore };
}

/**
 * Algoritmo principal para generar el crucigrama.
 * Ejecuta múltiples iteraciones con ligeras variaciones de orden para maximizar
 * la cantidad de palabras interconectadas.
 * 
 * @param {Array<{ id: string|number, word: string, clue: string }>} rawWords
 * @param {number} maxIterations
 * @returns {Object} Resultado estructurado del crucigrama
 */
export function generateCrossword(rawWords, maxIterations = 35) {
  // 1. Filtrar y normalizar
  const validWords = rawWords
    .map(item => ({
      ...item,
      cleanWord: normalizeWord(item.word),
      originalWord: item.word
    }))
    .filter(item => item.cleanWord.length >= 2);

  if (validWords.length === 0) {
    return {
      grid: [],
      placedWords: [],
      unplacedWords: [],
      width: 0,
      height: 0,
      clues: { across: [], down: [] }
    };
  }

  // Ordenar inicialmente por longitud decreciente
  const sortedWords = [...validWords].sort((a, b) => b.cleanWord.length - a.cleanWord.length);

  let bestResult = null;

  for (let it = 0; it < maxIterations; it++) {
    let wordsAttempt;
    if (it === 0) {
      wordsAttempt = [...sortedWords];
    } else {
      wordsAttempt = [...sortedWords];
      // Rotar palabra ancla inicial o reordenar
      const pivotIndex = it % Math.min(4, wordsAttempt.length);
      const [pivot] = wordsAttempt.splice(pivotIndex, 1);
      wordsAttempt.unshift(pivot);

      // Pequeñas permutaciones aleatorias en el resto
      for (let s = 1; s < wordsAttempt.length - 1; s++) {
        if (Math.random() < 0.35) {
          const swapIdx = s + 1 + Math.floor(Math.random() * (wordsAttempt.length - s - 1));
          const tmp = wordsAttempt[s];
          wordsAttempt[s] = wordsAttempt[swapIdx];
          wordsAttempt[swapIdx] = tmp;
        }
      }
    }

    const attempt = generateAttempt(wordsAttempt);

    if (
      !bestResult ||
      attempt.placedWords.length > bestResult.placedWords.length ||
      (attempt.placedWords.length === bestResult.placedWords.length && attempt.score > bestResult.score)
    ) {
      bestResult = attempt;
      if (attempt.unplacedWords.length === 0 && it > 10) {
        break;
      }
    }
  }

  // Construir la matriz normalizada y asignar números de pistas
  return formatCrosswordGrid(bestResult);
}

/**
 * Normaliza las coordenadas a (0, 0), asigna numeración estándar a las celdas de inicio
 * y genera la matriz bidimensional lista para el renderizado visual.
 */
function formatCrosswordGrid(rawResult) {
  const { gridMap, placedWords, unplacedWords, bbox } = rawResult;

  if (placedWords.length === 0) {
    return {
      grid: [],
      placedWords: [],
      unplacedWords,
      width: 0,
      height: 0,
      clues: { across: [], down: [] }
    };
  }

  const { minX, minY, width, height } = bbox;

  // Ajustar coordenadas de palabras
  const normalizedWords = placedWords.map(w => ({
    ...w,
    startX: w.x - minX,
    startY: w.y - minY
  }));

  // Identificar qué celdas son inicios de palabra y ordenarlas según convención
  const startCellsMap = new Map(); // key: "x,y" => { acrossWord, downWord }

  for (const word of normalizedWords) {
    const key = `${word.startX},${word.startY}`;
    if (!startCellsMap.has(key)) {
      startCellsMap.set(key, { x: word.startX, y: word.startY });
    }
    const cellEntry = startCellsMap.get(key);
    if (word.direction === DIRECTION.ACROSS) {
      cellEntry.acrossWord = word;
    } else {
      cellEntry.downWord = word;
    }
  }

  // Ordenar inicios de celda: primero por Y (fila), luego por X (columna)
  const sortedStarts = Array.from(startCellsMap.values()).sort((a, b) => {
    if (a.y !== b.y) return a.y - b.y;
    return a.x - b.x;
  });

  // Asignar números correlativos (1, 2, 3...)
  const cellNumbersMap = new Map(); // key: "x,y" => number
  let clueIndex = 1;
  const clues = { across: [], down: [] };

  for (const start of sortedStarts) {
    const number = clueIndex++;
    const key = `${start.x},${start.y}`;
    cellNumbersMap.set(key, number);

    if (start.acrossWord) {
      start.acrossWord.number = number;
      clues.across.push({
        number,
        word: start.acrossWord.cleanWord,
        originalWord: start.acrossWord.originalWord,
        clue: start.acrossWord.clue || `Palabra de ${start.acrossWord.cleanWord.length} letras`,
        length: start.acrossWord.cleanWord.length,
        startX: start.acrossWord.startX,
        startY: start.acrossWord.startY
      });
    }

    if (start.downWord) {
      start.downWord.number = number;
      clues.down.push({
        number,
        word: start.downWord.cleanWord,
        originalWord: start.downWord.originalWord,
        clue: start.downWord.clue || `Palabra de ${start.downWord.cleanWord.length} letras`,
        length: start.downWord.cleanWord.length,
        startX: start.downWord.startX,
        startY: start.downWord.startY
      });
    }
  }

  // Construir matriz 2D con margen interno de 1 celda alrededor para respiración visual en la cuadrícula
  const grid = [];
  for (let r = 0; r < height; r++) {
    const row = [];
    for (let c = 0; c < width; c++) {
      const origKey = `${c + minX},${r + minY}`;
      const normKey = `${c},${r}`;

      if (gridMap.has(origKey)) {
        const cellData = gridMap.get(origKey);
        row.push({
          row: r,
          col: c,
          letter: cellData.letter,
          number: cellNumbersMap.get(normKey) || null,
          isEmpty: false
        });
      } else {
        row.push({
          row: r,
          col: c,
          letter: '',
          number: null,
          isEmpty: true
        });
      }
    }
    grid.push(row);
  }

  return {
    grid,
    width,
    height,
    placedWords: normalizedWords,
    unplacedWords,
    clues
  };
}
