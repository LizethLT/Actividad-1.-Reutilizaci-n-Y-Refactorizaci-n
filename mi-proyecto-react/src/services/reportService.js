// ReportService — polimorfismo POO
// La clase base define el contrato. Las subclases lo implementan.
// Los módulos siempre llaman generarReporte() sin saber qué formato saldrá.

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
    import('xlsx').then(({ default: XLSX }) => {
      const wsData = [
        columnas.map(c => c.label),
        ...datos.map(row => columnas.map(c => row[c.key] ?? '')),
      ];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, titulo);
      XLSX.writeFile(wb, `${titulo}.xlsx`);
    });
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

// Factory: decide qué subclase instanciar
export function crearGenerador(formato) {
  switch (formato) {
    case 'pdf':   return new PDFReportGenerator();
    case 'excel': return new ExcelReportGenerator();
    case 'csv':   return new CSVReportGenerator();
    default: throw new Error(`Formato '${formato}' no soportado.`);
  }
}