// ARCHIVO PARA RUTAS DE CURSOS

import { Router } from "express";
import { check } from "express-validator";
import {
  insertarCurso,
  consultarCursos,
  consultarUnCurso,
  modificarCurso,
  eliminarCurso,
} from "../controller/cursoController";
import { validarCampos } from "../middlewares/validarCampos";

const routes = Router();

routes.post(
  "/",
  [
    check("nombre").not().isEmpty().withMessage("El nombre es obligatorio"),
    check("nombre")
      .isLength({ min: 3 })
      .withMessage("El nombre debe ser mayor a 3 caracteres"),
    check("profesor_id")
      .not()
      .isEmpty()
      .withMessage("El profesor es obligatorio"),
    validarCampos,
  ],
  insertarCurso
);

routes.get("/", consultarCursos);

routes
  .route("/:id")
  .get(consultarUnCurso)
  // .put(modificarCurso)
  .delete(eliminarCurso);

routes.put(
  "/:id",
  [
    check("nombre").not().isEmpty().withMessage("El nombre es obligatorio"),
    check("nombre")
      .isLength({ min: 3 })
      .withMessage("El nombre debe ser mayor a 3 caracteres"),
    check("profesor_id")
      .not()
      .isEmpty()
      .withMessage("El profesor es obligatorio"),
    validarCampos,
  ],
  modificarCurso
);

export default routes;
