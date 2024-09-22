import { Request, Response } from "express";
import { AppDataSource } from "../db/conexion";
import { Curso } from "../models/cursoModels";
import { Profesor } from "../models/profesorModels";

const cursoRepo = AppDataSource.getRepository(Curso);
const profesorRepo = AppDataSource.getRepository(Profesor);

/**** INSERTAR CURSO ****/
export const insertarCurso = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { nombre, descripcion, profesor_id } = req.body;

    const profesorId: number = Number(profesor_id);
    if (isNaN(profesorId)) {
      return res.status(400).json({ message: "ID de profesor inválido" });
    }

    // Buscar el profesor
    const profesorEncontrado: Profesor | null = await profesorRepo.findOneBy({
      id: parseInt(profesor_id),
    });
    if (!profesorEncontrado) {
      return res.status(404).json({ message: "Profesor no encontrado" });
    }

    // Crear el curso
    const curso: Curso = cursoRepo.create({
      nombre,
      descripcion,
      profesor: profesorEncontrado,
    });
    await cursoRepo.save(curso);
    return res.status(201).json(curso);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error en catch al insertar curso",
      error: error.message,
    });
  }
};

/****  CONSULTAR CURSOS ****/
export const consultarCursos = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const cursos: Curso[] = await cursoRepo.find({
      relations: ["profesor"],
    });
    return res.status(200).json(cursos);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error en catch al consultar los cursos",
      error: error.message,
    });
  }
};

/**** CONSULTAR UN CURSO ****/
export const consultarUnCurso = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const curso: Curso | null = await cursoRepo.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ["profesor"],
    });
    if (!curso) {
      return res.status(404).json("Curso no encontrado");
    }
    return res.status(200).json(curso);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error en catch al consultar el curso",
      error: error.message,
    });
  }
};

/**** MODIFICAR CURSO ****/
export const modificarCurso = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const curso: Curso | null = await cursoRepo.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ["profesor"],
    });
    if (!curso) {
      return res.status(404).json("Curso no encontrado");
    }
    if (req.body.profesor_id) {
      const profesor: Profesor | null = await profesorRepo.findOneBy({
        id: req.body.profesor_id,
      });
      if (!profesor) {
        return res.status(404).json("Profesor no encontrado");
      }
      curso.profesor = profesor;
    }
    cursoRepo.merge(curso, req.body);
    await cursoRepo.save(curso);
    return res.status(200).json(`Curso ${curso.nombre} modificado`);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error en catch al modificar el curso",
      error: error.message,
    });
  }
};

/**** ELIMINAR CURSO ****/
export const eliminarCurso = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const curso: Curso | null = await cursoRepo.findOneBy({
      id: parseInt(req.params.id),
    });
    if (!curso) {
      return res.status(404).json("Curso no encontrado");
    }
    await cursoRepo.remove(curso);
    return res.status(200).json(`Curso ${curso.nombre} eliminado`);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error en catch al eliminar el curso", error: error });
  }
};
