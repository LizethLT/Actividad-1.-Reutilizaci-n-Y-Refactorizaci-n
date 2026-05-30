const { Router } = require('express');
const router = Router();
router.use('/inventario', require('./inventarioRoutes'));
router.use('/ventas',     require('./ventasRoutes'));
router.use('/facturas',   require('./facturacionRoutes'));
module.exports = router;