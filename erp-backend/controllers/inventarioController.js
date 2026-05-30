const svc = require('../services/inventarioService');
const { ok, created, badReq, notFound, serverErr } = require('../base/baseController');

async function listar(req, res) {
  try {
    const productos = await svc.obtenerTodos();
    return ok(res, productos, 'Productos obtenidos', { total: productos.length });
  } catch (e) { return serverErr(res, e.message); }
}

async function crear(req, res) {
  const { nombre, precio } = req.body;
  if (!nombre || !precio) return badReq(res, 'nombre y precio son obligatorios');
  try {
    if (await svc.existeConNombre(nombre))
      return badReq(res, `El producto "${nombre}" ya existe en el inventario`);
    const nuevo = await svc.crear(req.body);
    return created(res, nuevo, 'Producto creado');
  } catch (e) { return serverErr(res, e.message); }
}

async function actualizar(req, res) {
  const { nombre, precio } = req.body;
  if (!nombre || !precio) return badReq(res, 'nombre y precio son obligatorios');
  try {
    if (await svc.existeConNombre(nombre, req.params.id))
      return badReq(res, `Ya existe otro producto con el nombre "${nombre}"`);
    const actualizado = await svc.actualizar(req.params.id, req.body);
    if (!actualizado) return notFound(res, 'Producto no encontrado');
    return ok(res, actualizado, 'Producto actualizado');
  } catch (e) { return serverErr(res, e.message); }
}

async function eliminar(req, res) {
  try {
    const nombre = await svc.eliminar(req.params.id);
    return ok(res, { id: req.params.id }, `Producto "${nombre}" eliminado`);
  } catch (e) {
    if (e.message === 'TIENE_VENTAS')
      return badReq(res, 'No se puede eliminar: el producto tiene ventas registradas');
    if (e.message === 'NO_ENCONTRADO')
      return notFound(res, 'Producto no encontrado');
    return serverErr(res, e.message);
  }
}

async function checkStock(req, res) {
  try {
    const cantidad = parseInt(req.query.cantidad) || 1;
    const datos    = await svc.verificarStockDisponible(req.params.id, cantidad);
    if (!datos) return notFound(res, 'Producto no encontrado');
    return ok(res, datos);
  } catch (e) { return serverErr(res, e.message); }
}

module.exports = { listar, crear, actualizar, eliminar, checkStock };