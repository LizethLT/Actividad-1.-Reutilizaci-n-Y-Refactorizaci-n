export default function BotonesExportar({ formatos, onExportar }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
      {formatos.map(fmt => (
        <button key={fmt} onClick={() => onExportar(fmt)}
          style={{ padding: '4px 10px', border: '1px solid #d1d5db', borderRadius: 4, cursor: 'pointer', fontSize: 12, background: '#fff', color: '#374151' }}>
          Exportar {fmt.toUpperCase()}
        </button>
      ))}
    </div>
  );
}