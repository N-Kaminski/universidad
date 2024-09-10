// ARCHIVO DE TUTAS DE PROFESORES

import { Router } from "express";
import {
  insertarProfesor,
  consultarProfesores,
  consultarUnProfesor,
  modificarProfesor,
  eliminarProfesor,
} from "../controller/profesorController";
import cors from "cors";

const routes = Router();

routes.post("/", insertarProfesor);
routes.get("/", consultarProfesores);
routes
  .route("/:id")
  .get(consultarUnProfesor)
  .put(modificarProfesor)
  .delete(eliminarProfesor);

export default routes;
