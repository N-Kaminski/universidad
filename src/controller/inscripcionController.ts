import { Request, Response } from "express";
import { AppDataSource } from "../db/conexion";
import { Inscripcion } from "../models/inscripcionModels";
import { Estudiante } from "../models/estudianteModels";
import { Curso } from "../models/cursoModels";

// Repositorios
const inscripcionRepo = AppDataSource.getRepository(Inscripcion);
const estudianteRepo = AppDataSource.getRepository(Estudiante);
const cursoRepo = AppDataSource.getRepository(Curso);

/**** INSCRIBIR ALUMNO A CURSO ****/
export const insertarInscripcion = async (req: Request, res: Response) => {
  try {
    const { curso_id, estudiante_id, nota } = req.body;

    const estudianteEncontrado = await estudianteRepo.findOneBy({
      id: parseInt(estudiante_id),
    });
    if (!estudianteEncontrado) {
      return res.status(404).json("Estudiante no encontrado");
    }

    const cursoEmcontrado = await cursoRepo.findOneBy({
      id: parseInt(curso_id),
    });
    if (!cursoEmcontrado) {
      return res.status(404).json("Curso no encontrado");
    }

    const inscripcion = inscripcionRepo.create({
      estudiante: estudianteEncontrado,
      curso: cursoEmcontrado,
      nota,
    });
    await inscripcionRepo.save(inscripcion);
    return res.status(201).json(inscripcion);
  } catch (error) {
    return res.status(500).send(`Error al insertar inscripción: ${error}`);
  }
};

/**** CONSULTAR INSCRIPCIONES (Listado general) ****/
export const consultarInscripciones = async (req: Request, res: Response) => {
  try {
    const inscripciones = await inscripcionRepo.find({
      relations: ["estudiante", "curso"],
    });
    if (!inscripciones || inscripciones.length === 0) {
      return res.status(404).json("No se encontraron inscripciones");
    }
    return res.status(200).json(inscripciones);
  } catch (error) {
    return res.status(500).send(`Error al consultar inscripciones: ${error}`);
  }
};

/**** CONSULTAR INSCRIPCIONES POR CURSO (que alumnos tien X curso?)****/
export const consultarInscripcionesPorCurso = async (
  req: Request,
  res: Response
) => {
  try {
    const inscripciones = await inscripcionRepo.find({
      where: { curso: { id: parseInt(req.params.curso_id) } },
      relations: ["curso", "estudiante"],
    });
    if (inscripciones.length === 0) {
      return res.status(404).json("No hay inscripciones en este curso");
    }
    return res.status(200).json(inscripciones);
  } catch (error) {
    return res
      .status(500)
      .send(`Error al consultar inscripciones por curso: ${error}`);
  }
};

/**** CONSULTAR INSCRIPCIONES POR ESTUDIANTE (que cursos hace X estudiante)****/
export const consultarInscripcionesPorEstudiante = async (
  req: Request,
  res: Response
) => {
  try {
    const inscripciones = await inscripcionRepo.find({
      where: { estudiante: { id: parseInt(req.params.estudiante_id) } },
      relations: ["curso", "estudiante"],
    });
    if (inscripciones.length === 0) {
      return res
        .status(404)
        .json("El estudiante no está inscrito en ningún curso");
    }
    return res.status(200).json(inscripciones);
  } catch (error) {
    return res
      .status(500)
      .send(`Error al consultar inscripciones por estudiante: ${error}`);
  }
};

/**** CONSULTAR NOTA ****/
export const consultarNota = async (req: Request, res: Response) => {
  try {
    const cursoElegido = parseInt(req.params.curso_id);
    const estudianteElegido = parseInt(req.params.estudiante_id);

    // Validar que los parámetros sean números válidos
    if (isNaN(cursoElegido) || isNaN(estudianteElegido)) {
      return res.status(400).json("ID de curso o estudiante inválido");
    }

    const inscripcion = await inscripcionRepo.findOne({
      where: {
        curso: { id: cursoElegido },
        estudiante: { id: estudianteElegido },
      },
      relations: ["curso", "estudiante"],
    });

    if (!inscripcion) {
      return res.status(404).json("Inscripción no encontrada");
    }
    return res.status(200).json({ nota: inscripcion.nota });
  } catch (error) {
    return res.status(500).send(`Error al consultar la nota: ${error}`);
  }
};

/**** MODIFICAR NOTA ****/
export const modificarNota = async (req: Request, res: Response) => {
  try {
    const cursoElegido = parseInt(req.params.curso_id);
    const estudianteElegido = parseInt(req.params.estudiante_id);
    const inscripcion = await inscripcionRepo.findOne({
      where: {
        curso: { id: cursoElegido },
        estudiante: { id: estudianteElegido },
      },
      relations: ["curso", "estudiante"],
    });
    if (!inscripcion) {
      return res.status(404).json("Inscripción no encontrada");
    }

    inscripcion.nota = req.body.nota;
    await inscripcionRepo.save(inscripcion);
    return res.status(200).json("Nota modificada");
  } catch (error) {
    return res.status(500).send(`Error al modificar la nota: ${error}`);
  }
};

/**** ELIMINAR INSCRIPCIÓN ****/
export const eliminarInscripcion = async (req: Request, res: Response) => {
  try {
    const cursoElegido = parseInt(req.params.curso_id);
    const estudianteElegido = parseInt(req.params.estudiante_id);
    const inscripcion = await inscripcionRepo.findOne({
      where: {
        curso: { id: cursoElegido },
        estudiante: { id: estudianteElegido },
      },
      relations: ["curso", "estudiante"],
    });
    if (!inscripcion) {
      return res.status(404).json("Inscripción no encontrada");
    }

    await inscripcionRepo.remove(inscripcion);
    return res.status(200).json("Inscripción eliminada");
  } catch (error) {
    return res.status(500).send(`Error al eliminar la inscripción: ${error}`);
  }
};
