const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

const estudianteRouters = require("./routers/estudianteRouters");
const profesorRouters = require("./routers/profesorRouters");
const cursoRouters = require("./routers/cursoRouters");
const inscripcionRouters = require("./routers/inscripcionRouters");

//middleware
app.use(cors());
app.use(express.json());

//RUTAS
app.get("/", (req, res) => {
  res.send("App Universidad :)");
});

//LE DIGO A LA APP QUE USE ESTAS RUTAS
app.use("/estudiantes", estudianteRouters);
app.use("/profesores", profesorRouters);
app.use("/cursos", cursoRouters);
app.use("/cursos_estudiantes", inscripcionRouters);

//PUERTO
app.listen(port, () => {
  console.log(`**Servidor activo en -> http://localhost:${port}`);
});
