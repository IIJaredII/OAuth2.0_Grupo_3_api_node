const express = require('express');
const productoController = require('../controllers/productoController');

const router = express.Router();

router.post('/producto', productoController.crearProducto);
router.get('/productos', productoController.obtenerProductos);
router.get('/producto/:id', productoController.obtenerProductoPorId);
router.get('/producto/nombre/:nombre', productoController.obtenerProductoPorNombre);
router.delete('/producto/:id', productoController.eliminarProducto);
router.put('/producto/:id', productoController.actualizarProducto);

module.exports = router;
