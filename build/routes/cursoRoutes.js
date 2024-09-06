"use strict";
// ARCHIVO PARA RUTAS DE CURSOS
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cursoController_1 = require("../controller/cursoController");
// import cors from "cors"; - VER DESPUES
const routes = (0, express_1.Router)();
//#region CODIGO VIEJO
// const express = require("express");
// const routes = express.Router();
// const cors = require("cors");
// const cursoController = require("../controller/cursoController");
//#endregion
routes.get("/", cursoController_1.cursoController.consultar);
routes.post("/", cursoController_1.cursoController.insertar);
routes
    .route("/:id")
    .get(cursoController_1.cursoController.consultarUno)
    .put(cursoController_1.cursoController.modificar)
    .delete(cursoController_1.cursoController.eliminar);
// module.exports = routes;
exports.default = routes;
