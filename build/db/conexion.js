"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.AppDataSource = void 0;
exports.initializeDatabase = initializeDatabase;
const promise_1 = require("mysql2/promise");
const typeorm_1 = require("typeorm");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const estudianteModels_1 = require("../models/estudianteModels");
const cursoModels_1 = require("../models/cursoModels");
const profesorModels_1 = require("../models/profesorModels");
const inscripcionModels_1 = require("../models/inscripcionModels");
const port = process.env.DB_PORT
    ? parseInt(process.env.DB_PORT, 10)
    : 3306;
// Función para crear la base de datos si no existe
function createDatabaseIfNotExists() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connection = yield (0, promise_1.createConnection)({
                host: process.env.HOST || "localhost",
                port: port,
                user: process.env.DB_USER || "root",
                password: process.env.DB_PASSWORD || "",
            });
            yield connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || "universidad"}`);
            yield connection.end();
            console.log("Database check/creacion ok");
        }
        catch (error) {
            console.error("Error en createDatabaseIfNotExists:", error);
            throw error;
        }
    });
}
// Configuración de TypeORM
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: process.env.HOST || "localhost",
    port: port,
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "universidad",
    entities: [estudianteModels_1.Estudiante, cursoModels_1.Curso, profesorModels_1.Profesor, inscripcionModels_1.Inscripcion],
    synchronize: true, // solo para desarrollo
    // logging: true,
});
// Función para inicializar la base de datos
function initializeDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield createDatabaseIfNotExists();
            yield exports.AppDataSource.initialize();
            console.log("Base de datos inicializada");
        }
        catch (error) {
            console.error("Error al inicializar la base de datos:", error);
            throw error;
        }
    });
}
