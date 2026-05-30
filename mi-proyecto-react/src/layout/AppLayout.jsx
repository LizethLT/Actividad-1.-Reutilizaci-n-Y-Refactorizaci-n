const TABS = [
  { id: 'inventario',  label: 'Inventario',              icon: '📦', color: '#1d4ed8' },
  { id: 'ventas',      label: 'Ventas',                  icon: '🛒', color: '#059669' },
  { id: 'facturacion', label: 'Facturación electrónica', icon: '🧾', color: '#7c3aed' },
];

export { TABS };

export default function AppLayout({ tab, onCambiarTab, children }) {
  const tabActual = TABS.find(t => t.id === tab);

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'system-ui, sans-serif', background: '#f1f5f9' }}>

      {/* ── BARRA LATERAL ── */}
      <aside style={{
        width: 220,
        background: '#1e293b',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}>
        <div style={{ padding: '20px 16px 14px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <p style={{ color: '#fff', fontWeight: 700, fontSize: 15, margin: 0 }}>ERP PyMEs</p>
          <span style={{ color: '#94a3b8', fontSize: 11 }}>Sector Industrial</span>
        </div>

        <nav style={{ padding: '12px 8px', flex: 1 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => onCambiarTab(t.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '10px 14px',
                marginBottom: 2,
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: tab === t.id ? 600 : 400,
                background: tab === t.id ? t.color : 'transparent',
                color: tab === t.id ? '#fff' : '#94a3b8',
                textAlign: 'left',
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={e => {
                if (tab !== t.id) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                  e.currentTarget.style.color = '#e2e8f0';
                }
              }}
              onMouseLeave={e => {
                if (tab !== t.id) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#94a3b8';
                }
              }}
            >
              <span style={{ fontSize: 18 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <p style={{ color: '#64748b', fontSize: 11, margin: 0 }}>Laime Torrez Lizeth Mireya</p>
        </div>
      </aside>

      {/* ── CONTENIDO ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        <header style={{
          background: '#fff',
          borderBottom: '1px solid #e2e8f0',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: tabActual.color, display: 'inline-block',
            }} />
            <span style={{ fontWeight: 600, fontSize: 15, color: '#1e293b' }}>{tabActual.label}</span>
          </div>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>
            {new Date().toLocaleDateString('es-BO', { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </span>
        </header>

        {}
        <main style={{ flex: 1, overflow: 'auto', padding: 24, background: '#f8fafc' }}>
          {children}
        </main>
      </div>
    </div>
  );
}