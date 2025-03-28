const OAuth2Server = require("oauth2-server");
const { Request, Response } = OAuth2Server;
const model = require("../models/oauthModel");

const oauth = new OAuth2Server({
  model,
  grants: ["password"],
  accessTokenLifetime: 3600, // 1 hora
});

exports.token = async (req, res) => {
    console.log(req.body);  // 🔍 Ver qué datos está recibiendo
    const request = new Request(req);
    const response = new Response(res);
  
    oauth
      .token(request, response)
      .then((token) => res.json(token))
      .catch((err) => {
        console.error(err); // Ver el error en la consola
        res.status(err.code || 500).json(err);
      });
  };
