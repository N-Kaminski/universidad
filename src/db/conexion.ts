import { createConnection } from "mysql2/promise";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
dotenv.config();

import { Estudiante } from "../models/estudianteModels";
import { Curso } from "../models/cursoModels";
import { Profesor } from "../models/profesorModels";
import { Inscripcion } from "../models/inscripcionModels";

const port: number = process.env.DB_PORT
  ? parseInt(process.env.DB_PORT, 10)
  : 3306;

// Función para crear la base de datos si no existe
async function createDatabaseIfNotExists() {
  try {
    const connection = await createConnection({
      host: process.env.HOST || "localhost",
      port: port,
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
    });
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || "universidad"}`
    );
    await connection.end();
    console.log("Database check/creacion ok");
  } catch (error) {
    console.error("Error en createDatabaseIfNotExists:", error);
    throw error;
  }
}

// Configuración de TypeORM
export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.HOST || "localhost",
  port: port,
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "universidad",
  entities: [Estudiante, Curso, Profesor, Inscripcion],
  synchronize: false, // solo para desarrollo
  // logging: true,
});

// Función para inicializar la base de datos
export async function initializeDatabase() {
  try {
    await createDatabaseIfNotExists();
    await AppDataSource.initialize();
    console.log("Base de datos inicializada");
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error);
    throw error;
  }
}
