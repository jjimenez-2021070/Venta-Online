const { Schema, model } = require('mongoose');

const FacturaSchema = Schema({
    productos: [
        {
            producto: { type: Schema.Types.ObjectId, ref: 'Producto' },
            nombre: { type: String, required: true },
            cantidad: { type: Number, required: true },
            precio: { type: Number, required: true }
        }
    ],
    total: { type: Number, required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    fecha: { type: Date, default: Date.now }
});

module.exports = model('Factura', FacturaSchema);
