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
exports.eliminarProfesor = exports.modificarProfesor = exports.consultarUnProfesor = exports.consultarProfesores = exports.insertarProfesor = void 0;
const conexion_1 = require("../db/conexion");
const profesorModels_1 = require("../models/profesorModels");
const profesorRepo = conexion_1.AppDataSource.getRepository(profesorModels_1.Profesor);
/**** INSERTAR PROFESOR ****/
const insertarProfesor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profesor = profesorRepo.create(req.body);
        yield profesorRepo.save(profesor);
        return res.status(201).json(profesor);
    }
    catch (error) {
        return res
            .status(500)
            .send(`Error en catch al insertar Profesor: ${error}`);
    }
});
exports.insertarProfesor = insertarProfesor;
/**** CONSULTAR PROFESORES ****/
const consultarProfesores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profesores = yield profesorRepo.find();
        return res.status(200).json(profesores);
    }
    catch (error) {
        return res
            .status(500)
            .send(`Error en catch al consultar profesores: ${error}`);
    }
});
exports.consultarProfesores = consultarProfesores;
/**** CONSULTAR UN PROFESOR ****/
const consultarUnProfesor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profesor = yield profesorRepo.findOneBy({
            id: parseInt(req.params.id),
        });
        if (!profesor) {
            return res.status(404).json("Profesor no encontrado");
        }
        return res.status(200).json(profesor);
    }
    catch (error) {
        return res
            .status(500)
            .send(`Error en catch al consultar el profesor: ${error}`);
    }
});
exports.consultarUnProfesor = consultarUnProfesor;
/**** MODIFICAR PROFESOR ****/
const modificarProfesor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profesor = yield profesorRepo.findOneBy({
            id: parseInt(req.params.id),
        });
        if (!profesor) {
            return res.status(404).json("Profesor no encontrado");
        }
        profesorRepo.merge(profesor, req.body);
        yield profesorRepo.save(profesor);
        return res.status(200).json(`Profesor ${profesor.dni} modificado`);
    }
    catch (error) {
        return res
            .status(500)
            .send(`Error en catch al modificar el profesor: ${error}`);
    }
});
exports.modificarProfesor = modificarProfesor;
/**** ELIMINAR PROFESOR ****/
const eliminarProfesor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profesor = yield profesorRepo.findOneBy({
            id: parseInt(req.params.id),
        });
        if (!profesor) {
            return res.status(404).json("Profesor no encontrado");
        }
        yield profesorRepo.remove(profesor);
        return res.status(200).json(`Profesor ${profesor.dni} eliminado`);
    }
    catch (error) {
        return res
            .status(500)
            .send(`Error en catch al eliminar el profesor: ${error}`);
    }
});
exports.eliminarProfesor = eliminarProfesor;
