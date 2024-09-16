# Proyecto Universidad

## Descripción

Este proyecto es una aplicación web para gestionar la información universitaria, incluyendo estudiantes, profesores y cursos. Está desarrollado utilizando TypeScript y TypeORM para la gestión de la base de datos relacional. El proyecto fue creado como parte de la asignatura "Desarrollo de Aplicaciones Web".

## Tecnologías Principales

- **TypeScript**: Lenguaje principal del proyecto.
- **TypeORM**: ORM utilizado para interactuar con la base de datos relacional.
- **Express.js**: Framework para crear la API REST.
- **MySQL**: Base de datos utilizada para almacenar la información.
- **Node.js**: Entorno de ejecución para el servidor.

## Estructura del Proyecto

El proyecto sigue una arquitectura típica MVC (Modelo-Vista-Controlador) con la adición de TypeORM para gestionar las interacciones con la base de datos. Se divide en dos partes principales: el código fuente en TypeScript dentro de `src/` y los archivos compilados en JavaScript dentro de `build/`.

### `/build/`

Esta carpeta contiene el código compilado a **JavaScript** del proyecto.

- `/controller/`: Controladores para manejar la lógica de cada entidad.

  - `cursoController.js`: Controlador para gestionar cursos.
  - `estudianteController.js`: Controlador para gestionar estudiantes.
  - `inscripcionController.js`: Controlador para gestionar la relación curso-estudiante.
  - `profesorController.js`: Controlador para gestionar profesores.

- `/db/`: Contiene la configuración de la base de datos.

  - `conexion.js`: Archivo de configuración de la conexión a la base de datos.
  - `configDB.js`: Archivo de configuración detallada de la base de datos.

- `/models/`: Modelos de datos generados por TypeORM.

  - `cursoModels.js`: Modelo de Curso.
  - `estudianteModels.js`: Modelo de Estudiante.
  - `inscripcionModels.js`: Modelo de Inscripción.
  - `profesorModels.js`: Modelo de Profesor.

- `/routes/`: Define las rutas de la API.

  - `cursoRoutes.js`: Rutas para las operaciones CRUD de cursos.
  - `estudianteRoutes.js`: Rutas para las operaciones CRUD de estudiantes.
  - `inscripcionRoutes.js`: Rutas para las operaciones CRUD de inscripciones.
  - `profesorRoutes.js`: Rutas para las operaciones CRUD de profesores.

### `/database/`

- `BD Datos.sql`: Script para poblar las tablas con datos de ejemplo.
- `BD Tablas.sql`: Script SQL para crear las tablas de la base de datos.

### `/src/`

Esta carpeta contiene el código fuente en **TypeScript** del proyecto.

- `/controller/`: Controladores que gestionan las acciones de cada recurso.

  - `cursoController.ts`: Controlador para gestionar cursos.
  - `estudianteController.ts`: Controlador para gestionar estudiantes.
  - `inscripcionController.ts`: Controlador para gestionar la relación curso-estudiante.
  - `profesorController.ts`: Controlador para gestionar profesores.

- `/db/`: Contiene la configuración para conectar con la base de datos.

  - `conexion.ts`: Archivo de configuración de la conexión a la base de datos utilizando `mysql2/promise`.
  - `configDB.ts`: Archivo de configuración detallada de la base de datos.

- `/models/`: Modelos de datos definidos usando **TypeORM**.

  - `cursoModels.ts`: Modelo de Curso.
  - `estudianteModels.ts`: Modelo de Estudiante.
  - `inscripcionModels.ts`: Modelo de Inscripción.
  - `profesorModels.ts`: Modelo de Profesor.

- `/routes/`: Define las rutas de la API.

  - `cursoRoutes.ts`: Rutas para las operaciones CRUD de cursos.
  - `estudianteRoutes.ts`: Rutas para las operaciones CRUD de estudiantes.
  - `inscripcionRoutes.ts`: Rutas para las operaciones CRUD de inscripciones.
  - `profesorRoutes.ts`: Rutas para las operaciones CRUD de profesores.

- `/views/`: Carpeta que contiene las vistas del proyecto.

  - `index.html`: Página principal del proyecto.
  - `estudiantes.html`: Vista para gestionar estudiantes.
  - `cursos.html`: Vista para gestionar cursos.
  - `profesores.html`: Vista para gestionar profesores.
  - `inscripciones.html`: Vista para gestionar inscripciones.

  Además, en esta carpeta se encuentran los archivos JavaScript correspondientes para la lógica de las vistas:

  - `estudiantes.js`: Lógica de la vista de estudiantes.
  - `cursos.js`: Lógica de la vista de cursos.
  - `profesores.js`: Lógica de la vista de profesores.
  - `inscripciones.js`: Lógica de la vista de inscripciones.

### Otros archivos importantes:

- `.env`: Archivo de configuración de entorno con variables sensibles como credenciales de base de datos.
- `package.json`: Archivo de configuración de npm, que incluye dependencias y scripts.
- `package-lock.json`: Archivo de bloqueo de dependencias de npm.
- `tsconfig.json`: Archivo de configuración de TypeScript.
- `.gitignore`: Archivo para ignorar directorios y archivos innecesarios en el repositorio.
- `readme.md`: Este archivo que estás leyendo.

## Nota

Estoy aprendiendo. Disculpen cualquier error u horror en mi código XD. Si encontrás errores, me alegraria cualquier comentario constructivo para solucionarlo!

## Contacto

Para cualquier consulta o comentario, puedes contactarme a través de [LinkedIn](https://www.linkedin.com/in/nkaminski-profile/)
o [GitHub](https://github.com/N-Kaminski)
.

---

Gracias por revisar mi proyecto! :)
