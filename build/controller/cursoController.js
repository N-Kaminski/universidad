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
Object.defineProperty(exports, "__esModule", { value: true });
exports.eliminarCurso = exports.modificarCurso = exports.consultarUnCurso = exports.consultarCursos = exports.insertarCurso = void 0;
const conexion_1 = require("../db/conexion");
const cursoModels_1 = require("../models/cursoModels");
const profesorModels_1 = require("../models/profesorModels");
const cursoRepo = conexion_1.AppDataSource.getRepository(cursoModels_1.Curso);
const profesorRepo = conexion_1.AppDataSource.getRepository(profesorModels_1.Profesor);
/**** INSERTAR CURSO ****/
const insertarCurso = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, descripcion, profesor_id } = req.body;
        const profesorId = Number(profesor_id);
        if (isNaN(profesorId)) {
            return res.status(400).json({ message: "ID de profesor inválido" });
        }
        // Buscar el profesor
        const profesorEncontrado = yield profesorRepo.findOneBy({
            id: parseInt(profesor_id),
        });
        if (!profesorEncontrado) {
            return res.status(404).json({ message: "Profesor no encontrado" });
        }
        // Crear el curso
        const curso = cursoRepo.create({
            nombre,
            descripcion,
            profesor: profesorEncontrado,
        });
        yield cursoRepo.save(curso);
        return res.status(201).json(curso);
    }
    catch (error) {
        return res.status(500).json({
            message: "Error en catch al insertar curso",
            error: error.message,
        });
    }
});
exports.insertarCurso = insertarCurso;
/****  CONSULTAR CURSOS ****/
const consultarCursos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cursos = yield cursoRepo.find({
            relations: ["profesor"],
        });
        return res.status(200).json(cursos);
    }
    catch (error) {
        return res.status(500).json({
            message: "Error en catch al consultar los cursos",
            error: error.message,
        });
    }
});
exports.consultarCursos = consultarCursos;
/**** CONSULTAR UN CURSO ****/
const consultarUnCurso = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const curso = yield cursoRepo.findOne({
            where: { id: parseInt(req.params.id) },
            relations: ["profesor"],
        });
        if (!curso) {
            return res.status(404).json("Curso no encontrado");
        }
        return res.status(200).json(curso);
    }
    catch (error) {
        return res.status(500).json({
            message: "Error en catch al consultar el curso",
            error: error.message,
        });
    }
});
exports.consultarUnCurso = consultarUnCurso;
/**** MODIFICAR CURSO ****/
const modificarCurso = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const curso = yield cursoRepo.findOne({
            where: { id: parseInt(req.params.id) },
            relations: ["profesor"],
        });
        if (!curso) {
            return res.status(404).json("Curso no encontrado");
        }
        if (req.body.profesor_id) {
            const profesor = yield profesorRepo.findOneBy({
                id: req.body.profesor_id,
            });
            if (!profesor) {
                return res.status(404).json("Profesor no encontrado");
            }
            curso.profesor = profesor; // Asignar el nuevo profesor
        }
        cursoRepo.merge(curso, req.body);
        yield cursoRepo.save(curso);
        return res.status(200).json(`Curso ${curso.nombre} modificado`);
    }
    catch (error) {
        return res.status(500).json({
            message: "Error en catch al modificar el curso",
            error: error.message,
        });
    }
});
exports.modificarCurso = modificarCurso;
/**** ELIMINAR CURSO ****/
const eliminarCurso = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const curso = yield cursoRepo.findOneBy({
            id: parseInt(req.params.id),
        });
        if (!curso) {
            return res.status(404).json("Curso no encontrado");
        }
        yield cursoRepo.remove(curso);
        return res.status(200).json(`Curso ${curso.nombre} eliminado`);
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Error en catch al eliminar el curso", error: error });
    }
});
exports.eliminarCurso = eliminarCurso;
