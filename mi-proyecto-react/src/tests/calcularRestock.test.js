function calculateRestock(productos) {
  if (!Array.isArray(productos)) return [];
  return productos.filter(p => p.stock_actual <= p.stock_minimo);
}

describe('calculateRestock — Prueba Unitaria', () => {

  test('CP-006: Detecta correctamente los productos que necesitan restock', () => {
    const productos = [
      { id: 1, nombre: 'Cable eléctrico 2.6', stock_actual: 290, stock_minimo: 30 },
      { id: 2, nombre: 'Soldadura 6013 kg',   stock_actual: 8,   stock_minimo: 5  },
      { id: 3, nombre: 'Plancha de acero 3mm',stock_actual: 15,  stock_minimo: 5  },
    ];

    // Act
    const resultado = calculateRestock(productos);

    expect(resultado).toHaveLength(0);
  });

  test('CP-007: Incluye producto cuando stock_actual es igual a stock_minimo', () => {
    const productos = [
      { id: 1, nombre: 'Tornillo M8x50mm', stock_actual: 5, stock_minimo: 5 },
      { id: 2, nombre: 'Cable eléctrico',  stock_actual: 290, stock_minimo: 30 },
    ];

    const resultado = calculateRestock(productos);

    expect(resultado).toHaveLength(1);
    expect(resultado[0].nombre).toBe('Tornillo M8x50mm');
  });

  test('CP-008: Incluye producto cuando stock_actual es menor al stock_minimo', () => {
    const productos = [
      { id: 1, nombre: 'Pintura esmalte 1L', stock_actual: 2, stock_minimo: 10 },
    ];

    const resultado = calculateRestock(productos);

    expect(resultado).toHaveLength(1);
    expect(resultado[0].id).toBe(1);
  });

  test('CP-009: Retorna lista vacía cuando todos tienen stock suficiente', () => {
    const productos = [
      { id: 1, nombre: 'Cable eléctrico', stock_actual: 290, stock_minimo: 30 },
      { id: 2, nombre: 'Tornillo M8',     stock_actual: 190, stock_minimo: 20 },
    ];

    const resultado = calculateRestock(productos);

    expect(resultado).toHaveLength(0);
  });

  test('CP-010: Retorna lista vacía cuando no hay productos', () => {
    const productos = [];

    const resultado = calculateRestock(productos);

    expect(resultado).toHaveLength(0);
  });

  test('CP-011: Retorna lista vacía cuando la entrada no es un array', () => {
    expect(calculateRestock(null)).toHaveLength(0);
    expect(calculateRestock(undefined)).toHaveLength(0);
    expect(calculateRestock('texto')).toHaveLength(0);
  });

});