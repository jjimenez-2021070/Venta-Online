const { response } = require('express');
const Compra = require('../models/compra');
const Carrito = require('../models/carrito');



const comprar = async(req, res = response) => {
    try {
        
        const { usuario, productos } = req.body;
        

        // Crear compra
        const compra = new Compra({ usuario, productos });

        // Guardar en DB
        await compra.save();

        

        res.json({
            compra
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hubo un error al procesar la compra'
        })
    }
}

const obtenerCompras = async(req, res = response) => {
    try {
        const compras = await Compra.find().populate('usuario', 'nombre');

        res.json({
            compras
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hubo un error al obtener las compras'
        })
    }
}

module.exports = {
    comprar,
    obtenerCompras
}
