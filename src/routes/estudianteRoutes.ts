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

routes.post("/", insertarEstudiante);
routes.get("/", consultarEstudiantes);
routes
  .route("/:id")
  .get(consultarUnEstudiante)
  .put(modificarEstudiante)
  .delete(eliminarEstudiante);

export default routes;
