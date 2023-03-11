const { Schema, model } = require('mongoose');

const CarritoSchema = Schema({
  productos: [{

    producto: {
      type: Schema.Types.ObjectId,

    },
    cantidad: {
      type: Number,
      required: true
    }
  }]
});

module.exports = model('Carrito', CarritoSchema);
