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
exports.estudianteController = void 0;
const conexion_1 = require("../db/conexion"); //nos conectamos a la base de datos
const joi_1 = __importDefault(require("joi")); //validaciones con joi
// const { json } = require("express"); //para parsear el body (traer/enviar datos)
// const db = require("../database/conexion");
// const joi = require("joi");
class EstudianteController {
    constructor() { }
    //INSERTAR ESTUDIANTE
    insertar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { dni, nombre, apellido, email } = req.body; //lo trae del body
            //#region Validaciones Joi
            const valid = joi_1.default.object({
                dni: joi_1.default.string().required(),
                nombre: joi_1.default.string().required(),
                apellido: joi_1.default.string().required(),
                email: joi_1.default.string().email().required(),
            });
            const { error } = valid.validate({ dni, nombre, apellido, email });
            if (error) {
                return res
                    .status(400)
                    .send(`Error de validacion: ${error.details[0].message}`);
            }
            //#endregion
            const sql = `INSERT INTO estudiantes (dni, nombre, apellido, email) VALUES (?, ?, ?, ?)`;
            try {
                const [acto] = yield conexion_1.poolDB.query(sql, [
                    dni,
                    nombre,
                    apellido,
                    email,
                ]);
                return res.status(201).json({ id: acto.insertId, dni, nombre, apellido });
            }
            catch (error) {
                return res.status(500).send("Error en catch al insertar Estudiante");
            }
        });
    }
    //CONSULTAR ESTUDIANTES
    consultar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT * FROM estudiantes`;
            try {
                const [busca] = yield conexion_1.poolDB.query(sql);
                return res.status(200).json(busca);
            }
            catch (error) {
                return res.status(500).send(`Error en catch al consultar estudiantes`);
            }
        });
    }
    //CONSULTAR UN ESTUDIANTE
    consultarUno(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params; // Extrae el ID del estudiante de los parámetros de la solicitud
            //#region Validaciones Joi
            const valid = joi_1.default.object({
                // Validar que el ID es un número usando Joi
                id: joi_1.default.number().integer().required(),
            });
            const { error } = valid.validate({ id });
            // Si la validación falla, devolver un error de validación
            if (error) {
                return res
                    .status(400)
                    .send(`Error de validacion: ${error.details[0].message}`);
            }
            //#endregion
            const sql = `SELECT * FROM estudiantes WHERE id = ?`;
            try {
                // Ejecutar la consulta para buscar el estudiante en la base de datos por su ID
                const [busca] = yield conexion_1.poolDB.query(sql, [id]);
                // Si no se encontro el estudiante con el ID, devolver un error 404
                if (busca.length === 0) {
                    return res.status(404).json("Estudiante no encontrado");
                }
                // si se encontro el estudiante, devolvera los datos
                return res.status(200).json(busca[0]);
            }
            catch (error) {
                // si hay algun error durante la consulta, devuelver un error 500
                return res.status(500).send("Error en catch al consultar el estudiante");
            }
        });
    }
    //MODIFICAR ESTUDIANTE
    modificar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params; //viene por parametro
            const { dni, nombre, apellido, email } = req.body; //viene por body
            //#region Validaciones Joi
            const valid = joi_1.default.object({
                id: joi_1.default.number().integer().required(),
                dni: joi_1.default.string().required(),
                nombre: joi_1.default.string().required(),
                apellido: joi_1.default.string().required(),
                email: joi_1.default.string().email().required(),
            });
            const { error } = valid.validate({ id, dni, nombre, apellido, email });
            if (error) {
                return res
                    .status(400)
                    .send(`Error de validacion: ${error.details[0].message}`);
            }
            //#endregion
            const sql = `SELECT * FROM estudiantes WHERE id = ?`;
            try {
                const [acto] = yield conexion_1.poolDB.query(sql, [
                    dni,
                    nombre,
                    apellido,
                    email,
                    id,
                ]);
                if (acto.affectedRows == 0) {
                    //el == 0 es: si no se modifico ninguna fila
                    return res.status(400).json("el estudiante no existe");
                }
                else {
                    return res.status(200).json({ res: "Estudiante Actualizado!" });
                }
            }
            catch (error) {
                return res.status(500).send("Error en catch al modificar");
            }
        });
    }
    //ELIMINAR ESTUDIANTE
    eliminar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params; //viene por parametro
            //#region validaciones joi
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
            const sql1 = `SELECT COUNT(*) AS Total FROM cursos_estudiantes WHERE estudiante_id = ?`;
            const sql2 = `DELETE FROM estudiantes WHERE id = ?`;
            const conex = yield conexion_1.poolDB.getConnection();
            try {
                yield conex.beginTransaction();
                const [busca] = yield conex.query(sql1, [id]);
                if (busca[0].Total > 0) {
                    // si tiene inscripciones asignadas
                    yield conex.rollback();
                    return res
                        .status(400)
                        .json("No se puede eliminar el estudiante, esta inscripto a un curso");
                }
                const [acto] = yield conex.query(sql2, [id]);
                if (acto.affectedRows == 1) {
                    //el ==1 es: si se modifico alguna fila
                    return res.status(200).json({ res: "Estudiante Eliminado!" });
                }
                else {
                    return res.status(400).json("El estudiante no existe");
                }
            }
            catch (error) {
                return res.status(500).send("Error en catch al eliminar");
            }
            finally {
                conex.release();
            }
        });
    }
}
exports.estudianteController = new EstudianteController();
// module.exports = new EstudianteController();
// module.exports = new EstudianteController();
