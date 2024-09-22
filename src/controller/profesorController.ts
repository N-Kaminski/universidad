import { Request, Response } from "express";
import { AppDataSource } from "../db/conexion";
import { Profesor } from "../models/profesorModels";

const profesorRepo = AppDataSource.getRepository(Profesor);

/**** INSERTAR PROFESOR ****/
export const insertarProfesor = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const existeProfe: Profesor | null = await profesorRepo.findOneBy({
      dni: req.body.dni,
    });
    if (existeProfe) {
      return res.status(400).json({ message: "El profesor ya existe" });
    }
    const profesor = profesorRepo.create(req.body);
    await profesorRepo.save(profesor);
    return res.status(201).json(profesor);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error en catch al insertar Profesor", error: error });
  }
};

/**** CONSULTAR PROFESORES ****/
export const consultarProfesores = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const profesores: Profesor[] = await profesorRepo.find();
    return res.status(200).json(profesores);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error en catch al consultar Profesores",
      error: error,
    });
  }
};

/**** CONSULTAR UN PROFESOR ****/
export const consultarUnProfesor = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const profesor: Profesor | null = await profesorRepo.findOneBy({
      id: parseInt(req.params.id),
    });
    if (!profesor) {
      return res.status(404).json("Profesor no encontrado");
    }
    return res.status(200).json(profesor);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error en catch al consultar Profesor", error: error });
  }
};

/**** MODIFICAR PROFESOR ****/
export const modificarProfesor = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const profesor: Profesor | null = await profesorRepo.findOneBy({
      id: parseInt(req.params.id),
    });
    if (!profesor) {
      return res.status(404).json("Profesor no encontrado");
    }
    profesorRepo.merge(profesor, req.body);
    await profesorRepo.save(profesor);
    return res.status(200).json(`Profesor ${profesor.dni} modificado`);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error en catch al modificar el Profesor",
      error: error,
    });
  }
};

/**** ELIMINAR PROFESOR ****/
export const eliminarProfesor = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const profesor: Profesor | null = await profesorRepo.findOneBy({
      id: parseInt(req.params.id),
    });
    if (!profesor) {
      return res.status(404).json("Profesor no encontrado");
    }
    await profesorRepo.remove(profesor);
    return res.status(200).json(`Profesor ${profesor.dni} eliminado`);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error en catch al eliminar el Profesor",
      error: error,
    });
  }
};
