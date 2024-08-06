const { json } = require("express"); //para parsear el body (traer/enviar datos)
const db = require("../database/conexion"); //nos conectamos a la base de datos

class estudianteController {
  constructor() {}

  insertar(req, res) {
    const { dni, nombre, apellido, email } = req.body; //lo trae del body
    try {
      db.query(
        `INSERT INTO estudiantes (dni, nombre, apellido, email) VALUES (?, ?, ?, ?)`,
        [dni, nombre, apellido, email],
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
    // res.send("insertando un estudiante");
  }

  consultar(req, res) {
    try {
      const sql = "SELECT * FROM estudiantes";
      db.query(sql, (err, rows) => {
        if (err) {
          res.status(400).send(err.message);
        }
        res.status(200).json(rows);
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
    // res.send("consultando los estudiantes");
  }

  consultarUno(req, res) {
    const { id } = req.params; //parametro requerimiento (id)
    try {
      db.query("SELECT * FROM estudiantes WHERE id = ?", [id], (err, rows) => {
        if (err) {
          return res.status(400).send(err.message); // Manejo de error de la consulta
        }
        if (rows.length === 0) {
          return res.status(404).send("Estudiante no encontrado"); // Manejo de caso cuando no se encuentra el estudiante
        }
        res.status(200).json(rows[0]); // Enviar el primer resultado (fila) encontrado
      });
    } catch (error) {
      res.status(500).send(error.message); // Manejo de error del bloque try-catch
    }
    // res.send("consultando un estudiante");
  }

  modificar(req, res) {
    const { id } = req.params; //viene por parametro
    const { dni, nombre, apellido, email } = req.body; //viene por body
    try {
      db.query(
        `UPDATE estudiantes SET dni = ?, nombre = ?, apellido = ?, email = ? WHERE id = ?`,
        [dni, nombre, apellido, email, id],
        (err, rows) => {
          if (err) {
            res.status(400).send(err.message);
          }
          if (rows.affectedRows == 0) {
            //el == 0 es: si no se modifico ninguna fila
            res.status(400).send("el estudiante no existe");
          }
          res.status(200).json({ res: "Estudiante Actualizado!" });
        }
      );
    } catch (error) {
      res.status(500).send(error.message);
    }
    // res.send("modificando un estudiante");
  }

  eliminar(req, res) {
    const { id } = req.params; //viene por parametro
    try {
      db.query(`DELETE FROM estudiantes WHERE id = ?`, [id], (err, rows) => {
        if (err) {
          res.status(400).send(err.message);
        }
        if (rows.affectedRows == 1) {
          //el ==1 es: si se modifico alguna fila
          res.status(200).json({ res: "Estudiante Eliminado!" });
        }
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
    // res.send("eliminando un estudiante");
  }
}

module.exports = new estudianteController();
