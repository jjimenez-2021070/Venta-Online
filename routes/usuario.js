//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { postCliente ,getUsuarios, postUsuario, putUsuario, deleteUsuario,editarPerfil, eliminarPerfil } = require('../controllers/usuario');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/mostrar', getUsuarios);

// Ruta para registrar un nuevo cliente
router.post('/clientes', postCliente);

router.post('/agregar', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 digitos').isLength( { min: 6 } ),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom( emailExiste ),
    //check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE', 'PROFESOR_ROLE']),
    check('rol').custom(  esRoleValido ),
    validarCampos,
] ,postUsuario);

router.put('/editar/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check('rol').custom(  esRoleValido ),
    validarCampos
] ,putUsuario);


router.delete('/eliminar/:id', [
    validarJWT,
    //esAdminRole,
    tieneRole('ADMIN_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
] ,deleteUsuario);

router.put('/editarPerfil',
    [
      validarJWT,
      check('nombre', 'El nombre es obligatorio').not().isEmpty(),
      check('correo', 'El correo no es válido').isEmail(),
      check('password', 'El password debe tener al menos 6 caracteres').isLength({ min: 6 }),
      validarCampos,
    ],
    editarPerfil
  );
  
  router.delete('/eliminarPerfil', validarJWT, eliminarPerfil);


module.exports = router;


// ROUTES