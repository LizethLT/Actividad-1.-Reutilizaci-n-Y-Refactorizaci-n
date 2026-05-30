const { getPool, sql } = require('../db/conexion');

async function obtenerTodas() {
  const pool = await getPool();
  const result = await pool.request().query(`
    SELECT 
      f.id, 
      f.nro_factura, 
      COALESCE(v.cliente_nombre, c.nombre, 'Sin nombre') AS cliente,
      f.nit, 
      f.monto, 
      f.estado_envio, 
      f.emitida_en
    FROM facturas f
    LEFT JOIN ventas v   ON v.id = f.venta_id
    LEFT JOIN clientes c ON c.id = v.cliente_id
    ORDER BY f.emitida_en DESC`);
  return result.recordset;
}

async function emitir({ venta_id, cliente_id, nit }) {
  const pool  = await getPool();
  const venta = await pool.request()
    .input('id', sql.Int, venta_id)
    .query('SELECT total FROM ventas WHERE id=@id');
  if (!venta.recordset.length) throw new Error('VENTA_NO_ENCONTRADA');
  const nro    = 'FAC-' + String(Date.now()).slice(-8);
  const result = await pool.request()
    .input('nro_factura', sql.NVarChar, nro)
    .input('venta_id',    sql.Int,      venta_id)
    .input('cliente_id',  sql.Int,      cliente_id)
    .input('nit',         sql.NVarChar, nit)
    .input('monto',       sql.Decimal,  venta.recordset[0].total)
    .query(`INSERT INTO facturas (nro_factura, venta_id, cliente_id, nit, monto, estado_envio)
            OUTPUT INSERTED.*
            VALUES (@nro_factura, @venta_id, @cliente_id, @nit, @monto, 'enviada')`);
  return result.recordset[0];
}

module.exports = { obtenerTodas, emitir };