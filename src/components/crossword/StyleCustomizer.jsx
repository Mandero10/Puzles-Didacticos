import React from 'react';
import { Palette, Type, Eye, EyeOff, RotateCcw, LayoutGrid } from 'lucide-react';
import ColorPicker from '../common/ColorPicker';
import Toggle from '../common/Toggle';
import { AVAILABLE_FONTS, DEFAULT_STYLE } from '../../constants/fonts';

const COLOR_PRESETS = {
  bg: ['#ffffff', '#f8fafc', '#fefce8', '#f0fdf4', '#eff6ff', '#faf5ff'],
  text: ['#0f172a', '#1e293b', '#1e1b4b', '#14532d', '#701a75', '#000000'],
  grid: ['#0f172a', '#334155', '#64748b', '#2563eb', '#059669', '#d97706']
};

export default function StyleCustomizer({
  styleOptions,
  onStyleChange
}) {
  const handleReset = () => {
    onStyleChange({ ...DEFAULT_STYLE });
  };

  const updateField = (field, value) => {
    onStyleChange({
      ...styleOptions,
      [field]: value
    });
  };

  const selectedFont = AVAILABLE_FONTS.find(f => f.id === styleOptions.fontId) || AVAILABLE_FONTS[0];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-6">
      {/* Encabezado */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <Palette className="w-5 h-5 text-indigo-600" />
            Personalización Visual
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Personaliza la tipografía, colores del tablero y aspecto de impresión.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          title="Restablecer estilos predeterminados"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Restablecer
        </button>
      </div>

      <div className="space-y-5">
        {/* 1. Selector de Tipografía */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Type className="w-4 h-4 text-slate-500" />
            Fuente Tipográfica
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {AVAILABLE_FONTS.map((font) => (
              <button
                key={font.id}
                type="button"
                onClick={() => updateField('fontId', font.id)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  styleOptions.fontId === font.id
                    ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-medium text-slate-800" style={{ fontFamily: font.fontFamily }}>
                  {font.name}
                </div>
                <div className="text-sm tracking-widest text-slate-500 mt-1 font-bold" style={{ fontFamily: font.fontFamily }}>
                  CRUCIGRAMA 123
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Selectores de Color */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
          {/* Color de fondo del tablero */}
          <ColorPicker
            label="Fondo del Tablero"
            description="Color de fondo"
            value={styleOptions.boardBgColor || '#ffffff'}
            onChange={(val) => updateField('boardBgColor', val)}
            presets={COLOR_PRESETS.bg}
            id="color-board-bg"
          />

          {/* Color de la fuente (letras y números) */}
          <ColorPicker
            label="Color de la Fuente"
            description="Letras y números"
            value={styleOptions.textColor || '#0f172a'}
            onChange={(val) => updateField('textColor', val)}
            presets={COLOR_PRESETS.text}
            id="color-font"
          />

          {/* Color para las líneas de la cuadrícula */}
          <ColorPicker
            label="Líneas de Cuadrícula"
            description="Bordes de celdas"
            value={styleOptions.gridLineColor || '#0f172a'}
            onChange={(val) => updateField('gridLineColor', val)}
            presets={COLOR_PRESETS.grid}
            id="color-grid-lines"
          />
        </div>

        {/* 3. Toggles de visualización didáctica */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <Toggle
            checked={styleOptions.showLetters}
            onChange={(val) => updateField('showLetters', val)}
            label="Mostrar respuestas (Letras visibles)"
            description="Desactívalo para imprimir la hoja de trabajo en blanco para los estudiantes; actívalo para la hoja de soluciones del docente."
            id="toggle-show-letters"
          />
        </div>

        {/* 4. Ajuste de tamaño de celda */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <LayoutGrid className="w-3.5 h-3.5 text-slate-500" />
              Tamaño de Casillas
            </span>
            <span className="font-mono text-slate-500">{styleOptions.cellSize || 42} px</span>
          </div>
          <input
            type="range"
            min="30"
            max="60"
            step="2"
            value={styleOptions.cellSize || 42}
            onChange={(e) => updateField('cellSize', Number(e.target.value))}
            className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
