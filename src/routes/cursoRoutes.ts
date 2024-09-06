// ARCHIVO PARA RUTAS DE CURSOS

import { Router } from "express";
import { cursoController } from "../controller/cursoController";
// import cors from "cors"; - VER DESPUES

const routes = Router();

//#region CODIGO VIEJO
// const express = require("express");
// const routes = express.Router();
// const cors = require("cors");
// const cursoController = require("../controller/cursoController");
//#endregion

routes.get("/", cursoController.consultar);
routes.post("/", cursoController.insertar);

routes
  .route("/:id")
  .get(cursoController.consultarUno)
  .put(cursoController.modificar)
  .delete(cursoController.eliminar);

// module.exports = routes;
export default routes;
