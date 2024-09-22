// ARCHIVO DE TUTAS DE PROFESORES

import { Router } from "express";
import { check } from "express-validator";
import {
  insertarProfesor,
  consultarProfesores,
  consultarUnProfesor,
  modificarProfesor,
  eliminarProfesor,
} from "../controller/profesorController";
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
    check("telefono")
      .isLength({ min: 9 })
      .withMessage("El telefono debe ser mayor a 9 caracteres"),
    validarCampos,
  ],
  insertarProfesor
);

routes.get("/", consultarProfesores);
routes.route("/:id").get(consultarUnProfesor).delete(eliminarProfesor);

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
    check("telefono")
      .isLength({ min: 9 })
      .withMessage("El telefono debe ser mayor a 9 caracteres"),
    validarCampos,
  ],
  modificarProfesor
);

export default routes;
