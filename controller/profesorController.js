const { json } = require("express");
const db = require("../database/conexion");

class profesorController {
  constructor() {}

  insertar(req, res) {
    const { dni, nombre, apellido, email, profesion, telefono } = req.body; //lo trae del body
    try {
      db.query(
        `INSERT INTO profesores (dni, nombre, apellido, email, profesion, telefono) VALUES (?, ?, ?, ?, ?, ?)`,
        [dni, nombre, apellido, email, profesion, telefono],
        (err, rows) => {
          if (err) {
            res.status(400).send(err.message);
          }
          res.status(200).json({ id: rows.insertId });
        }
      );
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  consultar(req, res) {
    try {
      const sql = "SELECT * FROM profesores";
      db.query(sql, (err, rows) => {
        if (err) {
          res.status(400).send(err.message);
        }
        res.status(200).json(rows);
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  consultarUno(req, res) {
    const { id } = req.params; //parametro requerimiento (id)
    try {
      db.query("SELECT * FROM profesores WHERE id = ?", [id], (err, rows) => {
        if (err) {
          return res.status(400).send(err.message); // Manejo de error de la consulta
        }
        if (rows.length === 0) {
          return res.status(404).send("Profesor no encontrado"); // Manejo de caso cuando no se encuentra el estudiante
        }
        res.status(200).json(rows[0]); // Enviar el primer resultado (fila) encontrado
      });
    } catch (error) {
      res.status(500).send(error.message); // Manejo de error del bloque try-catch
    }
  }

  modificar(req, res) {
    const { id } = req.params; //viene por parametro
    const { dni, nombre, apellido, email, profesion, telefono } = req.body; //viene por body
    try {
      db.query(
        `UPDATE profesores SET dni = ?, nombre = ?, apellido = ?, email = ?, profesion = ?, telefono = ? WHERE id = ?`,
        [dni, nombre, apellido, email, profesion, telefono, id],
        (err, rows) => {
          if (err) {
            res.status(400).send(err.message);
          }
          res.status(200).json({ id: rows.insertId });
        }
      );
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  eliminar(req, res) {
    const { id } = req.params; //viene por parametro
    try {
      db.query("DELETE FROM profesores WHERE id = ?", [id], (err, rows) => {
        if (err) {
          res.status(400).send(err.message);
        }
        res.status(200).json({ id: rows.insertId });
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}

module.exports = new profesorController();
