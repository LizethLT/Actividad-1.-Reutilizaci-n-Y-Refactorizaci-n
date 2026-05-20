// ─────────────────────────────────────────────────────────────
// apiClient.js — Refactorización: Extract Constant + Extract Function
//
// BAD SMELL eliminado: "Código duplicado"
//   ANTES: const API = 'http://localhost:3001/api' repetida en
//          Inventario.jsx, Ventas.jsx y Facturacion.jsx.
//          El patrón fetch(url).then(r=>r.json()) también
//          se copiaba en cada componente (6 veces en total).
//
//   DESPUÉS: Una única constante BASE_URL y una función apiFetch()
//            que centraliza la llamada HTTP. Si la URL cambia,
//            solo se modifica este archivo.
// ─────────────────────────────────────────────────────────────

// Extract Constant: un solo lugar para la URL base
export const BASE_URL = 'http://localhost:3001/api';

// Extract Function: encapsula fetch + manejo de respuesta JSON
export async function apiFetch(endpoint, options = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  return response.json();
}