/* ANTES
import { useEffect, useState } from 'react';
import DataTable from './DataTable';
import { crearGenerador } from '../services/reportService';

const API = 'http://localhost:3001/api';
const columnas = [
  { key: 'nro_factura', label: 'N° Factura', sortable: true  },
  { key: 'cliente',     label: 'Cliente',    sortable: true  },
  { key: 'nit',         label: 'NIT',        sortable: false },
  { key: 'monto',       label: 'Monto Bs.',  sortable: true  },
  { key: 'estado_envio',label: 'Estado',     sortable: false },
  { key: 'emitida_en',  label: 'Emitida',    sortable: true  },
];

export default function Facturacion() {
  const [facturas, setFacturas] = useState([]);
  const [form, setForm] = useState({ venta_id: '', cliente_id: 1, nit: '' });
  const [msg, setMsg]   = useState('');

  const cargar = () =>
    fetch(`${API}/facturas`).then(r => r.json()).then(j => setFacturas(j.data || []));
  useEffect(() => { cargar(); }, []);

  const emitir = async () => {
    if (!form.venta_id || !form.nit) return setMsg('Ingresa ID de venta y NIT');
    const res = await fetch(`${API}/facturas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ venta_id: parseInt(form.venta_id), cliente_id: form.cliente_id, nit: form.nit }),
    });
    const json = await res.json();
    setMsg(json.success ? `Factura emitida: ${json.data.nro_factura}` : json.message);
    cargar();
  };

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Facturación electrónica</h2>

      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:12, alignItems:'center' }}>
        <input placeholder="ID de venta" type="number" value={form.venta_id}
          onChange={e => setForm(p=>({...p, venta_id: e.target.value}))}
          style={{ width:110, padding:'6px 10px', border:'1px solid #d1d5db', borderRadius:6 }}/>
        <input placeholder="NIT del cliente" value={form.nit}
          onChange={e => setForm(p=>({...p, nit: e.target.value}))}
          style={{ padding:'6px 10px', border:'1px solid #d1d5db', borderRadius:6, flex:1 }}/>
        <button onClick={emitir}
          style={{ padding:'6px 14px', background:'#7c3aed', color:'#fff', border:'none', borderRadius:6, cursor:'pointer' }}>
          Emitir factura
        </button>
      </div>

      {msg && <p style={{ fontSize:13, marginBottom:12, color: msg.startsWith('Factura') ? '#059669' : '#dc2626' }}>{msg}</p>}

      <div style={{ display:'flex', gap:8, marginBottom:12 }}>
        {['csv','pdf'].map(fmt => (
          <button key={fmt} onClick={() => crearGenerador(fmt).generarReporte({ titulo:'Facturas_Emitidas', columnas, datos: facturas })}
            style={{ padding:'4px 10px', border:'1px solid #d1d5db', borderRadius:4, cursor:'pointer', fontSize:12 }}>
            Exportar {fmt.toUpperCase()}
          </button>
        ))}
      </div>

      <DataTable columns={columnas} data={facturas} pageSize={8} />
    </div>
  );
}*/


/* DESPUES */ 
import { useEffect, useState } from 'react';
import DataTable from './DataTable';
import { crearGenerador } from '../services/reportService';
import { apiFetch } from '../services/apiClient'; // ← Refactorización 1

const columnas = [
  { key: 'nro_factura', label: 'N° Factura', sortable: true  },
  { key: 'cliente',     label: 'Cliente',    sortable: true  },
  { key: 'nit',         label: 'NIT',        sortable: false },
  { key: 'monto',       label: 'Monto Bs.',  sortable: true  },
  { key: 'estado_envio',label: 'Estado',     sortable: false },
  { key: 'emitida_en',  label: 'Emitida',    sortable: true  },
];

export default function Facturacion() {
  const [facturas, setFacturas] = useState([]);
  const [form, setForm] = useState({ venta_id: '', cliente_id: 1, nit: '' });
  const [msg, setMsg]   = useState('');

  // apiFetch reemplaza fetch('/facturas').then(r=>r.json())
  const cargar = () => apiFetch('/facturas').then(j => setFacturas(j.data || []));
  useEffect(() => { cargar(); }, []);

  const emitir = async () => {
    if (!form.venta_id || !form.nit) return setMsg('Ingresa ID de venta y NIT');
    const json = await apiFetch('/facturas', {
      method: 'POST',
      body: JSON.stringify({ venta_id: parseInt(form.venta_id), cliente_id: form.cliente_id, nit: form.nit }),
    });
    setMsg(json.success ? `Factura emitida: ${json.data.nro_factura}` : json.message);
    cargar();
  };

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Facturación electrónica</h2>
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:12, alignItems:'center' }}>
        
        {/* Input Numérico: ID de venta con fondo blanco forzado */}
        <input placeholder="ID de venta" type="number" value={form.venta_id}
          onChange={e => setForm(p=>({...p, venta_id: e.target.value}))}
          style={{ width:110, padding:'6px 10px', border:'1px solid #d1d5db', borderRadius:6, background:'#ffffff', color:'#111827' }}/>
        
        {/* Input de Texto: NIT con fondo blanco forzado */}
        <input placeholder="NIT del cliente" value={form.nit}
          onChange={e => setForm(p=>({...p, nit: e.target.value}))}
          style={{ padding:'6px 10px', border:'1px solid #d1d5db', borderRadius:6, flex:1, background:'#ffffff', color:'#111827' }}/>
        
        <button onClick={emitir}
          style={{ padding:'6px 14px', background:'#7c3aed', color:'#fff', border:'none', borderRadius:6, cursor:'pointer' }}>
          Emitir factura
        </button>
      </div>

      {msg && <p style={{ fontSize:13, marginBottom:12, color: msg.startsWith('Factura') ? '#059669' : '#dc2626' }}>{msg}</p>}
      
      <div style={{ display:'flex', gap:8, marginBottom:12 }}>
        {['csv','pdf'].map(fmt => (
          <button key={fmt} onClick={() => crearGenerador(fmt).generarReporte({ titulo:'Facturas_Emitidas', columnas, datos: facturas })}
            style={{ padding:'4px 10px', border:'1px solid #d1d5db', borderRadius:4, cursor:'pointer', fontSize:12 }}>
            Exportar {fmt.toUpperCase()}
          </button>
        ))}
      </div>
      <DataTable columns={columnas} data={facturas} pageSize={8} />
    </div>
  );
}