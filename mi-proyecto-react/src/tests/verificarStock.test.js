function verificarStockDisponible(stockActual, stockMinimo, cantidadSolicitada) {
  if (cantidadSolicitada <= 0) return { valido: false, mensaje: 'La cantidad debe ser mayor a 0' };
  if (cantidadSolicitada > stockActual) return { valido: false, mensaje: 'Stock insuficiente' };
  if ((stockActual - cantidadSolicitada) <= stockMinimo) return { valido: true, alerta: true, mensaje: '⚠ Stock quedará bajo mínimo' };
  return { valido: true, alerta: false, mensaje: 'Stock suficiente' };
}

describe('verificarStockDisponible — Prueba Unitaria', () => {

  test('CP-001: Retorna válido cuando hay stock suficiente', () => {
    const stockActual     = 50;
    const stockMinimo     = 5;
    const cantidadPedida  = 10;

    const resultado = verificarStockDisponible(stockActual, stockMinimo, cantidadPedida);

    expect(resultado.valido).toBe(true);
    expect(resultado.alerta).toBe(false);
    expect(resultado.mensaje).toBe('Stock suficiente');
  });

  test('CP-002: Retorna inválido cuando cantidad supera stock actual', () => {
    const stockActual     = 5;
    const stockMinimo     = 2;
    const cantidadPedida  = 10;

    const resultado = verificarStockDisponible(stockActual, stockMinimo, cantidadPedida);

    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toBe('Stock insuficiente');
  });

  test('CP-003: Retorna alerta cuando stock quedará por debajo del mínimo', () => {
    const stockActual     = 10;
    const stockMinimo     = 8;
    const cantidadPedida  = 5;

    const resultado = verificarStockDisponible(stockActual, stockMinimo, cantidadPedida);

    expect(resultado.valido).toBe(true);
    expect(resultado.alerta).toBe(true);
    expect(resultado.mensaje).toBe('⚠ Stock quedará bajo mínimo');
  });

  test('CP-004: Retorna inválido cuando cantidad solicitada es 0 o negativa', () => {
    const stockActual     = 100;
    const stockMinimo     = 5;
    const cantidadPedida  = 0;

    const resultado = verificarStockDisponible(stockActual, stockMinimo, cantidadPedida);

    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toBe('La cantidad debe ser mayor a 0');
  });

  test('CP-005: Retorna inválido cuando se pide exactamente todo el stock disponible y quedaría en 0', () => {
    const stockActual     = 5;
    const stockMinimo     = 5;
    const cantidadPedida  = 5;

    const resultado = verificarStockDisponible(stockActual, stockMinimo, cantidadPedida);

    expect(resultado.valido).toBe(true);
    expect(resultado.alerta).toBe(true);
  });

});