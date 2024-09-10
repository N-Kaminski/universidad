import { Request, Response } from "express";
import { AppDataSource } from "../db/conexion";
import { Profesor } from "../models/profesorModels";

const profesorRepo = AppDataSource.getRepository(Profesor);

/**** INSERTAR PROFESOR ****/
export const insertarProfesor = async (req: Request, res: Response) => {
  try {
    const profesor = profesorRepo.create(req.body);
    await profesorRepo.save(profesor);
    return res.status(201).json(profesor);
  } catch (error) {
    return res
      .status(500)
      .send(`Error en catch al insertar Profesor: ${error}`);
  }
};

/**** CONSULTAR PROFESORES ****/
export const consultarProfesores = async (req: Request, res: Response) => {
  try {
    const profesores = await profesorRepo.find();
    return res.status(200).json(profesores);
  } catch (error) {
    return res
      .status(500)
      .send(`Error en catch al consultar profesores: ${error}`);
  }
};

/**** CONSULTAR UN PROFESOR ****/
export const consultarUnProfesor = async (req: Request, res: Response) => {
  try {
    const profesor = await profesorRepo.findOneBy({
      id: parseInt(req.params.id),
    });
    if (!profesor) {
      return res.status(404).json("Profesor no encontrado");
    }
    return res.status(200).json(profesor);
  } catch (error) {
    return res
      .status(500)
      .send(`Error en catch al consultar el profesor: ${error}`);
  }
};

/**** MODIFICAR PROFESOR ****/
export const modificarProfesor = async (req: Request, res: Response) => {
  try {
    const profesor = await profesorRepo.findOneBy({
      id: parseInt(req.params.id),
    });
    if (!profesor) {
      return res.status(404).json("Profesor no encontrado");
    }
    profesorRepo.merge(profesor, req.body);
    await profesorRepo.save(profesor);
    return res.status(200).json(`Profesor ${profesor.dni} modificado`);
  } catch (error) {
    return res
      .status(500)
      .send(`Error en catch al modificar el profesor: ${error}`);
  }
};

/**** ELIMINAR PROFESOR ****/
export const eliminarProfesor = async (req: Request, res: Response) => {
  try {
    const profesor = await profesorRepo.findOneBy({
      id: parseInt(req.params.id),
    });
    if (!profesor) {
      return res.status(404).json("Profesor no encontrado");
    }
    await profesorRepo.remove(profesor);
    return res.status(200).json(`Profesor ${profesor.dni} eliminado`);
  } catch (error) {
    return res
      .status(500)
      .send(`Error en catch al eliminar el profesor: ${error}`);
  }
};
