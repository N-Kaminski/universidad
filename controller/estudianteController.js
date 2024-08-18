const { json } = require("express"); //para parsear el body (traer/enviar datos)
const db = require("../database/conexion"); //nos conectamos a la base de datos
const joi = require("joi"); //validaciones con joi

class EstudianteController {
  constructor() {}

  async insertar(req, res) {
    const { dni, nombre, apellido, email } = req.body; //lo trae del body

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

    try {
      const [result] = await db.query(
        `INSERT INTO estudiantes (dni, nombre, apellido, email) VALUES (?, ?, ?, ?)`,
        [dni, nombre, apellido, email]
      );
      res.status(201).json({ id: result.insertId, dni, nombre, apellido });
    } catch (error) {
      res.status(500).send(`Error al insertar Estudiante: ${error.message}`);
    }
  }

  async consultar(req, res) {
    try {
      const [rows] = await db.query("SELECT * FROM estudiantes");
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
      const [rows] = await db.query(`SELECT * FROM estudiantes WHERE id = ?`, [
        id,
      ]);
      if (rows.length === 0) {
        return res.status(404).send("Estudiante no encontrado");
      }
      res.status(200).json(rows[0]);
    } catch (error) {
      res
        .status(500)
        .send(`Error al consultar el estudiante: ${error.message}`);
    }
  }

  async modificar(req, res) {
    const { id } = req.params; //viene por parametro
    const { dni, nombre, apellido, email } = req.body; //viene por body

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

    try {
      const [rows] = await db.query(
        `UPDATE estudiantes SET dni = ?, nombre = ?, apellido = ?, email = ? WHERE id = ?`,
        [dni, nombre, apellido, email, id]
      );
      if (rows.affectedRows == 0) {
        //el == 0 es: si no se modifico ninguna fila
        res.status(400).send("el estudiante no existe");
      } else {
        res.status(200).json({ res: "Estudiante Actualizado!" });
      }
    } catch (error) {
      res.status(500).send(`Error al modificar: ${error.message}`);
    }
  }

  async eliminar(req, res) {
    const { id } = req.params; //viene por parametro
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
      const [result] = await db.query(
        `SELECT COUNT(*) AS Total FROM cursos_estudiantes WHERE estudiante_id = ?`,
        [id]
      );
      if (result[0].Total > 0) {
        // si tiene inscripciones asignadas
        await conex.rollback();
        res.status(400).send("No se puede eliminar el estudiante");
        return;
      }
      const [rows] = await db.query(`DELETE FROM estudiantes WHERE id = ?`, [
        id,
      ]);
      if (rows.affectedRows == 1) {
        //el ==1 es: si se modifico alguna fila
        res.status(200).json({ res: "Estudiante Eliminado!" });
      } else {
        res.status(400).send("El estudiante no existe");
      }
    } catch (error) {
      res.status(500).send(`Error al eliminar: ${error.message}`);
    } finally {
      conex.release();
    }
  }
}

module.exports = new EstudianteController();
