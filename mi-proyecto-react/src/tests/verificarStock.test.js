//  FASE RED

import { verificarStock } from '../utils/verificarStock';

describe('verificarStock', () => {

  test('stock suficiente retorna true', () => {
    expect(verificarStock(100, 50)).toBe(true);
  });

  test('stock exactamente igual retorna true', () => {
    expect(verificarStock(10, 10)).toBe(true);
  });

  test('stock insuficiente retorna false', () => {
    expect(verificarStock(5, 10)).toBe(false);
  });

  test('stock cero retorna false para cantidad positiva', () => {
    expect(verificarStock(0, 1)).toBe(false);
  });

});