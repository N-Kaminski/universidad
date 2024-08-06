-- Active: 1719517196416@@127.0.0.1@3306CREATE DATABASE universidad;
CREATE DATABASE IF NOT EXISTS universidad;
USE universidad;

-- Tabla estudiantes
CREATE TABLE estudiantes (
    id INT(11) NOT NULL AUTO_INCREMENT,
    dni VARCHAR(15),
    nombre VARCHAR(30),
    apellido VARCHAR(30),
    email VARCHAR(50),
    PRIMARY KEY (id)
);

-- Tabla profesores
CREATE TABLE profesores (
    id INT(11) NOT NULL AUTO_INCREMENT,
    dni VARCHAR(15),
    nombre VARCHAR(30),
    apellido VARCHAR(30),
    email VARCHAR(50),
    profesion VARCHAR(30),
    telefono VARCHAR(15),
    PRIMARY KEY (id)
);

-- Tabla cursos
CREATE TABLE cursos (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(64),
    descripcion TEXT,
    profesor_id INT(11),
    PRIMARY KEY (id),
    FOREIGN KEY (profesor_id) REFERENCES profesores(id)
);

-- Tabla cursos_estudiantes
CREATE TABLE cursos_estudiantes (
    curso_id INT(11),
    estudiante_id INT(11),
    nota INT(11),
    PRIMARY KEY (curso_id, estudiante_id),
    FOREIGN KEY (curso_id) REFERENCES cursos(id),
    FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id)
);
