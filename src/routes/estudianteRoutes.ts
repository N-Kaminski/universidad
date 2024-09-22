// ARCHIVO DE RUTAS DE ESTUDIANTES

import { Router } from "express";
import { check } from "express-validator";
import {
  insertarEstudiante,
  consultarEstudiantes,
  consultarUnEstudiante,
  modificarEstudiante,
  eliminarEstudiante,
} from "../controller/estudianteController";
import { validarCampos } from "../middlewares/validarCampos";

const routes = Router();

routes.post(
  "/",
  [
    check("nombre").not().isEmpty().withMessage("El nombre es obligatorio"),
    check("nombre")
      .isLength({ min: 3 })
      .withMessage("El nombre debe ser mayor a 3 caracteres"),
    check("apellido").not().isEmpty().withMessage("El apellido es obligatorio"),
    check("email").isEmail().withMessage("Debe ser un email valido"),
    check("dni").not().isEmpty().withMessage("El dni es obligatorio"),
    check("dni")
      .isLength({ min: 8, max: 8 })
      .withMessage("El dni debe ser de 8 caracteres"),
    validarCampos,
  ],
  insertarEstudiante
);

routes.get("/", consultarEstudiantes);

routes
  .route("/:id")
  .get(consultarUnEstudiante)
  // .put(modificarEstudiante)
  .delete(eliminarEstudiante);

routes.put(
  "/:id",
  [
    check("nombre").not().isEmpty().withMessage("El nombre es obligatorio"),
    check("nombre")
      .isLength({ min: 3 })
      .withMessage("El nombre debe ser mayor a 3 caracteres"),
    check("apellido").not().isEmpty().withMessage("El apellido es obligatorio"),
    check("email").isEmail().withMessage("Debe ser un email valido"),
    check("dni").not().isEmpty().withMessage("El dni es obligatorio"),
    check("dni")
      .isLength({ min: 8, max: 8 })
      .withMessage("El dni debe ser de 8 caracteres"),
    validarCampos,
  ],
  modificarEstudiante
);
export default routes;
