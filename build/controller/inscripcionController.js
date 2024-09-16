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
exports.eliminarInscripcion = exports.modificarNota = exports.consultarNota = exports.consultarInscripcionesPorEstudiante = exports.consultarInscripcionesPorCurso = exports.consultarInscripciones = exports.insertarInscripcion = void 0;
const conexion_1 = require("../db/conexion");
const inscripcionModels_1 = require("../models/inscripcionModels");
const estudianteModels_1 = require("../models/estudianteModels");
const cursoModels_1 = require("../models/cursoModels");
// Repositorios
const inscripcionRepo = conexion_1.AppDataSource.getRepository(inscripcionModels_1.Inscripcion);
const estudianteRepo = conexion_1.AppDataSource.getRepository(estudianteModels_1.Estudiante);
const cursoRepo = conexion_1.AppDataSource.getRepository(cursoModels_1.Curso);
/**** INSCRIBIR ALUMNO A CURSO ****/
const insertarInscripcion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { curso_id, estudiante_id, nota } = req.body;
        const estudianteEncontrado = yield estudianteRepo.findOneBy({
            id: parseInt(estudiante_id),
        });
        if (!estudianteEncontrado) {
            return res.status(404).json("Estudiante no encontrado");
        }
        const cursoEmcontrado = yield cursoRepo.findOneBy({
            id: parseInt(curso_id),
        });
        if (!cursoEmcontrado) {
            return res.status(404).json("Curso no encontrado");
        }
        const inscripcion = inscripcionRepo.create({
            estudiante: estudianteEncontrado,
            curso: cursoEmcontrado,
            nota,
        });
        yield inscripcionRepo.save(inscripcion);
        return res.status(201).json(inscripcion);
    }
    catch (error) {
        return res.status(500).send(`Error al insertar inscripción: ${error}`);
    }
});
exports.insertarInscripcion = insertarInscripcion;
/**** CONSULTAR INSCRIPCIONES (Listado general) ****/
const consultarInscripciones = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inscripciones = yield inscripcionRepo.find({
            relations: ["estudiante", "curso"],
        });
        if (!inscripciones || inscripciones.length === 0) {
            return res.status(404).json("No se encontraron inscripciones");
        }
        return res.status(200).json(inscripciones);
    }
    catch (error) {
        return res.status(500).send(`Error al consultar inscripciones: ${error}`);
    }
});
exports.consultarInscripciones = consultarInscripciones;
/**** CONSULTAR INSCRIPCIONES POR CURSO (que alumnos tien X curso?)****/
const consultarInscripcionesPorCurso = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inscripciones = yield inscripcionRepo.find({
            where: { curso: { id: parseInt(req.params.curso_id) } },
            relations: ["curso", "estudiante"],
        });
        if (inscripciones.length === 0) {
            return res.status(404).json("No hay inscripciones en este curso");
        }
        return res.status(200).json(inscripciones);
    }
    catch (error) {
        return res
            .status(500)
            .send(`Error al consultar inscripciones por curso: ${error}`);
    }
});
exports.consultarInscripcionesPorCurso = consultarInscripcionesPorCurso;
/**** CONSULTAR INSCRIPCIONES POR ESTUDIANTE (que cursos hace X estudiante)****/
const consultarInscripcionesPorEstudiante = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inscripciones = yield inscripcionRepo.find({
            where: { estudiante: { id: parseInt(req.params.estudiante_id) } },
            relations: ["curso", "estudiante"],
        });
        if (inscripciones.length === 0) {
            return res
                .status(404)
                .json("El estudiante no está inscrito en ningún curso");
        }
        return res.status(200).json(inscripciones);
    }
    catch (error) {
        return res
            .status(500)
            .send(`Error al consultar inscripciones por estudiante: ${error}`);
    }
});
exports.consultarInscripcionesPorEstudiante = consultarInscripcionesPorEstudiante;
/**** CONSULTAR NOTA ****/
const consultarNota = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cursoElegido = parseInt(req.params.curso_id);
        const estudianteElegido = parseInt(req.params.estudiante_id);
        // Validar que los parámetros sean números válidos
        if (isNaN(cursoElegido) || isNaN(estudianteElegido)) {
            return res.status(400).json("ID de curso o estudiante inválido");
        }
        const inscripcion = yield inscripcionRepo.findOne({
            where: {
                curso: { id: cursoElegido },
                estudiante: { id: estudianteElegido },
            },
            relations: ["curso", "estudiante"],
        });
        if (!inscripcion) {
            return res.status(404).json("Inscripción no encontrada");
        }
        return res.status(200).json({ nota: inscripcion.nota });
    }
    catch (error) {
        return res.status(500).send(`Error al consultar la nota: ${error}`);
    }
});
exports.consultarNota = consultarNota;
/**** MODIFICAR NOTA ****/
const modificarNota = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cursoElegido = parseInt(req.params.curso_id);
        const estudianteElegido = parseInt(req.params.estudiante_id);
        const inscripcion = yield inscripcionRepo.findOne({
            where: {
                curso: { id: cursoElegido },
                estudiante: { id: estudianteElegido },
            },
            relations: ["curso", "estudiante"],
        });
        if (!inscripcion) {
            return res.status(404).json("Inscripción no encontrada");
        }
        inscripcion.nota = req.body.nota;
        yield inscripcionRepo.save(inscripcion);
        return res.status(200).json("Nota modificada");
    }
    catch (error) {
        return res.status(500).send(`Error al modificar la nota: ${error}`);
    }
});
exports.modificarNota = modificarNota;
/**** ELIMINAR INSCRIPCIÓN ****/
const eliminarInscripcion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cursoElegido = parseInt(req.params.curso_id);
        const estudianteElegido = parseInt(req.params.estudiante_id);
        const inscripcion = yield inscripcionRepo.findOne({
            where: {
                curso: { id: cursoElegido },
                estudiante: { id: estudianteElegido },
            },
            relations: ["curso", "estudiante"],
        });
        if (!inscripcion) {
            return res.status(404).json("Inscripción no encontrada");
        }
        yield inscripcionRepo.remove(inscripcion);
        return res.status(200).json("Inscripción eliminada");
    }
    catch (error) {
        return res.status(500).send(`Error al eliminar la inscripción: ${error}`);
    }
});
exports.eliminarInscripcion = eliminarInscripcion;
