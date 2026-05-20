// ============================================================
//  invoicePDF.js — Genera un PDF de factura con formato real
//  src/services/invoicePDF.js
//  Requiere: npm install jspdf  (ya lo tienes si usas reportService)
// ============================================================

import jsPDF from 'jspdf';

function fmt(m) {
  return 'Bs. ' + Number(m).toLocaleString('es-BO', {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  });
}

function fmtFecha(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-BO', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function exportarFacturaPDF(factura) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W   = doc.internal.pageSize.getWidth();   // 210
  const H   = doc.internal.pageSize.getHeight();  // 297

  // ── Paleta ──────────────────────────────────────────────
  const AZUL  = [30,  58,  95];   // header
  const AZUL2 = [59,  130, 246];  // acento
  const GRIS1 = [248, 250, 252];  // fondo celda par
  const GRIS2 = [100, 116, 139];  // texto secundario
  const NEGRO = [15,  23,  42];   // texto principal
  const VERDE = [15,  118, 110];  // monto
  const ROJO  = [185, 28,  28];   // anulada

  // ── 1. Encabezado azul ───────────────────────────────────
  doc.setFillColor(...AZUL);
  doc.rect(0, 0, W, 38, 'F');

  //  Nombre empresa (izquierda)
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('ERP PyME Industrial', 12, 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(190, 220, 255);
  doc.text('Comercio y Producción Industrial', 12, 22);
  doc.text('Tarija — Bolivia', 12, 27);

  //  "FACTURA" (derecha)
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.text('FACTURA', W - 12, 18, { align: 'right' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(190, 220, 255);
  doc.text(factura.nro_factura, W - 12, 26, { align: 'right' });

  // ── 2. Franja estado ────────────────────────────────────
  const esAnulada = factura.estado_envio !== 'enviada';
  doc.setFillColor(...(esAnulada ? ROJO : AZUL2));
  doc.rect(0, 38, W, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  const estadoTxt = esAnulada ? '✖  ANULADA' : '✔  ENVIADA';
  doc.text(estadoTxt, W / 2, 43.5, { align: 'center' });

  // ── 3. Bloque datos factura (izquierda) ─────────────────
  let y = 56;

  doc.setFillColor(...GRIS1);
  doc.roundedRect(10, y, 88, 30, 2, 2, 'F');

  doc.setTextColor(...GRIS2);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('NÚMERO DE FACTURA', 14, y + 7);
  doc.text('FECHA DE EMISIÓN',   14, y + 16);
  doc.text('ESTADO DE ENVÍO',    14, y + 25);

  doc.setTextColor(...NEGRO);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(factura.nro_factura,             75, y + 7,  { align: 'right' });
  doc.text(fmtFecha(factura.emitida_en),    75, y + 16, { align: 'right' });
  doc.setTextColor(...(esAnulada ? ROJO : VERDE));
  doc.text(factura.estado_envio.toUpperCase(), 75, y + 25, { align: 'right' });

  // ── 4. Bloque cliente (derecha) ──────────────────────────
  doc.setFillColor(...GRIS1);
  doc.roundedRect(108, y, 92, 30, 2, 2, 'F');

  doc.setTextColor(...GRIS2);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('FACTURADO A',    112, y + 7);

  doc.setTextColor(...NEGRO);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);

  // Nombre cliente — puede ser largo, ajustamos
  const nombreLineas = doc.splitTextToSize(factura.cliente, 80);
  doc.text(nombreLineas, 112, y + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...GRIS2);
  doc.text('NIT: ' + factura.nit, 112, y + 14 + (nombreLineas.length * 5));

  // ── 5. Separador ─────────────────────────────────────────
  y += 38;
  doc.setDrawColor(...AZUL);
  doc.setLineWidth(0.5);
  doc.line(10, y, W - 10, y);

  // ── 6. Tabla de detalle ──────────────────────────────────
  y += 8;

  // Encabezado tabla
  doc.setFillColor(...AZUL);
  doc.rect(10, y, W - 20, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('DESCRIPCIÓN',      14,      y + 5.5);
  doc.text('CANT.',            120,     y + 5.5, { align: 'center' });
  doc.text('P. UNITARIO',      155,     y + 5.5, { align: 'right' });
  doc.text('IMPORTE',          W - 14,  y + 5.5, { align: 'right' });

  // Fila de detalle (con el monto total disponible)
  y += 8;
  doc.setFillColor(...GRIS1);
  doc.rect(10, y, W - 20, 9, 'F');
  doc.setTextColor(...NEGRO);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Servicios / Productos ERP Industrial', 14, y + 6);
  doc.text('1',                                   120,     y + 6, { align: 'center' });
  doc.text(fmt(factura.monto),                    155,     y + 6, { align: 'right' });
  doc.text(fmt(factura.monto),                    W - 14,  y + 6, { align: 'right' });

  // ── 7. Totales ───────────────────────────────────────────
  y += 18;
  doc.setDrawColor(220, 230, 240);
  doc.setLineWidth(0.3);

  // Subtotal
  doc.setTextColor(...GRIS2);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('SUBTOTAL',  140, y);
  doc.setTextColor(...NEGRO);
  doc.text(fmt(factura.monto), W - 14, y, { align: 'right' });
  doc.line(130, y + 2, W - 10, y + 2);

  // Descuento
  y += 9;
  doc.setTextColor(...GRIS2);
  doc.text('DESCUENTO', 140, y);
  doc.setTextColor(...NEGRO);
  doc.text('Bs. 0,00', W - 14, y, { align: 'right' });
  doc.line(130, y + 2, W - 10, y + 2);

  // Total — destacado
  y += 10;
  doc.setFillColor(...AZUL);
  doc.roundedRect(125, y - 5, W - 135, 13, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('TOTAL',          130, y + 3.5);
  doc.text(fmt(factura.monto), W - 14, y + 3.5, { align: 'right' });

  // ── 8. Nota legal / pie ──────────────────────────────────
  y += 24;
  doc.setDrawColor(...AZUL);
  doc.setLineWidth(0.3);
  doc.line(10, y, W - 10, y);

  y += 6;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(...GRIS2);
  doc.text(
    'Este documento es una Factura Electrónica generada por el sistema ERP PyME Industrial.',
    W / 2, y, { align: 'center' }
  );
  doc.text(
    'Para consultas contáctese con el área de facturación.',
    W / 2, y + 5, { align: 'center' }
  );

  // ── 9. Franja pie ────────────────────────────────────────
  doc.setFillColor(...AZUL);
  doc.rect(0, H - 12, W, 12, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(190, 220, 255);
  doc.text('ERP PyME Sector Industrial — Tarija, Bolivia', 12, H - 5);
  doc.setTextColor(255, 255, 255);
  doc.text(new Date().getFullYear().toString(), W - 12, H - 5, { align: 'right' });

  // ── Descargar ────────────────────────────────────────────
  doc.save(`${factura.nro_factura}.pdf`);
}