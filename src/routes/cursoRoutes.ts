// ARCHIVO PARA RUTAS DE CURSOS

import { Router } from "express";
import {
  insertarCurso,
  consultarCursos,
  consultarUnCurso,
  modificarCurso,
  eliminarCurso,
} from "../controller/cursoController";

const routes = Router();

routes.post("/", insertarCurso);
routes.get("/", consultarCursos);
routes
  .route("/:id")
  .get(consultarUnCurso)
  .put(modificarCurso)
  .delete(eliminarCurso);

export default routes;
