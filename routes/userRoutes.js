const express = require("express");
const router = express.Router();
const userController = require("../controllers/usersController");

router.post("/", userController.registarUsuario);

module.exports = router;