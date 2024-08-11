const { json } = require("express");
const db = require("../database/conexion");

class ProfesorController {
  constructor() {}

  async insertar(req, res) {
    try {
      const { dni, nombre, apellido, email, profesion, telefono } = req.body; //lo trae del body
      const [result] = await db.query(
        `INSERT INTO profesores (dni, nombre, apellido, email, profesion, telefono) VALUES (?, ?, ?, ?, ?, ?)`,
        [dni, nombre, apellido, email, profesion, telefono]
      );
      res.status(201).json({ id: result.insertId, dni, nombre, apellido });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async consultar(req, res) {
    try {
      const sql = "SELECT * FROM profesores";
      const [rows] = await db.query(sql);
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async consultarUno(req, res) {
    try {
      const { id } = req.params; //parametro requerimiento (id)
      const [rows] = await db.query("SELECT * FROM profesores WHERE id = ?", [
        id,
      ]);
      if (rows.length === 0) {
        return res.status(404).send("Profesor no encontrado");
      }
      res.status(200).json(rows[0]);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async modificar(req, res) {
    try {
      const { id } = req.params; //viene por parametro
      const { dni, nombre, apellido, email, profesion, telefono } = req.body; //viene por body
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
      res.status(500).send(error.message);
    }
  }

  async eliminar(req, res) {
    const { id } = req.params;
    const conex = await db.getConnection();
    try {
      await conex.beginTransaction();
      const [result] = await conex.query(
        "SELECT COUNT(*) AS Total FROM cursos WHERE profesor_id = ?",
        [id]
      );
      if (result[0].Total > 0) {
        // si tiene curso asignado
        await conex.rollback();
        return result.status(400).send("El profesor tiene cursos asignados");
      }
      const [result2] = await conex.query(
        "DELETE FROM profesores WHERE id = ?",
        [id]
      );
      if (result2.affectedRows === 1) {
        await conex.commit(); // si hubo exito se hizo un COMIT
        return res.status(200).json({ res: "Profesor Eliminado!" });
      } else {
        await conex.rollback(); // si no hubo exito, se hace un rollback
        return res.status(400).send("el profesor no existe");
      }
    } catch (error) {
      await conex.rollback();
      res.status(500).send(error.message);
    } finally {
      conex.release();
    }
  }
}

module.exports = new ProfesorController();
