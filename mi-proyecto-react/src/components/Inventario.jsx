/* ANTES
import { useEffect, useState } from 'react';
import DataTable from './DataTable';
import { useInventory } from '../hooks/useInventory';
import { crearGenerador } from '../services/reportService';

const API = 'http://localhost:3001/api';
const columnas = [
  { key: 'nombre',       label: 'Producto',   sortable: true  },
  { key: 'categoria',    label: 'Categoría',  sortable: true  },
  { key: 'stock_actual', label: 'Stock',      sortable: true  },
  { key: 'stock_minimo', label: 'Mín.',       sortable: false },
  { key: 'precio',       label: 'Precio Bs.', sortable: true  },
  { key: 'alerta',       label: 'Estado',     sortable: false },
];

export default function Inventario() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({ nombre:'', categoria:'', stock_actual:0, stock_minimo:5, precio:0 });
  const { calculateRestock } = useInventory();

  const cargar = () =>
    fetch(`${API}/inventario`)
      .then(r => r.json())
      .then(json => {
        const data = json.data.map(p => ({
          ...p,
          alerta: p.stock_actual <= p.stock_minimo ? '⚠ Bajo stock' : '✓ OK',
        }));
        setProductos(data);
      });

  useEffect(() => { cargar(); }, []);

  const guardar = async () => {
    await fetch(`${API}/inventario`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ nombre:'', categoria:'', stock_actual:0, stock_minimo:5, precio:0 });
    cargar();
  };

  const restock = calculateRestock(productos);

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Inventario</h2>

      {restock.length > 0 && (
        <div style={{ background:'#fef3c7', border:'1px solid #fbbf24', borderRadius:8, padding:'10px 14px', marginBottom:16, fontSize:13 }}>
          ⚠ Productos con stock bajo: {restock.map(p => p.nombre).join(', ')}
        </div>
      )}

      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16 }}>
        {['nombre','categoria'].map(f => (
          <input key={f} placeholder={f} value={form[f]}
            onChange={e => setForm(p => ({...p, [f]: e.target.value}))}
            style={{ padding:'6px 10px', border:'1px solid #d1d5db', borderRadius:6, flex:1, minWidth:120 }}/>
        ))}
        {['stock_actual','stock_minimo','precio'].map(f => (
          <input key={f} type="number" placeholder={f} value={form[f]}
            onChange={e => setForm(p => ({...p, [f]: parseFloat(e.target.value)}))}
            style={{ padding:'6px 10px', border:'1px solid #d1d5db', borderRadius:6, width:100 }}/>
        ))}
        <button onClick={guardar}
          style={{ padding:'6px 14px', background:'#1d4ed8', color:'#fff', border:'none', borderRadius:6, cursor:'pointer' }}>
          Agregar
        </button>
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:12 }}>
        {['csv','excel','pdf'].map(fmt => (
          <button key={fmt} onClick={() => crearGenerador(fmt).generarReporte({ titulo:'Inventario', columnas: columnas.filter(c=>c.key!=='alerta'), datos: productos })}
            style={{ padding:'4px 10px', border:'1px solid #d1d5db', borderRadius:4, cursor:'pointer', fontSize:12 }}>
            Exportar {fmt.toUpperCase()}
          </button>
        ))}
      </div>

      <DataTable columns={columnas} data={productos} pageSize={8} />
    </div>
  );
} */

/* DESPUES */

import { useEffect, useState } from 'react';
import DataTable from './DataTable';
import { useInventory } from '../hooks/useInventory';
import { crearGenerador } from '../services/reportService';
import { apiFetch } from '../services/apiClient'; // ← Refactorización 1

const columnas = [
  { key: 'nombre',       label: 'Producto',   sortable: true  },
  { key: 'categoria',    label: 'Categoría',  sortable: true  },
  { key: 'stock_actual', label: 'Stock',      sortable: true  },
  { key: 'stock_minimo', label: 'Mín.',       sortable: false },
  { key: 'precio',       label: 'Precio Bs.', sortable: true  },
  { key: 'alerta',       label: 'Estado',     sortable: false },
];

export default function Inventario() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({ nombre:'', categoria:'', stock_actual:0, stock_minimo:5, precio:0 });
  const { calculateRestock } = useInventory();

  // apiFetch reemplaza: fetch(`${API}/inventario`).then(r=>r.json())
  const cargar = () =>
    apiFetch('/inventario').then(json => {
      const data = (json.data || []).map(p => ({
        ...p,
        alerta: p.stock_actual <= p.stock_minimo ? '⚠ Bajo stock' : '✓ OK',
      }));
      setProductos(data);
    });

  useEffect(() => { cargar(); }, []);

  const guardar = async () => {
    await apiFetch('/inventario', { method: 'POST', body: JSON.stringify(form) });
    setForm({ nombre:'', categoria:'', stock_actual:0, stock_minimo:5, precio:0 });
    cargar();
  };

  const restock = calculateRestock(productos);

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Inventario</h2>

      {restock.length > 0 && (
        <div style={{ background:'#fef3c7', border:'1px solid #fbbf24', borderRadius:8, padding:'10px 14px', marginBottom:16, fontSize:13 }}>
          ⚠ Productos con stock bajo: {restock.map(p => p.nombre).join(', ')}
        </div>
      )}

      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16 }}>
        {/* Inputs de texto (Nombre, Categoría) con fondo blanco forzado */}
        {['nombre','categoria'].map(f => (
          <input key={f} placeholder={f} value={form[f]}
            onChange={e => setForm(p => ({...p, [f]: e.target.value}))}
            style={{ padding:'6px 10px', border:'1px solid #d1d5db', borderRadius:6, flex:1, minWidth:120, background:'#ffffff', color:'#111827' }}/>
        ))}
        
        {/* Inputs numéricos (Stock, Mínimo, Precio) con fondo blanco forzado */}
        {['stock_actual','stock_minimo','precio'].map(f => (
          <input key={f} type="number" placeholder={f} value={form[f]}
            onChange={e => setForm(p => ({...p, [f]: parseFloat(e.target.value)}))}
            style={{ padding:'6px 10px', border:'1px solid #d1d5db', borderRadius:6, width:100, background:'#ffffff', color:'#111827' }}/>
        ))}
        <button onClick={guardar}
          style={{ padding:'6px 14px', background:'#1d4ed8', color:'#fff', border:'none', borderRadius:6, cursor:'pointer' }}>
          Agregar
        </button>
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:12 }}>
        {['csv','excel','pdf'].map(fmt => (
          <button key={fmt}
            onClick={() => crearGenerador(fmt).generarReporte({ titulo:'Inventario', columnas: columnas.filter(c=>c.key!=='alerta'), datos: productos })}
            style={{ padding:'4px 10px', border:'1px solid #d1d5db', borderRadius:4, cursor:'pointer', fontSize:12 }}>
            Exportar {fmt.toUpperCase()}
          </button>
        ))}
      </div>

      <DataTable columns={columnas} data={productos} pageSize={8} />
    </div>
  );
}