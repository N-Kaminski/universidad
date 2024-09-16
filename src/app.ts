import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";

import estudianteRouter from "./routes/estudianteRoutes";
import profesorRouter from "./routes/profesorRoutes";
import inscripcionRouter from "./routes/inscripcionRoutes";
import cursoRouter from "./routes/cursoRoutes";

// Inicializamos la aplicación
const app = express();

// Middlewares
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://127.0.0.1:5500", // Permite solicitudes desde el puerto 5500
  })
);

// Ruta principal
app.get("/", (req: Request, res: Response) => {
  res.send("App Universidad :)");
});

// Definimos las rutas para cada entidad
app.use("/estudiantes", estudianteRouter);
app.use("/profesores", profesorRouter);
app.use("/cursos", cursoRouter);
app.use("/inscripciones", inscripcionRouter);

export default app;
