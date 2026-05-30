//  FASE RED — Primera Ley del TDD
import { calcularRestock } from '../utils/calcularRestock';

describe('calcularRestock', () => {

  test('retorna productos con stock_actual <= stock_minimo', () => {
    const productos = [
      { nombre: 'Tornillo M8', stock_actual: 3,  stock_minimo: 20 },
      { nombre: 'Pintura 1L',  stock_actual: 50, stock_minimo: 10 },
      { nombre: 'Cable 2.5mm', stock_actual: 5,  stock_minimo: 5  },
    ];
    const resultado = calcularRestock(productos);
    const nombres   = resultado.map(p => p.nombre);

    expect(nombres).toContain('Tornillo M8');
    expect(nombres).toContain('Cable 2.5mm');
    expect(nombres).not.toContain('Pintura 1L');
  });

  test('retorna lista vacía si todos tienen stock suficiente', () => {
    const productos = [{ nombre: 'Soldadura', stock_actual: 100, stock_minimo: 5 }];
    expect(calcularRestock(productos)).toEqual([]);
  });

  test('retorna lista vacía si recibe array vacío', () => {
    expect(calcularRestock([])).toEqual([]);
  });

});