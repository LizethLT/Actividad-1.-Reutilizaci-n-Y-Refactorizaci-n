import { useEffect, useState } from 'react';
import DataTable        from '../components/DataTable';
import FormProducto     from '../components/FormProducto';
import AlertaRestock    from '../components/AlertaRestock';
import BotonesExportar  from '../components/BotonesExportar';
import { useInventory } from '../hooks/useInventory';
import { apiFetch }     from '../services/apiClient';
import { crearGenerador } from '../services/reportService';

const COLUMNAS = [
  { key: 'nombre',       label: 'Producto',   sortable: true  },
  { key: 'categoria',    label: 'Categoría',  sortable: true  },
  { key: 'stock_actual', label: 'Stock',      sortable: true  },
  { key: 'stock_minimo', label: 'Mín.',       sortable: false },
  { key: 'precio',       label: 'Precio Bs.', sortable: true  },
  { key: 'alerta',       label: 'Estado',     sortable: false },
  { key: '_acciones',    label: 'Acciones',   sortable: false },
];

const FORM_VACIO = { nombre: '', categoria: '', stock_actual: 0, stock_minimo: 5, precio: 0 };

export default function InventarioPage() {
  const [productos, setProductos] = useState([]);
  const [form, setForm]           = useState(FORM_VACIO);
  const [editId, setEditId]       = useState(null);
  const [msg, setMsg]             = useState({ texto: '', error: false });
  const { calculateRestock }      = useInventory();

  const cargar = () =>
    apiFetch('/inventario').then(json => {
      const data = (json.data || []).map(p => ({
        ...p,
        alerta: p.stock_actual <= p.stock_minimo ? '⚠ Bajo stock' : '✓ OK',
        _acciones: (
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => iniciarEdicion(p)}
              style={{ padding: '3px 10px', borderRadius: 4, border: '1px solid #3b82f6', background: '#eff6ff', color: '#1d4ed8', cursor: 'pointer', fontSize: 12 }}>
              ✏ Editar
            </button>
            <button onClick={() => eliminar(p.id, p.nombre)}
              style={{ padding: '3px 10px', borderRadius: 4, border: '1px solid #ef4444', background: '#fef2f2', color: '#dc2626', cursor: 'pointer', fontSize: 12 }}>
              🗑 Eliminar
            </button>
          </div>
        ),
      }));
      setProductos(data);
    });

  useEffect(() => { cargar(); }, []);

  const iniciarEdicion = (p) => {
    setEditId(p.id);
    setForm({ nombre: p.nombre, categoria: p.categoria, stock_actual: p.stock_actual, stock_minimo: p.stock_minimo, precio: p.precio });
    setMsg({ texto: '', error: false });
  };

  const cancelarEdicion = () => { setEditId(null); setForm(FORM_VACIO); setMsg({ texto: '', error: false }); };

  const guardar = async () => {
    if (!form.nombre.trim()) return setMsg({ texto: 'El nombre es obligatorio', error: true });
    if (!form.precio || form.precio <= 0) return setMsg({ texto: 'El precio debe ser mayor a 0', error: true });
    const json = await apiFetch(
      editId ? `/inventario/${editId}` : '/inventario',
      { method: editId ? 'PUT' : 'POST', body: JSON.stringify(form) }
    );
    if (!json.success) return setMsg({ texto: json.message, error: true });
    setMsg({ texto: editId ? 'Producto actualizado' : 'Producto agregado', error: false });
    setEditId(null); setForm(FORM_VACIO); cargar();
  };

  const eliminar = async (id, nombre) => {
    if (!window.confirm(`¿Eliminar "${nombre}"?`)) return;
    const json = await apiFetch(`/inventario/${id}`, { method: 'DELETE' });
    setMsg({ texto: json.success ? `"${nombre}" eliminado` : json.message, error: !json.success });
    cargar();
  };

  const restock = calculateRestock(productos);

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Inventario</h2>
      <AlertaRestock productos={restock} />
      {msg.texto && (
        <div style={{ background: msg.error ? '#fef2f2' : '#f0fdf4', border: `1px solid ${msg.error ? '#fca5a5' : '#86efac'}`, borderRadius: 8, padding: '10px 14px', marginBottom: 12, fontSize: 13, color: msg.error ? '#dc2626' : '#16a34a' }}>
          {msg.error ? '✗' : '✓'} {msg.texto}
        </div>
      )}
      <FormProducto form={form} setForm={setForm} editId={editId} onGuardar={guardar} onCancelar={cancelarEdicion} />
      <BotonesExportar
        formatos={['csv', 'excel', 'pdf']}
        onExportar={(fmt) => crearGenerador(fmt).generarReporte({
          titulo: 'Inventario',
          columnas: COLUMNAS.filter(c => !['alerta', '_acciones'].includes(c.key)),
          datos: productos,
        })}
      />
      <DataTable columns={COLUMNAS} data={productos} pageSize={8} />
    </div>
  );
}