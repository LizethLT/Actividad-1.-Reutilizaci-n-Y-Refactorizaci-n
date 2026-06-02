import { useEffect, useState } from 'react';
import DataTable        from '../components/DataTable';
import BotonesExportar  from '../components/BotonesExportar';
import { useInventory } from '../hooks/useInventory';
import { apiFetch }     from '../services/apiClient';
import { crearGenerador } from '../services/reportService';

const COLUMNAS = [
  { key: 'id',      label: 'ID',      sortable: true  },
  { key: 'cliente', label: 'Cliente', sortable: true  },
  { key: 'fecha',   label: 'Fecha',   sortable: true  },
  { key: 'total',   label: 'Total',   sortable: true  },
  { key: 'estado',  label: 'Estado',  sortable: false },
];

export default function VentasPage() {
  const [ventas, setVentas]       = useState([]);
  const [productos, setProductos] = useState([]);
  
  const [form, setForm]           = useState({ cliente_nombre: '', producto_id: '', cantidad: 1 });
  const [msg, setMsg]             = useState('');
  const { checkStock }            = useInventory();

  const cargar = () => {

    apiFetch('/ventas').then(j => setVentas(j.data || []));
    apiFetch('/inventario').then(j => setProductos(j.data || []));
  };
  useEffect(() => { cargar(); }, []);

  const confirmar = async () => {
    if (!form.cliente_nombre.trim()) return setMsg('Ingresa el nombre de la Empresa');
    if (!form.producto_id)           return setMsg('Selecciona un producto');
    const producto = productos.find(p => p.id === parseInt(form.producto_id));
    const hayStock = await checkStock(form.producto_id, form.cantidad);
    if (!hayStock) return setMsg('Stock insuficiente para confirmar la venta');

    const json = await apiFetch('/ventas', {
      method: 'POST',
      body: JSON.stringify({
        cliente_nombre: form.cliente_nombre.trim(),
        items: [{ producto_id: parseInt(form.producto_id), cantidad: form.cantidad, precio_unit: producto.precio }],
      }),
    });
    setMsg(json.success
      ? `Venta #${json.data.id} creada — Total: Bs. ${json.data.total}`
      : json.message);
    if (json.success) setForm({ cliente_nombre: '', producto_id: '', cantidad: 1 });
    cargar();
  };

  const estiloInput = { padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 6, color: '#111827' };

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Ventas</h2>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12, alignItems: 'center' }}>
        {/* Input libre — cualquier cliente sin lista fija */}
        <input
          placeholder="Nombre de la Empresa"
          value={form.cliente_nombre}
          onChange={e => setForm(p => ({ ...p, cliente_nombre: e.target.value }))}
          style={{ ...estiloInput, minWidth: 200 }}
        />
        <select
          value={form.producto_id}
          onChange={e => setForm(p => ({ ...p, producto_id: e.target.value }))}
          style={{ ...estiloInput, flex: 1 }}
        >
          <option value="">— Seleccionar producto —</option>
          {productos.map(p => (
            <option key={p.id} value={p.id}>
              {p.nombre} (Stock: {p.stock_actual})
            </option>
          ))}
        </select>
        <input
          type="number" min={1} value={form.cantidad}
          onChange={e => setForm(p => ({ ...p, cantidad: parseInt(e.target.value) }))}
          style={{ ...estiloInput, width: 70 }}
        />
        <button
          onClick={confirmar}
          style={{ padding: '6px 14px', background: '#059669', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
        >
          Confirmar venta
        </button>
      </div>
      {msg && (
        <p style={{ fontSize: 13, marginBottom: 12, color: msg.includes('insuficiente') || msg.includes('Ingresa') ? '#dc2626' : '#059669' }}>
          {msg}
        </p>
      )}
      <BotonesExportar
        formatos={['csv', 'excel']}
        onExportar={(fmt) => crearGenerador(fmt).generarReporte({
          titulo: 'Historial_Ventas',
          columnas: COLUMNAS,
          datos: ventas,
        })}
      />
      <DataTable columns={COLUMNAS} data={ventas} pageSize={8} />
    </div>
  );
}