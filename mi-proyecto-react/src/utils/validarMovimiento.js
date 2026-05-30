/*  FASE GREEN
export function validarMovimiento(tipo, cantidad) {
  if (cantidad <= 0)
    return { valido: false, mensaje: 'La cantidad debe ser mayor a 0.' };
  if (tipo !== 'entrada' && tipo !== 'salida')
    return { valido: false, mensaje: 'Tipo de movimiento no reconocido.' };
  return { valido: true, mensaje: 'Movimiento válido.' };
}*/

//  REFACTOR 
 
const TIPOS_VALIDOS = ['entrada', 'salida'];
 
export function validarMovimiento(tipo, cantidad) {
  const cantidadEsInvalida = cantidad <= 0;
  if (cantidadEsInvalida) {
    return {
      valido: false,
      mensaje: 'La cantidad debe ser mayor a 0.',
    };
  }
 
  const tipoEsValido = TIPOS_VALIDOS.includes(tipo);
  if (!tipoEsValido) {
    return {
      valido: false,
      mensaje: `Tipo de movimiento no reconocido. Use: ${TIPOS_VALIDOS.join(' o ')}.`,
    };
  }
 
  return {
    valido: true,
    mensaje: 'Movimiento validado correctamente.',
  };
}