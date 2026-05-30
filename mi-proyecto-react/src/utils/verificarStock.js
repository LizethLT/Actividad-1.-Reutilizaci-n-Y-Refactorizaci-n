/*  FASE GREEN — Segunda Ley del TDD
export function verificarStock(stock_actual, cantidad) {
  return stock_actual >= cantidad;
}*/

// REFACTOR 
 
export function verificarStock(stock_actual, cantidad) {
  const hayDisponibilidad = stock_actual >= cantidad;
  return hayDisponibilidad;
}