"use strict";
//#region CODIGO VIEJO
/*
const express = require("express");
const cors = require("cors");
const estudianteRouters = require("./routers/estudianteRouters");
const profesorRouters = require("./routers/profesorRouters");
const cursoRouters = require("./routers/cursoRouters");
 const inscripcionRouters = require("./routers/inscripcionRouters");
*/
//#endregion
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const estudianteRoutes_1 = __importDefault(require("./routes/estudianteRoutes"));
const profesorRoutes_1 = __importDefault(require("./routes/profesorRoutes"));
const inscripcionRoutes_1 = __importDefault(require("./routes/inscripcionRoutes"));
const cursoRoutes_1 = __importDefault(require("./routes/cursoRoutes"));
// Inicializamos la aplicación
const app = (0, express_1.default)();
// Middlewares
app.use(express_1.default.json());
// app.use(express.urlencoded({ extended: true }));
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)());
// Ruta principal
app.get("/", (req, res) => {
    res.send("App Universidad :)");
});
// Definimos las rutas para cada entidad
app.use("/estudiantes", estudianteRoutes_1.default);
app.use("/profesores", profesorRoutes_1.default);
app.use("/cursos", cursoRoutes_1.default);
app.use("/inscripciones", inscripcionRoutes_1.default);
exports.default = app;
