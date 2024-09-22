import { Request, Response } from "express";
import { AppDataSource } from "../db/conexion";
import { Estudiante } from "../models/estudianteModels";

const estudianteRepo = AppDataSource.getRepository(Estudiante);

/**** INSERTAR ESTUDIANTE ****/
export const insertarEstudiante = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const existeEstudiante: Estudiante | null = await estudianteRepo.findOneBy({
      dni: req.body.dni,
    });
    if (existeEstudiante) {
      return res.status(400).json({ message: "El estudiante ya existe" });
    }
    const estudiante = estudianteRepo.create(req.body);
    await estudianteRepo.save(estudiante);
    return res.status(201).json(estudiante);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error en catch al insertar Estudiante",
      error: error.message,
    });
  }
};

/****  CONSULTAR ESTUDIANTES ****/
export const consultarEstudiantes = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const estudiante: Estudiante[] = await estudianteRepo.find();
    return res.status(200).json(estudiante);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error en catch al consultar estudiantes",
      error: error.message,
    });
  }
};

/**** CONSULTAR UN ESTUDIANTE ****/
export const consultarUnEstudiante = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const estudiante: Estudiante | null = await estudianteRepo.findOneBy({
      id: parseInt(req.params.id),
    });
    // Si no se encontro el estudiante con el ID, devolver un error 404
    if (!estudiante) {
      return res.status(404).json("Estudiante no encontrado");
    }
    // si se encontro el estudiante, devolvera los datos
    return res.status(200).json(estudiante);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error en catch al consultar el estudiante",
      error: error.message,
    });
  }
};

/*** MODIFICAR ESTUDIANTE ***/
export const modificarEstudiante = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const estudiante: Estudiante | null = await estudianteRepo.findOneBy({
      id: parseInt(req.params.id),
    });
    if (!estudiante) {
      return res.status(404).json("Estudiante no encontrado");
    }
    estudianteRepo.merge(estudiante, req.body);
    await estudianteRepo.save(estudiante);
    return res.status(200).json(`Estudiante ${estudiante.dni} modificado`);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error en catch al modificar el estudiante",
      error: error.message,
    });
  }
};

/**** ELIMINAR ESTUDIANTE ****/
export const eliminarEstudiante = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const estudiante: Estudiante | null = await estudianteRepo.findOneBy({
      id: parseInt(req.params.id),
    });
    if (!estudiante) {
      return res.status(404).json("Estudiante no encontrado");
    }
    await estudianteRepo.remove(estudiante);
    return res.status(200).json(`Estudiante ${estudiante.dni} eliminado`);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error en catch al eliminar el estudiante",
      error: error.message,
    });
  }
};
