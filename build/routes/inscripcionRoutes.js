"use strict";
// ARCHIVO DE RUTAS DE INSCRIPCION
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const inscripcionController_1 = require("../controller/inscripcionController");
const validarCampos_1 = require("../middlewares/validarCampos");
const routes = (0, express_1.Router)();
// Consultar todas las inscripciones
routes.get("/", inscripcionController_1.consultarInscripciones);
// Inscribir alumno en un curso
routes.post("/", [
    (0, express_validator_1.check)("curso_id").not().isEmpty().withMessage("El curso es obligatorio"),
    (0, express_validator_1.check)("estudiante_id")
        .not()
        .isEmpty()
        .withMessage("El estudiante es obligatorio"),
    (0, express_validator_1.check)("nota")
        .optional({ checkFalsy: true })
        .isFloat({ min: 0, max: 10 })
        .withMessage("La nota debe ser entre 1 y 10"),
    validarCampos_1.validarCampos,
], inscripcionController_1.insertarInscripcion);
// Consultar inscripciones por estudiante
routes.get("/estudiante/:estudiante_id", inscripcionController_1.consultarInscripcionesPorEstudiante);
// Consultar inscripciones por curso
routes.get("/curso/:curso_id", inscripcionController_1.consultarInscripcionesPorCurso);
// Consultar, modificar o eliminar una inscripción específica (por curso y estudiante)
routes
    .route("/curso/:curso_id/estudiante/:estudiante_id")
    .get(inscripcionController_1.consultarNota)
    // .put(modificarNota)
    .delete(inscripcionController_1.eliminarInscripcion);
routes.put("/curso/:curso_id/estudiante/:estudiante_id", [
    (0, express_validator_1.check)("curso_id").not().isEmpty().withMessage("El curso es obligatorio"),
    (0, express_validator_1.check)("estudiante_id")
        .not()
        .isEmpty()
        .withMessage("El estudiante es obligatorio"),
    (0, express_validator_1.check)("nota")
        .optional()
        .isFloat({ min: 0, max: 10 })
        .withMessage("La nota debe ser entre 0 y 10"),
    validarCampos_1.validarCampos,
], inscripcionController_1.modificarNota);
exports.default = routes;
