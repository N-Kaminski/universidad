import { Request, Response } from "express";
import { poolDB } from "../db/conexion"; //nos conectamos a la base de datos
import joi from "joi"; //validaciones con joi
import { RowDataPacket } from "mysql2";
import { ResultSetHeader } from "mysql2";

// const { json } = require("express");
// const db = require("../database/conexion");
// const joi = require("joi");

class InscripcionController {
  constructor() {}

  // INSCRIBIR ALUMNO A CURSO
  async insertar(req: Request, res: Response): Promise<Response> {
    const { curso_id, estudiante_id } = req.body;

    //#region validaciones joi
    const valid = joi.object({
      curso_id: joi.number().integer().required(),
      estudiante_id: joi.number().integer().required(),
    });
    //validar la solicitud
    const { error } = valid.validate({ curso_id, estudiante_id });
    if (error) {
      return res
        .status(400)
        .send(`Error de validación: ${error.details[0].message}`);
    }
    //#endregion

    const sql1 = `SELECT COUNT(*) AS Total FROM cursos WHERE id = ?`;
    const sql2 = `SELECT COUNT(*) AS Total FROM estudiantes WHERE id = ?`;
    const sql3 = `INSERT INTO cursos_estudiantes (curso_id, estudiante_id) VALUES (?, ?)`;
    const conex = await poolDB.getConnection();

    try {
      await conex.beginTransaction();
      //existe el curso?
      const [busca] = await poolDB.query<RowDataPacket[]>(sql1, [curso_id]);
      if (busca[0].Total === 0) {
        await conex.rollback();
        return res.status(400).json("El curso no existe");
      }
      //existe el estudiante?
      const [busca2] = await poolDB.query<RowDataPacket[]>(sql2, [
        estudiante_id,
      ]);
      if (busca2[0].Total === 0) {
        await conex.rollback();
        return res.status(400).json("El estudiante no existe");
      }
      //si el estudiante y el curso SI existen
      const [acto] = await poolDB.query<ResultSetHeader>(sql3, [
        curso_id,
        estudiante_id,
      ]);
      if (acto.affectedRows === 1) {
        await conex.commit();
        return res
          .status(201)
          .json({ id: acto.insertId, curso_id, estudiante_id });
      } else {
        await conex.rollback();
        return res
          .status(400)
          .json("Error al inscribir el estudiante al curso");
      }
    } catch (error) {
      await conex.rollback();
      return res
        .status(500)
        .send("Error en catch al inscribir el estudiante al curso");
    } finally {
      await conex.release();
    }
  }

  //CONSULTAR LISTADO DE INSCRIPCIONES POR CURSO
  async consultar(req: Request, res: Response): Promise<Response> {
    const sql = `SELECT estudiantes.nombre AS estudiante, cursos.nombre AS curso FROM cursos_estudiantes 
         JOIN estudiantes ON cursos_estudiantes.estudiante_id = estudiantes.id 
         JOIN cursos ON cursos_estudiantes.curso_id = cursos.id`;
    try {
      const [busca] = await poolDB.query<RowDataPacket[]>(sql);
      // si esta bien devuleve todas las filas
      return res.status(200).json(busca);
    } catch (error) {
      return res
        .status(500)
        .send("Error en catch al consultar las inscripciones");
    }
  }

  //CONSULTAR INSCRIPCION POR ESTUDIANTE
  async consultarEstudiante(req: Request, res: Response): Promise<Response> {
    const { estudiante_id } = req.params;

    //#region validaciones joi
    const valid = joi.object({
      estudiante_id: joi.number().integer().required(),
    });
    const { error } = valid.validate({ estudiante_id });
    if (error) {
      return res
        .status(400)
        .send(`Error de validación: ${error.details[0].message}`);
    }
    //#endregion

    const sql = `SELECT estudiantes.nombre AS estudiante, cursos.nombre AS curso FROM cursos_estudiantes 
         JOIN estudiantes ON cursos_estudiantes.estudiante_id = estudiantes.id 
         JOIN cursos ON cursos_estudiantes.curso_id = cursos.id
         WHERE estudiante_id = ?`;

    try {
      const [busca] = await poolDB.query<RowDataPacket[]>(sql, [estudiante_id]);
      if (busca.length === 0) {
        return res.status(404).json("Estudiante no encontrado");
      }
      return res.status(200).json(busca);
    } catch (error) {
      return res
        .status(500)
        .send("Error en catch al consultar las inscripciones por estudiante");
    }
  }

  //CONSULTAR INSCRIPCION POR CURSO
  async consultarCurso(req: Request, res: Response): Promise<Response> {
    const { curso_id } = req.params;

    //#region validaciones joi
    const valid = joi.object({
      curso_id: joi.number().integer().required(),
    });
    const { error } = valid.validate({ curso_id });
    if (error) {
      return res
        .status(400)
        .send(`Error de validación: ${error.details[0].message}`);
    }
    //#endregion

    const sql = `SELECT estudiantes.nombre AS estudiante, cursos.nombre AS curso FROM cursos_estudiantes 
         JOIN estudiantes ON cursos_estudiantes.estudiante_id = estudiantes.id 
         JOIN cursos ON cursos_estudiantes.curso_id = cursos.id
         WHERE curso_id = ?`;

    try {
      const [busca] = await poolDB.query<RowDataPacket[]>(sql, [curso_id]);
      if (busca.length === 0) {
        return res.status(404).json("Curso no encontrado");
      }
      return res.status(200).json(busca);
    } catch (error) {
      return res
        .status(500)
        .send("Error en catch al consultar las inscripciones por curso");
    }
  }

  //CONSULTAR NOTA
  async consultarNota(req: Request, res: Response): Promise<Response> {
    const { curso_id, estudiante_id } = req.params;

    //#region validaciones joi
    const valid = joi.object({
      curso_id: joi.number().integer().required(),
      estudiante_id: joi.number().integer().required(),
    });
    const { error } = valid.validate({ curso_id, estudiante_id });
    if (error) {
      return res
        .status(400)
        .send(`Error de validación: ${error.details[0].message}`);
    }
    //#endregion

    const sql = `SELECT estudiantes.nombre AS estudiante, cursos.nombre AS curso, nota FROM cursos_estudiantes 
         JOIN estudiantes ON cursos_estudiantes.estudiante_id = estudiantes.id 
         JOIN cursos ON cursos_estudiantes.curso_id = cursos.id
         WHERE curso_id = ? AND estudiante_id = ?`;

    try {
      const [busca] = await poolDB.query<RowDataPacket[]>(sql, [
        curso_id,
        estudiante_id,
      ]);
      if (busca.length === 0) {
        return res.status(404).json("Curso no encontrado");
      }
      return res.status(200).json(busca[0]);
    } catch (error) {
      return res.status(500).send("Error en catch al consultar la nota");
    }
  }

  //MODIFICAR NOTA
  async modificar(req: Request, res: Response): Promise<Response> {
    const { curso_id, estudiante_id } = req.params;
    const { nota } = req.body;

    //#region validaciones joi
    const valid = joi.object({
      curso_id: joi.number().integer().required(),
      estudiante_id: joi.number().integer().required(),
      nota: joi.number().min(0).max(10).required(),
    });
    const { error } = valid.validate({ curso_id, estudiante_id, nota });
    if (error) {
      return res
        .status(400)
        .send(`Error de validacion: ${error.details[0].message}`);
    }
    //#endregion

    const sql1 = `SELECT COUNT(*) AS Total FROM cursos_estudiantes 
         WHERE curso_id = ? AND estudiante_id = ?`;
    const sql2 = `UPDATE cursos_estudiantes SET nota = ? 
         WHERE curso_id = ? AND estudiante_id = ?`;
    const conex = await poolDB.getConnection();

    try {
      // el estudiante esta inscrito?
      await conex.beginTransaction();
      const [busca] = await conex.query<RowDataPacket[]>(sql1, [
        curso_id,
        estudiante_id,
      ]);
      if (busca[0].Total === 0) {
        await conex.rollback();
        return res
          .status(404)
          .json("El estudiante no esta inscripto en este curso");
      }
      // Modificar la nota
      const [acto] = await conex.query<ResultSetHeader>(sql2, [
        nota,
        curso_id,
        estudiante_id,
      ]);
      if (acto.affectedRows === 0) {
        await conex.rollback();
        return res.status(400).json("No se pudo modificar la nota");
      }
      await conex.commit();
      return res.status(200).json("Nota modificada!");
    } catch (error) {
      await conex.rollback();
      return res
        .status(500)
        .send("Error en catch al modificar la nota del estudiante");
    } finally {
      await conex.release();
    }
  }

  //ELIMINAR INSCRIPCION
  async eliminar(req: Request, res: Response): Promise<Response> {
    const { curso_id, estudiante_id } = req.params;

    //#region validaciones joi
    const valid = joi.object({
      curso_id: joi.number().integer().required(),
      estudiante_id: joi.number().integer().required(),
    });
    const { error } = valid.validate({ curso_id, estudiante_id });
    if (error) {
      return res
        .status(400)
        .send(`Error de validación: ${error.details[0].message}`);
    }
    //#endregion

    const sql1 = `SELECT COUNT(*) AS Total FROM cursos_estudiantes WHERE curso_id = ? AND estudiante_id = ?`;
    const sql2 = `DELETE FROM cursos_estudiantes WHERE curso_id = ? AND estudiante_id = ?`;
    const conex = await poolDB.getConnection();

    try {
      await conex.beginTransaction();
      // el estudiante esta inscrito?
      const [busca] = await conex.query<RowDataPacket[]>(sql1, [
        curso_id,
        estudiante_id,
      ]);
      if (busca[0].Total === 0) {
        await conex.rollback();
        return res
          .status(404)
          .json("El estudiante no esta inscripto en este curso");
      }
      // Eliminar la inscripcion
      const [acto] = await conex.query<ResultSetHeader>(sql2, [
        curso_id,
        estudiante_id,
      ]);
      if (acto.affectedRows === 1) {
        await conex.commit();
        return res.status(200).json("Inscripción eliminada");
      } else {
        await conex.rollback();
        return res.status(400).json("No se pudo eliminar la inscripcioon");
      }
    } catch (error) {
      return res
        .status(500)
        .send("Error en catch al eliminar la inscripción del estudiante");
    }
  }
}

export const inscripcionController = new InscripcionController();
// module.exports = new InscripcionController();
