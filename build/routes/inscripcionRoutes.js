"use strict";
// ARCHIVO DE RUTAS DE INSCRIPCION
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inscripcionController_1 = require("../controller/inscripcionController");
const routes = (0, express_1.Router)();
// Consultar todas las inscripciones
routes.get("/", inscripcionController_1.consultarInscripciones);
// Inscribir alumno en un curso
routes.post("/", inscripcionController_1.insertarInscripcion);
// Consultar inscripciones por estudiante
routes.get("/estudiante/:estudiante_id", inscripcionController_1.consultarInscripcionesPorEstudiante);
// Consultar inscripciones por curso
routes.get("/curso/:curso_id", inscripcionController_1.consultarInscripcionesPorCurso);
// Consultar, modificar o eliminar una inscripción específica (por curso y estudiante)
routes
    .route("/curso/:curso_id/estudiante/:estudiante_id")
    .get(inscripcionController_1.consultarNota)
    .put(inscripcionController_1.modificarNota)
    .delete(inscripcionController_1.eliminarInscripcion);
exports.default = routes;
