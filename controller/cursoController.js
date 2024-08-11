const { json } = require("express");
const db = require("../database/conexion");

class CursoController {
  constructor() {}

  async insertar(req, res) {
    const { nombre, descripcion, profesor_id } = req.body; //obtenemos los datos que vamos a insertar del body
    const conex = await db.getConnection();
    try {
      await conex.beginTransaction();
      //existe el profesor?
      const [result] = await db.query(
        `SELECT COUNT (*) AS Total FROM profesores WHERE id = ?`,
        [profesor_id]
      );
      // si el profe no existe:
      if (result[0].Total === 0) {
        await conex.rollback();
        return res.status(400).send("El profesor no existe");
      }
      //si el profe existe
      const [result2] = await db.query(
        `INSERT INTO cursos (nombre, descripcion, profesor_id) VALUES (?, ?, ?)`,
        [nombre, descripcion, profesor_id]
      );
      if (result2.affectedRows === 1) {
        await conex.commit();
        res.status(201).json({ id: result2.insertId, nombre, descripcion });
      } else {
        await conex.rollback();
        res.status(400).send("Error al insertar el curso");
      }
    } catch (error) {
      await conex.rollback();
      res.status(500).send(error.message);
    } finally {
      conex.release();
    }
  }

  async consultar(req, res) {
    try {
      const sql = "SELECT * FROM cursos";
      const [rows] = await db.query(sql);
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async consultarUno(req, res) {
    try {
      const { id } = req.params;
      const [rows] = await db.query("SELECT * FROM cursos WHERE id = ?", [id]);
      if (rows.length === 0) {
        return res.status(404).send("Curso no encontrado");
      }
      res.status(200).json(rows[0]);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async modificar(req, res) {
    const { id } = req.params;
    const { nombre, descripcion, profesor_id } = req.body;
    const conex = await db.getConnection();
    try {
      await conex.beginTransaction();
      //existe el profesor?
      const [result] = await db.query(
        `SELECT COUNT (*) AS Total FROM profesores WHERE id = ?`,
        [profesor_id]
      );
      // si el profe no existe:
      if (result[0].Total === 0) {
        await conex.rollback();
        return res.status(400).send("El profesor no existe");
      }
      //si el profe existe
      const [result2] = await db.query(
        `UPDATE cursos SET nombre = ?, descripcion = ?, profesor_id = ? WHERE id = ?`,
        [nombre, descripcion, profesor_id, id]
      );
      // si hay error
      if (result2.affectedRows === 0) {
        await conex.rollback();
        res.status(400).send("el curso no existe");
      } else {
        // si todo salio bien
        await conex.commit();
        res.status(200).json({ res: "Curso Actualizado!" });
      }
    } catch (error) {
      await conex.rollback();
      res.status(500).send(error.message);
    } finally {
      conex.release();
    }
  }

  async eliminar(req, res) {
    const { id } = req.params;
    try {
      const [rows] = await db.query("DELETE FROM cursos WHERE id = ?", [id]);
      if (rows.affectedRows === 1) {
        res.status(200).json({ res: "Curso Eliminado!" });
      } else {
        res.status(400).send("el curso no existe");
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}

module.exports = new CursoController();
