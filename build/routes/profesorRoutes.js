"use strict";
// ARCHIVO DE TUTAS DE PROFESORES
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profesorController_1 = require("../controller/profesorController");
// import cors from "cors"; - VER DESPUES
const routes = (0, express_1.Router)();
//#region CODIGO VIEJO
// const express = require("express");
// const routes = express.Router();
// const profesorController = require("../controller/profesorController");
// const cors = require("cors");
//#endregion
// COMPORTAMOS LOS MIDDLEWARES (si se accede a estas rutas -> que se puede hacer con un profesor)
// ESTO HAY QUE CONTARSELO AL INDEX!!
routes.get("/", profesorController_1.profesorController.consultar); //consultar todos los profesores
routes.post("/", profesorController_1.profesorController.insertar); //insertar un profesor
routes
    .route("/:id")
    .get(profesorController_1.profesorController.consultarUno) //consultar un solo profesor
    .put(profesorController_1.profesorController.modificar) //modificar un solo profesor
    .delete(profesorController_1.profesorController.eliminar); //eliminar un solo profesor
// module.exports = routes;
exports.default = routes;
