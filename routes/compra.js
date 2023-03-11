const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { comprar, obtenerCompras } = require('../controllers/compra');

const router = Router();

router.get('/', validarJWT, obtenerCompras);

router.post('/', [
    validarJWT,
    check('usuario', 'El id del usuario es obligatorio').not().isEmpty(),
    check('productos', 'La lista de productos es obligatoria').isArray({ min: 1 }),
    validarCampos
], comprar);

module.exports = router;
