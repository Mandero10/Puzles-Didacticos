import React, { useState } from 'react';
import { Download, FileDown, Image, CheckCircle, ShieldCheck, Printer } from 'lucide-react';
import Button from '../common/Button';
import { EXPORT_QUALITIES } from '../../core/export/exportService';

export default function ExportControls({
  onExportPNG,
  onExportPDF,
  isExporting = false,
  crosswordTitle = 'Crucigrama Didáctico'
}) {
  const [format, setFormat] = useState('png'); // 'png' | 'pdf'
  const [quality, setQuality] = useState('high'); // 'low' | 'medium' | 'high'
  const [lastExported, setLastExported] = useState(null);

  const handleExport = async () => {
    let success = false;
    if (format === 'png') {
      success = await onExportPNG(quality);
    } else {
      success = await onExportPDF();
    }
    if (success) {
      setLastExported(format);
      setTimeout(() => setLastExported(null), 4000);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <Download className="w-5 h-5 text-indigo-600" />
            Módulo de Exportación
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Exporta el material listo para imprimir en papel o compartir digitalmente.
          </p>
        </div>
      </div>

      {/* Selector de Formato: PNG vs PDF */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Formato de Exportación
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setFormat('png')}
            className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left ${
              format === 'png'
                ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
            }`}
          >
            <div className={`p-2 rounded-lg ${format === 'png' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
              <Image className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-800">Formato PNG</div>
              <div className="text-xs text-slate-500">Imagen con escala de resolución</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setFormat('pdf')}
            className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left ${
              format === 'pdf'
                ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
            }`}
          >
            <div className={`p-2 rounded-lg ${format === 'pdf' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-800">Formato PDF</div>
              <div className="text-xs text-slate-500">Documento estándar A4 para imprimir</div>
            </div>
          </button>
        </div>
      </div>

      {/* Opciones condicionales para PNG: Selector de Calidad (scale) */}
      {format === 'png' ? (
        <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center justify-between">
            <span>Calidad de Imagen (Propiedad Scale del Canvas)</span>
            <span className="text-[11px] font-mono text-indigo-600 font-bold">
              {EXPORT_QUALITIES[quality].scale}x de resolución
            </span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {Object.values(EXPORT_QUALITIES).map((q) => (
              <button
                key={q.id}
                type="button"
                onClick={() => setQuality(q.id)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  quality === q.id
                    ? 'border-indigo-600 bg-white ring-2 ring-indigo-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white/70'
                }`}
              >
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  {q.id === 'high' && <Printer className="w-3.5 h-3.5 text-indigo-600" />}
                  {q.id === 'low' && 'Baja (1x)'}
                  {q.id === 'medium' && 'Media (2x)'}
                  {q.id === 'high' && 'Alta (4x Impresión)'}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 leading-snug">
                  {q.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-center gap-3">
          <Printer className="w-5 h-5 text-indigo-600 shrink-0" />
          <span>El documento PDF se generará con formato A4 con centrado automático y resolución apta para impresión directa en fotocopiadora o impresora láser.</span>
        </div>
      )}

      {/* Botón de Descarga */}
      <div className="space-y-2">
        <Button
          variant="primary"
          size="lg"
          onClick={handleExport}
          loading={isExporting}
          icon={Download}
          className="w-full py-3.5 text-base font-semibold shadow-md shadow-indigo-100 hover:shadow-indigo-200"
        >
          {isExporting ? (
            'Renderizando y Procesando...'
          ) : format === 'png' ? (
            `Descargar PNG (${EXPORT_QUALITIES[quality].name.split(' ')[0]} - ${EXPORT_QUALITIES[quality].scale}x)`
          ) : (
            'Descargar Documento PDF (A4)'
          )}
        </Button>

        {lastExported && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 font-medium py-1 animate-fadeIn">
            <CheckCircle className="w-4 h-4" />
            ¡Archivo {lastExported.toUpperCase()} generado y descargado con éxito!
          </div>
        )}
      </div>
    </div>
  );
}
