import { validarMovimiento } from '../utils/validarMovimiento';

describe('validarMovimiento', () => {

  test('movimiento entrada con cantidad positiva es válido', () => {
    const resultado = validarMovimiento('entrada', 50);
    expect(resultado.valido).toBe(true);
    expect(resultado).toHaveProperty('mensaje');
  });

  test('movimiento salida con cantidad positiva es válido', () => {
    expect(validarMovimiento('salida', 10).valido).toBe(true);
  });

  test('cantidad cero es inválida', () => {
    const resultado = validarMovimiento('entrada', 0);
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toMatch(/mayor a 0/i);
  });

  test('tipo desconocido es inválido', () => {
    const resultado = validarMovimiento('transferencia', 10);
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toMatch(/no reconocido/i);
  });

  test('cantidad negativa es inválida', () => {
    expect(validarMovimiento('salida', -5).valido).toBe(false);
  });

});

