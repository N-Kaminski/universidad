"use strict";
// ARCHIVO DE RUTAS DE INSCRIPCION
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inscripcionController_1 = require("../controller/inscripcionController");
// import cors from "cors"; - VER DESPUES
const routes = (0, express_1.Router)();
//#region CODIGO VIEJO
// const express = require("express");
// const routes = express.Router();
// const cors = require("cors");
// const inscripcionController = require("../controller/inscripcionController");
//#endregion
routes.get("/", inscripcionController_1.inscripcionController.consultar);
routes.post("/", inscripcionController_1.inscripcionController.insertar);
routes.get("/estudiante/:estudiante_id", inscripcionController_1.inscripcionController.consultarEstudiante);
routes.get("/curso/:curso_id", inscripcionController_1.inscripcionController.consultarCurso);
routes
    .route("/curso/:curso_id/estudiante/:estudiante_id")
    .get(inscripcionController_1.inscripcionController.consultarNota)
    .put(inscripcionController_1.inscripcionController.modificar)
    .delete(inscripcionController_1.inscripcionController.eliminar);
// module.exports = routes;
exports.default = routes;
