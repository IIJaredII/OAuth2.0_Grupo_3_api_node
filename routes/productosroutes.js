const express = require('express');
const productoController = require('../controllers/productoscontrolador');
const auth = require("../middlewares/authenticate");
const verificarRol = require("../middlewares/verificarRol");

const router = express.Router();

router.post('/',auth, verificarRol(["A"]), productoController.crearProducto);
router.get('/', auth, verificarRol(["A","C"]),productoController.obtenerProductos);
router.get('/:id',auth, verificarRol(["A","C"]),productoController.obtenerProductoPorId);
router.get('/nombre/:nombre',auth, verificarRol(["A","C"]), productoController.obtenerProductoPorNombre);
router.delete('/:id',auth, verificarRol(["A"]), productoController.eliminarProducto);
router.put('/:id', auth, verificarRol(["A"]),productoController.actualizarProducto);

module.exports = router;
