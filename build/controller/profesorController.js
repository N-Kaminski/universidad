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
exports.profesorController = void 0;
const conexion_1 = require("../db/conexion"); //nos conectamos a la base de datos
const joi_1 = __importDefault(require("joi")); //validaciones con joi
// const { json } = require("express");
// const db = require("../db/conexion");
// const joi = require("joi");
class ProfesorController {
    constructor() { }
    //INSERTAR PROFESOR
    insertar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { dni, nombre, apellido, email, profesion, telefono } = req.body; //lo trae del body
            //#region Validaciones Joi
            const valid = joi_1.default.object({
                dni: joi_1.default.string().required(),
                nombre: joi_1.default.string().required(),
                apellido: joi_1.default.string().required(),
                email: joi_1.default.string().email().required(),
                profesion: joi_1.default.string().required(),
                telefono: joi_1.default.string().required(),
            });
            const { error } = valid.validate({
                dni,
                nombre,
                apellido,
                email,
                profesion,
                telefono,
            });
            if (error) {
                return res
                    .status(400)
                    .send(`Error de validacion: ${error.details[0].message}`);
            }
            //#endregion
            const sql = `INSERT INTO profesores (dni, nombre, apellido, email, profesion, telefono) VALUES (?, ?, ?, ?, ?, ?)`;
            try {
                const [acto] = yield conexion_1.poolDB.query(sql, [
                    dni,
                    nombre,
                    apellido,
                    email,
                    profesion,
                    telefono,
                ]);
                return res.status(201).json({ id: acto.insertId, dni, nombre, apellido });
            }
            catch (error) {
                return res.status(500).send("Error en catch al insertar el profesor");
            }
        });
    }
    //CONSULTAR PROFESOR
    consultar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT * FROM profesores`;
            try {
                sql;
                const [busca] = yield conexion_1.poolDB.query(sql);
                return res.status(200).json(busca);
            }
            catch (error) {
                return res.status(500).send("Error en catch al consultar los profesores");
            }
        });
    }
    //CONSULTAR UN PROFESOR
    consultarUno(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //#region Validaciones Joi
            const { id } = req.params; //parametro requerimiento (id)
            const valid = joi_1.default.object({
                id: joi_1.default.number().integer().required(),
            });
            const { error } = valid.validate({ id });
            if (error) {
                return res
                    .status(400)
                    .send(`Error de validacion: ${error.details[0].message}`);
            }
            //#endregion
            const sql = `SELECT * FROM profesores WHERE id = ?`;
            try {
                const [busca] = yield conexion_1.poolDB.query(sql, [id]);
                if (busca.length === 0) {
                    return res.status(404).json("Profesor no encontrado");
                }
                return res.status(200).json(busca[0]);
            }
            catch (error) {
                return res.status(500).send("Error en catch al consultar el profesor");
            }
        });
    }
    //MODIFICAR PROFESOR
    modificar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params; //viene por parametro
            const { dni, nombre, apellido, email, profesion, telefono } = req.body; //viene por body
            //#region Validaciones Joi
            const valid = joi_1.default.object({
                dni: joi_1.default.string().required(),
                nombre: joi_1.default.string().required(),
                apellido: joi_1.default.string().required(),
                email: joi_1.default.string().email().required(),
                profesion: joi_1.default.string().required(),
                telefono: joi_1.default.string().required(),
            });
            const { error } = valid.validate({
                dni,
                nombre,
                apellido,
                email,
                profesion,
                telefono,
            });
            if (error) {
                return res
                    .status(400)
                    .send(`Error de validacion: ${error.details[0].message}`);
            }
            //#endregion
            const sql = `UPDATE profesores SET dni = ?, nombre = ?, apellido = ?, email = ?, profesion = ?, telefono = ? WHERE id = ?`;
            try {
                const [acto] = yield conexion_1.poolDB.query(sql, [
                    dni,
                    nombre,
                    apellido,
                    email,
                    profesion,
                    telefono,
                    id,
                ]);
                if (acto.affectedRows == 0) {
                    //el == 0 es: si no se modifico ninguna fila
                    return res.status(400).json("el profesor no existe");
                }
                else {
                    return res.status(200).json({ res: "Profesor Actualizado!" });
                }
            }
            catch (error) {
                return res.status(500).send("Error en catch al modificar el profesor");
            }
        });
    }
    //ELIMINAR PROFESOR
    eliminar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            //#region Validaciones Joi
            const valid = joi_1.default.object({
                id: joi_1.default.number().integer().required(),
            });
            const { error } = valid.validate({ id });
            if (error) {
                return res
                    .status(400)
                    .send(`Error de validacion: ${error.details[0].message}`);
            }
            //#endregion
            const sql1 = `SELECT * FROM profesores WHERE profesor_id=?;`;
            const sql2 = `SELECT COUNT(*) AS Total FROM cursos WHERE profesor_id = ?;`;
            const sql3 = `DELETE FROM profesores WHERE id = ?;`;
            const conex = yield conexion_1.poolDB.getConnection();
            try {
                yield conex.beginTransaction();
                const [busca] = yield conex.query(sql1, [id]);
                if (busca.length === 0) {
                    yield conex.rollback();
                    return res.status(404).json({ mes: "Profesor no encontrado" });
                }
                const [busca2] = yield conex.query(sql2, [id]);
                if (busca2[0].Total > 0) {
                    // si tiene curso asignado
                    yield conex.rollback();
                    return res.status(400).json("El profesor tiene cursos asignados");
                }
                const [acto] = yield conex.query(sql3, [id]);
                if (acto.affectedRows === 1) {
                    yield conex.commit(); // si hubo exito se hizo un COMIT
                    return res.status(200).json({ res: "Profesor Eliminado!" });
                }
                else {
                    yield conex.rollback(); // si no hubo exito, se hace un rollback
                    return res.status(400).json("El profesor no existe");
                }
            }
            catch (error) {
                yield conex.rollback();
                return res.status(500).send("Error en catch al eliminar el profesor");
            }
            finally {
                conex.release();
            }
        });
    }
}
exports.profesorController = new ProfesorController();
// module.exports = new ProfesorController();
