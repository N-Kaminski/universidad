# Proyecto Universidad

## Descripción

Este proyecto es una aplicación web para gestionar la información universitaria, incluyendo estudiantes, profesores y cursos.
Lo estoy desarrollando en funcion de las clases que curso de la materia "Desarrollo de App Web".

## Estructura del Proyecto

- `/config`
  - `configDB.js`: Configuración de la BD para la aplicación, incluyendo los detalles del host, usuario, y otros parámetros de conexión.
- `/controller`

  - `estudianteController.js`: Controlador para gestionar estudiantes.
  - `profesorController.js`: Controlador para gestionar profesores.
  - `cursoController.js`: Controlador para gestionar cursos.
  - `inscripcionController.js`: Controlador para gestionar relacion curso y estudiante.

- `/database`

  - `conexion.js`: Archivo de configuración de la conexión a la base de datos.
  - `schema.sql`: Script SQL para crear las tablas de la base de datos.
  - `data.sql`: Script SQL para poblar las tablas con datos de ejemplo.

- `/model`

  - (Por ahora está vacío, pero aquí se incluirán los modelos de datos)

- `/routers`

  - `estudianteRouters.js`: Rutas para las operaciones CRUD de estudiantes.
  - `profesorRouters.js`: Rutas para las operaciones CRUD de profesores.
  - `cursoRouters.js`: Rutas para las operaciones CRUD de cursos.
  - `inscripcionRouters.js`: Rutas para las operaciones CRUD de cursosEstudiantes.

- `/`: Raíz del proyecto
  - `index.js`: Punto de entrada de la aplicación.
  - `package.json`: Archivo de configuración de npm.
  - `package-lock.json`: Archivo de bloqueo de npm.
  - `.gitignore`: Archivo para ignorar directorios y archivos innecesarios.

## Nota

Estoy aprendiendo. Disculpen cualquier error u horror en mi código XD.

## Contacto

Para cualquier consulta o comentario, puedes contactarme a través de LinkedIn o GitHub.

---

Gracias por revisar mi proyecto! :)
