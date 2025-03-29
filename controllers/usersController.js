const connection = require("../config/db");

const registarUsuario = async (req, res) => {
    try {
        const {mail,password } = req.body;

        if (!mail || !password) {
            return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
        }


        const [results] = await connection.promise().query(
            "INSERT INTO users (username, password, rol) VALUES (?, ?, C)",
            [mail,password]
        );

        res.status(201).json({
            mensaje: "Cliente agregado correctamente",
            id: results.insertId
        });
    } catch (error) {
        console.error("Error al crear cliente:", error);

        res.status(500).json({ mensaje: "Error al crear el producto" });
    }
};

module.exports = {registarUsuario}