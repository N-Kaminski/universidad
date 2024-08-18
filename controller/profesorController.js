const { json } = require("express");
const db = require("../database/conexion");
const joi = require("joi");

class ProfesorController {
  constructor() {}

  async insertar(req, res) {
    const { dni, nombre, apellido, email, profesion, telefono } = req.body; //lo trae del body

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

    try {
      const [result] = await db.query(
        `INSERT INTO profesores (dni, nombre, apellido, email, profesion, telefono) VALUES (?, ?, ?, ?, ?, ?)`,
        [dni, nombre, apellido, email, profesion, telefono]
      );
      res.status(201).json({ id: result.insertId, dni, nombre, apellido });
    } catch (error) {
      res.status(500).send(`Error al insertar Profesor: ${error.message}`);
    }
  }

  async consultar(req, res) {
    try {
      const sql = `SELECT * FROM profesores`;
      const [rows] = await db.query(sql);
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).send(`Error al consultar: ${error.message}`);
    }
  }

  async consultarUno(req, res) {
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

    try {
      const [rows] = await db.query(`SELECT * FROM profesores WHERE id = ?`, [
        id,
      ]);
      if (rows.length === 0) {
        return res.status(404).send("Profesor no encontrado");
      }
      res.status(200).json(rows[0]);
    } catch (error) {
      res.status(500).send(`Error al consultar el profesor: ${error.message}`);
    }
  }

  async modificar(req, res) {
    const { id } = req.params; //viene por parametro
    const { dni, nombre, apellido, email, profesion, telefono } = req.body; //viene por body
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

    try {
      const [rows] = await db.query(
        `UPDATE profesores SET dni = ?, nombre = ?, apellido = ?, email = ?, profesion = ?, telefono = ? WHERE id = ?`,
        [dni, nombre, apellido, email, profesion, telefono, id]
      );
      if (rows.affectedRows == 0) {
        //el == 0 es: si no se modifico ninguna fila
        res.status(400).send("el profesor no existe");
      } else {
        res.status(200).json({ res: "Profesor Actualizado!" });
      }
    } catch (error) {
      res.status(500).send(`Error al modificar: ${error.message}`);
    }
  }

  async eliminar(req, res) {
    const { id } = req.params;

    const valid = joi.object({
      id: joi.number().integer().required(),
    });
    const { error } = valid.validate({ id });
    if (error) {
      return res
        .status(400)
        .send(`Error de validacion: ${error.details[0].message}`);
    }

    const conex = await db.getConnection();
    try {
      await conex.beginTransaction();
      const [result] = await conn.query(
        `SELECT * FROM profesores WHERE profesor_id=?;`,
        [id]
      );
      if (result.length === 0) {
        await conn.rollback();
        return res.status(404).json({ mes: "Profesor no encontrado" });
      }
      const [result1] = await conex.query(
        `SELECT COUNT(*) AS Total FROM cursos WHERE profesor_id = ?`,
        [id]
      );
      if (result1[0].Total > 0) {
        // si tiene curso asignado
        await conex.rollback();
        return result1.status(400).send("El profesor tiene cursos asignados");
      }
      const [result3] = await conex.query(
        `DELETE FROM profesores WHERE id = ?`,
        [id]
      );
      if (result3.affectedRows === 1) {
        await conex.commit(); // si hubo exito se hizo un COMIT
        return res.status(200).json({ res: "Profesor Eliminado!" });
      } else {
        await conex.rollback(); // si no hubo exito, se hace un rollback
        return res.status(400).send("El profesor no existe");
      }
    } catch (error) {
      await conex.rollback();
      res.status(500).send(`Error al eliminar: ${error.message}`);
    } finally {
      conex.release();
    }
  }
}

module.exports = new ProfesorController();
