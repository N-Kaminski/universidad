// ARCHIVO DE TUTAS DE PROFESORES

const express = require("express");
const routes = express.Router();
const profesorController = require("../controller/profesorController");
const cors = require("cors");

// COMPORTAMOS LOS MIDDLEWARES (si se accede a estas rutas -> que se puede hacer con un profesor)
// ESTO HAY QUE CONTARSELO AL INDEX!!

routes.get("/", profesorController.consultar); //consultar todos los profesores

routes.post("/", profesorController.insertar); //insertar un profesor

routes
  .route("/:id")
  .get(profesorController.consultarUno) //consultar un solo profesor
  .put(profesorController.modificar) //modificar un solo profesor
  .delete(profesorController.eliminar); //eliminar un solo profesor

module.exports = routes;
