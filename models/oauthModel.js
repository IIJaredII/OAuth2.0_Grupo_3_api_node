const db = require("../config/db");

module.exports = {
  
  getAccessToken: async (accessToken) => {
    try {
        console.log("Buscando accessToken:", accessToken);
        const [rows] = await db.promise().query(
            "SELECT * FROM tokens WHERE accessToken = ?",
            [accessToken]
        );

        if (rows.length === 0) return null;

        const [userRows] = await db.promise().query(
            "SELECT id, username, rol FROM users WHERE id = ?",
            [rows[0].userId]
        );

        if (userRows.length === 0) return null;

        const user = {
            id: userRows[0].id,
            username: userRows[0].username,
            rol: userRows[0].rol, 
        };

        return {
            accessToken: rows[0].accessToken,
            accessTokenExpiresAt: rows[0].accessTokenExpiresAt,
            user,
        };
    } catch (error) {
        console.error("Error en getAccessToken:", error);
        return null;
    }
},


  getClient: async (clientId, clientSecret) => {
    try {
      console.log("Buscando cliente en la base de datos...");
      console.log("Client ID:", clientId, "Client Secret:", clientSecret);
  
      const [rows] = await db.promise().query(
        "SELECT id, clientSecret, grants FROM clients WHERE id = ? AND clientSecret = ?",
        [clientId, clientSecret]
      );
  
      if (rows.length === 0) {
        console.log("Cliente no encontrado");
        return null;
      }
  
      const client = {
        id: rows[0].id,
        clientSecret: rows[0].clientSecret, 
        grants: rows[0].grants.split(","),
      };
   
  
      return client;
    } catch (error) {
      console.error("Error en getClient:", error);
      throw new Error("Error al obtener el cliente");
    }
  },
  
  saveToken: async (token, client, user) => {
    try {
      if (!client || !client.id) {
        throw new Error("El objeto `client` no es válido");
      }
  
      await db.promise().query(
        "INSERT INTO tokens (accessToken, accessTokenExpiresAt, userId) VALUES (?, ?, ?)",
        [token.accessToken, token.accessTokenExpiresAt, user.id]
      );
  
      return {
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        client,
        user,
      };
    } catch (error) {
      console.error("Error en saveToken:", error);
      throw new Error("Error al guardar el token");
    }
  },
  

  getUser: async (username, password) => {
    const [rows] = await db.promise().query(
      "SELECT id, username, rol FROM users WHERE username = ? AND password = ?",
      [username, password]
    );

    return rows.length ? rows[0] : null;
},
};
