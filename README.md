# Proyecto Universidad

## Descripción

Este proyecto es una aplicación web para gestionar la información universitaria, incluyendo estudiantes, profesores y cursos. Ahora está completamente desarrollado en TypeScript en funcion de las clases que curso de la materia "Desarrollo de App Web".

## Estructura del Proyecto

El proyecto se divide en dos partes principales: el código fuente en TypeScript dentro de `src/` y los archivos compilados en JavaScript dentro de `build/`.

### `/build/`

Esta carpeta contiene el código compilado (JavaScript) del proyecto.

- `/controller/`

  - `cursoController.js`: Controlador para gestionar cursos.
  - `estudianteController.js`: Controlador para gestionar estudiantes.
  - `inscripcionController.js`: Controlador para gestionar la relación curso-estudiante.
  - `profesorController.js`: Controlador para gestionar profesores.

- `/db/`

  - `conexion.js`: Archivo de configuración de la conexión a la base de datos.
  - `configDB.js`: Archivo de configuración detallada de la base de datos.

- `/models/`: (Por ahora está vacío, pero aquí se incluirán los modelos de datos.)

- `/routes/`

  - `cursoRoutes.js`: Rutas para las operaciones CRUD de cursos.
  - `estudianteRoutes.js`: Rutas para las operaciones CRUD de estudiantes.
  - `inscripcionRoutes.js`: Rutas para las operaciones CRUD de inscripciones.
  - `profesorRoutes.js`: Rutas para las operaciones CRUD de profesores.

- `/views/`: Carpeta vacía, prevista para vistas.

### `/database/`

- `BD Datos.sql`: Script para poblar las tablas con datos de ejemplo.
- `BD Tablas.sql`: Script SQL para crear las tablas de la base de datos.

### `/src/`

Esta carpeta contiene el código fuente en TypeScript del proyecto.

- `/controller/`

  - `cursoController.ts`: Controlador para gestionar cursos.
  - `estudianteController.ts`: Controlador para gestionar estudiantes.
  - `inscripcionController.ts`: Controlador para gestionar la relación curso-estudiante.
  - `profesorController.ts`: Controlador para gestionar profesores.

- `/db/`

  - `conexion.ts`: Archivo de configuración de la conexión a la base de datos utilizando `mysql2/promise`.
  - `configDB.ts`: Archivo de configuración detallada de la base de datos.

- `/models/`: Carpeta vacía para los modelos de datos.

- `/routes/`

  - `cursoRoutes.ts`: Rutas para las operaciones CRUD de cursos.
  - `estudianteRoutes.ts`: Rutas para las operaciones CRUD de estudiantes.
  - `inscripcionRoutes.ts`: Rutas para las operaciones CRUD de inscripciones.
  - `profesorRoutes.ts`: Rutas para las operaciones CRUD de profesores.

- `/views/`: Carpeta vacía, prevista para vistas.

### Otros archivos importantes:

- `package.json`: Archivo de configuración de npm, que incluye dependencias y scripts.
- `package-lock.json`: Archivo de bloqueo de dependencias de npm.
- `tsconfig.json`: Archivo de configuración de TypeScript.
- `.gitignore`: Archivo para ignorar directorios y archivos innecesarios en el repositorio.
- `readme.md`: Este archivo que estás leyendo.

## Nota

Estoy aprendiendo. Disculpen cualquier error u horror en mi código XD.

## Contacto

Para cualquier consulta o comentario, puedes contactarme a través de LinkedIn o GitHub.

---

Gracias por revisar mi proyecto! :)
