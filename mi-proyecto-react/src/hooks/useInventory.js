import { useState, useCallback } from 'react';

const API = 'http://localhost:3001/api';

export function useInventory() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const checkStock = useCallback(async (productoId, cantidad) => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/inventario/${productoId}/stock?cantidad=${cantidad}`);
      const json = await res.json();
      return json.data?.disponible ?? false;
    } catch (e) {
      setError('Error al verificar stock: ' + e.message);
      return false;
    } finally { setLoading(false); }
  }, []);

  const calculateRestock = useCallback((productos) => {
    return productos.filter(p => p.stock_actual <= p.stock_minimo);
  }, []);

  const validateMovement = useCallback((tipo, cantidad) => {
    if (cantidad <= 0)
      return { valido: false, mensaje: 'La cantidad debe ser mayor a 0.' };
    if (tipo !== 'entrada' && tipo !== 'salida')
      return { valido: false, mensaje: 'Tipo de movimiento no reconocido.' };
    return { valido: true, mensaje: 'Movimiento válido.' };
  }, []);

  return { checkStock, calculateRestock, validateMovement, loading, error };
}