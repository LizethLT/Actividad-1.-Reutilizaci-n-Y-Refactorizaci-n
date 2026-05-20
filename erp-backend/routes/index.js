const { Router } = require('express');
const inv = require('../controllers/inventarioController');
const ven = require('../controllers/ventasController');
const fac = require('../controllers/facturacionController');

const router = Router();

// ── Inventario ──────────────────────────────────────────────
router.get( '/inventario',              inv.listar);
router.post('/inventario',              inv.crear);
router.get( '/inventario/:id/stock',    inv.checkStock);

// ── Ventas ──────────────────────────────────────────────────
router.get( '/ventas',  ven.listar);
router.post('/ventas',  ven.crear);

// ── Facturación ─────────────────────────────────────────────
router.get( '/facturas', fac.listar);
router.post('/facturas', fac.emitir);

module.exports = router;