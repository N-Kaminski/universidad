import { Request, Response } from "express";
import { poolDB } from "../db/conexion"; //nos conectamos a la base de datos
import joi from "joi"; //validaciones con joi
import { RowDataPacket } from "mysql2";
import { ResultSetHeader } from "mysql2";

// const { json } = require("express"); //para parsear el body (traer/enviar datos)
// const db = require("../database/conexion");
// const joi = require("joi");

class EstudianteController {
  constructor() {}

  //INSERTAR ESTUDIANTE
  async insertar(req: Request, res: Response): Promise<Response> {
    const { dni, nombre, apellido, email } = req.body; //lo trae del body

    //#region Validaciones Joi
    const valid = joi.object({
      dni: joi.string().required(),
      nombre: joi.string().required(),
      apellido: joi.string().required(),
      email: joi.string().email().required(),
    });
    const { error } = valid.validate({ dni, nombre, apellido, email });
    if (error) {
      return res
        .status(400)
        .send(`Error de validacion: ${error.details[0].message}`);
    }
    //#endregion

    const sql = `INSERT INTO estudiantes (dni, nombre, apellido, email) VALUES (?, ?, ?, ?)`;

    try {
      const [acto] = await poolDB.query<ResultSetHeader>(sql, [
        dni,
        nombre,
        apellido,
        email,
      ]);
      return res.status(201).json({ id: acto.insertId, dni, nombre, apellido });
    } catch (error) {
      return res.status(500).send("Error en catch al insertar Estudiante");
    }
  }

  //CONSULTAR ESTUDIANTES
  async consultar(req: Request, res: Response): Promise<Response> {
    const sql = `SELECT * FROM estudiantes`;
    try {
      const [busca] = await poolDB.query<RowDataPacket[][]>(sql);
      return res.status(200).json(busca);
    } catch (error) {
      return res.status(500).send(`Error en catch al consultar estudiantes`);
    }
  }

  //CONSULTAR UN ESTUDIANTE
  async consultarUno(req: Request, res: Response): Promise<Response> {
    const { id } = req.params; // Extrae el ID del estudiante de los parámetros de la solicitud

    //#region Validaciones Joi
    const valid = joi.object({
      // Validar que el ID es un número usando Joi
      id: joi.number().integer().required(),
    });
    const { error } = valid.validate({ id });
    // Si la validación falla, devolver un error de validación
    if (error) {
      return res
        .status(400)
        .send(`Error de validacion: ${error.details[0].message}`);
    }
    //#endregion

    const sql = `SELECT * FROM estudiantes WHERE id = ?`;

    try {
      // Ejecutar la consulta para buscar el estudiante en la base de datos por su ID
      const [busca] = await poolDB.query<RowDataPacket[] | RowDataPacket[][]>(
        sql,
        [id]
      );
      // Si no se encontro el estudiante con el ID, devolver un error 404
      if (busca.length === 0) {
        return res.status(404).json("Estudiante no encontrado");
      }
      // si se encontro el estudiante, devolvera los datos
      return res.status(200).json(busca[0]);
    } catch (error) {
      // si hay algun error durante la consulta, devuelver un error 500
      return res.status(500).send("Error en catch al consultar el estudiante");
    }
  }

  //MODIFICAR ESTUDIANTE
  async modificar(req: Request, res: Response): Promise<Response> {
    const { id } = req.params; //viene por parametro
    const { dni, nombre, apellido, email } = req.body; //viene por body

    //#region Validaciones Joi
    const valid = joi.object({
      id: joi.number().integer().required(),
      dni: joi.string().required(),
      nombre: joi.string().required(),
      apellido: joi.string().required(),
      email: joi.string().email().required(),
    });
    const { error } = valid.validate({ id, dni, nombre, apellido, email });
    if (error) {
      return res
        .status(400)
        .send(`Error de validacion: ${error.details[0].message}`);
    }
    //#endregion

    const sql = `SELECT * FROM estudiantes WHERE id = ?`;
    try {
      const [acto] = await poolDB.query<ResultSetHeader>(sql, [
        dni,
        nombre,
        apellido,
        email,
        id,
      ]);
      if (acto.affectedRows == 0) {
        //el == 0 es: si no se modifico ninguna fila
        return res.status(400).json("el estudiante no existe");
      } else {
        return res.status(200).json({ res: "Estudiante Actualizado!" });
      }
    } catch (error) {
      return res.status(500).send("Error en catch al modificar");
    }
  }

  //ELIMINAR ESTUDIANTE
  async eliminar(req: Request, res: Response): Promise<Response> {
    const { id } = req.params; //viene por parametro

    //#region validaciones joi
    const valid = joi.object({
      id: joi.number().integer().required(),
    });
    const { error } = valid.validate({ id });
    if (error) {
      return res
        .status(400)
        .send(`Error de validacion: ${error.details[0].message}`);
    }
    //#endregion

    const sql1 = `SELECT COUNT(*) AS Total FROM cursos_estudiantes WHERE estudiante_id = ?`;
    const sql2 = `DELETE FROM estudiantes WHERE id = ?`;
    const conex = await poolDB.getConnection();

    try {
      await conex.beginTransaction();
      const [busca] = await conex.query<RowDataPacket[]>(sql1, [id]);
      if (busca[0].Total > 0) {
        // si tiene inscripciones asignadas
        await conex.rollback();
        return res
          .status(400)
          .json(
            "No se puede eliminar el estudiante, esta inscripto a un curso"
          );
      }
      const [acto] = await conex.query<ResultSetHeader>(sql2, [id]);
      if (acto.affectedRows == 1) {
        //el ==1 es: si se modifico alguna fila
        return res.status(200).json({ res: "Estudiante Eliminado!" });
      } else {
        return res.status(400).json("El estudiante no existe");
      }
    } catch (error) {
      return res.status(500).send("Error en catch al eliminar");
    } finally {
      conex.release();
    }
  }
}

export const estudianteController = new EstudianteController();
// module.exports = new EstudianteController();
// module.exports = new EstudianteController();
