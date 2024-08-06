const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

const estudianteRouters = require("./routers/estudianteRouters");
const profesorRouters = require("./routers/profesorRouters");

//middleware
app.use(cors());
app.use(express.json());

//RUTAS
app.get("/", (req, res) => {
  res.send("App Universidad :)");
});

//LE DIGO A LA APP QUE USE ESTAS RUTAS
app.use("/estudiantes", estudianteRouters); //le digo a la app que use todo lo que tenga en rutas
app.use("/profesores", profesorRouters);

//PUERTO
app.listen(port, () => {
  console.log(`**Servidor activo en -> http://localhost:${port}`);
});
