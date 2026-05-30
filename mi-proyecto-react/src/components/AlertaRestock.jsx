

export default function AlertaRestock({ productos }) {
  if (!productos.length) return null;
  return (
    <div style={{ background: '#fef3c7', border: '1px solid #fbbf24', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13 }}>
      ⚠ Productos con stock bajo: {productos.map(p => p.nombre).join(', ')}
    </div>
  );
}