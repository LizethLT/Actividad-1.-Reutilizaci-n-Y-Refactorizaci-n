export function verificarStock(stock_actual, cantidad) {
  const hayDisponibilidad = stock_actual >= cantidad;
  return hayDisponibilidad;
}