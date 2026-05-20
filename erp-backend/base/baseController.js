/**
 * BaseController — Función genérica de respuesta HTTP
 * Tipo T = cualquier entidad: Producto, Venta, Factura, etc.
 * Todos los controladores usan estas funciones. Nunca construyen
 * su propia respuesta: eso garantiza estructura uniforme en toda la API.
 */

function sendResponse(res, statusCode, success, message, data = null, meta = {}) {
  return res.status(statusCode).json({
    success,
    statusCode,
    message,
    data,
    meta,
    timestamp: new Date().toISOString(),
  });
}

const ok        = (res, data, message = 'OK', meta = {}) => sendResponse(res, 200, true,  message, data, meta);
const created   = (res, data, message = 'Creado correctamente')       => sendResponse(res, 201, true,  message, data);
const badReq    = (res, message = 'Datos inválidos')                  => sendResponse(res, 400, false, message);
const notFound  = (res, message = 'Recurso no encontrado')            => sendResponse(res, 404, false, message);
const serverErr = (res, message = 'Error interno del servidor')       => sendResponse(res, 500, false, message);

module.exports = { ok, created, badReq, notFound, serverErr };


