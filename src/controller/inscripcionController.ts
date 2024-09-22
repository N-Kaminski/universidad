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
export const insertarInscripcion = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { curso_id, estudiante_id, nota } = req.body;

    const estudianteEncontrado: Estudiante | null =
      await estudianteRepo.findOneBy({
        id: parseInt(estudiante_id),
      });
    if (!estudianteEncontrado) {
      return res.status(404).json("Estudiante no encontrado");
    }

    const cursoEncontrado: Curso | null = await cursoRepo.findOneBy({
      id: parseInt(curso_id),
    });
    if (!cursoEncontrado) {
      return res.status(404).json("Curso no encontrado");
    }

    const inscripcionExistente = await inscripcionRepo.findOne({
      where: {
        curso_id: cursoEncontrado.id,
        estudiante_id: estudianteEncontrado.id,
      },
    });
    if (inscripcionExistente) {
      return res.status(400).json({
        message: "El estudiante ya está inscrito en este curso.",
      });
    }

    const inscripcion: Inscripcion = inscripcionRepo.create({
      estudiante: estudianteEncontrado,
      curso: cursoEncontrado,
      nota: nota || null,
    });
    await inscripcionRepo.save(inscripcion);
    return res.status(201).json(inscripcion);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error en catch al insertar inscripción",
      error: error.message,
    });
  }
};

/**** CONSULTAR INSCRIPCIONES (Listado general) ****/
export const consultarInscripciones = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const inscripciones: Inscripcion[] = await inscripcionRepo.find({
      relations: ["estudiante", "curso"],
    });
    if (!inscripciones || inscripciones.length === 0) {
      return res.status(404).json("No se encontraron inscripciones");
    }
    return res.status(200).json(inscripciones);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error en catch al consultar inscripciones",
      error: error.message,
    });
  }
};

/**** CONSULTAR INSCRIPCIONES POR CURSO (que alumnos tiene X curso?)****/
export const consultarInscripcionesPorCurso = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const inscripciones: Inscripcion[] = await inscripcionRepo.find({
      where: { curso: { id: parseInt(req.params.curso_id) } },
      relations: ["curso", "estudiante"],
    });
    if (inscripciones.length === 0) {
      return res.status(404).json("No hay inscripciones en este curso");
    }
    return res.status(200).json(inscripciones);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error en catch al consultar inscripciones", error });
  }
};

/**** CONSULTAR INSCRIPCIONES POR ESTUDIANTE (que cursos hace X estudiante)****/
export const consultarInscripcionesPorEstudiante = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const inscripciones: Inscripcion[] = await inscripcionRepo.find({
      where: { estudiante: { id: parseInt(req.params.estudiante_id) } },
      relations: ["curso", "estudiante"],
    });
    if (inscripciones.length === 0) {
      return res
        .status(404)
        .json("El estudiante no está inscrito en ningún curso");
    }
    return res.status(200).json(inscripciones);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error en catch al consultar inscripciones", error });
  }
};

/**** CONSULTAR NOTA ****/
export const consultarNota = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const cursoElegido: number = parseInt(req.params.curso_id);
    const estudianteElegido: number = parseInt(req.params.estudiante_id);

    // Validar que los parámetros sean números válidos
    if (isNaN(cursoElegido) || isNaN(estudianteElegido)) {
      return res.status(400).json("ID de curso o estudiante inválido");
    }

    const inscripcion: Inscripcion | null = await inscripcionRepo.findOne({
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
  } catch (error: any) {
    return res.status(500).json({
      message: "Error en catch al consultar nota",
      error: error.message,
    });
  }
};

/**** MODIFICAR NOTA ****/
export const modificarNota = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const cursoElegido: number = parseInt(req.params.curso_id);
    const estudianteElegido: number = parseInt(req.params.estudiante_id);
    const inscripcion: Inscripcion | null = await inscripcionRepo.findOne({
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
  } catch (error: any) {
    return res.status(500).json({
      message: "Error en catch al modificar nota",
      error: error.message,
    });
  }
};

/**** ELIMINAR INSCRIPCIÓN ****/
export const eliminarInscripcion = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const cursoElegido: number = parseInt(req.params.curso_id);
    const estudianteElegido: number = parseInt(req.params.estudiante_id);
    const inscripcion: Inscripcion | null = await inscripcionRepo.findOne({
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
  } catch (error: any) {
    return res.status(500).json({
      message: "Error en catch al eliminar la inscripción",
      error: error.message,
    });
  }
};
