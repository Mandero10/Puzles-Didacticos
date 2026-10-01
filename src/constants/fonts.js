export const AVAILABLE_FONTS = [
  {
    id: 'outfit',
    name: 'Outfit (Moderno y Limpio)',
    fontFamily: "'Outfit', sans-serif",
    category: 'sans-serif'
  },
  {
    id: 'inter',
    name: 'Inter (Neutral y Profesional)',
    fontFamily: "'Inter', sans-serif",
    category: 'sans-serif'
  },
  {
    id: 'fredoka',
    name: 'Fredoka (Infantil y Amigable)',
    fontFamily: "'Fredoka', cursive, sans-serif",
    category: 'display'
  },
  {
    id: 'patrick-hand',
    name: 'Patrick Hand (Escolar / Pizarra)',
    fontFamily: "'Patrick Hand', cursive",
    category: 'handwriting'
  },
  {
    id: 'roboto-mono',
    name: 'Roboto Mono (Técnico / Cuadrícula)',
    fontFamily: "'Roboto Mono', monospace",
    category: 'monospace'
  },
  {
    id: 'merriweather',
    name: 'Merriweather (Elegante con Serif)',
    fontFamily: "'Merriweather', serif",
    category: 'serif'
  }
];

export const DEFAULT_STYLE = {
  fontId: 'outfit',
  boardBgColor: '#ffffff',
  cellBgColor: '#ffffff',
  textColor: '#1e293b',       // slate-800
  gridLineColor: '#0f172a',   // slate-900
  clueNumberColor: '#64748b', // slate-500
  fontSize: 20,               // px base
  cellSize: 42,               // px
  showLetters: true,          // toggle para vista profesor vs alumno
  hideClues: false            // "Ocultar descripciones en el documento final"
};
