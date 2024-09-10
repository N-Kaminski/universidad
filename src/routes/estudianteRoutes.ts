// ARCHIVO DE RUTAS DE ESTUDIANTES

import { Router } from "express";
import {
  insertarEstudiante,
  consultarEstudiantes,
  consultarUnEstudiante,
  modificarEstudiante,
  eliminarEstudiante,
} from "../controller/estudianteController";
import cors from "cors";

const routes = Router();

//#region CODIGO VIEJO
/*
const express = require("express");
const routes = express.Router();
const estudianteController = require("../controller/estudianteController");
const cors = require("cors");

routes.get("/", estudianteController.consultar);

routes.post("/", estudianteController.insertar);

routes
  .route("/:id")
  .get(estudianteController.consultarUno)
  .put(estudianteController.modificar)
  .delete(estudianteController.eliminar);

module.exports = routes;
*/
//#endregion

routes.post("/", insertarEstudiante);
routes.get("/", consultarEstudiantes);
routes
  .route("/:id")
  .get(consultarUnEstudiante)
  .put(modificarEstudiante)
  .delete(eliminarEstudiante);

export default routes;
