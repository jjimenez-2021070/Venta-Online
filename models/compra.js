const { Schema, model } = require('mongoose');

const CompraSchema = Schema({
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  productos: [
    {
      producto: {
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
      },
      cantidad: { type: Number, default: 1 }
    }
  ],
  fecha: { type: Date, default: Date.now }
});

module.exports = model('Compra', CompraSchema);
