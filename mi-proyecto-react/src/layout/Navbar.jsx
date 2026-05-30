export default function Navbar({ tabActual, onCambiarTab }) {
  const tabs = [
    { id: 'inventario',  label: 'Inventario',              color: '#1d4ed8' },
    { id: 'ventas',      label: 'Ventas',                  color: '#059669' },
    { id: 'facturacion', label: 'Facturación electrónica', color: '#7c3aed' },
  ];

  return (
    <nav style={{
      background: '#fff',
      borderBottom: '1px solid #e2e8f0',
      padding: '0 24px',
      display: 'flex',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onCambiarTab(t.id)}
          style={{
            padding: '12px 20px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: tabActual === t.id ? 600 : 400,
            color: tabActual === t.id ? t.color : '#64748b',
            borderBottom: tabActual === t.id ? `2px solid ${t.color}` : '2px solid transparent',
          }}>
          {t.label}
        </button>
      ))}
    </nav>
  );
}