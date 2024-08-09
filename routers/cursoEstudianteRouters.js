const express = require("express");
const routes = express.Router();
const cors = require("cors");
const cursoEstudianteController = require("../controller/cursoEstudianteController");

routes.get("/", cursoEstudianteController.consultar);
routes.post("/", cursoEstudianteController.insertar);

routes.get(
  "/estudiante/:estudiante_id",
  cursoEstudianteController.consultarEstudiante
);

routes.get("/curso/:curso_id", cursoEstudianteController.consultarCurso);

routes
  .route("/curso/:curso_id/estudiante/:estudiante_id")
  .get(cursoEstudianteController.consultarUno)
  .put(cursoEstudianteController.modificar)
  .delete(cursoEstudianteController.eliminar);

module.exports = routes;
