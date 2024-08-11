const { json } = require("express"); //para parsear el body (traer/enviar datos)
const db = require("../database/conexion"); //nos conectamos a la base de datos

class EstudianteController {
  constructor() {}

  async insertar(req, res) {
    try {
      const { dni, nombre, apellido, email } = req.body; //lo trae del body
      const [result] = await db.query(
        `INSERT INTO estudiantes (dni, nombre, apellido, email) VALUES (?, ?, ?, ?)`,
        [dni, nombre, apellido, email]
      );
      res.status(201).json({ id: result.insertId, dni, nombre, apellido });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async consultar(req, res) {
    try {
      const [rows] = await db.query("SELECT * FROM estudiantes");
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async consultarUno(req, res) {
    try {
      const { id } = req.params; //parametro requerimiento (id)
      const [rows] = await db.query("SELECT * FROM estudiantes WHERE id = ?", [
        id,
      ]);
      if (rows.length === 0) {
        return res.status(404).send("Estudiante no encontrado");
      }
      res.status(200).json(rows[0]);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async modificar(req, res) {
    try {
      const { id } = req.params; //viene por parametro
      const { dni, nombre, apellido, email } = req.body; //viene por body
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
      res.status(500).send(error.message);
    }
  }

  async eliminar(req, res) {
    try {
      const { id } = req.params; //viene por parametro
      const [rows] = await db.query(`DELETE FROM estudiantes WHERE id = ?`, [
        id,
      ]);
      if (rows.affectedRows == 1) {
        //el ==1 es: si se modifico alguna fila
        res.status(200).json({ res: "Estudiante Eliminado!" });
      } else {
        res.status(400).send("el estudiante no existe");
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}

module.exports = new EstudianteController();
