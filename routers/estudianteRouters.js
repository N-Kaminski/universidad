// ARCHIVO DE RUTAS DE ESTUDIANTES

const express = require("express");
const routes = express.Router();
const estudianteController = require("../controller/estudianteController");
const cors = require("cors");

// COMPORTAMOS LOS MIDDLEWARES (si se accede a estas rutas -> que se puede hacer con un estudiante)
// ESTO HAY QUE CONTARSELO AL INDEX!!

routes.get("/", estudianteController.consultar);

routes.post("/", estudianteController.insertar);

routes
  .route("/:id")
  .get(estudianteController.consultarUno)
  .put(estudianteController.modificar)
  .delete(estudianteController.eliminar);

module.exports = routes;
