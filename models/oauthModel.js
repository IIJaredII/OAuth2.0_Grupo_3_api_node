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
        "SELECT id, username FROM users WHERE id = ?",
        [rows[0].userId]
      );

      return {
        accessToken: rows[0].accessToken,
        accessTokenExpiresAt: rows[0].accessTokenExpiresAt,
        user: userRows.length ? userRows[0] : null,
      };
    } catch (error) {
      console.error("Error en getAccessToken:", error);
      return null;
    }
  },

  getClient: async (clientId, clientSecret) => {
    try {
      console.log("Buscando cliente en la base de datos..."); // 🔍 Depuración
      console.log("Client ID:", clientId, "Client Secret:", clientSecret);
  
      const [rows] = await db.promise().query(
        "SELECT id, clientSecret, grants FROM clients WHERE id = ? AND clientSecret = ?",
        [clientId, clientSecret]
      );
  
      console.log("Resultados de la consulta:", rows); // 🔍 Ver qué devuelve la BD
  
      if (rows.length === 0) {
        console.log("Cliente no encontrado");
        return null;
      }
  
      const client = {
        id: rows[0].id,
        clientSecret: rows[0].clientSecret, 
        grants: rows[0].grants.split(","),
      };
  
      console.log("Cliente encontrado:", client); 
  
      return client;
    } catch (error) {
      console.error("Error en getClient:", error);
      throw new Error("Error al obtener el cliente");
    }
  },
  
  saveToken: async (token, client, user) => {
    try {
      if (!client || !client.id) {
        console.error("❌ Error: el objeto `client` no es válido:", client);
        throw new Error("El objeto `client` no es válido");
      }
  
      console.log("Guardando token para el usuario:", user.id); // 🔍 Depuración
      await db.promise().query(
        "INSERT INTO tokens (accessToken, accessTokenExpiresAt, userId) VALUES (?, ?, ?)",
        [token.accessToken, token.accessTokenExpiresAt, user.id]
      );
  
      return {
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        client, // 🔥 Importante devolver `client`
        user,
      };
    } catch (error) {
      console.error("Error en saveToken:", error);
      throw new Error("Error al guardar el token");
    }
  },
  

  getUser: async (username, password) => {
    try {
      console.log("Buscando usuario:", username); // 🔍 Depuración
      const [rows] = await db.promise().query(
        "SELECT id, username FROM users WHERE username = ? AND password = ?",
        [username, password]
      );

      if (rows.length === 0) {
        console.log("Usuario no encontrado o credenciales incorrectas");
        return null;
      }

      return rows[0];
    } catch (error) {
      console.error("Error en getUser:", error);
      return null;
    }
  },
};
