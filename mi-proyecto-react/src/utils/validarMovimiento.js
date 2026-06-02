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