const { json } = require("express");
const db = require("../database/conexion");

class cursoEstudianteController {
  constructor() {}

  insertar(req, res) {
    const { curso_id, estudiante_id } = req.body;
    try {
      db.query(
        `INSERT INTO cursos_estudiantes (curso_id, estudiante_id) VALUES (?, ?)`,
        [curso_id, estudiante_id],
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
      const sql = "SELECT * FROM cursos_estudiantes";
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
    const { curso_id, estudiante_id } = req.params;
    try {
      db.query(
        "SELECT * FROM cursos_estudiantes WHERE curso_id = ? AND estudiante_id = ?",
        [curso_id, estudiante_id],
        (err, rows) => {
          if (err) {
            return res.status(400).send(err.message);
          }
          if (rows.length === 0) {
            return res.status(404).send("Curso no encontrado 1");
          }
          res.status(200).json(rows[0]);
        }
      );
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  consultarEstudiante(req, res) {
    const { estudiante_id } = req.params;
    try {
      db.query(
        "SELECT * FROM cursos_estudiantes WHERE estudiante_id = ?",
        [estudiante_id],
        (err, rows) => {
          if (err) {
            return res.status(400).send(err.message);
          }
          if (rows.length === 0) {
            return res.status(404).send("Estudiante no encontrado");
          }
          res.status(200).json(rows);
        }
      );
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  consultarCurso(req, res) {
    const { curso_id } = req.params;
    try {
      db.query(
        "SELECT * FROM cursos_estudiantes WHERE curso_id = ?",
        [curso_id],
        (err, rows) => {
          if (err) {
            return res.status(400).send(err.message);
          }
          if (rows.length === 0) {
            return res.status(404).send("Curso no encontrado 2");
          }
          res.status(200).json(rows);
        }
      );
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  modificar(req, res) {
    const { curso_id, estudiante_id } = req.params;
    const { nota } = req.body;
    try {
      db.query(
        "UPDATE cursos_estudiantes SET nota = ? WHERE curso_id = ? AND estudiante_id = ?",
        [nota, curso_id, estudiante_id],
        (err, rows) => {
          if (err) {
            return res.status(400).send(err.message);
          }
          if (rows.affectedRows === 0) {
            return res.status(404).send("Curso no encontrado 3");
          }
          res.status(200).send("Curso modificado");
        }
      );
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  eliminar(req, res) {
    const { curso_id, estudiante_id } = req.params;
    try {
      db.query(
        "DELETE FROM cursos_estudiantes WHERE curso_id = ? AND estudiante_id = ?",
        [curso_id, estudiante_id],
        (err, rows) => {
          if (err) {
            return res.status(400).send(err.message);
          }
          if (rows.affectedRows === 0) {
            return res.status(404).send("Curso no encontrado 4");
          }
          res.status(200).send("Curso y Estudiante eliminado");
        }
      );
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}

module.exports = new cursoEstudianteController();
