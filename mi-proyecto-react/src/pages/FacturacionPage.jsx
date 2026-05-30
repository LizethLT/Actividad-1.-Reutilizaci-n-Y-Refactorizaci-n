/*
import { useEffect, useState } from 'react';
import DataTable       from '../components/DataTable';
import BotonesExportar from '../components/BotonesExportar';
import { crearGenerador, generarFacturaPDF } from '../services/reportService';

const API = 'http://localhost:3001/api';

const COLUMNAS_TABLA = [
  { key: 'nro_factura',  label: 'N° Factura', sortable: true  },
  { key: 'cliente',      label: 'Cliente',    sortable: true  },
  { key: 'nit',          label: 'NIT',        sortable: false },
  { key: 'monto',        label: 'Monto Bs.',  sortable: true  },
  { key: 'estado_envio', label: 'Estado',     sortable: false },
  { key: 'emitida_en',   label: 'Emitida',    sortable: true  },
  { key: '_pdf',         label: 'Factura',    sortable: false },
];
const COLUMNAS_EXPORT = COLUMNAS_TABLA.filter(c => c.key !== '_pdf');

export default function FacturacionPage() {
  const [facturas, setFacturas] = useState([]);
  const [form, setForm]         = useState({ venta_id: '', cliente_id: 1, nit: '' });
  const [msg, setMsg]           = useState('');

  const cargar = () => {
    fetch(`${API}/facturas`, {
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(j => {
        const data = (j.data || []).map(f => ({
          ...f,
          _pdf: (
            <button
              onClick={() => generarFacturaPDF(f)}
              style={{
                padding: '3px 12px',
                borderRadius: 4,
                border: '1px solid #7c3aed',
                background: '#f5f3ff',
                color: '#7c3aed',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              📄 Ver PDF
            </button>
          ),
        }));
        setFacturas(data);
      });
  };

  useEffect(() => { cargar(); }, []);

  const emitir = async () => {
    if (!form.venta_id || !form.nit) return setMsg('Ingresa ID de venta y NIT');
    const res = await fetch(`${API}/facturas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        venta_id:   parseInt(form.venta_id),
        cliente_id: form.cliente_id,
        nit:        form.nit,
      }),
    });
    const json = await res.json();
    setMsg(json.success ? `Factura emitida: ${json.data.nro_factura}` : json.message);
    cargar();
  };

  const estiloInput = { padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 6, color: '#111827' };

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Facturación electrónica</h2>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12, alignItems: 'center' }}>
        <input
          placeholder="ID de venta" type="number" value={form.venta_id}
          onChange={e => setForm(p => ({ ...p, venta_id: e.target.value }))}
          style={{ ...estiloInput, width: 110 }}
        />
        <input
          placeholder="NIT del cliente" value={form.nit}
          onChange={e => setForm(p => ({ ...p, nit: e.target.value }))}
          style={{ ...estiloInput, flex: 1 }}
        />
        <button
          onClick={emitir}
          style={{ padding: '6px 14px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
        >
          Emitir factura
        </button>
      </div>
      {msg && (
        <p style={{ fontSize: 13, marginBottom: 12, color: msg.startsWith('Factura') ? '#059669' : '#dc2626' }}>
          {msg}
        </p>
      )}
      <BotonesExportar
        formatos={['csv', 'pdf']}
        onExportar={(fmt) => crearGenerador(fmt).generarReporte({
          titulo: 'Facturas_Emitidas',
          columnas: COLUMNAS_EXPORT,
          datos: facturas,
        })}
      />
      <DataTable columns={COLUMNAS_TABLA} data={facturas} pageSize={8} />
    </div>
  );
}*/


// Técnica aplicada: Extract Function + Extract Constant
import { useEffect, useState } from 'react';
import DataTable       from '../components/DataTable';
import BotonesExportar from '../components/BotonesExportar';
import { apiFetch }    from '../services/apiClient';
import { crearGenerador, generarFacturaPDF } from '../services/reportService';

const COLUMNAS_TABLA = [
  { key: 'nro_factura',  label: 'N° Factura', sortable: true  },
  { key: 'cliente',      label: 'Cliente',    sortable: true  },
  { key: 'nit',          label: 'NIT',        sortable: false },
  { key: 'monto',        label: 'Monto Bs.',  sortable: true  },
  { key: 'estado_envio', label: 'Estado',     sortable: false },
  { key: 'emitida_en',   label: 'Emitida',    sortable: true  },
  { key: '_pdf',         label: 'Factura',    sortable: false },
];
const COLUMNAS_EXPORT = COLUMNAS_TABLA.filter(c => c.key !== '_pdf');

export default function FacturacionPage() {
  const [facturas, setFacturas] = useState([]);
  const [form, setForm]         = useState({ venta_id: '', cliente_id: 1, nit: '' });
  const [msg, setMsg]           = useState('');

  const cargar = () =>
    apiFetch('/facturas').then(j => {
      const data = (j.data || []).map(f => ({
        ...f,
        _pdf: (
          <button
            onClick={() => generarFacturaPDF(f)}
            style={{
              padding: '3px 12px',
              borderRadius: 4,
              border: '1px solid #7c3aed',
              background: '#f5f3ff',
              color: '#7c3aed',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            📄 Ver PDF
          </button>
        ),
      }));
      setFacturas(data);
    });

  useEffect(() => { cargar(); }, []);

  const emitir = async () => {
    if (!form.venta_id || !form.nit) return setMsg('Ingresa ID de venta y NIT');
    const json = await apiFetch('/facturas', {
      method: 'POST',
      body: JSON.stringify({
        venta_id:   parseInt(form.venta_id),
        cliente_id: form.cliente_id,
        nit:        form.nit,
      }),
    });
    setMsg(json.success ? `Factura emitida: ${json.data.nro_factura}` : json.message);
    cargar();
  };

  const estiloInput = { padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 6, color: '#111827' };

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Facturación electrónica</h2>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12, alignItems: 'center' }}>
        <input
          placeholder="ID de venta" type="number" value={form.venta_id}
          onChange={e => setForm(p => ({ ...p, venta_id: e.target.value }))}
          style={{ ...estiloInput, width: 110 }}
        />
        <input
          placeholder="NIT del cliente" value={form.nit}
          onChange={e => setForm(p => ({ ...p, nit: e.target.value }))}
          style={{ ...estiloInput, flex: 1 }}
        />
        <button
          onClick={emitir}
          style={{ padding: '6px 14px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
        >
          Emitir factura
        </button>
      </div>
      {msg && (
        <p style={{ fontSize: 13, marginBottom: 12, color: msg.startsWith('Factura') ? '#059669' : '#dc2626' }}>
          {msg}
        </p>
      )}
      <BotonesExportar
        formatos={['csv', 'pdf']}
        onExportar={(fmt) => crearGenerador(fmt).generarReporte({
          titulo: 'Facturas_Emitidas',
          columnas: COLUMNAS_EXPORT,
          datos: facturas,
        })}
      />
      <DataTable columns={COLUMNAS_TABLA} data={facturas} pageSize={8} />
    </div>
  );
}