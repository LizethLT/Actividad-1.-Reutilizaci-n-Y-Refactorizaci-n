 const necesitaRestock = (producto) =>
  producto.stock_actual <= producto.stock_minimo;
 
export function calcularRestock(productos) {
  if (!Array.isArray(productos)) return [];
  return productos.filter(necesitaRestock);
}