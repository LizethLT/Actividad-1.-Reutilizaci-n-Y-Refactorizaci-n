const { getPool, sql } = require('../db/conexion');
const { ok, created, badReq, notFound, serverErr } = require('../base/baseController');

async function listar(req, res) {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM productos ORDER BY nombre');
    return ok(res, result.recordset, 'Productos obtenidos', { total: result.recordset.length });
  } catch (e) { return serverErr(res, e.message); }
}

async function crear(req, res) {
  const { nombre, categoria, stock_actual, stock_minimo, precio } = req.body;
  if (!nombre || !precio) return badReq(res, 'nombre y precio son obligatorios');
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('nombre',       sql.NVarChar, nombre)
      .input('categoria',    sql.NVarChar, categoria || 'General')
      .input('stock_actual', sql.Int,      stock_actual || 0)
      .input('stock_minimo', sql.Int,      stock_minimo || 5)
      .input('precio',       sql.Decimal,  precio)
      .query(`INSERT INTO productos (nombre,categoria,stock_actual,stock_minimo,precio)
              OUTPUT INSERTED.*
              VALUES (@nombre,@categoria,@stock_actual,@stock_minimo,@precio)`);
    return created(res, result.recordset[0], 'Producto creado');
  } catch (e) { return serverErr(res, e.message); }
}

async function checkStock(req, res) {
  const { id } = req.params;
  const cantidad = parseInt(req.query.cantidad) || 1;
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT stock_actual, stock_minimo FROM productos WHERE id = @id');
    if (!result.recordset.length) return notFound(res, 'Producto no encontrado');
    const { stock_actual, stock_minimo } = result.recordset[0];
    return ok(res, {
      disponible: stock_actual >= cantidad,
      stock_actual,
      stock_minimo,
      necesita_restock: stock_actual <= stock_minimo,
    });
  } catch (e) { return serverErr(res, e.message); }
}

module.exports = { listar, crear, checkStock };