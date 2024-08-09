// ARCHIVO PARA RUTAS DE CURSOS

const express = require("express");
const routes = express.Router();
const cors = require("cors");
const cursoController = require("../controller/cursoController");

routes.get("/", cursoController.consultar);
routes.post("/", cursoController.insertar);

routes
  .route("/:id")
  .get(cursoController.consultarUno)
  .put(cursoController.modificar)
  .delete(cursoController.eliminar);

module.exports = routes;
