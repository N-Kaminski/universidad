import { Request, Response } from "express";
import { poolDB } from "../db/conexion"; //nos conectamos a la base de datos
import joi from "joi"; //validaciones con joi
import { RowDataPacket } from "mysql2";
import { ResultSetHeader } from "mysql2";

// const { json } = require("express");
// const db = require("../db/conexion");
// const joi = require("joi");

class ProfesorController {
  constructor() {}

  //INSERTAR PROFESOR
  async insertar(req: Request, res: Response): Promise<Response> {
    const { dni, nombre, apellido, email, profesion, telefono } = req.body; //lo trae del body

    //#region Validaciones Joi
    const valid = joi.object({
      dni: joi.string().required(),
      nombre: joi.string().required(),
      apellido: joi.string().required(),
      email: joi.string().email().required(),
      profesion: joi.string().required(),
      telefono: joi.string().required(),
    });
    const { error } = valid.validate({
      dni,
      nombre,
      apellido,
      email,
      profesion,
      telefono,
    });
    if (error) {
      return res
        .status(400)
        .send(`Error de validacion: ${error.details[0].message}`);
    }
    //#endregion

    const sql = `INSERT INTO profesores (dni, nombre, apellido, email, profesion, telefono) VALUES (?, ?, ?, ?, ?, ?)`;

    try {
      const [acto] = await poolDB.query<ResultSetHeader>(sql, [
        dni,
        nombre,
        apellido,
        email,
        profesion,
        telefono,
      ]);
      return res.status(201).json({ id: acto.insertId, dni, nombre, apellido });
    } catch (error) {
      return res.status(500).send("Error en catch al insertar el profesor");
    }
  }

  //CONSULTAR PROFESOR
  async consultar(req: Request, res: Response): Promise<Response> {
    const sql = `SELECT * FROM profesores`;
    try {
      sql;
      const [busca] = await poolDB.query(sql);
      return res.status(200).json(busca);
    } catch (error) {
      return res.status(500).send("Error en catch al consultar los profesores");
    }
  }

  //CONSULTAR UN PROFESOR
  async consultarUno(req: Request, res: Response): Promise<Response> {
    //#region Validaciones Joi
    const { id } = req.params; //parametro requerimiento (id)
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

    const sql = `SELECT * FROM profesores WHERE id = ?`;

    try {
      const [busca] = await poolDB.query<RowDataPacket[]>(sql, [id]);
      if (busca.length === 0) {
        return res.status(404).json("Profesor no encontrado");
      }
      return res.status(200).json(busca[0]);
    } catch (error) {
      return res.status(500).send("Error en catch al consultar el profesor");
    }
  }

  //MODIFICAR PROFESOR
  async modificar(req: Request, res: Response): Promise<Response> {
    const { id } = req.params; //viene por parametro
    const { dni, nombre, apellido, email, profesion, telefono } = req.body; //viene por body

    //#region Validaciones Joi
    const valid = joi.object({
      dni: joi.string().required(),
      nombre: joi.string().required(),
      apellido: joi.string().required(),
      email: joi.string().email().required(),
      profesion: joi.string().required(),
      telefono: joi.string().required(),
    });
    const { error } = valid.validate({
      dni,
      nombre,
      apellido,
      email,
      profesion,
      telefono,
    });
    if (error) {
      return res
        .status(400)
        .send(`Error de validacion: ${error.details[0].message}`);
    }
    //#endregion

    const sql = `UPDATE profesores SET dni = ?, nombre = ?, apellido = ?, email = ?, profesion = ?, telefono = ? WHERE id = ?`;

    try {
      const [acto] = await poolDB.query<ResultSetHeader>(sql, [
        dni,
        nombre,
        apellido,
        email,
        profesion,
        telefono,
        id,
      ]);
      if (acto.affectedRows == 0) {
        //el == 0 es: si no se modifico ninguna fila
        return res.status(400).json("el profesor no existe");
      } else {
        return res.status(200).json({ res: "Profesor Actualizado!" });
      }
    } catch (error) {
      return res.status(500).send("Error en catch al modificar el profesor");
    }
  }

  //ELIMINAR PROFESOR
  async eliminar(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    //#region Validaciones Joi
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

    const sql1 = `SELECT * FROM profesores WHERE profesor_id=?;`;
    const sql2 = `SELECT COUNT(*) AS Total FROM cursos WHERE profesor_id = ?;`;
    const sql3 = `DELETE FROM profesores WHERE id = ?;`;
    const conex = await poolDB.getConnection();

    try {
      await conex.beginTransaction();
      const [busca] = await conex.query<RowDataPacket[]>(sql1, [id]);
      if (busca.length === 0) {
        await conex.rollback();
        return res.status(404).json({ mes: "Profesor no encontrado" });
      }
      const [busca2] = await conex.query<RowDataPacket[]>(sql2, [id]);
      if (busca2[0].Total > 0) {
        // si tiene curso asignado
        await conex.rollback();
        return res.status(400).json("El profesor tiene cursos asignados");
      }
      const [acto] = await conex.query<ResultSetHeader>(sql3, [id]);
      if (acto.affectedRows === 1) {
        await conex.commit(); // si hubo exito se hizo un COMIT
        return res.status(200).json({ res: "Profesor Eliminado!" });
      } else {
        await conex.rollback(); // si no hubo exito, se hace un rollback
        return res.status(400).json("El profesor no existe");
      }
    } catch (error) {
      await conex.rollback();
      return res.status(500).send("Error en catch al eliminar el profesor");
    } finally {
      conex.release();
    }
  }
}

export const profesorController = new ProfesorController();
// module.exports = new ProfesorController();
