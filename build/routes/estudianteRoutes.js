"use strict";
// ARCHIVO DE RUTAS DE ESTUDIANTES
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const estudianteController_1 = require("../controller/estudianteController");
const routes = (0, express_1.Router)();
routes.post("/", estudianteController_1.insertarEstudiante);
routes.get("/", estudianteController_1.consultarEstudiantes);
routes
    .route("/:id")
    .get(estudianteController_1.consultarUnEstudiante)
    .put(estudianteController_1.modificarEstudiante)
    .delete(estudianteController_1.eliminarEstudiante);
exports.default = routes;
