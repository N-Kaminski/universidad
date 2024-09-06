// const express = require("express");
// const cors = require("cors");

import express, { Request, Response } from "express";
// import cors from "cors"; VER DESPUES
const app = express();
const port = 3000;

//#region CODIGO VIEJO
// const estudianteRouters = require("./routers/estudianteRouters");
// const profesorRouters = require("./routers/profesorRouters");
// const cursoRouters = require("./routers/cursoRouters");
// const inscripcionRouters = require("./routers/inscripcionRouters");
//#endregion

import estudianteRoutes from "./routes/estudianteRoutes";
import profesorRoutes from "./routes/profesorRoutes";
import cursoRoutes from "./routes/cursoRoutes";
import inscripcionRoutes from "./routes/inscripcionRoutes";

//middleware
// app.use(cors()); VER DESPUES
app.use(express.json());

//RUTAS
app.get("/", (req: Request, res: Response) => {
  res.send("App Universidad :)");
});

//LE DIGO A LA APP QUE USE ESTAS RUTAS
app.use("/estudiantes", estudianteRoutes);
app.use("/profesores", profesorRoutes);
app.use("/cursos", cursoRoutes);
app.use("/cursos_estudiantes", inscripcionRoutes);

//PUERTO
app.listen(port, () => {
  console.log(`**Servidor activo en -> http://localhost:${port}`);
});

export default app;
