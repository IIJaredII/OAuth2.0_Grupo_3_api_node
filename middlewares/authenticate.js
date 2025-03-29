const OAuth2Server = require("oauth2-server");
const { Request, Response } = OAuth2Server;
const model = require("../models/oauthModel");

const oauth = new OAuth2Server({ model });

module.exports = async (req, res, next) => {
  const request = new Request(req);
  const response = new Response(res);

  oauth
    .authenticate(request, response)
    .then((token) => {
      console.log("✅ Usuario autenticado:", token.user); // 🚀 Agregar log
      req.user = token.user; // Asegurarse de pasar el usuario con el rol
      next();
    })
    .catch((err) => {
      console.error("❌ Error en autenticación:", err);
      res.status(err.code || 401).json({ error: "No autorizado" });
    });
};
