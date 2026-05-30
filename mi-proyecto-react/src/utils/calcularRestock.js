/*  FASE GREEN 

export function calcularRestock(productos) {
  return productos.filter(p => p.stock_actual <= p.stock_minimo);
}*/


// REFACTOR 
const necesitaRestock = (producto) =>
  producto.stock_actual <= producto.stock_minimo;
 
export function calcularRestock(productos) {
  // Validación defensiva: evita error si llega undefined o null
  if (!Array.isArray(productos)) return [];
  return productos.filter(necesitaRestock);
}