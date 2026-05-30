/* 
const { getPool, sql } = require('../db/conexion');

async function obtenerTodas() {
  const pool   = await getPool();
  const result = await pool.request().query(`
    SELECT id, cliente_nombre AS cliente, fecha, total, estado
    FROM ventas
    ORDER BY fecha DESC`);
  return result.recordset;
}

async function crear({ cliente_nombre, items }) {
  const pool = await getPool();

  for (const item of items) {
    const result = await pool.request()
      .input('id', sql.Int, item.producto_id)
      .query('SELECT stock_actual FROM productos WHERE id=@id');
    if (!result.recordset.length)
      return { errorTipo: 'notFound', errorMsg: `Producto ${item.producto_id} no existe` };
    if (result.recordset[0].stock_actual < item.cantidad)
      return { errorTipo: 'badReq', errorMsg: `Stock insuficiente para producto ${item.producto_id}` };
  }

  const total = items.reduce((s, i) => s + i.precio_unit * i.cantidad, 0);

  const venta = await pool.request()
    .input('cliente_nombre', sql.NVarChar, cliente_nombre)
    .input('total',          sql.Decimal,  total)
    .query(`INSERT INTO ventas (cliente_nombre, total, estado)
            OUTPUT INSERTED.id
            VALUES (@cliente_nombre, @total, 'confirmada')`);
  const venta_id = venta.recordset[0].id;

  for (const item of items) {
    await pool.request()
      .input('venta_id',    sql.Int,     venta_id)
      .input('producto_id', sql.Int,     item.producto_id)
      .input('cantidad',    sql.Int,     item.cantidad)
      .input('precio_unit', sql.Decimal, item.precio_unit)
      .query(`INSERT INTO detalle_venta (venta_id,producto_id,cantidad,precio_unit)
              VALUES (@venta_id,@producto_id,@cantidad,@precio_unit)`);
    await pool.request()
      .input('cantidad',    sql.Int, item.cantidad)
      .input('producto_id', sql.Int, item.producto_id)
      .query('UPDATE productos SET stock_actual=stock_actual-@cantidad WHERE id=@producto_id');
  }

  return { id: venta_id, total, cliente_nombre };
}

module.exports = { obtenerTodas, crear };*/



// Técnica aplicada: Extract Method
const { getPool, sql } = require('../db/conexion');

async function obtenerTodas() {
  const pool   = await getPool();
  const result = await pool.request().query(`
    SELECT id, cliente_nombre AS cliente, fecha, total, estado
    FROM ventas
    ORDER BY fecha DESC`);
  return result.recordset;
}

async function verificarStockItems(pool, items) {
  for (const item of items) {
    const result = await pool.request()
      .input('id', sql.Int, item.producto_id)
      .query('SELECT stock_actual FROM productos WHERE id=@id');
    if (!result.recordset.length)
      return { error: `Producto ${item.producto_id} no existe`, tipo: 'notFound' };
    if (result.recordset[0].stock_actual < item.cantidad)
      return { error: `Stock insuficiente para producto ${item.producto_id}`, tipo: 'badReq' };
  }
  return { error: null };
}

async function insertarDetalleYDescontarStock(pool, venta_id, items) {
  for (const item of items) {
    await pool.request()
      .input('venta_id',    sql.Int,     venta_id)
      .input('producto_id', sql.Int,     item.producto_id)
      .input('cantidad',    sql.Int,     item.cantidad)
      .input('precio_unit', sql.Decimal, item.precio_unit)
      .query(`INSERT INTO detalle_venta (venta_id,producto_id,cantidad,precio_unit)
              VALUES (@venta_id,@producto_id,@cantidad,@precio_unit)`);
    await pool.request()
      .input('cantidad',    sql.Int, item.cantidad)
      .input('producto_id', sql.Int, item.producto_id)
      .query('UPDATE productos SET stock_actual=stock_actual-@cantidad WHERE id=@producto_id');
  }
}

async function crear({ cliente_nombre, items }) {
  const pool       = await getPool();
  const stockCheck = await verificarStockItems(pool, items);
  if (stockCheck.error) return { errorTipo: stockCheck.tipo, errorMsg: stockCheck.error };
  const total    = items.reduce((s, i) => s + i.precio_unit * i.cantidad, 0);
  const venta    = await pool.request()
    .input('cliente_nombre', sql.NVarChar, cliente_nombre)
    .input('total',          sql.Decimal,  total)
    .query(`INSERT INTO ventas (cliente_nombre, total, estado)
            OUTPUT INSERTED.id
            VALUES (@cliente_nombre, @total, 'confirmada')`);
  const venta_id = venta.recordset[0].id;
  await insertarDetalleYDescontarStock(pool, venta_id, items);
  return { id: venta_id, total, cliente_nombre };
}

module.exports = { obtenerTodas, crear };