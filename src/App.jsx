import React, { useState, useRef, useEffect } from 'react';
import Header from './components/layout/Header';
import WordInputForm from './components/crossword/WordInputForm';
import StyleCustomizer from './components/crossword/StyleCustomizer';
import ExportControls from './components/crossword/ExportControls';
import CrosswordSheet from './components/crossword/CrosswordSheet';
import { useCrossword } from './hooks/useCrossword';
import { useExport } from './hooks/useExport';
import { DEFAULT_STYLE } from './constants/fonts';
import {
  BookOpen,
  Palette,
  Download,
  Eye,
  EyeOff,
  Printer,
  CheckCircle2,
  Maximize2,
  Minimize2,
  Sliders,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('words'); // 'words' | 'styles' | 'export'
  const [styleOptions, setStyleOptions] = useState({ ...DEFAULT_STYLE });
  const [isWideWorkspace, setIsWideWorkspace] = useState(false);
  const sheetRef = useRef(null);

  // Hook de Crucigrama (lógica matemática pura y estado de palabras)
  const {
    words,
    setWords,
    crosswordTitle,
    setCrosswordTitle,
    crosswordData,
    isGenerating,
    generate
  } = useCrossword();

  // Hook de Exportación (html2canvas con scale dinámico y jsPDF)
  const { isExporting, exportPNG, exportPDF } = useExport();

  // Auto-ajuste inteligente de tamaño de casilla según la cantidad de columnas del crucigrama
  useEffect(() => {
    if (crosswordData.width > 0) {
      if (crosswordData.width > 20) {
        setStyleOptions(prev => ({ ...prev, cellSize: 30 }));
      } else if (crosswordData.width > 14) {
        setStyleOptions(prev => ({ ...prev, cellSize: 36 }));
      } else {
        setStyleOptions(prev => ({ ...prev, cellSize: 42 }));
      }
    }
  }, [crosswordData.width]);

  // Manejo de exportación
  const handleExportPNG = async (qualityKey) => {
    if (!sheetRef.current) return false;
    const sanitizedTitle = crosswordTitle.toLowerCase().replace(/[^a-z0-9]/gi, '_');
    return await exportPNG(sheetRef.current, qualityKey, `${sanitizedTitle}_didactic.png`);
  };

  const handleExportPDF = async () => {
    if (!sheetRef.current) return false;
    const sanitizedTitle = crosswordTitle.toLowerCase().replace(/[^a-z0-9]/gi, '_');
    return await exportPDF(sheetRef.current, `${sanitizedTitle}_didactic.pdf`);
  };

  const handleDirectPrint = () => {
    window.print();
  };

  const placedCount = crosswordData.placedWords?.length || 0;
  const totalCount = words.filter(w => w.word && w.word.trim().length >= 2).length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      {/* Barra de Navegación Superior */}
      <Header currentModule="crossword" />

      {/* Contenedor Principal con Área de Trabajo Expandida */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Controles de Vista de la Aplicación */}
        <div className="flex items-center justify-between mb-4 no-print">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Módulo de Crucigramas
            </h1>
            <span className="hidden sm:inline-block text-xs bg-slate-200/80 text-slate-700 px-2.5 py-0.5 rounded-full font-medium">
              Fase 1: Configuración y Generación
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Botón para expandir/maximizar el área de trabajo */}
            <button
              type="button"
              onClick={() => setIsWideWorkspace(!isWideWorkspace)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isWideWorkspace
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title="Maximiza el área de la hoja de trabajo para visualizar crucigramas de gran tamaño"
            >
              {isWideWorkspace ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              <span>{isWideWorkspace ? 'Vista Dividida Normal' : 'Área de Trabajo Amplia'}</span>
            </button>
          </div>
        </div>

        <div className={`grid grid-cols-1 ${isWideWorkspace ? 'lg:grid-cols-1' : 'lg:grid-cols-12'} gap-8 items-start`}>
          
          {/* PANEL IZQUIERDO: Controles y Configuración */}
          <div className={`${isWideWorkspace ? 'w-full max-w-4xl mx-auto' : 'lg:col-span-4'} space-y-6 no-print`}>
            
            {/* Navegación por Pestañas del Panel */}
            <div className="bg-white p-1.5 rounded-2xl shadow-xs border border-slate-200 flex items-center justify-between gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('words')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'words'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Palabras</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeTab === 'words' ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-200 text-slate-600'
                }`}>
                  {placedCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('styles')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'styles'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Palette className="w-4 h-4" />
                <span>Diseño</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('export')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'export'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>Exportar</span>
              </button>
            </div>

            {/* Pestaña 1: Entrada de Palabras y Toggle de Descripciones */}
            {activeTab === 'words' && (
              <WordInputForm
                words={words}
                onWordsChange={setWords}
                hideClues={styleOptions.hideClues}
                onHideCluesChange={(val) => setStyleOptions({ ...styleOptions, hideClues: val })}
                onGenerate={generate}
                isGenerating={isGenerating}
                unplacedWords={crosswordData.unplacedWords}
              />
            )}

            {/* Pestaña 2: Personalización Visual (Fuente, Colores, Líneas) */}
            {activeTab === 'styles' && (
              <StyleCustomizer
                styleOptions={styleOptions}
                onStyleChange={setStyleOptions}
              />
            )}

            {/* Pestaña 3: Módulo Central de Exportación (PDF y PNG con scale) */}
            {activeTab === 'export' && (
              <ExportControls
                onExportPNG={handleExportPNG}
                onExportPDF={handleExportPDF}
                isExporting={isExporting}
                crosswordTitle={crosswordTitle}
              />
            )}

            {/* Tarjeta de Resumen Estadístico del Crucigrama */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Estado del Crucigrama</span>
                <span className="flex items-center gap-1 text-emerald-600 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  {placedCount} de {totalCount} palabras cruzadas
                </span>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${totalCount > 0 ? (placedCount / totalCount) * 100 : 0}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>Área: {crosswordData.width} × {crosswordData.height} casillas</span>
                <span>Pistas: {crosswordData.clues?.across?.length || 0} Horiz. / {crosswordData.clues?.down?.length || 0} Vert.</span>
              </div>
            </div>
          </div>

          {/* PANEL DERECHO: Vista Previa Didáctica en Vivo (Área Amplia) */}
          <div className={`${isWideWorkspace ? 'w-full' : 'lg:col-span-8'} space-y-4`}>
            
            {/* Barra de Herramientas de la Hoja */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs no-print">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Área de Trabajo
                </span>
                <span className="text-[11px] bg-indigo-50 text-indigo-700 font-medium px-2 py-0.5 rounded-full border border-indigo-200">
                  {styleOptions.hideClues ? 'Modo Solo Cuadrícula' : 'Cuadrícula + Definiciones'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Control rápido de tamaño de casillas */}
                <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1">
                  <button
                    type="button"
                    onClick={() => setStyleOptions(prev => ({ ...prev, cellSize: Math.max(26, prev.cellSize - 2) }))}
                    className="p-1 text-slate-500 hover:text-slate-800 rounded transition-colors"
                    title="Reducir casillas"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono text-slate-600 px-1">
                    {styleOptions.cellSize}px
                  </span>
                  <button
                    type="button"
                    onClick={() => setStyleOptions(prev => ({ ...prev, cellSize: Math.min(56, prev.cellSize + 2) }))}
                    className="p-1 text-slate-500 hover:text-slate-800 rounded transition-colors"
                    title="Aumentar casillas"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Botón para alternar respuestas rápidamente */}
                <button
                  type="button"
                  onClick={() => setStyleOptions(prev => ({ ...prev, showLetters: !prev.showLetters }))}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                    styleOptions.showLetters
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                  title={styleOptions.showLetters ? 'Ocultar letras para versión de alumno' : 'Mostrar letras para solucionario'}
                >
                  {styleOptions.showLetters ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{styleOptions.showLetters ? 'Soluciones Visibles' : 'Modo Alumno (Vacío)'}</span>
                </button>

                {/* Botón Imprimir directo */}
                <button
                  type="button"
                  onClick={handleDirectPrint}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
                  title="Imprimir directamente desde el navegador"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Imprimir</span>
                </button>
              </div>
            </div>

            {/* Hoja Didáctica para Impresión y Exportación */}
            <div className="overflow-x-auto pb-4">
              <CrosswordSheet
                ref={sheetRef}
                title={crosswordTitle}
                onTitleChange={setCrosswordTitle}
                grid={crosswordData.grid}
                clues={crosswordData.clues}
                hideClues={styleOptions.hideClues}
                styleOptions={styleOptions}
              />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
