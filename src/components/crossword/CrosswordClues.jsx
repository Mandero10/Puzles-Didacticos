import React from 'react';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { AVAILABLE_FONTS } from '../../constants/fonts';

export default function CrosswordClues({
  clues = { across: [], down: [] },
  hideClues = false,
  styleOptions = {}
}) {
  if (hideClues) {
    return null;
  }

  const { fontId = 'outfit', textColor = '#0f172a' } = styleOptions;
  const selectedFont = AVAILABLE_FONTS.find(f => f.id === fontId);
  const fontFamily = selectedFont ? selectedFont.fontFamily : 'inherit';

  const hasAcross = clues.across && clues.across.length > 0;
  const hasDown = clues.down && clues.down.length > 0;

  if (!hasAcross && !hasDown) {
    return null;
  }

  return (
    <div
      className="w-full mt-6 pt-6 border-t border-slate-200"
      style={{ fontFamily, color: textColor }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pistas Horizontales */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 border-b pb-1.5 border-slate-300">
            <ArrowRight className="w-4 h-4 text-indigo-600" />
            Horizontales
          </h3>
          {hasAcross ? (
            <ol className="space-y-2 text-xs">
              {clues.across.map((item) => (
                <li key={`across-${item.number}`} className="flex items-start gap-2 leading-relaxed">
                  <span className="font-bold shrink-0 min-w-[20px] text-right">
                    {item.number}.
                  </span>
                  <span>
                    {item.clue} <span className="opacity-60 font-mono text-[11px]">({item.length} letras)</span>
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-xs italic opacity-50">Sin palabras horizontales</p>
          )}
        </div>

        {/* Pistas Verticales */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 border-b pb-1.5 border-slate-300">
            <ArrowDown className="w-4 h-4 text-indigo-600" />
            Verticales
          </h3>
          {hasDown ? (
            <ol className="space-y-2 text-xs">
              {clues.down.map((item) => (
                <li key={`down-${item.number}`} className="flex items-start gap-2 leading-relaxed">
                  <span className="font-bold shrink-0 min-w-[20px] text-right">
                    {item.number}.
                  </span>
                  <span>
                    {item.clue} <span className="opacity-60 font-mono text-[11px]">({item.length} letras)</span>
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-xs italic opacity-50">Sin palabras verticales</p>
          )}
        </div>
      </div>
    </div>
  );
}
