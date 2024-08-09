const { json } = require("express");
const db = require("../database/conexion");

class cursoController {
  constructor() {}

  insertar(req, res) {
    const { nombre, descripcion, profesor_id } = req.body; //lo trae del body
    try {
      db.query(
        `INSERT INTO cursos (nombre, descripcion, profesor_id) VALUES (?, ?, ?)`,
        [nombre, descripcion, profesor_id],
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
      const sql = "SELECT * FROM cursos";
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
    const { id } = req.params;
    try {
      db.query("SELECT * FROM cursos WHERE id = ?", [id], (err, rows) => {
        if (err) {
          return res.status(400).send(err.message);
        }
        if (rows.length === 0) {
          return res.status(404).send("Curso no encontrado a");
        }
        res.status(200).json(rows[0]);
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  modificar(req, res) {
    const { id } = req.params;
    const { nombre, descripcion, profesor_id } = req.body;
    try {
      db.query(
        "UPDATE cursos SET nombre = ?, descripcion = ?, profesor_id = ? WHERE id = ?",
        [nombre, descripcion, profesor_id, id],
        (err, rows) => {
          if (err) {
            return res.status(400).send(err.message);
          }
          if (rows.affectedRows === 0) {
            return res.status(404).send("Curso no encontrado b");
          }
          res.status(200).send("Curso modificado");
        }
      );
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  eliminar(req, res) {
    const { id } = req.params;
    try {
      db.query("DELETE FROM cursos WHERE id = ?", [id], (err, rows) => {
        if (err) {
          return res.status(400).send(err.message);
        }
        if (rows.affectedRows === 0) {
          return res.status(404).send("Curso no encontrado c");
        }
        res.status(200).send("Curso eliminado");
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}

module.exports = new cursoController();
