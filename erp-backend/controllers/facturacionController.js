const svc = require('../services/facturacionService');
const { ok, created, badReq, serverErr } = require('../base/baseController');

async function listar(req, res) {
  try {
    return ok(res, await svc.obtenerTodas(), 'Facturas obtenidas');
  } catch (e) { return serverErr(res, e.message); }
}

async function emitir(req, res) {
  const { venta_id, nit } = req.body;
  if (!venta_id)      return badReq(res, 'El ID de venta es obligatorio');
  if (!nit?.trim())   return badReq(res, 'El NIT es obligatorio');
  try {
    const resultado = await svc.emitir({ venta_id: parseInt(venta_id), nit: nit.trim() });
    return created(res, resultado, 'Factura emitida');
  } catch (e) {
    if (e.message === 'VENTA_NO_ENCONTRADA') return badReq(res, 'La venta no existe');
    return serverErr(res, e.message);
  }
}

module.exports = { listar, emitir };