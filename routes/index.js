const express = require("express");
const router = express.Router();

// Importar rutas individuales
const authRoutes = require("./authRoutes");
const producto = require("./productosroutes");
const users = require("./userRoutes");

// Usar las rutas
router.use("/auth", authRoutes);
router.use("/producto",producto);
router.use("/user",users);

module.exports = router;