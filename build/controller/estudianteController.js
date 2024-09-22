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
exports.eliminarEstudiante = exports.modificarEstudiante = exports.consultarUnEstudiante = exports.consultarEstudiantes = exports.insertarEstudiante = void 0;
const conexion_1 = require("../db/conexion");
const estudianteModels_1 = require("../models/estudianteModels");
const estudianteRepo = conexion_1.AppDataSource.getRepository(estudianteModels_1.Estudiante);
/**** INSERTAR ESTUDIANTE ****/
const insertarEstudiante = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existeEstudiante = yield estudianteRepo.findOneBy({
            dni: req.body.dni,
        });
        if (existeEstudiante) {
            return res.status(400).json({ message: "El estudiante ya existe" });
        }
        const estudiante = estudianteRepo.create(req.body);
        yield estudianteRepo.save(estudiante);
        return res.status(201).json(estudiante);
    }
    catch (error) {
        return res.status(500).json({
            message: "Error en catch al insertar Estudiante",
            error: error.message,
        });
    }
});
exports.insertarEstudiante = insertarEstudiante;
/****  CONSULTAR ESTUDIANTES ****/
const consultarEstudiantes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const estudiante = yield estudianteRepo.find();
        return res.status(200).json(estudiante);
    }
    catch (error) {
        return res.status(500).json({
            message: "Error en catch al consultar estudiantes",
            error: error.message,
        });
    }
});
exports.consultarEstudiantes = consultarEstudiantes;
/**** CONSULTAR UN ESTUDIANTE ****/
const consultarUnEstudiante = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const estudiante = yield estudianteRepo.findOneBy({
            id: parseInt(req.params.id),
        });
        // Si no se encontro el estudiante con el ID, devolver un error 404
        if (!estudiante) {
            return res.status(404).json("Estudiante no encontrado");
        }
        // si se encontro el estudiante, devolvera los datos
        return res.status(200).json(estudiante);
    }
    catch (error) {
        return res.status(500).json({
            message: "Error en catch al consultar el estudiante",
            error: error.message,
        });
    }
});
exports.consultarUnEstudiante = consultarUnEstudiante;
/*** MODIFICAR ESTUDIANTE ***/
const modificarEstudiante = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const estudiante = yield estudianteRepo.findOneBy({
            id: parseInt(req.params.id),
        });
        if (!estudiante) {
            return res.status(404).json("Estudiante no encontrado");
        }
        estudianteRepo.merge(estudiante, req.body);
        yield estudianteRepo.save(estudiante);
        return res.status(200).json(`Estudiante ${estudiante.dni} modificado`);
    }
    catch (error) {
        return res.status(500).json({
            message: "Error en catch al modificar el estudiante",
            error: error.message,
        });
    }
});
exports.modificarEstudiante = modificarEstudiante;
/**** ELIMINAR ESTUDIANTE ****/
const eliminarEstudiante = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const estudiante = yield estudianteRepo.findOneBy({
            id: parseInt(req.params.id),
        });
        if (!estudiante) {
            return res.status(404).json("Estudiante no encontrado");
        }
        yield estudianteRepo.remove(estudiante);
        return res.status(200).json(`Estudiante ${estudiante.dni} eliminado`);
    }
    catch (error) {
        return res.status(500).json({
            message: "Error en catch al eliminar el estudiante",
            error: error.message,
        });
    }
});
exports.eliminarEstudiante = eliminarEstudiante;
