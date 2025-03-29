const verificarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.user || !rolesPermitidos.includes(req.user.rol)) {
            return res.status(403).json({ error: "No tienes permisos para acceder a esta ruta" });
        }
        next();
    };
};

module.exports = verificarRol;
