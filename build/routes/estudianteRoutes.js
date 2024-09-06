"use strict";
// ARCHIVO DE RUTAS DE ESTUDIANTES
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const estudianteController_1 = require("../controller/estudianteController");
// import cors from "cors"; - VER DESPUES
const routes = (0, express_1.Router)();
//#region CODIGO VIEJO
// const express = require("express");
// const routes = express.Router();
// const estudianteController = require("../controller/estudianteController");
// const cors = require("cors");
//#endregion
// COMPORTAMOS LOS MIDDLEWARES (si se accede a estas rutas -> que se puede hacer con un estudiante)
// ESTO HAY QUE CONTARSELO AL INDEX!!
routes.get("/", estudianteController_1.estudianteController.consultar);
routes.post("/", estudianteController_1.estudianteController.insertar);
routes
    .route("/:id")
    .get(estudianteController_1.estudianteController.consultarUno)
    .put(estudianteController_1.estudianteController.modificar)
    .delete(estudianteController_1.estudianteController.eliminar);
// module.exports = routes;
exports.default = routes;
