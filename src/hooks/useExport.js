import { useState, useCallback } from 'react';
import { exportToPNG, exportToPDF } from '../core/export/exportService';

export function useExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState(null);

  const exportPNG = useCallback(async (element, quality = 'high', fileName = 'crucigrama.png') => {
    if (!element) return false;
    setIsExporting(true);
    setExportError(null);
    try {
      const res = await exportToPNG(element, { quality, fileName });
      return res;
    } catch (err) {
      console.error('Error al exportar PNG:', err);
      setExportError(err.message);
      return false;
    } finally {
      setIsExporting(false);
    }
  }, []);

  const exportPDF = useCallback(async (element, fileName = 'crucigrama.pdf') => {
    if (!element) return false;
    setIsExporting(true);
    setExportError(null);
    try {
      const res = await exportToPDF(element, { fileName });
      return res;
    } catch (err) {
      console.error('Error al exportar PDF:', err);
      setExportError(err.message);
      return false;
    } finally {
      setIsExporting(false);
    }
  }, []);

  return {
    isExporting,
    exportError,
    exportPNG,
    exportPDF
  };
}
