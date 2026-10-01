import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const EXPORT_QUALITIES = {
  low: {
    id: 'low',
    name: 'Baja (1x - Web / Pantalla)',
    scale: 1,
    description: 'Ligero y rápido para compartir por chat'
  },
  medium: {
    id: 'medium',
    name: 'Media (2x - Digital HD)',
    scale: 2,
    description: 'Ideal para presentaciones o pantallas retina'
  },
  high: {
    id: 'high',
    name: 'Alta (4x - Calidad de Impresión)',
    scale: 4,
    description: 'Resolución ultra nítida optimizada para imprimir en papel'
  }
};

/**
 * Prepara el documento clonado para capturar el 100% del área de trabajo
 * sin recortes ni barras de desplazamiento.
 */
function prepareClonedDocument(clonedDoc) {
  const cloneTarget = clonedDoc.querySelector('[data-export-root]');
  if (!cloneTarget) return;

  // 1. Eliminar sombras y restricciones de ancho
  cloneTarget.style.boxShadow = 'none';
  cloneTarget.style.border = 'none';
  cloneTarget.style.margin = '0';
  cloneTarget.style.maxWidth = 'none';
  cloneTarget.style.width = 'max-content';

  // 2. Localizar la cuadrícula del crucigrama para calcular el ancho real requerido
  const boardEl = cloneTarget.querySelector('[data-crossword-board]');
  const boardWidth = boardEl ? boardEl.scrollWidth : 0;

  // Garantizar un ancho mínimo generoso para que quepan encabezado, cuadrícula y pistas completas
  const requiredWidth = Math.max(900, boardWidth + 140);
  cloneTarget.style.minWidth = `${requiredWidth}px`;
  cloneTarget.style.width = `${requiredWidth}px`;
  cloneTarget.style.padding = '48px';

  // 3. Desactivar desbordamientos y scrollbars en todos los elementos hijos
  const allElements = cloneTarget.querySelectorAll('*');
  allElements.forEach((el) => {
    el.style.overflow = 'visible';
    el.style.overflowX = 'visible';
    el.style.overflowY = 'visible';
    el.style.maxWidth = 'none';
  });
}

/**
 * Exporta el área del crucigrama como imagen PNG de alta fidelidad,
 * asegurando que todas las casillas y pistas aparezcan 100% completas.
 */
export async function exportToPNG(element, options = {}) {
  const qualityKey = options.quality || 'high';
  const qualityConfig = EXPORT_QUALITIES[qualityKey] || EXPORT_QUALITIES.high;
  const fileName = options.fileName || `crucigrama-${Date.now()}.png`;

  // Medir ancho necesario considerando elementos internos
  const boardEl = element.querySelector('[data-crossword-board]');
  const naturalWidth = Math.max(900, (boardEl?.scrollWidth || element.scrollWidth) + 140);
  const naturalHeight = element.scrollHeight + 80;

  const canvas = await html2canvas(element, {
    scale: qualityConfig.scale,
    useCORS: true,
    backgroundColor: options.bgColor || '#ffffff',
    logging: false,
    windowWidth: naturalWidth + 200,
    windowHeight: naturalHeight + 200,
    scrollX: 0,
    scrollY: 0,
    onclone: (clonedDoc) => {
      prepareClonedDocument(clonedDoc);
    }
  });

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve(false);
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName.endsWith('.png') ? fileName : `${fileName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      resolve(true);
    }, 'image/png');
  });
}

/**
 * Exporta el área del crucigrama como documento PDF estándar A4,
 * ajustando automáticamente orientación (vertical u horizontal) y márgenes para que nada se corte.
 */
export async function exportToPDF(element, options = {}) {
  const fileName = options.fileName || `crucigrama-${Date.now()}.pdf`;

  const boardEl = element.querySelector('[data-crossword-board]');
  const naturalWidth = Math.max(900, (boardEl?.scrollWidth || element.scrollWidth) + 140);
  const naturalHeight = element.scrollHeight + 80;

  // Usamos escala 3 para que el renderizado de texto y líneas en el PDF sea ultra nítido
  const canvas = await html2canvas(element, {
    scale: 3,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
    windowWidth: naturalWidth + 200,
    windowHeight: naturalHeight + 200,
    scrollX: 0,
    scrollY: 0,
    onclone: (clonedDoc) => {
      prepareClonedDocument(clonedDoc);
    }
  });

  const imgData = canvas.toDataURL('image/png');

  // Dimensiones A4 en mm
  const a4Width = 210;
  const a4Height = 297;

  // Determinar si conviene formato horizontal (apaisado) o vertical
  const isLandscape = canvas.width > canvas.height * 1.15;
  const pageWidth = isLandscape ? a4Height : a4Width;
  const pageHeight = isLandscape ? a4Width : a4Height;

  const pdf = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const margin = 12; // 12 mm de margen de seguridad para no tocar los bordes de la impresora
  const maxContentWidth = pageWidth - margin * 2;
  const maxContentHeight = pageHeight - margin * 2;

  const imgAspect = canvas.width / canvas.height;
  let renderWidth = maxContentWidth;
  let renderHeight = renderWidth / imgAspect;

  // Si sobrepasa el alto disponible, ajustar por alto
  if (renderHeight > maxContentHeight) {
    renderHeight = maxContentHeight;
    renderWidth = renderHeight * imgAspect;
  }

  // Centrar perfectamente en la hoja A4
  const posX = (pageWidth - renderWidth) / 2;
  const posY = (pageHeight - renderHeight) / 2;

  pdf.addImage(imgData, 'PNG', posX, posY, renderWidth, renderHeight);
  pdf.save(fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`);

  return true;
}
