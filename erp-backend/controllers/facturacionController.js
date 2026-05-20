const { getPool, sql } = require('../db/conexion');
const { ok, created, badReq, notFound, serverErr } = require('../base/baseController');

async function listar(req, res) {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT f.id, f.nro_factura, c.nombre AS cliente, f.nit,
             f.monto, f.estado_envio, f.emitida_en
      FROM facturas f
      JOIN clientes c ON c.id = f.cliente_id
      ORDER BY f.emitida_en DESC
    `);
    return ok(res, result.recordset, 'Facturas obtenidas', { total: result.recordset.length });
  } catch (e) { return serverErr(res, e.message); }
}

async function emitir(req, res) {
  const { venta_id, cliente_id, nit } = req.body;
  if (!venta_id || !cliente_id || !nit) return badReq(res, 'venta_id, cliente_id y nit son obligatorios');
  try {
    const pool = await getPool();

    const venta = await pool.request()
      .input('id', sql.Int, venta_id)
      .query('SELECT total FROM ventas WHERE id = @id');
    if (!venta.recordset.length) return notFound(res, 'Venta no encontrada');

    const nro = 'FAC-' + String(Date.now()).slice(-8);
    const result = await pool.request()
      .input('nro_factura', sql.NVarChar, nro)
      .input('venta_id',    sql.Int,      venta_id)
      .input('cliente_id',  sql.Int,      cliente_id)
      .input('nit',         sql.NVarChar, nit)
      .input('monto',       sql.Decimal,  venta.recordset[0].total)
      .query(`INSERT INTO facturas (nro_factura, venta_id, cliente_id, nit, monto, estado_envio)
              OUTPUT INSERTED.*
              VALUES (@nro_factura, @venta_id, @cliente_id, @nit, @monto, 'enviada')`);
    return created(res, result.recordset[0], 'Factura emitida');
  } catch (e) { return serverErr(res, e.message); }
}

module.exports = { listar, emitir };