"use strict";
// ARCHIVO DE TUTAS DE PROFESORES
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profesorController_1 = require("../controller/profesorController");
const routes = (0, express_1.Router)();
routes.post("/", profesorController_1.insertarProfesor);
routes.get("/", profesorController_1.consultarProfesores);
routes
    .route("/:id")
    .get(profesorController_1.consultarUnProfesor)
    .put(profesorController_1.modificarProfesor)
    .delete(profesorController_1.eliminarProfesor);
exports.default = routes;
