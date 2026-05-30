const estiloInput = { padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 6, color: '#111827', background: '#fff' };
const estiloBtn   = (bg) => ({ padding: '6px 14px', background: bg, color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 });

export default function FormProducto({ form, setForm, editId, onGuardar, onCancelar }) {
  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '14px 16px', marginBottom: 16 }}>
      <p style={{ margin: '0 0 10px', fontWeight: 600, fontSize: 14, color: '#1e293b' }}>
        {editId ? `✏ Editando producto (ID: ${editId})` : '＋ Agregar nuevo producto'}
      </p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <input placeholder="Nombre *" value={form.nombre}
          onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
          style={{ ...estiloInput, flex: 2, minWidth: 140 }} />
        <input placeholder="Categoría" value={form.categoria}
          onChange={e => setForm(p => ({ ...p, categoria: e.target.value }))}
          style={{ ...estiloInput, flex: 1, minWidth: 120 }} />
        <input type="number" placeholder="Stock" value={form.stock_actual}
          onChange={e => setForm(p => ({ ...p, stock_actual: parseInt(e.target.value) || 0 }))}
          style={{ ...estiloInput, width: 80 }} />
        <input type="number" placeholder="Mín." value={form.stock_minimo}
          onChange={e => setForm(p => ({ ...p, stock_minimo: parseInt(e.target.value) || 0 }))}
          style={{ ...estiloInput, width: 70 }} />
        <input type="number" placeholder="Precio *" value={form.precio}
          onChange={e => setForm(p => ({ ...p, precio: parseFloat(e.target.value) || 0 }))}
          style={{ ...estiloInput, width: 90 }} />
        <button onClick={onGuardar} style={estiloBtn(editId ? '#0284c7' : '#1d4ed8')}>
          {editId ? 'Guardar cambios' : 'Agregar'}
        </button>
        {editId && <button onClick={onCancelar} style={estiloBtn('#6b7280')}>Cancelar</button>}
      </div>
    </div>
  );
}