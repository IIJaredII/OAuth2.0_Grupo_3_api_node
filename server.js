const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes/index");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));  // Agregar esto

app.use("/api", routes);

app.listen(3000,"0.0.0.0", () => console.log("Servidor corriendo en el puerto 3000"));