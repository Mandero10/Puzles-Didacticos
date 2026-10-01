import React from 'react';
import { AVAILABLE_FONTS } from '../../constants/fonts';

export default function CrosswordBoard({
  grid,
  styleOptions = {}
}) {
  if (!grid || grid.length === 0) {
    return (
      <div className="p-16 text-center text-slate-400 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
        <p className="text-sm font-semibold">No hay palabras generadas en la cuadrícula.</p>
        <p className="text-xs mt-1">Agrega palabras y presiona "Generar / Cruzar Palabras".</p>
      </div>
    );
  }

  const {
    fontId = 'outfit',
    boardBgColor = '#ffffff',
    cellBgColor = '#ffffff',
    textColor = '#0f172a',
    gridLineColor = '#0f172a',
    cellSize = 40,
    showLetters = true
  } = styleOptions;

  const selectedFont = AVAILABLE_FONTS.find(f => f.id === fontId);
  const fontFamily = selectedFont ? selectedFont.fontFamily : 'inherit';

  const rowsCount = grid.length;
  const colsCount = grid[0]?.length || 0;

  return (
    <div
      data-crossword-board="true"
      className="flex justify-center items-center p-4 my-2 transition-all"
    >
      <div
        className="inline-block select-none"
        style={{
          fontFamily,
          backgroundColor: boardBgColor,
          padding: '12px',
          borderRadius: '8px'
        }}
      >
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${colsCount}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${rowsCount}, ${cellSize}px)`,
            gap: '0px'
          }}
        >
          {grid.map((row, rIdx) =>
            row.map((cell, cIdx) => {
              if (cell.isEmpty) {
                return (
                  <div
                    key={`empty-${rIdx}-${cIdx}`}
                    style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
                    className="bg-transparent"
                  />
                );
              }

              return (
                <div
                  key={`cell-${rIdx}-${cIdx}`}
                  className="relative flex items-center justify-center font-bold"
                  style={{
                    width: `${cellSize}px`,
                    height: `${cellSize}px`,
                    backgroundColor: cellBgColor,
                    border: `1.5px solid ${gridLineColor}`,
                    color: textColor,
                    fontSize: `${Math.round(cellSize * 0.48)}px`,
                    lineHeight: 1
                  }}
                >
                  {/* Número de celda (si es inicio de palabra) */}
                  {cell.number && (
                    <span
                      className="absolute top-0.5 left-1 font-semibold select-none pointer-events-none"
                      style={{
                        fontSize: `${Math.max(8, Math.round(cellSize * 0.24))}px`,
                        color: textColor,
                        opacity: 0.85,
                        fontFamily
                      }}
                    >
                      {cell.number}
                    </span>
                  )}

                  {/* Letra (ocultable si es modo estudiante) */}
                  {showLetters && (
                    <span className="uppercase select-none">
                      {cell.letter}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
