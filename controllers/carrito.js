const Carrito = require('../models/carrito');
const Producto = require('../models/producto');
const { validationResult } = require('express-validator');

// Agregar un producto al carrito
exports.agregarProductoCarrito = async (req, res) => {
  // Revisar si hay errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const idProducto = req.params.idProducto;
  const cantidad = req.body.cantidad;

  try {
    // Buscamos el producto por su ID
    const producto = await Producto.findById(idProducto);
    if (!producto) {
      return res.status(404).json({ msg: 'Producto no encontrado' });
    }

    // Agregamos el producto al carrito
    let carrito = await Carrito.findOne({});
    if (!carrito) {
      // Si el carrito no existe, lo creamos
      carrito = new Carrito();
    }
    const productoEnCarrito = carrito.productos.find(productoCarrito => productoCarrito.producto.toString() === idProducto);
    if (productoEnCarrito) {
      // Si el producto ya está en el carrito, sumamos la cantidad
      productoEnCarrito.cantidad += cantidad;
    } else {
      // Si el producto no está en el carrito, lo agregamos
      carrito.productos.push({ producto: idProducto, cantidad });
    }
    await carrito.save();
    res.json(carrito);
  } catch (error) {
    console.error(error);
    res.status(500).send('Hubo un error');
  }
};

// Obtener el carrito completo
exports.obtenerCarrito = async (req, res) => {
  try {
    const carrito = await Carrito.findOne({});
    if (!carrito) {
      return res.json({ productos: [] });
    }
    res.json(carrito);
  } catch (error) {
    console.error(error);
    res.status(500).send('Hubo un error');
  }
};

// Eliminar un producto del carrito
exports.eliminarProductoCarrito = async (req, res) => {
  const idProducto = req.params.idProducto;

  try {
    // Buscamos el producto por su ID
    const producto = await Producto.findById(idProducto);
    if (!producto) {
      return res.status(404).json({ msg: 'Producto no encontrado' });
    }

    // Eliminamos el producto del carrito
    const carrito = await Carrito.findOne({});
    if (!carrito) {
      return res.json({ productos: [] });
    }
    carrito.productos = carrito.productos.filter(productoCarrito => productoCarrito.producto.toString() !== idProducto);
    await carrito.save();
    res.json(carrito);
  } catch (error) {
    console.error(error);
    res.status(500).send('Hubo un error');
  }
};
