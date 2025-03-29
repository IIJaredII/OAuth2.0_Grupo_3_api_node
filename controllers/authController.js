const OAuth2Server = require("oauth2-server");
const { Request, Response } = OAuth2Server;
const model = require("../models/oauthModel");

const oauth = new OAuth2Server({
  model,
  grants: ["password"],
  accessTokenLifetime: 3600,
});

exports.token = async (req, res) => {
  console.log(req.body);
  const request = new Request(req);
  const response = new Response(res);

  oauth
      .token(request, response)
      .then((token) => {
          const responseData = {
              id: token.user.id, 
              username: token.user.username, 
              accessToken: token.accessToken, 
          };
          res.json(responseData);
      })
      .catch((err) => {
          console.error(err);
          res.status(err.code || 500).json(err);
      });
};

