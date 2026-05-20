/* ANTES
import { useEffect, useState } from 'react';
import DataTable from './DataTable';
import { useInventory } from '../hooks/useInventory';
import { crearGenerador } from '../services/reportService';

const API = 'http://localhost:3001/api';
const columnas = [
  { key: 'id',      label: 'ID',      sortable: true  },
  { key: 'cliente', label: 'Cliente', sortable: true  },
  { key: 'fecha',   label: 'Fecha',   sortable: true  },
  { key: 'total',   label: 'Total',   sortable: true  },
  { key: 'estado',  label: 'Estado',  sortable: false },
];

export default function Ventas() {
  const [ventas, setVentas]       = useState([]);
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes]   = useState([{ id: 1, nombre: 'Industrias Quispe S.R.L.' }, { id: 2, nombre: 'Manufactura Torrez' }]);
  const [form, setForm] = useState({ cliente_id: 1, producto_id: '', cantidad: 1 });
  const [msg, setMsg]   = useState('');
  const { checkStock } = useInventory();

  const cargar = () => {
    fetch(`${API}/ventas`).then(r => r.json()).then(j => setVentas(j.data || []));
    fetch(`${API}/inventario`).then(r => r.json()).then(j => setProductos(j.data || []));
  };
  useEffect(() => { cargar(); }, []);

  const confirmar = async () => {
    if (!form.producto_id) return setMsg('Selecciona un producto');
    const producto = productos.find(p => p.id === parseInt(form.producto_id));
    const hayStock = await checkStock(form.producto_id, form.cantidad);
    if (!hayStock) return setMsg('Stock insuficiente para confirmar la venta');

    const res = await fetch(`${API}/ventas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cliente_id: form.cliente_id,
        items: [{ producto_id: parseInt(form.producto_id), cantidad: form.cantidad, precio_unit: producto.precio }],
      }),
    });
    const json = await res.json();
    setMsg(json.success ? `Venta #${json.data.id} creada — Total: Bs. ${json.data.total}` : json.message);
    cargar();
  };

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Ventas</h2>

      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:12, alignItems:'center' }}>
        <select value={form.cliente_id} onChange={e => setForm(p=>({...p, cliente_id: parseInt(e.target.value)}))}
          style={{ padding:'6px 10px', border:'1px solid #d1d5db', borderRadius:6 }}>
          {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
        <select value={form.producto_id} onChange={e => setForm(p=>({...p, producto_id: e.target.value}))}
          style={{ padding:'6px 10px', border:'1px solid #d1d5db', borderRadius:6, flex:1 }}>
          <option value="">— Seleccionar producto —</option>
          {productos.map(p => <option key={p.id} value={p.id}>{p.nombre} (Stock: {p.stock_actual})</option>)}
        </select>
        <input type="number" min={1} value={form.cantidad}
          onChange={e => setForm(p=>({...p, cantidad: parseInt(e.target.value)}))}
          style={{ width:70, padding:'6px 10px', border:'1px solid #d1d5db', borderRadius:6 }}/>
        <button onClick={confirmar}
          style={{ padding:'6px 14px', background:'#059669', color:'#fff', border:'none', borderRadius:6, cursor:'pointer' }}>
          Confirmar venta
        </button>
      </div>

      {msg && <p style={{ fontSize:13, marginBottom:12, color: msg.includes('insuficiente') ? '#dc2626' : '#059669' }}>{msg}</p>}

      <div style={{ display:'flex', gap:8, marginBottom:12 }}>
        {['csv','excel'].map(fmt => (
          <button key={fmt} onClick={() => crearGenerador(fmt).generarReporte({ titulo:'Historial_Ventas', columnas, datos: ventas })}
            style={{ padding:'4px 10px', border:'1px solid #d1d5db', borderRadius:4, cursor:'pointer', fontSize:12 }}>
            Exportar {fmt.toUpperCase()}
          </button>
        ))}
      </div>

      <DataTable columns={columnas} data={ventas} pageSize={8} />
    </div>
  );
}*/
/* DESPUES */
import { useEffect, useState } from 'react';
import DataTable from './DataTable';
import { useInventory } from '../hooks/useInventory';
import { crearGenerador } from '../services/reportService';
import { apiFetch } from '../services/apiClient'; // ← Refactorización 1

const columnas = [
  { key: 'id',      label: 'ID',      sortable: true  },
  { key: 'cliente', label: 'Cliente', sortable: true  },
  { key: 'fecha',   label: 'Fecha',   sortable: true  },
  { key: 'total',   label: 'Total',   sortable: true  },
  { key: 'estado',  label: 'Estado',  sortable: false },
];

export default function Ventas() {
  const [ventas, setVentas]       = useState([]);
  const [productos, setProductos] = useState([]);
  const [clientes]                = useState([{ id: 1, nombre: 'Industrias Quispe S.R.L.' }, { id: 2, nombre: 'Manufactura Torrez' }]);
  const [form, setForm]           = useState({ cliente_id: 1, producto_id: '', cantidad: 1 });
  const [msg, setMsg]             = useState('');
  const { checkStock }            = useInventory();

  // apiFetch reemplaza las dos llamadas fetch duplicadas
  const cargar = () => {
    apiFetch('/ventas').then(j => setVentas(j.data || []));
    apiFetch('/inventario').then(j => setProductos(j.data || []));
  };
  useEffect(() => { cargar(); }, []);

  const confirmar = async () => {
    if (!form.producto_id) return setMsg('Selecciona un producto');
    const producto = productos.find(p => p.id === parseInt(form.producto_id));
    const hayStock = await checkStock(form.producto_id, form.cantidad);
    if (!hayStock) return setMsg('Stock insuficiente para confirmar la venta');

    const json = await apiFetch('/ventas', {
      method: 'POST',
      body: JSON.stringify({
        cliente_id: form.cliente_id,
        items: [{ producto_id: parseInt(form.producto_id), cantidad: form.cantidad, precio_unit: producto.precio }],
      }),
    });
    setMsg(json.success ? `Venta #${json.data.id} creada — Total: Bs. ${json.data.total}` : json.message);
    cargar();
  };

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Ventas</h2>
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:12, alignItems:'center' }}>
        
        {/* Selector de Clientes con fondo blanco forzado */}
        <select value={form.cliente_id} onChange={e => setForm(p=>({...p, cliente_id: parseInt(e.target.value)}))}
          style={{ padding:'6px 10px', border:'1px solid #d1d5db', borderRadius:6, background:'#ffffff', color:'#111827' }}>
          {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>

        {/* Selector de Productos con fondo blanco forzado */}
        <select value={form.producto_id} onChange={e => setForm(p=>({...p, producto_id: e.target.value}))}
          style={{ padding:'6px 10px', border:'1px solid #d1d5db', borderRadius:6, flex:1, background:'#ffffff', color:'#111827' }}>
          <option value="">— Seleccionar producto —</option>
          {productos.map(p => <option key={p.id} value={p.id}>{p.nombre} (Stock: {p.stock_actual})</option>)}
        </select>

        {/* Input Numérico de Cantidad con fondo blanco forzado */}
        <input type="number" min={1} value={form.cantidad}
          onChange={e => setForm(p=>({...p, cantidad: parseInt(e.target.value)}))}
          style={{ width:70, padding:'6px 10px', border:'1px solid #d1d5db', borderRadius:6, background:'#ffffff', color:'#111827' }}/>
        
        <button onClick={confirmar}
          style={{ padding:'6px 14px', background:'#8efa00', color:'#000000', border:'none', borderRadius:6, cursor:'pointer' }}>
          Confirmar venta
        </button>
      </div>

      {msg && <p style={{ fontSize:13, marginBottom:12, color: msg.includes('insuficiente') ? '#dc2626' : '#26bd2d' }}>{msg}</p>}
      
      <div style={{ display:'flex', gap:8, marginBottom:12 }}>
        {['csv','excel'].map(fmt => (
          <button key={fmt} onClick={() => crearGenerador(fmt).generarReporte({ titulo:'Historial_Ventas', columnas, datos: ventas })}
            style={{ padding:'4px 10px', border:'1px solid #d1d5db', borderRadius:4, cursor:'pointer', fontSize:12 }}>
            Exportar {fmt.toUpperCase()}
          </button>
        ))}
      </div>
      <DataTable columns={columnas} data={ventas} pageSize={8} />
    </div>
  );
}