import { Request, Response } from "express";
import { AppDataSource } from "../db/conexion";
import { Curso } from "../models/cursoModels";
import { Profesor } from "../models/profesorModels";

const cursoRepo = AppDataSource.getRepository(Curso);
const profesorRepo = AppDataSource.getRepository(Profesor);

/**** INSERTAR CURSO ****/
export const insertarCurso = async (req: Request, res: Response) => {
  try {
    const { nombre, descripcion, profesor_id } = req.body;

    const profesorId = Number(profesor_id);
    if (isNaN(profesorId)) {
      return res.status(400).json({ message: "ID de profesor inválido" });
    }

    // Buscar el profesor
    const profesorEncontrado = await profesorRepo.findOneBy({
      id: parseInt(profesor_id),
    });
    if (!profesorEncontrado) {
      return res.status(404).json("Profesor no encontrado");
    }

    // Crear el curso
    const curso = cursoRepo.create({
      nombre,
      descripcion,
      profesor: profesorEncontrado,
    });
    await cursoRepo.save(curso);
    return res.status(201).json(curso);
  } catch (error) {
    return res.status(500).send(`Error en catch al insertar curso: ${error}`);
  }
};

/****  CONSULTAR CURSOS ****/
export const consultarCursos = async (req: Request, res: Response) => {
  try {
    const cursos = await cursoRepo.find({
      relations: ["profesor"],
    });
    return res.status(200).json(cursos);
  } catch (error) {
    return res.status(500).send(`Error en catch al consultar cursos: ${error}`);
  }
};

/**** CONSULTAR UN CURSO ****/
export const consultarUnCurso = async (req: Request, res: Response) => {
  try {
    const curso = await cursoRepo.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ["profesor"],
    });
    if (!curso) {
      return res.status(404).json("Curso no encontrado");
    }
    return res.status(200).json(curso);
  } catch (error) {
    return res
      .status(500)
      .send(`Error en catch al consultar el curso: ${error}`);
  }
};

/**** MODIFICAR CURSO ****/
export const modificarCurso = async (req: Request, res: Response) => {
  try {
    const curso = await cursoRepo.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ["profesor"],
    });
    if (!curso) {
      return res.status(404).json("Curso no encontrado");
    }
    if (req.body.profesor_id) {
      const profesor = await profesorRepo.findOneBy({
        id: req.body.profesor_id,
      });
      if (!profesor) {
        return res.status(404).json("Profesor no encontrado");
      }
      curso.profesor = profesor; // Asignar el nuevo profesor
    }
    cursoRepo.merge(curso, req.body);
    await cursoRepo.save(curso);
    return res.status(200).json(`Curso ${curso.nombre} modificado`);
  } catch (error) {
    return res
      .status(500)
      .send(`Error en catch al modificar el curso: ${error}`);
  }
};

/**** ELIMINAR CURSO ****/
export const eliminarCurso = async (req: Request, res: Response) => {
  try {
    const curso = await cursoRepo.findOneBy({ id: parseInt(req.params.id) });
    if (!curso) {
      return res.status(404).json("Curso no encontrado");
    }
    await cursoRepo.remove(curso);
    return res.status(200).json(`Curso ${curso.nombre} eliminado`);
  } catch (error) {
    return res
      .status(500)
      .send(`Error en catch al eliminar el curso: ${error}`);
  }
};
