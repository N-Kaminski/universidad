const express = require("express");
const routes = express.Router();
const cors = require("cors");
const inscripcionController = require("../controller/inscripcionController");

routes.get("/", inscripcionController.consultar);
routes.post("/", inscripcionController.insertar);

routes.get(
  "/estudiante/:estudiante_id",
  inscripcionController.consultarEstudiante
);

routes.get("/curso/:curso_id", inscripcionController.consultarCurso);

routes
  .route("/curso/:curso_id/estudiante/:estudiante_id")
  .get(inscripcionController.consultarNota)
  .put(inscripcionController.modificar)
  .delete(inscripcionController.eliminar);

module.exports = routes;
