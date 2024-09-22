"use strict";
// ARCHIVO DE RUTAS DE ESTUDIANTES
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const estudianteController_1 = require("../controller/estudianteController");
const validarCampos_1 = require("../middlewares/validarCampos");
const routes = (0, express_1.Router)();
routes.post("/", [
    (0, express_validator_1.check)("nombre").not().isEmpty().withMessage("El nombre es obligatorio"),
    (0, express_validator_1.check)("nombre")
        .isLength({ min: 3 })
        .withMessage("El nombre debe ser mayor a 3 caracteres"),
    (0, express_validator_1.check)("apellido").not().isEmpty().withMessage("El apellido es obligatorio"),
    (0, express_validator_1.check)("email").isEmail().withMessage("Debe ser un email valido"),
    (0, express_validator_1.check)("dni").not().isEmpty().withMessage("El dni es obligatorio"),
    (0, express_validator_1.check)("dni")
        .isLength({ min: 8, max: 8 })
        .withMessage("El dni debe ser de 8 caracteres"),
    validarCampos_1.validarCampos,
], estudianteController_1.insertarEstudiante);
routes.get("/", estudianteController_1.consultarEstudiantes);
routes
    .route("/:id")
    .get(estudianteController_1.consultarUnEstudiante)
    // .put(modificarEstudiante)
    .delete(estudianteController_1.eliminarEstudiante);
routes.put("/:id", [
    (0, express_validator_1.check)("nombre").not().isEmpty().withMessage("El nombre es obligatorio"),
    (0, express_validator_1.check)("nombre")
        .isLength({ min: 3 })
        .withMessage("El nombre debe ser mayor a 3 caracteres"),
    (0, express_validator_1.check)("apellido").not().isEmpty().withMessage("El apellido es obligatorio"),
    (0, express_validator_1.check)("email").isEmail().withMessage("Debe ser un email valido"),
    (0, express_validator_1.check)("dni").not().isEmpty().withMessage("El dni es obligatorio"),
    (0, express_validator_1.check)("dni")
        .isLength({ min: 8, max: 8 })
        .withMessage("El dni debe ser de 8 caracteres"),
    validarCampos_1.validarCampos,
], estudianteController_1.modificarEstudiante);
exports.default = routes;
