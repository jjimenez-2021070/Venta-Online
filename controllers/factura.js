const Carrito = require('../models/carrito');
const Producto = require('../models/producto');
const Factura = require('../models/factura');
const { validationResult } = require('express-validator');

exports.createFactura = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const carritoId = req.body.carritoId;

    try {
        const carrito = await Carrito.findById(carritoId).populate('productos.producto');
        if (!carrito) {
            return res.status(404).json({ msg: 'Carrito de compras no encontrado' });
        }

        for (const productoCarrito of carrito.productos) {
            const producto = productoCarrito.producto;
            const cantidad = productoCarrito.cantidad;
            if (producto.stock < cantidad) {
                return res.status(400).json({ msg: 'No hay suficiente stock para el producto ' + producto.nombre });
            }
        }

        const factura = new Factura({
            productos: [],
            total: 0,
            usuario: req.usuario.id
        });

        let totalFactura = 0;

        /*for (const productoCarrito of carrito.productos) {
            const producto = productoCarrito.producto;
            const cantidad = productoCarrito.cantidad;

            producto.stock -= cantidad;
            await producto.save();

            const productoFactura = {
                producto: producto._id,
                nombre: producto.nombre,
                cantidad: cantidad,
                precio: producto.precio
            };
            factura.productos.push(productoFactura);
            totalFactura += cantidad * producto.precio;
        }*/

        factura.total = totalFactura;
        await factura.save();

        carrito.productos = [];
        await carrito.save();

        res.json(factura);
    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error');
    }
};


// Editar una factura y validar el stock de los productos
exports.editFactura = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { productos } = req.body;

    try {
        // Obtener la factura
        const factura = await Factura.findById(id).populate('productos.producto');
        if (!factura) {
            return res.status(404).json({ msg: 'Factura no encontrada' });
        }

        // Validar el stock de los productos en la factura
        for (const productoFactura of factura.productos) {
            const producto = productoFactura.producto;
            const cantidadAnterior = productoFactura.cantidad;
            const cantidadNueva = productos.find(p => p.producto === producto._id).cantidad;
            const diferencia = cantidadNueva - cantidadAnterior;
            if (producto.stock < diferencia) {
                return res.status(400).json({ msg: 'No hay suficiente stock para el producto ' + producto.nombre });
            }
        }

        // Actualizar los productos de la factura y restar el stock de los productos en el inventario
        let totalFactura = 0;
        for (const productoFactura of factura.productos) {
            const producto = productoFactura.producto;
            const cantidadAnterior = productoFactura.cantidad;
            const cantidadNueva = productos.find(p => p.producto === producto._id).cantidad;
            const diferencia = cantidadNueva - cantidadAnterior;

            // Restar la cantidad del stock del producto
            producto.stock -= diferencia;
            await producto.save();

            // Actualizar la cantidad del producto en la factura
            productoFactura.cantidad = cantidadNueva;

            totalFactura += cantidadNueva * producto.precio;
        }

        // Actualizar el total de la factura y guardar los cambios
        factura.total = totalFactura;
        await factura.save();

        res.json(factura);
    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error');
    }
};


exports.getProductosCompradosPorUsuario = async (req, res) => {
    const usuarioId = req.params.usuarioId;

    try {
        // Obtener todas las facturas del usuario
        const facturas = await Factura.find({ usuario: usuarioId }).populate('productos.producto');
        if (!facturas || facturas.length === 0) {
            return res.status(404).json({ msg: 'No se encontraron facturas para este usuario' });
        }

        // Crear un arreglo con los productos comprados
        const productosComprados = [];
        for (const factura of facturas) {
            for (const productoFactura of factura.productos) {
                const producto = productoFactura.producto;
                const cantidad = productoFactura.cantidad;
                productosComprados.push({
                    nombre: producto.nombre,
                    cantidad: cantidad,
                    precio: producto.precio,
                    fecha: factura.fecha
                });
            }
        }

        res.json(productosComprados);
    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error');
    }
};
