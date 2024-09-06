"use strict";
// const express = require("express");
// const cors = require("cors");
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import cors from "cors"; VER DESPUES
const app = (0, express_1.default)();
const port = 3000;
//#region CODIGO VIEJO
// const estudianteRouters = require("./routers/estudianteRouters");
// const profesorRouters = require("./routers/profesorRouters");
// const cursoRouters = require("./routers/cursoRouters");
// const inscripcionRouters = require("./routers/inscripcionRouters");
//#endregion
const estudianteRoutes_1 = __importDefault(require("./routes/estudianteRoutes"));
const profesorRoutes_1 = __importDefault(require("./routes/profesorRoutes"));
const cursoRoutes_1 = __importDefault(require("./routes/cursoRoutes"));
const inscripcionRoutes_1 = __importDefault(require("./routes/inscripcionRoutes"));
//middleware
// app.use(cors()); VER DESPUES
app.use(express_1.default.json());
//RUTAS
app.get("/", (req, res) => {
    res.send("App Universidad :)");
});
//LE DIGO A LA APP QUE USE ESTAS RUTAS
app.use("/estudiantes", estudianteRoutes_1.default);
app.use("/profesores", profesorRoutes_1.default);
app.use("/cursos", cursoRoutes_1.default);
app.use("/cursos_estudiantes", inscripcionRoutes_1.default);
//PUERTO
app.listen(port, () => {
    console.log(`**Servidor activo en -> http://localhost:${port}`);
});
exports.default = app;
