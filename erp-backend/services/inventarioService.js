const { getPool, sql } = require('../db/conexion');

async function obtenerTodos() {
  const pool   = await getPool();
  const result = await pool.request()
    .query('SELECT * FROM productos ORDER BY nombre');
  return result.recordset;
}

async function existeConNombre(nombre, excluirId = null) {
  const pool   = await getPool();
  const query  = excluirId
    ? 'SELECT id FROM productos WHERE LOWER(nombre)=LOWER(@nombre) AND id<>@id'
    : 'SELECT id FROM productos WHERE LOWER(nombre)=LOWER(@nombre)';
  const req = pool.request().input('nombre', sql.NVarChar, nombre.trim());
  if (excluirId) req.input('id', sql.Int, excluirId);
  const result = await req.query(query);
  return result.recordset.length > 0;
}

async function crear({ nombre, categoria, stock_actual, stock_minimo, precio }) {
  const pool   = await getPool();
  const result = await pool.request()
    .input('nombre',       sql.NVarChar, nombre.trim())
    .input('categoria',    sql.NVarChar, categoria || 'General')
    .input('stock_actual', sql.Int,      stock_actual || 0)
    .input('stock_minimo', sql.Int,      stock_minimo || 5)
    .input('precio',       sql.Decimal,  precio)
    .query(`INSERT INTO productos (nombre,categoria,stock_actual,stock_minimo,precio)
            OUTPUT INSERTED.* VALUES (@nombre,@categoria,@stock_actual,@stock_minimo,@precio)`);
  return result.recordset[0];
}

async function actualizar(id, { nombre, categoria, stock_actual, stock_minimo, precio }) {
  const pool   = await getPool();
  const result = await pool.request()
    .input('id',           sql.Int,      id)
    .input('nombre',       sql.NVarChar, nombre.trim())
    .input('categoria',    sql.NVarChar, categoria || 'General')
    .input('stock_actual', sql.Int,      stock_actual || 0)
    .input('stock_minimo', sql.Int,      stock_minimo || 5)
    .input('precio',       sql.Decimal,  precio)
    .query(`UPDATE productos SET nombre=@nombre,categoria=@categoria,
            stock_actual=@stock_actual,stock_minimo=@stock_minimo,precio=@precio
            OUTPUT INSERTED.* WHERE id=@id`);
  return result.recordset[0] || null;
}

async function eliminar(id) {
  const pool = await getPool();
  // Verificar si tiene ventas
  const ventas = await pool.request()
    .input('id', sql.Int, id)
    .query('SELECT TOP 1 id FROM detalle_venta WHERE producto_id=@id');
  if (ventas.recordset.length > 0) throw new Error('TIENE_VENTAS');
  const producto = await pool.request()
    .input('id', sql.Int, id)
    .query('SELECT nombre FROM productos WHERE id=@id');
  if (!producto.recordset.length) throw new Error('NO_ENCONTRADO');
  await pool.request().input('id', sql.Int, id)
    .query('DELETE FROM productos WHERE id=@id');
  return producto.recordset[0].nombre;
}

async function verificarStockDisponible(productoId, cantidad) {
  const pool   = await getPool();
  const result = await pool.request()
    .input('id', sql.Int, productoId)
    .query('SELECT stock_actual, stock_minimo FROM productos WHERE id=@id');
  if (!result.recordset.length) return null;
  const { stock_actual, stock_minimo } = result.recordset[0];
  return { disponible: stock_actual >= cantidad, stock_actual, stock_minimo, necesita_restock: stock_actual <= stock_minimo };
}

module.exports = { obtenerTodos, existeConNombre, crear, actualizar, eliminar, verificarStockDisponible };