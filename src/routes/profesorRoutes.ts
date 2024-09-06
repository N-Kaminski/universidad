// ARCHIVO DE TUTAS DE PROFESORES

import { Router } from "express";
import { profesorController } from "../controller/profesorController";
// import cors from "cors"; - VER DESPUES
const routes = Router();

//#region CODIGO VIEJO
// const express = require("express");
// const routes = express.Router();
// const profesorController = require("../controller/profesorController");
// const cors = require("cors");
//#endregion

// COMPORTAMOS LOS MIDDLEWARES (si se accede a estas rutas -> que se puede hacer con un profesor)
// ESTO HAY QUE CONTARSELO AL INDEX!!

routes.get("/", profesorController.consultar); //consultar todos los profesores

routes.post("/", profesorController.insertar); //insertar un profesor

routes
  .route("/:id")
  .get(profesorController.consultarUno) //consultar un solo profesor
  .put(profesorController.modificar) //modificar un solo profesor
  .delete(profesorController.eliminar); //eliminar un solo profesor

// module.exports = routes;
export default routes;
