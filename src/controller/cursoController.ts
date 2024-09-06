import { Request, Response } from "express";
import { poolDB } from "../db/conexion"; //nos conectamos a la base de datos
import joi from "joi"; //validaciones con joi
import { RowDataPacket } from "mysql2";
import { ResultSetHeader } from "mysql2";

// const { json } = require("express");
// const db = require("../database/conexion");
// const joi = require("joi");

class CursoController {
  constructor() {}

  //INSERTAR CURSO
  async insertar(req: Request, res: Response): Promise<Response> {
    const { nombre, descripcion, profesor_id } = req.body; //obtenemos los datos que vamos a insertar del body

    //#region Validaciones Joi
    const valid = joi.object({
      nombre: joi.string().required(),
      descripcion: joi.string().required(),
      profesor_id: joi.number().integer().required(),
    });
    const { error } = valid.validate({ nombre, descripcion, profesor_id });
    if (error) {
      return res
        .status(400)
        .send(`Error de validacion: ${error.details[0].message}`);
    }
    //#endregion

    const sql1 = `SELECT COUNT(*) AS Total FROM profesores WHERE id = ?`;
    const sql2 = `INSERT INTO cursos (nombre, descripcion, profesor_id) VALUES (?, ?, ?)`;
    const conex = await poolDB.getConnection();

    try {
      await conex.beginTransaction();
      //existe el profesor?
      const [busca] = await conex.query<RowDataPacket[]>(sql1, [profesor_id]);
      // si el profe no existe:
      if (busca[0].Total === 0) {
        await conex.rollback();
        return res.status(400).json("El profesor no existe");
      }
      //si el profe existe
      const [acto] = await conex.query<ResultSetHeader>(sql2, [
        nombre,
        descripcion,
        profesor_id,
      ]);
      if (acto.affectedRows === 1) {
        await conex.commit();
        return res.status(201).json({ id: acto.insertId, nombre, descripcion });
      } else {
        await conex.rollback();
        return res.status(400).json("Error al insertar el curso");
      }
    } catch (error) {
      await conex.rollback();
      return res
        .status(500)
        .json({ message: "Error en catch al insertar el curso" });
    } finally {
      conex.release();
    }
  }

  //CONSULTAR CURSOS
  async consultar(req: Request, res: Response): Promise<Response> {
    const sql = `SELECT * FROM cursos`;
    try {
      const [busca] = await poolDB.query(sql);
      return res.status(200).json(busca);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error en catch al consultar los cursos" });
    }
  }

  //CONSULTAR UN CURSO
  async consultarUno(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    //#region validaciones joi

    const valid = joi.object({
      id: joi.number().integer().required(),
    });
    const { error } = valid.validate({ id });
    if (error) {
      return res.status(400).send(`Error de validacion: ${error.message}`);
    }
    //#endregion

    const sql = `SELECT * FROM cursos WHERE id = ?`;

    try {
      const [busca] = await poolDB.query<RowDataPacket[] | RowDataPacket[][]>(
        sql,
        [id]
      );
      if (busca.length === 0) {
        return res.status(404).json("Curso no encontrado");
      }
      return res.status(200).json(busca[0]);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error en catch al consultar el curso" });
    }
  }

  //MODIFICAR CURSO
  async modificar(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { nombre, descripcion, profesor_id } = req.body;

    //#region validaciones joi
    const valid = joi.object({
      id: joi.number().integer().required(),
      nombre: joi.string().required(),
      descripcion: joi.string().required(),
      profesor_id: joi.number().integer().required(),
    });
    const { error } = valid.validate({ id, nombre, descripcion, profesor_id });
    if (error) {
      return res
        .status(400)
        .send(`Error de validacion: ${error.details[0].message}`);
    }
    //#endregion

    const sql1 = `SELECT COUNT(*) AS Total FROM profesores WHERE id = ?`;
    const sql2 = `UPDATE cursos SET nombre = ?, descripcion = ?, profesor_id = ? WHERE id = ?`;
    const conex = await poolDB.getConnection();

    try {
      await conex.beginTransaction();
      //existe el profesor?
      const [busca] = await conex.query<RowDataPacket[]>(sql1, [profesor_id]);
      // si el profe no existe:
      if (busca[0].Total === 0) {
        await conex.rollback();
        return res.status(400).json("El profesor no existe");
      }
      //si el profe existe
      const [acto] = await conex.query<ResultSetHeader>(sql2, [
        nombre,
        descripcion,
        profesor_id,
        id,
      ]);
      // si el curso no existe
      if (acto.affectedRows === 0) {
        await conex.rollback();
        return res.status(400).json("el curso no existe");
      } else {
        // si todo salio bien
        await conex.commit();
        return res.status(200).json({ res: "Curso Actualizado!" });
      }
    } catch (error) {
      await conex.rollback();
      return res
        .status(500)
        .json({ message: "Error en catch al modificar el curso" });
    } finally {
      conex.release();
    }
  }

  //ELIMINAR CURSO
  async eliminar(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    //#region validaciones joi
    const valid = joi.object({
      id: joi.number().integer().required(),
    });
    const { error } = valid.validate({ id });
    if (error) {
      return res
        .status(400)
        .send(`Error de validación: ${error.details[0].message}`);
    }
    //#endregion

    const sql1 = `SELECT COUNT(*) AS Total FROM profesores WHERE id = ?`;
    const sql2 = `DELETE FROM cursos WHERE id = ?`;
    const conex = await poolDB.getConnection();

    try {
      await conex.beginTransaction();
      const [busca] = await conex.query<RowDataPacket[]>(sql1, [id]);
      if (busca[0].Total > 0) {
        await conex.rollback();
        return res
          .status(400)
          .json("No se puede eliminar el curso, tiene un profesor asignado");
      }
      const [acto] = await conex.query<ResultSetHeader>(sql2, [id]);
      if (acto.affectedRows === 1) {
        return res.status(200).json({ res: "Curso Eliminado!" });
      } else {
        return res.status(400).json("el curso no existe");
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error en catch al insertar el curso" });
    }
  }
}

export const cursoController = new CursoController();
// module.exports = new CursoController();
