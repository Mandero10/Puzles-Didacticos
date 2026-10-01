import { useState, useCallback, useEffect } from 'react';
import { generateCrossword } from '../core/crossword/algorithm';
import { PRESET_THEMES } from '../constants/presets';

export function useCrossword(initialThemeId = 'solar-system') {
  const initialTheme = PRESET_THEMES.find(t => t.id === initialThemeId) || PRESET_THEMES[0];

  const [words, setWords] = useState(
    initialTheme.words.map(w => ({ ...w, id: Math.random().toString() }))
  );
  const [crosswordTitle, setCrosswordTitle] = useState(`Crucigrama: ${initialTheme.title}`);
  const [crosswordData, setCrosswordData] = useState({
    grid: [],
    placedWords: [],
    unplacedWords: [],
    width: 0,
    height: 0,
    clues: { across: [], down: [] }
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = useCallback(() => {
    setIsGenerating(true);
    // Defer a tick para permitir renderizar el spinner si la lista es grande
    setTimeout(() => {
      try {
        const result = generateCrossword(words, 25);
        setCrosswordData(result);
      } catch (err) {
        console.error('Error generando crucigrama:', err);
      } finally {
        setIsGenerating(false);
      }
    }, 50);
  }, [words]);

  // Generar automáticamente al inicio
  useEffect(() => {
    generate();
  }, []);

  return {
    words,
    setWords,
    crosswordTitle,
    setCrosswordTitle,
    crosswordData,
    isGenerating,
    generate
  };
}
