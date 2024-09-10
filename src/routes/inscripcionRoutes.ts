// ARCHIVO DE RUTAS DE INSCRIPCION

import { Router } from "express";
import {
  consultarInscripciones,
  insertarInscripcion,
  modificarNota,
  eliminarInscripcion,
  consultarNota,
  consultarInscripcionesPorCurso,
  consultarInscripcionesPorEstudiante,
} from "../controller/inscripcionController";

const routes = Router();

// Consultar todas las inscripciones
routes.get("/", consultarInscripciones);

// Inscribir alumno en un curso
routes.post("/", insertarInscripcion);

// Consultar inscripciones por estudiante
routes.get("/estudiante/:estudiante_id", consultarInscripcionesPorEstudiante);

// Consultar inscripciones por curso
routes.get("/curso/:curso_id", consultarInscripcionesPorCurso);

// Consultar, modificar o eliminar una inscripción específica (por curso y estudiante)
routes
  .route("/curso/:curso_id/estudiante/:estudiante_id")
  .get(consultarNota)
  .put(modificarNota)
  .delete(eliminarInscripcion);

export default routes;
