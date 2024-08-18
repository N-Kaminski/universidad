const { json } = require("express");
const db = require("../database/conexion");
const joi = require("joi");

class InscripcionController {
  constructor() {}

  // inscribe alumno a curso
  async insertar(req, res) {
    const { curso_id, estudiante_id } = req.body;
    const conex = await db.getConnection();

    // validacion con joi
    const valid = joi.object({
      curso_id: joi.number().integer().required(),
      estudiante_id: joi.number().integer().required(),
    });
    //validar la solicitud
    const { error } = valid.validate({ curso_id, estudiante_id });
    if (error) {
      return res
        .status(400)
        .send(`Error de validación: ${error.details[0].message}`);
    }

    try {
      await conex.beginTransaction();
      //existe el curso?
      const [result] = await db.query(
        `SELECT COUNT(*) AS Total FROM cursos WHERE id = ?`,
        [curso_id]
      );
      if (result[0].Total === 0) {
        await conex.rollback();
        return res.status(400).send("El curso no existe");
      }
      //existe el estudiante?
      const [result2] = await db.query(
        `SELECT COUNT(*) AS Total FROM estudiantes WHERE id = ?`,
        [estudiante_id]
      );
      if (result2[0].Total === 0) {
        await conex.rollback();
        return res.status(400).send("El estudiante no existe");
      }
      //si el estudiante y el curso SI existen
      const [result3] = await db.query(
        `INSERT INTO cursos_estudiantes (curso_id, estudiante_id) VALUES (?, ?)`,
        [curso_id, estudiante_id]
      );
      if (result3.affectedRows === 1) {
        await conex.commit();
        res.status(201).json({ id: result3.insertId, curso_id, estudiante_id });
      } else {
        await conex.rollback();
        res.status(400).send("Error al inscribir el estudiante al curso");
      }
    } catch (error) {
      await conex.rollback();
      res.status(500).send(`Error al inscribir: ${error.message}`);
    } finally {
      await conex.release();
    }
  }

  // consulta listado de estudiantes y cursos
  async consultar(req, res) {
    try {
      const [rows] = await db.query(
        `SELECT estudiantes.nombre AS estudiante, cursos.nombre AS curso FROM cursos_estudiantes 
         JOIN estudiantes ON cursos_estudiantes.estudiante_id = estudiantes.id 
         JOIN cursos ON cursos_estudiantes.curso_id = cursos.id`
      );
      // si esta bien devuleve todas las filas
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).send(`Error al consultar: ${error.message}`);
    }
  }

  // consulta X estudiante
  async consultarEstudiante(req, res) {
    const { estudiante_id } = req.params;

    const valid = joi.object({
      estudiante_id: joi.number().integer().required(),
    });
    const { error } = valid.validate({ estudiante_id });
    if (error) {
      return res
        .status(400)
        .send(`Error de validación: ${error.details[0].message}`);
    }

    try {
      const [rows] = await db.query(
        `SELECT estudiantes.nombre AS estudiante, cursos.nombre AS curso FROM cursos_estudiantes 
         JOIN estudiantes ON cursos_estudiantes.estudiante_id = estudiantes.id 
         JOIN cursos ON cursos_estudiantes.curso_id = cursos.id
         WHERE estudiante_id = ?`,
        [estudiante_id]
      );
      if (rows.length === 0) {
        return res.status(404).send("Estudiante no encontrado");
      }
      res.status(200).json(rows);
    } catch (error) {
      res
        .status(500)
        .send(`Error al consultar el estudiante: ${error.message}`);
    }
  }

  // consulta X curso
  async consultarCurso(req, res) {
    const { curso_id } = req.params;

    const valid = joi.object({
      curso_id: joi.number().integer().required(),
    });
    const { error } = valid.validate({ curso_id });
    if (error) {
      return res
        .status(400)
        .send(`Error de validación: ${error.details[0].message}`);
    }

    try {
      const [rows] = await db.query(
        `SELECT estudiantes.nombre AS estudiante, cursos.nombre AS curso FROM cursos_estudiantes 
         JOIN estudiantes ON cursos_estudiantes.estudiante_id = estudiantes.id 
         JOIN cursos ON cursos_estudiantes.curso_id = cursos.id
         WHERE curso_id = ?`,
        [curso_id]
      );
      if (rows.length === 0) {
        return res.status(404).send("Curso no encontrado");
      }
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).send(`Error al consultar el curso: ${error.message}`);
    }
  }

  // consulta nota
  async consultarNota(req, res) {
    const { curso_id, estudiante_id } = req.params;

    const valid = joi.object({
      curso_id: joi.number().integer().required(),
      estudiante_id: joi.number().integer().required(),
    });
    const { error } = valid.validate({ curso_id, estudiante_id });
    if (error) {
      return res
        .status(400)
        .send(`Error de validación: ${error.details[0].message}`);
    }

    try {
      const [rows] = await db.query(
        `SELECT estudiantes.nombre AS estudiante, cursos.nombre AS curso, nota FROM cursos_estudiantes 
         JOIN estudiantes ON cursos_estudiantes.estudiante_id = estudiantes.id 
         JOIN cursos ON cursos_estudiantes.curso_id = cursos.id
         WHERE curso_id = ? AND estudiante_id = ?`,
        [curso_id, estudiante_id]
      );
      if (rows.length === 0) {
        return res.status(404).send("Curso no encontrado");
      }
      res.status(200).json(rows[0]);
    } catch (error) {
      res.status(500).send(`Error al consultar la nota: ${error.message}`);
    }
  }

  // modifica nota
  async modificar(req, res) {
    const { curso_id, estudiante_id } = req.params;
    const { nota } = req.body;

    const valid = joi.object({
      curso_id: joi.number().integer().required(),
      estudiante_id: joi.number().integer().required(),
      nota: joi.number().min(0).max(10).required(),
    });
    const { error } = valid.validate({ curso_id, estudiante_id, nota });
    if (error) {
      return res
        .status(400)
        .send(`Error de validacion: ${error.details[0].message}`);
    }

    try {
      // el estudiante esta inscrito?
      const [check] = await db.query(
        `SELECT COUNT(*) AS Total FROM cursos_estudiantes 
         WHERE curso_id = ? AND estudiante_id = ?`,
        [curso_id, estudiante_id]
      );
      if (check[0].Total === 0) {
        return res
          .status(404)
          .send("El estudiante no esta inscripto en este curso");
      }
      // Modificar la nota
      const [rows] = await db.query(
        `UPDATE cursos_estudiantes SET nota = ? 
         WHERE curso_id = ? AND estudiante_id = ?`,
        [nota, curso_id, estudiante_id]
      );
      if (rows.affectedRows === 0) {
        return res.status(400).send("No se pudo modificar la nota");
      }
      res.status(200).send("Nota modificada!");
    } catch (error) {
      res
        .status(500)
        .send(`Error en la modificacion de la nota: ${error.message}`);
    }
  }

  // elimina inscripcion
  async eliminar(req, res) {
    const { curso_id, estudiante_id } = req.params;

    const valid = joi.object({
      curso_id: joi.number().integer().required(),
      estudiante_id: joi.number().integer().required(),
    });
    const { error } = valid.validate({ curso_id, estudiante_id });
    if (error) {
      return res
        .status(400)
        .send(`Error de validación: ${error.details[0].message}`);
    }

    try {
      // el estudiante esta inscrito?
      const [check] = await db.query(
        `SELECT COUNT(*) AS Total FROM cursos_estudiantes WHERE curso_id = ? AND estudiante_id = ?`,
        [curso_id, estudiante_id]
      );
      if (check[0].Total === 0) {
        return res
          .status(404)
          .send("El estudiante no esta inscripto en este curso");
      }
      // Eliminar la inscripcion
      const [rows] = await db.query(
        `DELETE FROM cursos_estudiantes WHERE curso_id = ? AND estudiante_id = ?`,
        [curso_id, estudiante_id]
      );
      res.status(200).send("Inscripción eliminada");
    } catch (error) {
      res
        .status(500)
        .send(`Error al eliminar la inscripcion: ${error.message}`);
    }
  }
}

module.exports = new InscripcionController();
