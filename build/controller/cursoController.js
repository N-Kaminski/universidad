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
exports.cursoController = void 0;
const conexion_1 = require("../db/conexion"); //nos conectamos a la base de datos
const joi_1 = __importDefault(require("joi")); //validaciones con joi
// const { json } = require("express");
// const db = require("../database/conexion");
// const joi = require("joi");
class CursoController {
    constructor() { }
    //INSERTAR CURSO
    insertar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre, descripcion, profesor_id } = req.body; //obtenemos los datos que vamos a insertar del body
            //#region Validaciones Joi
            const valid = joi_1.default.object({
                nombre: joi_1.default.string().required(),
                descripcion: joi_1.default.string().required(),
                profesor_id: joi_1.default.number().integer().required(),
            });
            const { error } = valid.validate({ nombre, descripcion, profesor_id });
            if (error) {
                return res
                    .status(400)
                    .send(`Error de validacion: ${error.details[0].message}`);
            }
            //#endregion
            const sql1 = `SELECT COUNT(*) AS Total FROM profesores WHERE id = ?`;
            const sql2 = `INSERT INTO cursos (nombre, descripcion, profesor_id) VALUES (?, ?, ?)`;
            const conex = yield conexion_1.poolDB.getConnection();
            try {
                yield conex.beginTransaction();
                //existe el profesor?
                const [busca] = yield conex.query(sql1, [profesor_id]);
                // si el profe no existe:
                if (busca[0].Total === 0) {
                    yield conex.rollback();
                    return res.status(400).json("El profesor no existe");
                }
                //si el profe existe
                const [acto] = yield conex.query(sql2, [
                    nombre,
                    descripcion,
                    profesor_id,
                ]);
                if (acto.affectedRows === 1) {
                    yield conex.commit();
                    return res.status(201).json({ id: acto.insertId, nombre, descripcion });
                }
                else {
                    yield conex.rollback();
                    return res.status(400).json("Error al insertar el curso");
                }
            }
            catch (error) {
                yield conex.rollback();
                return res
                    .status(500)
                    .json({ message: "Error en catch al insertar el curso" });
            }
            finally {
                conex.release();
            }
        });
    }
    //CONSULTAR CURSOS
    consultar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT * FROM cursos`;
            try {
                const [busca] = yield conexion_1.poolDB.query(sql);
                return res.status(200).json(busca);
            }
            catch (error) {
                return res
                    .status(500)
                    .json({ message: "Error en catch al consultar los cursos" });
            }
        });
    }
    //CONSULTAR UN CURSO
    consultarUno(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            //#region validaciones joi
            const valid = joi_1.default.object({
                id: joi_1.default.number().integer().required(),
            });
            const { error } = valid.validate({ id });
            if (error) {
                return res.status(400).send(`Error de validacion: ${error.message}`);
            }
            //#endregion
            const sql = `SELECT * FROM cursos WHERE id = ?`;
            try {
                const [busca] = yield conexion_1.poolDB.query(sql, [id]);
                if (busca.length === 0) {
                    return res.status(404).json("Curso no encontrado");
                }
                return res.status(200).json(busca[0]);
            }
            catch (error) {
                return res
                    .status(500)
                    .json({ message: "Error en catch al consultar el curso" });
            }
        });
    }
    //MODIFICAR CURSO
    modificar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { nombre, descripcion, profesor_id } = req.body;
            //#region validaciones joi
            const valid = joi_1.default.object({
                id: joi_1.default.number().integer().required(),
                nombre: joi_1.default.string().required(),
                descripcion: joi_1.default.string().required(),
                profesor_id: joi_1.default.number().integer().required(),
            });
            const { error } = valid.validate({ id, nombre, descripcion, profesor_id });
            if (error) {
                return res
                    .status(400)
                    .send(`Error de validacion: ${error.details[0].message}`);
            }
            //#endregion
            const sql1 = `SELECT COUNT(*) AS Total FROM profesores WHERE id = ?`;
            const sql2 = `UPDATE cursos SET nombre = ?, descripcion = ?, profesor_id = ? WHERE id = ?`;
            const conex = yield conexion_1.poolDB.getConnection();
            try {
                yield conex.beginTransaction();
                //existe el profesor?
                const [busca] = yield conex.query(sql1, [profesor_id]);
                // si el profe no existe:
                if (busca[0].Total === 0) {
                    yield conex.rollback();
                    return res.status(400).json("El profesor no existe");
                }
                //si el profe existe
                const [acto] = yield conex.query(sql2, [
                    nombre,
                    descripcion,
                    profesor_id,
                    id,
                ]);
                // si el curso no existe
                if (acto.affectedRows === 0) {
                    yield conex.rollback();
                    return res.status(400).json("el curso no existe");
                }
                else {
                    // si todo salio bien
                    yield conex.commit();
                    return res.status(200).json({ res: "Curso Actualizado!" });
                }
            }
            catch (error) {
                yield conex.rollback();
                return res
                    .status(500)
                    .json({ message: "Error en catch al modificar el curso" });
            }
            finally {
                conex.release();
            }
        });
    }
    //ELIMINAR CURSO
    eliminar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            //#region validaciones joi
            const valid = joi_1.default.object({
                id: joi_1.default.number().integer().required(),
            });
            const { error } = valid.validate({ id });
            if (error) {
                return res
                    .status(400)
                    .send(`Error de validación: ${error.details[0].message}`);
            }
            //#endregion
            const sql1 = `SELECT COUNT(*) AS Total FROM profesores WHERE id = ?`;
            const sql2 = `DELETE FROM cursos WHERE id = ?`;
            const conex = yield conexion_1.poolDB.getConnection();
            try {
                yield conex.beginTransaction();
                const [busca] = yield conex.query(sql1, [id]);
                if (busca[0].Total > 0) {
                    yield conex.rollback();
                    return res
                        .status(400)
                        .json("No se puede eliminar el curso, tiene un profesor asignado");
                }
                const [acto] = yield conex.query(sql2, [id]);
                if (acto.affectedRows === 1) {
                    return res.status(200).json({ res: "Curso Eliminado!" });
                }
                else {
                    return res.status(400).json("el curso no existe");
                }
            }
            catch (error) {
                return res
                    .status(500)
                    .json({ message: "Error en catch al insertar el curso" });
            }
        });
    }
}
exports.cursoController = new CursoController();
// module.exports = new CursoController();
