import React, { forwardRef } from 'react';
import CrosswordBoard from './CrosswordBoard';
import CrosswordClues from './CrosswordClues';
import { AVAILABLE_FONTS } from '../../constants/fonts';

const CrosswordSheet = forwardRef(function CrosswordSheet(
  {
    title = 'Crucigrama Didáctico',
    onTitleChange,
    grid = [],
    clues = { across: [], down: [] },
    hideClues = false,
    styleOptions = {}
  },
  ref
) {
  const { fontId = 'outfit', textColor = '#0f172a', boardBgColor = '#ffffff' } = styleOptions;
  const selectedFont = AVAILABLE_FONTS.find(f => f.id === fontId);
  const fontFamily = selectedFont ? selectedFont.fontFamily : 'inherit';

  return (
    <div
      ref={ref}
      data-export-root="true"
      className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12 transition-all mx-auto"
      style={{
        fontFamily,
        backgroundColor: boardBgColor,
        color: textColor,
        minWidth: '780px',
        width: '100%',
        minHeight: '750px'
      }}
    >
      {/* Encabezado del Material Didáctico */}
      <div className="border-b-2 border-slate-900 pb-5 mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Título editable */}
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange && onTitleChange(e.target.value)}
            className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight bg-transparent focus:outline-none focus:ring-1 focus:ring-indigo-400 rounded px-1 -mx-1 flex-1"
            placeholder="TÍTULO DEL CRUCIGRAMA"
          />

          <div className="text-right text-xs opacity-75 font-mono shrink-0 bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
            Ficha Didáctica
          </div>
        </div>

        {/* Fila de campos para el estudiante (Nombre, Fecha, Calificación) */}
        <div className="flex flex-wrap items-center justify-between gap-6 text-xs font-medium pt-3">
          <div className="flex items-center gap-2 flex-1 min-w-[220px]">
            <span className="font-bold">Nombre:</span>
            <span className="flex-1 border-b border-dashed border-slate-400 h-4"></span>
          </div>
          <div className="flex items-center gap-2 w-44">
            <span className="font-bold">Fecha:</span>
            <span className="flex-1 border-b border-dashed border-slate-400 h-4"></span>
          </div>
          <div className="flex items-center gap-2 w-32">
            <span className="font-bold">Calificación:</span>
            <span className="flex-1 border-b border-dashed border-slate-400 h-4"></span>
          </div>
        </div>
      </div>

      {/* Instrucciones generales */}
      <p className="text-xs italic opacity-75 mb-6">
        Instrucciones: Lee atentamente cada una de las definiciones y completa los casilleros correspondientes en el tablero.
      </p>

      {/* Tablero del Crucigrama (Área central espaciosa) */}
      <div className="my-8 flex justify-center">
        <CrosswordBoard grid={grid} styleOptions={styleOptions} />
      </div>

      {/* Pistas (Horizontales y Verticales) */}
      <CrosswordClues
        clues={clues}
        hideClues={hideClues}
        styleOptions={styleOptions}
      />

      {/* Pie de página discreto */}
      <div className="mt-14 pt-4 border-t border-slate-200/80 flex justify-between items-center text-[10px] opacity-45 font-mono">
        <span>Generado con DidactiCraft • Material Educativo</span>
        <span>{new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>
    </div>
  );
});

export default CrosswordSheet;
