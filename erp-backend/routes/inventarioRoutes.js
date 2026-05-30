const { Router } = require('express');
const ctrl = require('../controllers/inventarioController');
const router = Router();

router.get('/',          ctrl.listar);
router.post('/',         ctrl.crear);
router.put('/:id',       ctrl.actualizar);
router.delete('/:id',    ctrl.eliminar);
router.get('/:id/stock', ctrl.checkStock);

module.exports = router;