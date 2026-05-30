const { Router } = require('express');
const ctrl = require('../controllers/ventasController');
const router = Router();
router.get('/',  ctrl.listar);
router.post('/', ctrl.crear);
module.exports = router;