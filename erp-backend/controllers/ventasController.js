const svc = require('../services/ventasService');
const { ok, created, badReq, notFound, serverErr } = require('../base/baseController');

async function listar(req, res) {
  try {
    return ok(res, await svc.obtenerTodas(), 'Ventas obtenidas');
  } catch (e) { return serverErr(res, e.message); }
}

async function crear(req, res) {
  const { cliente_nombre, items } = req.body;
  if (!cliente_nombre?.trim()) return badReq(res, 'El nombre del cliente es obligatorio');
  if (!items?.length)          return badReq(res, 'Debes incluir al menos un producto');
  try {
    const resultado = await svc.crear({ cliente_nombre: cliente_nombre.trim(), items });
    if (resultado.errorTipo === 'notFound') return notFound(res, resultado.errorMsg);
    if (resultado.errorTipo === 'badReq')   return badReq(res, resultado.errorMsg);
    return created(res, resultado, 'Venta creada');
  } catch (e) { return serverErr(res, e.message); }
}

module.exports = { listar, crear };