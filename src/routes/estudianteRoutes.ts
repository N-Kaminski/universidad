// ARCHIVO DE RUTAS DE ESTUDIANTES

import { Router } from "express";
import { estudianteController } from "../controller/estudianteController";
// import cors from "cors"; - VER DESPUES
const routes = Router();

//#region CODIGO VIEJO
// const express = require("express");
// const routes = express.Router();
// const estudianteController = require("../controller/estudianteController");
// const cors = require("cors");
//#endregion

// COMPORTAMOS LOS MIDDLEWARES (si se accede a estas rutas -> que se puede hacer con un estudiante)
// ESTO HAY QUE CONTARSELO AL INDEX!!

routes.get("/", estudianteController.consultar);

routes.post("/", estudianteController.insertar);

routes
  .route("/:id")
  .get(estudianteController.consultarUno)
  .put(estudianteController.modificar)
  .delete(estudianteController.eliminar);

// module.exports = routes;
export default routes;
