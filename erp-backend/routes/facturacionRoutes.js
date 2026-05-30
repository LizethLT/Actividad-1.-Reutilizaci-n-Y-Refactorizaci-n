const { Router } = require('express');
const ctrl = require('../controllers/facturacionController');
const router = Router();
router.get('/',  ctrl.listar);
router.post('/', ctrl.emitir);
module.exports = router;