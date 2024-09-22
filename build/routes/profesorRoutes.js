"use strict";
// ARCHIVO DE TUTAS DE PROFESORES
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const profesorController_1 = require("../controller/profesorController");
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
    (0, express_validator_1.check)("telefono")
        .isLength({ min: 9 })
        .withMessage("El telefono debe ser mayor a 9 caracteres"),
    validarCampos_1.validarCampos,
], profesorController_1.insertarProfesor);
routes.get("/", profesorController_1.consultarProfesores);
routes
    .route("/:id")
    .get(profesorController_1.consultarUnProfesor)
    // .put(modificarProfesor)
    .delete(profesorController_1.eliminarProfesor);
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
    (0, express_validator_1.check)("telefono")
        .isLength({ min: 9 })
        .withMessage("El telefono debe ser mayor a 9 caracteres"),
    validarCampos_1.validarCampos,
], profesorController_1.modificarProfesor);
exports.default = routes;
