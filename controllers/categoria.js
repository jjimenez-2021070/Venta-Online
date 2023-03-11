const { request, response } = require('express');
const Categoria = require('../models/categoria');
const Producto = require('../models/producto');


const getCategorias = async (req = request, res = response) => {

     //condiciones del get
     const query = { estado: true };

     const listaCategorias = await Promise.all([
         Categoria.countDocuments(query),
         Categoria.find(query).populate('usuario', 'nombre')
     ]);
 
     res.json({
         msg: 'get Api - Controlador Usuario',
        listaCategorias
     });

}


const getCategoriaPorID = async (req = request, res = response) => {

   const { id } = req.params;
   const categoriaById = await Categoria.findById( id ).populate('usuario', 'nombre');

   res.status(201).json( categoriaById );

}


const postCategoria = async (req = request, res = response) => {
    //toUpperCase para todo a Mayusculas
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    //validacion para verificar si ya existe dicha categoria para que no lo agregue
    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);
    //Guardar en DB
    await categoria.save();

    res.status(201).json(categoria);

}


const putCategoria = async (req = request, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...resto } = req.body;

    resto.nombre = resto.nombre.toUpperCase();
    resto.usuario = req.usuario._id;

    //Editar o actualiar la cateogira
    const categoriaEditada = await Categoria.findByIdAndUpdate(id, resto, { new: true });

    res.status(201).json(categoriaEditada);

}

const DEFAULT_CATEGORY_NAME = 'CATEGORIAPORDEFECTO';

const deleteCategoria = async (req, res) => {
  const { id } = req.params;

  try {
    const [categoria, productos, categoriaEliminada] = await Promise.all([
      Categoria.findById(id),
      Producto.find({ categoria: id }),
      Categoria.findByIdAndUpdate(id, { estado: false }, { new: true })
    ]);

    if (!categoriaEliminada || categoriaEliminada.estado !== false) {
      return res.status(500).json({
        msg: 'Error al eliminar la categoría'
      });
    }

    if (productos.length > 0) {
      const defaultCategory = await Categoria.findOne({ nombre: DEFAULT_CATEGORY_NAME });
      if (!defaultCategory) {
        return res.status(500).json({
          msg: 'Categoria por defecto no encontrada'
        });
      }
      await Producto.updateMany({ categoria: id }, { categoria: defaultCategory._id });
    }

    res.status(201).json(categoriaEliminada);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'No se puedo eliminar categoria'
    });
  }
};





module.exports = {
    getCategorias,
    getCategoriaPorID,
    postCategoria,
    putCategoria,
    deleteCategoria
}
