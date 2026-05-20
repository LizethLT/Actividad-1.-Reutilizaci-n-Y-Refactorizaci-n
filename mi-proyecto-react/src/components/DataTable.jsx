import { useState } from 'react';

export default function DataTable({ columns, data, pageSize = 10, onRowClick, emptyMessage = 'Sin registros' }) {
  const [page, setPage]       = useState(1);
  const [sortKey, setSortKey] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [filter, setFilter]   = useState('');

  const filtered = data.filter(row =>
    columns.some(col => String(row[col.key] ?? '').toLowerCase().includes(filter.toLowerCase()))
  );

  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
        const va = a[sortKey]; const vb = b[sortKey];
        return sortAsc ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
      })
    : filtered;

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated  = sorted.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const tdStyle = {
    padding: '8px 12px',
    borderBottom: '1px solid #d1d5db',
    fontSize: 13,
    color: '#111827',
    background: 'transparent',
  };
  const thStyle = {
    padding: '8px 12px',
    borderBottom: '2px solid #d1d5db',
    fontSize: 13,
    color: '#111827',
    background: '#e5e7eb',
    fontWeight: 600,
    cursor: 'pointer',
    userSelect: 'none',
  };

  return (
    <div style={{ background: '#ffffff', borderRadius: 8, padding: 12, border: '1px solid #e5e7eb' }}>
      <input
        placeholder="Buscar..."
        value={filter}
        onChange={e => { setFilter(e.target.value); setPage(1); }}
        style={{
          marginBottom: 10, padding: '6px 10px',
          border: '1px solid #d1d5db', borderRadius: 6,
          width: 240, color: '#111827', background: '#fff',
        }}
      />
      {paginated.length === 0 ? (
        <p style={{ color: '#6b7280', textAlign: 'center', padding: 20 }}>{emptyMessage}</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {columns.map(col => (
                  <th key={col.key} style={thStyle} onClick={() => col.sortable && handleSort(col.key)}>
                    {col.label} {sortKey === col.key ? (sortAsc ? '▲' : '▼') : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((row, i) => (
                <tr
                  key={i}
                  onClick={() => onRowClick?.(row)}
                  style={{
                    cursor: onRowClick ? 'pointer' : 'default',
                    background: i % 2 === 0 ? '#ffffff' : '#f9fafb',
                  }}
                >
                  {columns.map(col => <td key={col.key} style={tdStyle}>{row[col.key]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, fontSize: 13 }}>
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          style={{ padding: '4px 10px', cursor: 'pointer', borderRadius: 4, border: '1px solid #d1d5db', background: '#fff', color: '#6b6b6b' }}
        >
          Anterior
        </button>
        <span style={{ color: '#6b7280' }}>Página {page} de {totalPages || 1}</span>
        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
          style={{ padding: '4px 10px', cursor: 'pointer', borderRadius: 4, border: '1px solid #d1d5db', background: '#fff', color: '#7c7c7c' }}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}