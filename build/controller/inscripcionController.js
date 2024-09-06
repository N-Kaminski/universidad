"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inscripcionController = void 0;
const conexion_1 = require("../db/conexion"); //nos conectamos a la base de datos
const joi_1 = __importDefault(require("joi")); //validaciones con joi
// const { json } = require("express");
// const db = require("../database/conexion");
// const joi = require("joi");
class InscripcionController {
    constructor() { }
    // INSCRIBIR ALUMNO A CURSO
    insertar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { curso_id, estudiante_id } = req.body;
            //#region validaciones joi
            const valid = joi_1.default.object({
                curso_id: joi_1.default.number().integer().required(),
                estudiante_id: joi_1.default.number().integer().required(),
            });
            //validar la solicitud
            const { error } = valid.validate({ curso_id, estudiante_id });
            if (error) {
                return res
                    .status(400)
                    .send(`Error de validación: ${error.details[0].message}`);
            }
            //#endregion
            const sql1 = `SELECT COUNT(*) AS Total FROM cursos WHERE id = ?`;
            const sql2 = `SELECT COUNT(*) AS Total FROM estudiantes WHERE id = ?`;
            const sql3 = `INSERT INTO cursos_estudiantes (curso_id, estudiante_id) VALUES (?, ?)`;
            const conex = yield conexion_1.poolDB.getConnection();
            try {
                yield conex.beginTransaction();
                //existe el curso?
                const [busca] = yield conexion_1.poolDB.query(sql1, [curso_id]);
                if (busca[0].Total === 0) {
                    yield conex.rollback();
                    return res.status(400).json("El curso no existe");
                }
                //existe el estudiante?
                const [busca2] = yield conexion_1.poolDB.query(sql2, [
                    estudiante_id,
                ]);
                if (busca2[0].Total === 0) {
                    yield conex.rollback();
                    return res.status(400).json("El estudiante no existe");
                }
                //si el estudiante y el curso SI existen
                const [acto] = yield conexion_1.poolDB.query(sql3, [
                    curso_id,
                    estudiante_id,
                ]);
                if (acto.affectedRows === 1) {
                    yield conex.commit();
                    return res
                        .status(201)
                        .json({ id: acto.insertId, curso_id, estudiante_id });
                }
                else {
                    yield conex.rollback();
                    return res
                        .status(400)
                        .json("Error al inscribir el estudiante al curso");
                }
            }
            catch (error) {
                yield conex.rollback();
                return res
                    .status(500)
                    .send("Error en catch al inscribir el estudiante al curso");
            }
            finally {
                yield conex.release();
            }
        });
    }
    //CONSULTAR LISTADO DE INSCRIPCIONES POR CURSO
    consultar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT estudiantes.nombre AS estudiante, cursos.nombre AS curso FROM cursos_estudiantes 
         JOIN estudiantes ON cursos_estudiantes.estudiante_id = estudiantes.id 
         JOIN cursos ON cursos_estudiantes.curso_id = cursos.id`;
            try {
                const [busca] = yield conexion_1.poolDB.query(sql);
                // si esta bien devuleve todas las filas
                return res.status(200).json(busca);
            }
            catch (error) {
                return res
                    .status(500)
                    .send("Error en catch al consultar las inscripciones");
            }
        });
    }
    //CONSULTAR INSCRIPCION POR ESTUDIANTE
    consultarEstudiante(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { estudiante_id } = req.params;
            //#region validaciones joi
            const valid = joi_1.default.object({
                estudiante_id: joi_1.default.number().integer().required(),
            });
            const { error } = valid.validate({ estudiante_id });
            if (error) {
                return res
                    .status(400)
                    .send(`Error de validación: ${error.details[0].message}`);
            }
            //#endregion
            const sql = `SELECT estudiantes.nombre AS estudiante, cursos.nombre AS curso FROM cursos_estudiantes 
         JOIN estudiantes ON cursos_estudiantes.estudiante_id = estudiantes.id 
         JOIN cursos ON cursos_estudiantes.curso_id = cursos.id
         WHERE estudiante_id = ?`;
            try {
                const [busca] = yield conexion_1.poolDB.query(sql, [estudiante_id]);
                if (busca.length === 0) {
                    return res.status(404).json("Estudiante no encontrado");
                }
                return res.status(200).json(busca);
            }
            catch (error) {
                return res
                    .status(500)
                    .send("Error en catch al consultar las inscripciones por estudiante");
            }
        });
    }
    //CONSULTAR INSCRIPCION POR CURSO
    consultarCurso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { curso_id } = req.params;
            //#region validaciones joi
            const valid = joi_1.default.object({
                curso_id: joi_1.default.number().integer().required(),
            });
            const { error } = valid.validate({ curso_id });
            if (error) {
                return res
                    .status(400)
                    .send(`Error de validación: ${error.details[0].message}`);
            }
            //#endregion
            const sql = `SELECT estudiantes.nombre AS estudiante, cursos.nombre AS curso FROM cursos_estudiantes 
         JOIN estudiantes ON cursos_estudiantes.estudiante_id = estudiantes.id 
         JOIN cursos ON cursos_estudiantes.curso_id = cursos.id
         WHERE curso_id = ?`;
            try {
                const [busca] = yield conexion_1.poolDB.query(sql, [curso_id]);
                if (busca.length === 0) {
                    return res.status(404).json("Curso no encontrado");
                }
                return res.status(200).json(busca);
            }
            catch (error) {
                return res
                    .status(500)
                    .send("Error en catch al consultar las inscripciones por curso");
            }
        });
    }
    //CONSULTAR NOTA
    consultarNota(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { curso_id, estudiante_id } = req.params;
            //#region validaciones joi
            const valid = joi_1.default.object({
                curso_id: joi_1.default.number().integer().required(),
                estudiante_id: joi_1.default.number().integer().required(),
            });
            const { error } = valid.validate({ curso_id, estudiante_id });
            if (error) {
                return res
                    .status(400)
                    .send(`Error de validación: ${error.details[0].message}`);
            }
            //#endregion
            const sql = `SELECT estudiantes.nombre AS estudiante, cursos.nombre AS curso, nota FROM cursos_estudiantes 
         JOIN estudiantes ON cursos_estudiantes.estudiante_id = estudiantes.id 
         JOIN cursos ON cursos_estudiantes.curso_id = cursos.id
         WHERE curso_id = ? AND estudiante_id = ?`;
            try {
                const [busca] = yield conexion_1.poolDB.query(sql, [
                    curso_id,
                    estudiante_id,
                ]);
                if (busca.length === 0) {
                    return res.status(404).json("Curso no encontrado");
                }
                return res.status(200).json(busca[0]);
            }
            catch (error) {
                return res.status(500).send("Error en catch al consultar la nota");
            }
        });
    }
    //MODIFICAR NOTA
    modificar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { curso_id, estudiante_id } = req.params;
            const { nota } = req.body;
            //#region validaciones joi
            const valid = joi_1.default.object({
                curso_id: joi_1.default.number().integer().required(),
                estudiante_id: joi_1.default.number().integer().required(),
                nota: joi_1.default.number().min(0).max(10).required(),
            });
            const { error } = valid.validate({ curso_id, estudiante_id, nota });
            if (error) {
                return res
                    .status(400)
                    .send(`Error de validacion: ${error.details[0].message}`);
            }
            //#endregion
            const sql1 = `SELECT COUNT(*) AS Total FROM cursos_estudiantes 
         WHERE curso_id = ? AND estudiante_id = ?`;
            const sql2 = `UPDATE cursos_estudiantes SET nota = ? 
         WHERE curso_id = ? AND estudiante_id = ?`;
            const conex = yield conexion_1.poolDB.getConnection();
            try {
                // el estudiante esta inscrito?
                yield conex.beginTransaction();
                const [busca] = yield conex.query(sql1, [
                    curso_id,
                    estudiante_id,
                ]);
                if (busca[0].Total === 0) {
                    yield conex.rollback();
                    return res
                        .status(404)
                        .json("El estudiante no esta inscripto en este curso");
                }
                // Modificar la nota
                const [acto] = yield conex.query(sql2, [
                    nota,
                    curso_id,
                    estudiante_id,
                ]);
                if (acto.affectedRows === 0) {
                    yield conex.rollback();
                    return res.status(400).json("No se pudo modificar la nota");
                }
                yield conex.commit();
                return res.status(200).json("Nota modificada!");
            }
            catch (error) {
                yield conex.rollback();
                return res
                    .status(500)
                    .send("Error en catch al modificar la nota del estudiante");
            }
            finally {
                yield conex.release();
            }
        });
    }
    //ELIMINAR INSCRIPCION
    eliminar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { curso_id, estudiante_id } = req.params;
            //#region validaciones joi
            const valid = joi_1.default.object({
                curso_id: joi_1.default.number().integer().required(),
                estudiante_id: joi_1.default.number().integer().required(),
            });
            const { error } = valid.validate({ curso_id, estudiante_id });
            if (error) {
                return res
                    .status(400)
                    .send(`Error de validación: ${error.details[0].message}`);
            }
            //#endregion
            const sql1 = `SELECT COUNT(*) AS Total FROM cursos_estudiantes WHERE curso_id = ? AND estudiante_id = ?`;
            const sql2 = `DELETE FROM cursos_estudiantes WHERE curso_id = ? AND estudiante_id = ?`;
            const conex = yield conexion_1.poolDB.getConnection();
            try {
                yield conex.beginTransaction();
                // el estudiante esta inscrito?
                const [busca] = yield conex.query(sql1, [
                    curso_id,
                    estudiante_id,
                ]);
                if (busca[0].Total === 0) {
                    yield conex.rollback();
                    return res
                        .status(404)
                        .json("El estudiante no esta inscripto en este curso");
                }
                // Eliminar la inscripcion
                const [acto] = yield conex.query(sql2, [
                    curso_id,
                    estudiante_id,
                ]);
                if (acto.affectedRows === 1) {
                    yield conex.commit();
                    return res.status(200).json("Inscripción eliminada");
                }
                else {
                    yield conex.rollback();
                    return res.status(400).json("No se pudo eliminar la inscripcioon");
                }
            }
            catch (error) {
                return res
                    .status(500)
                    .send("Error en catch al eliminar la inscripción del estudiante");
            }
        });
    }
}
exports.inscripcionController = new InscripcionController();
// module.exports = new InscripcionController();
