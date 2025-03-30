const connection = require("../config/db");

const crearProducto = async (req, res) => {
    try {
        const {nombre, precio, categoria, imagen } = req.body;

        if (!nombre || !precio || !categoria || !imagen) {
            return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
        }

        console.log(nombre);
        console.log(precio);
        console.log(categoria);
        console.log(imagen);

        const [results] = await connection.promise().query(
            "INSERT INTO productos (nombre, precio, categoria, imagenProducto) VALUES (?, ?, ?, ?)",
            [nombre, precio, categoria, imagen]
        );

        res.status(201).json({
            mensaje: "Producto agregado correctamente",
            id: results.insertId
        });
    } catch (error) {
        console.error("Error al crear producto:", error);

        res.status(500).json({ mensaje: "Error al crear el producto" });
    }
};

const obtenerProductos = async (req, res) => {
    try {
        const [results] = await connection.promise().query('SELECT * FROM productos');
        res.json(results);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ mensaje: "Error al obtener productos" });
    }
};

const obtenerProductoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const [results] = await connection.promise().query('SELECT * FROM productos WHERE id = ?', [id]);

        if (results.length === 0) {
            res.status(404).json({ mensaje: "No se encontró ese producto" });
        } else {
            res.json(results[0]);
        }
    } catch (error) {
        console.error("Error al obtener producto:", error);
        res.status(500).json({ mensaje: "Error al obtener producto" });
    }
};

const obtenerProductoPorNombre = async (req, res) => {
    try {
        const { nombre } = req.params;

        if (!nombre) {
            return res.status(400).json({ mensaje: "Por favor, ingrese un nombre de producto." });
        }

        const [results] = await connection.promise().query(
            "SELECT * FROM productos WHERE nombre LIKE ?",
            [`%${nombre}%`]
        );

        if (results.length === 0) {
            res.status(404).json({ mensaje: "No se encontró ese producto" });
        } else {
            res.json(results);
        }
    } catch (error) {
        console.error("Error al obtener producto:", error);
        res.status(500).json({ mensaje: "Error al obtener producto" });
    }
};

const eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;

        await connection.promise().query("DELETE FROM productos WHERE id=?", [id]);

        res.json({ mensaje: "Producto eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar producto: ", error);
        res.status(500).json({ mensaje: "Error al eliminar producto" });
    }
};

const actualizarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, precio, categoria, imagen } = req.body;

        console.log(id);
        console.log(nombre);
        console.log(precio);
        console.log(categoria);
        console.log(imagen);

            await connection.promise().query(
                "UPDATE productos SET nombre = ?, precio = ?, categoria = ?, imagenProducto = ? WHERE id = ?",
                [nombre, precio, categoria, imagen, id]
            );

        res.json({ mensaje: "Producto actualizado exitosamente" });
    } catch (error) {
        console.error("Error al actualizar producto: ", error);
        res.status(500).json({ mensaje: "Error al actualizar producto" });
    }
};

module.exports = {
    crearProducto,
    obtenerProductos,
    eliminarProducto,
    actualizarProducto,
    obtenerProductoPorId,
    obtenerProductoPorNombre
};
