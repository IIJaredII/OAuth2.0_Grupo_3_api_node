const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/", authController.token);

module.exports = router;