"use strict";
// ARCHIVO PARA RUTAS DE CURSOS
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const cursoController_1 = require("../controller/cursoController");
const validarCampos_1 = require("../middlewares/validarCampos");
const routes = (0, express_1.Router)();
routes.post("/", [
    (0, express_validator_1.check)("nombre").not().isEmpty().withMessage("El nombre es obligatorio"),
    (0, express_validator_1.check)("nombre")
        .isLength({ min: 3 })
        .withMessage("El nombre debe ser mayor a 3 caracteres"),
    (0, express_validator_1.check)("profesor_id")
        .not()
        .isEmpty()
        .withMessage("El profesor es obligatorio"),
    validarCampos_1.validarCampos,
], cursoController_1.insertarCurso);
routes.get("/", cursoController_1.consultarCursos);
routes
    .route("/:id")
    .get(cursoController_1.consultarUnCurso)
    // .put(modificarCurso)
    .delete(cursoController_1.eliminarCurso);
routes.put("/:id", [
    (0, express_validator_1.check)("nombre").not().isEmpty().withMessage("El nombre es obligatorio"),
    (0, express_validator_1.check)("nombre")
        .isLength({ min: 3 })
        .withMessage("El nombre debe ser mayor a 3 caracteres"),
    (0, express_validator_1.check)("profesor_id")
        .not()
        .isEmpty()
        .withMessage("El profesor es obligatorio"),
    validarCampos_1.validarCampos,
], cursoController_1.modificarCurso);
exports.default = routes;
