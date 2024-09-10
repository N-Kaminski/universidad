import { Request, Response } from "express";
import { AppDataSource } from "../db/conexion";
import { Estudiante } from "../models/estudianteModels";

const estudianteRepo = AppDataSource.getRepository(Estudiante);

/**** INSERTAR ESTUDIANTE ****/
export const insertarEstudiante = async (req: Request, res: Response) => {
  try {
    const estudiante = estudianteRepo.create(req.body);
    await estudianteRepo.save(estudiante);
    return res.status(201).json(estudiante);
  } catch (error) {
    return res
      .status(500)
      .send(`Error en catch al insertar Estudiante ${error}`);
  }
};

/****  CONSULTAR ESTUDIANTES ****/
export const consultarEstudiantes = async (req: Request, res: Response) => {
  try {
    const estudiante = await estudianteRepo.find();
    return res.status(200).json(estudiante);
  } catch (error) {
    return res
      .status(500)
      .send(`Error en catch al consultar estudiantes ${error}`);
  }
};

/**** CONSULTAR UN ESTUDIANTE ****/
export const consultarUnEstudiante = async (req: Request, res: Response) => {
  try {
    const estudiante = await estudianteRepo.findOneBy({
      id: parseInt(req.params.id),
    });
    // Si no se encontro el estudiante con el ID, devolver un error 404
    if (!estudiante) {
      return res.status(404).json("Estudiante no encontrado");
    }
    // si se encontro el estudiante, devolvera los datos
    return res.status(200).json(estudiante);
  } catch (error) {
    return res
      .status(500)
      .send(`Error en catch al consultar el estudiante ${error}`);
  }
};

/*** MODIFICAR ESTUDIANTE ***/
export const modificarEstudiante = async (req: Request, res: Response) => {
  try {
    const estudiante = await estudianteRepo.findOneBy({
      id: parseInt(req.params.id),
    });
    if (!estudiante) {
      return res.status(404).json("Estudiante no encontrado");
    }
    estudianteRepo.merge(estudiante, req.body);
    await estudianteRepo.save(estudiante);
    return res.status(200).json(`Estudiante ${estudiante.dni} modificado`);
  } catch (error) {
    return res
      .status(500)
      .send(`Error en catch al modificar el estudiante ${error}`);
  }
};

/**** ELIMINAR ESTUDIANTE ****/
export const eliminarEstudiante = async (req: Request, res: Response) => {
  try {
    const estudiante = await estudianteRepo.findOneBy({
      id: parseInt(req.params.id),
    });
    if (!estudiante) {
      return res.status(404).json("Estudiante no encontrado");
    }
    await estudianteRepo.remove(estudiante);
    return res.status(200).json(`Estudiante ${estudiante.dni} eliminado`);
  } catch (error) {
    return res
      .status(500)
      .send(`Error en catch al eliminar el estudiante ${error}`);
  }
};
