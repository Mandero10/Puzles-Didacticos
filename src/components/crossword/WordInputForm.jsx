import React, { useState } from 'react';
import { Plus, Trash2, Sparkles, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';
import Button from '../common/Button';
import Toggle from '../common/Toggle';
import { PRESET_THEMES } from '../../constants/presets';

export default function WordInputForm({
  words,
  onWordsChange,
  hideClues,
  onHideCluesChange,
  onGenerate,
  isGenerating = false,
  unplacedWords = []
}) {
  const [selectedPreset, setSelectedPreset] = useState('');

  const handleAddWord = () => {
    const newId = Date.now().toString();
    onWordsChange([
      ...words,
      { id: newId, word: '', clue: '' }
    ]);
  };

  const handleUpdateWord = (id, field, value) => {
    const updated = words.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    onWordsChange(updated);
  };

  const handleRemoveWord = (id) => {
    if (words.length <= 2) {
      alert('Se recomienda mantener al menos 2 palabras para poder cruzarlas.');
    }
    onWordsChange(words.filter(item => item.id !== id));
  };

  const handleLoadPreset = (e) => {
    const presetId = e.target.value;
    setSelectedPreset(presetId);
    const theme = PRESET_THEMES.find(t => t.id === presetId);
    if (theme) {
      onWordsChange(theme.words.map(w => ({ ...w, id: Date.now() + Math.random().toString() })));
    }
  };

  const handleClearAll = () => {
    if (window.confirm('¿Deseas vaciar la lista de palabras actual?')) {
      onWordsChange([
        { id: '1', word: '', clue: '' },
        { id: '2', word: '', clue: '' }
      ]);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-6">
      {/* Encabezado y Presets */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            Palabras y Descripciones
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Ingresa los términos y pistas para el crucigrama ({words.length} palabras ingresadas).
          </p>
        </div>

        {/* Selector de plantilla de ejemplo */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedPreset}
            onChange={handleLoadPreset}
            className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="">Cargar ejemplo temático...</option>
            {PRESET_THEMES.map(theme => (
              <option key={theme.id} value={theme.id}>
                ✨ {theme.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de entradas de palabras */}
      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
        {words.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-slate-300 transition-colors group"
          >
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold shrink-0">
              {index + 1}
            </div>

            {/* Input Palabra */}
            <div className="relative w-1/3 min-w-[120px]">
              <input
                type="text"
                value={item.word}
                placeholder="Palabra"
                onChange={(e) => handleUpdateWord(item.id, 'word', e.target.value)}
                className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg px-2.5 py-2 uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:normal-case placeholder:font-normal placeholder:text-slate-400"
              />
            </div>

            {/* Input Pista / Descripción */}
            <div className="flex-1">
              <input
                type="text"
                value={item.clue}
                placeholder="Pista o definición..."
                onChange={(e) => handleUpdateWord(item.id, 'clue', e.target.value)}
                className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-400"
              />
            </div>

            {/* Botón eliminar fila */}
            <button
              type="button"
              onClick={() => handleRemoveWord(item.id)}
              disabled={words.length <= 1}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
              title="Eliminar palabra"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Acciones de lista */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddWord}
          icon={Plus}
        >
          Agregar otra palabra
        </Button>

        {words.length > 2 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs text-slate-400 hover:text-rose-500 transition-colors"
          >
            Limpiar lista
          </button>
        )}
      </div>

      {/* Alerta de palabras no cruzadas (si las hubiere) */}
      {unplacedWords && unplacedWords.length > 0 && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-amber-800 text-xs">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Palabras sin cruce detectadas: </span>
            <span>{unplacedWords.map(w => w.cleanWord).join(', ')}. No comparten letras compatibles con la cuadrícula actual. Puedes modificar las letras o presionar "Regenerar" para buscar otro arreglo.</span>
          </div>
        </div>
      )}

      {/* Sección de Opciones del documento: Toggle Requerido */}
      <div className="pt-4 border-t border-slate-100">
        <Toggle
          checked={hideClues}
          onChange={onHideCluesChange}
          label="Ocultar descripciones en el documento final"
          description="Genera el crucigrama únicamente con las celdas vacías y numeradas, omitiendo la lista de definiciones."
          id="toggle-hide-clues"
        />
      </div>

      {/* Botón Principal para Reorganizar/Generar Crucigrama */}
      <div className="pt-2">
        <Button
          variant="primary"
          size="lg"
          onClick={onGenerate}
          loading={isGenerating}
          icon={RefreshCw}
          className="w-full shadow-md hover:shadow-indigo-200 shadow-indigo-100 py-3"
        >
          {isGenerating ? 'Generando Crucigrama...' : 'Generar / Cruzar Palabras'}
        </Button>
      </div>
    </div>
  );
}
