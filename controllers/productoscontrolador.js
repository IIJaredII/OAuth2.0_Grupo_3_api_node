const fs = require("fs");
const path = require("path");
const connection = require("../config/db");

const crearProducto = async (req, res) => {
    try {
        const { nombre, precio, categoria, imagen } = req.body;

        if (!nombre || !precio || !categoria || !imagen) {
            return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
        }

        const imagenBuffer = Buffer.from(imagen, 'base64'); 

        const imagenNombre = `${Date.now()}.jpg`; 
        const imagenPath = path.join(__dirname, "../../imagenes", imagenNombre);

        fs.writeFileSync(imagenPath, imagenBuffer);

        const [results] = await connection.promise().query(
            "INSERT INTO productos (nombre, precio, categoria, imagenProducto) VALUES (?, ?, ?, ?)",
            [nombre, precio, categoria, imagenNombre]
        );

        res.status(201).json({
            mensaje: "Producto agregado correctamente",
            id: results.insertId
        });
    } catch (error) {
        console.error("Error al crear producto:", error);

        if (imagen) {
            try {
                const imagenPath = path.join(__dirname, "../../imagenes", `${Date.now()}.jpg`);
                fs.unlinkSync(imagenPath);
                console.log("Imagen eliminada debido a un error en la BD.");
            } catch (unlinkError) {
                console.error("Error al eliminar la imagen:", unlinkError);
            }
        }

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

        const [rows] = await connection.promise().query("SELECT imagenProducto FROM productos WHERE id=?", [id]);

        if (!rows.length) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }

        const imagenNombre = rows[0].imagenProducto;

        await connection.promise().query("DELETE FROM productos WHERE id=?", [id]);

        const imagenPath = path.join(__dirname, "../../imagenes/", imagenNombre);
        if (fs.existsSync(imagenPath)) {
            fs.unlinkSync(imagenPath);
        }

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

        const [producto] = await connection.promise().query("SELECT imagenProducto FROM productos WHERE id=?", [id]);

        if (producto.length === 0) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }

        const imagenActual = producto[0].imagenProducto;

        if (imagen) {
            const imagenBuffer = Buffer.from(imagen, 'base64');
            const nuevaImagenNombre = `${Date.now()}.jpg`;
            const imagenPath = path.join(__dirname, "../../imagenes", nuevaImagenNombre);

            if (imagenActual) {
                const imagenAntiguaPath = path.join(__dirname, "../../imagenes", imagenActual);
                if (fs.existsSync(imagenAntiguaPath)) {
                    fs.unlinkSync(imagenAntiguaPath);
                }
            }

            fs.writeFileSync(imagenPath, imagenBuffer);

            await connection.promise().query(
                "UPDATE productos SET nombre = ?, precio = ?, categoria = ?, imagenProducto = ? WHERE id = ?",
                [nombre, precio, categoria, nuevaImagenNombre, id]
            );
        } else {
            await connection.promise().query(
                "UPDATE productos SET nombre = ?, precio = ?, categoria = ? WHERE id = ?",
                [nombre, precio, categoria, id]
            );
        }

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
