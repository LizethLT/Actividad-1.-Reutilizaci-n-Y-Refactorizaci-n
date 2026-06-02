import * as XLSX from 'xlsx';

class ReportGenerator {
  generarReporte(config) {
    throw new Error('generarReporte() debe ser implementado por la subclase.');
  }
}

class PDFReportGenerator extends ReportGenerator {
  generarReporte({ titulo, columnas, datos, pie }) {
    import('jspdf').then(async ({ default: jsPDF }) => {
      const { default: autoTable } = await import('jspdf-autotable');
      const doc = new jsPDF();
      doc.setFontSize(14);
      doc.text(titulo, 14, 18);
      autoTable(doc, {
        startY: 26,
        head: [columnas.map(c => c.label)],
        body: datos.map(row => columnas.map(c => String(row[c.key] ?? '—'))),
        styles: { fontSize: 10 },
        headStyles: { fillColor: [31, 78, 121] },
      });
      if (pie) { doc.setFontSize(9); doc.text(pie, 14, doc.lastAutoTable.finalY + 8); }
      doc.save(`${titulo.replace(/ /g, '_')}.pdf`);
    });
  }
}

class ExcelReportGenerator extends ReportGenerator {
  generarReporte({ titulo, columnas, datos }) {
    const cabecera = columnas.map(c => c.label);
    const filas    = datos.map(row =>
      columnas.map(c => {
        const val = row[c.key];
        if (val !== null && val !== undefined && typeof val === 'object' && !Array.isArray(val)) return '';
        return val ?? '';
      })
    );
    const wsData = [cabecera, ...filas];
    const ws     = XLSX.utils.aoa_to_sheet(wsData);

    ws['!cols'] = cabecera.map((h, i) => ({
      wch: Math.max(h.length, ...filas.map(f => String(f[i] ?? '').length)) + 2
    }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, titulo.slice(0, 31));
    XLSX.writeFile(wb, `${titulo}.xlsx`);
  }
}

class CSVReportGenerator extends ReportGenerator {
  generarReporte({ titulo, columnas, datos }) {
    const header = columnas.map(c => c.label).join(',');
    const rows   = datos.map(row => columnas.map(c => row[c.key] ?? '').join(','));
    const csv    = [header, ...rows].join('\n');
    const blob   = new Blob([csv], { type: 'text/csv' });
    const url    = URL.createObjectURL(blob);
    const a      = document.createElement('a');
    a.href = url; a.download = `${titulo}.csv`; a.click();
    URL.revokeObjectURL(url);
  }
}

export function crearGenerador(formato) {
  switch (formato) {
    case 'pdf':   return new PDFReportGenerator();
    case 'excel': return new ExcelReportGenerator();
    case 'csv':   return new CSVReportGenerator();
    default: throw new Error(`Formato '${formato}' no soportado.`);
  }
}

export async function generarFacturaPDF(factura) {
  const { default: jsPDF }     = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W   = 210;
  const mg  = 14;
  doc.setFontSize(11); doc.setFont('helvetica', 'bold');
  doc.text('ERP PyMEs — Sector Industrial', mg, 20);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
  doc.text('CASA MATRIZ', mg, 26);
  doc.text('Calle Comercio #123', mg, 31);
  doc.text('Teléfono: 2-456789', mg, 36);
  doc.text('La Paz, Bolivia', mg, 41);
  const rx = W - mg;
  doc.setFont('helvetica', 'bold'); doc.setFontSize(9);
  doc.text('NIT',        rx - 60, 20); doc.setFont('helvetica', 'normal');
  doc.text('1234567890', rx - 30, 20);
  doc.setFont('helvetica', 'bold');
  doc.text('FACTURA N°', rx - 60, 26); doc.setFont('helvetica', 'normal');
  doc.text(String(factura.nro_factura), rx - 30, 26);
  doc.setFont('helvetica', 'bold');
  doc.text('CUF',        rx - 60, 32); doc.setFont('helvetica', 'normal');
  const cuf = ('CUF' + factura.nro_factura.replace('FAC-', '') + 'BOL2026').toUpperCase();
  doc.text(cuf, rx - 30, 32);
  doc.setFont('helvetica', 'bold');
  doc.text('ACTIVIDAD',  rx - 60, 38); doc.setFont('helvetica', 'normal');
  doc.text('Venta por mayor de productos', rx - 30, 38);
  doc.text('industriales y ferretería',   rx - 30, 43);
  doc.setDrawColor(180, 180, 180);
  doc.line(mg, 50, W - mg, 50);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(16);
  doc.text('FACTURA', W / 2, 60, { align: 'center' });
  doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
  doc.text('(Con Derecho a Crédito Fiscal)', W / 2, 67, { align: 'center' });
  const fechaEmitida = factura.emitida_en
    ? new Date(factura.emitida_en).toLocaleString('es-BO')
    : new Date().toLocaleString('es-BO');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
  doc.text('Fecha:',               mg, 78);
  doc.text('Nombre/Razón Social:', mg, 84);
  doc.text('NIT/CI/CEX:',          W / 2 + 10, 78);
  doc.setFont('helvetica', 'normal');
  doc.text(fechaEmitida,           mg + 32, 78);
  doc.text(factura.cliente || 'Cliente', mg + 50, 84);
  doc.text(String(factura.nit),    W / 2 + 42, 78);
  autoTable(doc, {
    startY: 90,
    head: [['Código Producto', 'Cantidad', 'Descripción', 'Precio Unitario', 'Descuento', 'Subtotal']],
    body: [[
      factura.nro_factura, '1',
      `Venta confirmada — ${factura.cliente}`,
      `${factura.monto} Bs.`, '0.00', `${factura.monto} Bs.`,
    ]],
    styles:       { fontSize: 9, halign: 'center' },
    headStyles:   { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.3, lineColor: [0, 0, 0] },
    bodyStyles:   { lineWidth: 0.3, lineColor: [0, 0, 0] },
    columnStyles: { 0: { cellWidth: 28 }, 1: { cellWidth: 20 }, 2: { cellWidth: 55 }, 3: { cellWidth: 30 }, 4: { cellWidth: 25 }, 5: { cellWidth: 25 } },
  });
  const finalY = doc.lastAutoTable.finalY;
  doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
  doc.text('TOTAL BS',                    W - mg, finalY + 8,  { align: 'right' });
  doc.text(`${factura.monto} Bs.`,        W - mg, finalY + 14, { align: 'right' });
  doc.setDrawColor(0);
  doc.line(W - 60, finalY + 16, W - mg, finalY + 16);
  doc.text('IMPORTE BASE CRÉDITO FISCAL', W - mg, finalY + 22, { align: 'right' });
  doc.text(`${factura.monto} Bs.`,        W - mg, finalY + 28, { align: 'right' });
  doc.setFont('helvetica', 'bold'); doc.setFontSize(9);
  doc.text(`Son: ${montoEnLetras(factura.monto)} Bolivianos`, mg, finalY + 20);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
  const pie1 = '"ESTA FACTURA CONTRIBUYE AL DESARROLLO DE NUESTRO PAÍS, EL USO ILÍCITO DE ÉSTA SERÁ SANCIONADO DE ACUERDO A LEY"';
  const pie2 = 'Ley N° 453: Tienes derecho a recibir información sobre las características y contenidos de los servicios que utilices.';
  doc.text(pie1, W / 2, finalY + 45, { align: 'center', maxWidth: W - mg * 2 });
  doc.text(pie2, W / 2, finalY + 55, { align: 'center', maxWidth: W - mg * 2 });
  doc.save(`Factura_${factura.nro_factura}.pdf`);
}

function montoEnLetras(monto) {
  const n      = Number(monto);
  const entero = Math.floor(n);
  const dec    = Math.round((n - entero) * 100);
  const letras = ['cero','uno','dos','tres','cuatro','cinco','seis','siete','ocho','nueve',
    'diez','once','doce','trece','catorce','quince','dieciséis','diecisiete','dieciocho','diecinueve',
    'veinte','veintiuno','veintidós','veintitrés','veinticuatro','veinticinco'];
  const txt = entero <= 25 ? letras[entero] : `${entero}`;
  return `${txt} ${dec > 0 ? dec + '/100' : '00/100'}`;
}