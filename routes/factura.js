const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { createFactura, editFactura, getProductosCompradosPorUsuario } = require('../controllers/factura');

// Crea una factura
router.post('/',
    [
        validarJWT,
        check('carritoId', 'El ID del carrito es obligatorio').not().isEmpty()
    ],
    createFactura
);

// Edita una factura
router.put('/:id',
    [
        validarJWT,
        check('productos', 'Los productos son obligatorios').isArray({ min: 1 })
    ],
    editFactura
);

// Obtiene los productos comprados por un usuario
router.get('/usuario/:usuarioId',
    validarJWT,
    getProductosCompradosPorUsuario
);

module.exports = router;
