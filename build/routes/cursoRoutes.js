"use strict";
// ARCHIVO PARA RUTAS DE CURSOS
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cursoController_1 = require("../controller/cursoController");
const routes = (0, express_1.Router)();
routes.post("/", cursoController_1.insertarCurso);
routes.get("/", cursoController_1.consultarCursos);
routes
    .route("/:id")
    .get(cursoController_1.consultarUnCurso)
    .put(cursoController_1.modificarCurso)
    .delete(cursoController_1.eliminarCurso);
exports.default = routes;
