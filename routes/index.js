const express = require("express");
const router = express.Router();

// Importar rutas individuales
const authRoutes = require("./authRoutes");

// Usar las rutas
router.use("/auth", authRoutes);

module.exports = router;
