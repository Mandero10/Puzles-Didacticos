import React from 'react';
import { Grid, Search, Puzzle, Sparkles, BookOpen } from 'lucide-react';

export default function Header({ currentModule = 'crossword' }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo y Nombre */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
              <Grid className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                Didacti<span className="text-indigo-600">Craft</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Fase 1
                </span>
              </span>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Generador de Material Didáctico Interactivo
              </p>
            </div>
          </div>

          {/* Módulos de la SPA */}
          <nav className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {/* 1. Crucigramas (Activo) */}
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-indigo-700 shadow-2xs transition-all"
            >
              <Grid className="w-3.5 h-3.5 text-indigo-600" />
              <span>Crucigramas</span>
            </button>

            {/* 2. Sopas de letras (Próximamente) */}
            <button
              type="button"
              disabled
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-500 cursor-not-allowed opacity-60"
              title="Próximamente en Fase 2"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Sopas de Letras</span>
              <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-sm">Próx</span>
            </button>

            {/* 3. Rompecabezas (Próximamente) */}
            <button
              type="button"
              disabled
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-500 cursor-not-allowed opacity-60 hidden md:flex"
              title="Próximamente en Fase 3"
            >
              <Puzzle className="w-3.5 h-3.5" />
              <span>Rompecabezas</span>
              <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-sm">Próx</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
