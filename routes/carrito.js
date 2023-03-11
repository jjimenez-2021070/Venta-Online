const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { agregarProductoCarrito, obtenerCarrito, eliminarProductoCarrito} = require('../controllers/carrito');

// Agregar un producto al carrito
router.post('/carrito/:idProducto', 
  [
    check('cantidad').isInt({ min: 1 }).withMessage('La cantidad debe ser mayor a cero')
  ],
  agregarProductoCarrito
);

// Obtener el carrito completo
router.get('/carrito', obtenerCarrito);

// Eliminar un producto del carrito
router.delete('/carrito/:idProducto', eliminarProductoCarrito);

module.exports = router;
