import { useState } from 'react';
import Inventario   from './components/Inventario';
import Ventas       from './components/Ventas';
import Facturacion  from './components/Facturacion';

const tabs = [
  { id: 'inventario',  label: 'Inventario',            color: '#1d4ed8' },
  { id: 'ventas',      label: 'Ventas',                color: '#14b622' },
  { id: 'facturacion', label: 'Facturación electrónica',color: '#7c3aed' },
];

export default function App() {
  const [tab, setTab] = useState('inventario');

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: '100vh', background: '#abe0f5' }}>
      <header style={{ background: '#4c5769', color: '#ffffff', padding: '14px 24px', display:'flex', alignItems:'center', gap:16 }}>
        <span style={{ fontWeight: 700, fontSize: 18 }}>ERP PyMEs — Sector Industrial</span>
        <span style={{ fontSize: 12, color: '#94a3b8' }}></span>
      </header>

      <nav style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 24px', display:'flex', gap:0 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              padding: '12px 20px', border: 'none', background: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: tab === t.id ? 600 : 400,
              color: tab === t.id ? t.color : '#64748b',
              borderBottom: tab === t.id ? `2px solid ${t.color}` : '2px solid transparent',
            }}>
            {t.label}
          </button>
        ))}
      </nav>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
        {tab === 'inventario'  && <Inventario />}
        {tab === 'ventas'      && <Ventas />}
        {tab === 'facturacion' && <Facturacion />}
      </main>
    </div>
  );
}