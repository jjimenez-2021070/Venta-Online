const { response, request } = require('express');
const bcrypt = require('bcryptjs');
//Importación del modelo
const Usuario = require('../models/usuario');

const postCliente = async (req = request, res = response) => {
    //Desestructuración
    const { nombre, correo, password } = req.body;
    const clienteGuardadoDB = new Usuario({ nombre, correo, password, rol: 'CLIENT_ROLE' });

    //Encriptar password
    const salt = bcrypt.genSaltSync();
    clienteGuardadoDB.password = bcrypt.hashSync(password, salt);

    //Guardar en BD
    await clienteGuardadoDB.save();

    res.json({
        msg: 'Post Api - Post Cliente',
        clienteGuardadoDB
    });
}


const getUsuarios = async (req = request, res = response) => {

    //condiciones del get
    const query = { estado: true };

    const listaUsuarios = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
    ]);

    res.json({
        msg: 'get Api - Controlador Usuario',
        listaUsuarios
    });


}

const postUsuario = async (req = request, res = response) => {

    //Desestructuración
    const { nombre, correo, password, rol } = req.body;
    const usuarioGuardadoDB = new Usuario({ nombre, correo, password, rol });

    //Encriptar password
    const salt = bcrypt.genSaltSync();
    usuarioGuardadoDB.password = bcrypt.hashSync(password, salt);

    //Guardar en BD
    await usuarioGuardadoDB.save();

    res.json({
        msg: 'Post Api - Post Usuario',
        usuarioGuardadoDB
    });


}

const putUsuario = async (req = request, res = response) => {

    //Req.params sirve para traer parametros de las rutas
    const { id } = req.params;
    const { _id, img, estado, google, ...resto } = req.body;

    const usuarioActual = req.usuario; // usuario que hace la petición
    const usuarioDB = await Usuario.findById(id); // usuario que se desea modificar

    if (usuarioActual.rol === 'ADMIN_ROLE' && usuarioDB.rol === 'ADMIN_ROLE') {
        return res.status(400).json({
            msg: 'No está autorizado para editar a un usuario con rol ADMIN_ROLE'
        });
    }

    //Si la password existe o viene en el req.body, la encripta
    if (resto.password) {
        //Encriptar password
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(resto.password, salt);
    }

    //Editar al usuario por el id
    const usuarioEditado = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        msg: 'PUT editar user',
        usuarioEditado
    });
}

const deleteUsuario = async (req = request, res = response) => {
    //Req.params sirve para traer parametros de las rutas
    const { id } = req.params;

    const usuarioActual = req.usuario; // usuario que hace la petición
    const usuarioDB = await Usuario.findById(id); // usuario que se desea eliminar

    if (usuarioActual.rol === 'ADMIN_ROLE' && usuarioDB.rol === 'ADMIN_ROLE') {
        return res.status(400).json({
            msg: 'No está autorizado para eliminar a un usuario con rol ADMIN_ROLE'
        });
    }

    //Eliminar cambiando el estado a false
    const usuarioEliminado = await Usuario.findByIdAndUpdate(id, { estado: false });

    res.json({
        msg: 'DELETE eliminar user',
        usuarioEliminado
    });
}

const editarPerfil = async (req = request, res = response) => {
    const { nombre, correo, password } = req.body;
    const usuarioActual = req.usuario;
    const usuarioDB = await Usuario.findById(usuarioActual._id);

    if (!usuarioDB) {
        return res.status(404).json({
            msg: 'El usuario no existe'
        });
    }

    usuarioDB.nombre = nombre;
    usuarioDB.correo = correo;

    if (password) {
        const salt = bcrypt.genSaltSync();
        usuarioDB.password = bcrypt.hashSync(password, salt);
    }

    const usuarioEditado = await usuarioDB.save();

    res.json({
        msg: 'Perfil editado',
        usuarioEditado
    });
};

const eliminarPerfil = async (req = request, res = response) => {
    const usuarioActual = req.usuario;
    const usuarioDB = await Usuario.findById(usuarioActual._id);

    if (!usuarioDB) {
        return res.status(404).json({
            msg: 'El usuario no existe'
        });
    }

    await usuarioDB.delete();

    res.json({
        msg: 'Perfil eliminado'
    });
};




module.exports = {
    getUsuarios,
    postUsuario,
    putUsuario,
    deleteUsuario,
    postCliente,
    editarPerfil,
    eliminarPerfil,
}


