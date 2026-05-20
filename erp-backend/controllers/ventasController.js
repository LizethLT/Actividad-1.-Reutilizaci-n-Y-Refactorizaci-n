/* ANTES
const { getPool, sql } = require('../db/conexion');
const { ok, created, badReq, notFound, serverErr } = require('../base/baseController');

async function listar(req, res) {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT v.id, c.nombre AS cliente, v.fecha, v.total, v.estado
      FROM ventas v
      JOIN clientes c ON c.id = v.cliente_id
      ORDER BY v.fecha DESC
    `);
    return ok(res, result.recordset, 'Ventas obtenidas', { total: result.recordset.length });
  } catch (e) { return serverErr(res, e.message); }
}

async function crear(req, res) {
  const { cliente_id, items } = req.body;
  if (!cliente_id || !items?.length) return badReq(res, 'cliente_id e items son obligatorios');
  try {
    const pool = await getPool();

    // Verificar stock de cada ítem (usa la lógica de useInventory en el servidor)
    for (const item of items) {
      const stock = await pool.request()
        .input('id', sql.Int, item.producto_id)
        .query('SELECT stock_actual FROM productos WHERE id = @id');
      if (!stock.recordset.length) return notFound(res, `Producto ${item.producto_id} no existe`);
      if (stock.recordset[0].stock_actual < item.cantidad)
        return badReq(res, `Stock insuficiente para producto ${item.producto_id}`);
    }

    const total = items.reduce((s, i) => s + i.precio_unit * i.cantidad, 0);
    const venta = await pool.request()
      .input('cliente_id', sql.Int,     cliente_id)
      .input('total',      sql.Decimal, total)
      .query(`INSERT INTO ventas (cliente_id, total, estado)
              OUTPUT INSERTED.id VALUES (@cliente_id, @total, 'confirmada')`);
    const venta_id = venta.recordset[0].id;

    for (const item of items) {
      await pool.request()
        .input('venta_id',    sql.Int,     venta_id)
        .input('producto_id', sql.Int,     item.producto_id)
        .input('cantidad',    sql.Int,     item.cantidad)
        .input('precio_unit', sql.Decimal, item.precio_unit)
        .query(`INSERT INTO detalle_venta (venta_id,producto_id,cantidad,precio_unit)
                VALUES (@venta_id,@producto_id,@cantidad,@precio_unit)`);
      // Descontar stock
      await pool.request()
        .input('cantidad',    sql.Int, item.cantidad)
        .input('producto_id', sql.Int, item.producto_id)
        .query('UPDATE productos SET stock_actual = stock_actual - @cantidad WHERE id = @producto_id');
    }

    return created(res, { id: venta_id, total }, 'Venta creada');
  } catch (e) { return serverErr(res, e.message); }
}

module.exports = { listar, crear };

const { getPool, sql } = require('../db/conexion');
const { ok, created, badReq, notFound, serverErr } = require('../base/baseController');*/




 /* DESPUES */
// ─────────────────────────────────────────────────────────────
// Refactorización 2 — Extract Method
//
// BAD SMELL eliminado: "Long Method"
//   ANTES: crear() tenía 58 líneas con 4 responsabilidades mezcladas:
//     1. Validar request  2. Verificar stock  3. Insertar BD  4. Descontar stock
//   Era imposible testear cada parte por separado.
//
//   DESPUÉS: cada responsabilidad es una función independiente,
//     nombrada según lo que hace. crear() solo orquesta el flujo
//     y queda en 15 líneas legibles.
// ─────────────────────────────────────────────────────────────


// Extract Method 1: verifica stock de todos los ítems
async function verificarStock(pool, items) {
  for (const item of items) {
    const result = await pool.request()
      .input('id', sql.Int, item.producto_id)
      .query('SELECT stock_actual FROM productos WHERE id = @id');
    if (!result.recordset.length)
      return { error: `Producto ${item.producto_id} no existe`, tipo: 'notFound' };
    if (result.recordset[0].stock_actual < item.cantidad)
      return { error: `Stock insuficiente para producto ${item.producto_id}`, tipo: 'badReq' };
  }
  return { error: null };
}

// Extract Method 2: inserta el detalle de la venta y descuenta stock
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
      .query('UPDATE productos SET stock_actual = stock_actual - @cantidad WHERE id = @producto_id');
  }
}

// ── Controladores ────────────────────────────────────────────

async function listar(req, res) {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT v.id, c.nombre AS cliente, v.fecha, v.total, v.estado
      FROM ventas v JOIN clientes c ON c.id = v.cliente_id
      ORDER BY v.fecha DESC
    `);
    return ok(res, result.recordset, 'Ventas obtenidas', { total: result.recordset.length });
  } catch (e) { return serverErr(res, e.message); }
}

// crear() ahora solo orquesta — cada paso está en su propia función
async function crear(req, res) {
  const { cliente_id, items } = req.body;
  if (!cliente_id || !items?.length) return badReq(res, 'cliente_id e items son obligatorios');
  try {
    const pool = await getPool();

    const stockCheck = await verificarStock(pool, items);          // Extract Method 1
    if (stockCheck.error)
      return stockCheck.tipo === 'notFound'
        ? notFound(res, stockCheck.error)
        : badReq(res, stockCheck.error);

    const total = items.reduce((s, i) => s + i.precio_unit * i.cantidad, 0);
    const venta = await pool.request()
      .input('cliente_id', sql.Int,     cliente_id)
      .input('total',      sql.Decimal, total)
      .query(`INSERT INTO ventas (cliente_id,total,estado) OUTPUT INSERTED.id VALUES (@cliente_id,@total,'confirmada')`);

    await insertarDetalleYDescontarStock(pool, venta.recordset[0].id, items); // Extract Method 2

    return created(res, { id: venta.recordset[0].id, total }, 'Venta creada');
  } catch (e) { return serverErr(res, e.message); }
}

module.exports = { listar, crear };