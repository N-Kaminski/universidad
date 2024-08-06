USE universidad;

-- Insertar estudiantes
INSERT INTO estudiantes (dni, nombre, apellido, email) VALUES
('12345678', 'Nicolas', 'Kaminski', 'nicolas.kaminski@gmail.com'),
('23456789', 'Belen', 'Gorosito', 'belen.gorosito@outlook.com'),
('34567890', 'Gaston', 'Gojian', 'gaston.gojian@gmail.com'),
('45678901', 'Daro', 'Ruiz', 'daro.ruiz@outlook.com'),
('56789012', 'Johana', 'Cottone', 'johana.cottone@gmail.com'),
('67890123', 'Silvana', 'Casaus', 'silvana.casaus@outlook.com'),
('78901234', 'Pablo', 'Maglia', 'pablo.maglia@gmail.com'),
('89012345', 'Lucas', 'Lani', 'lucas.lani@outlook.com'),
('90123456', 'Ricardo', 'Janek', 'ricardo.janek@gmail.com'),
('01234567', 'Silvina', 'Osmolski', 'silvina.osmolski@outlook.com');

-- Insertar profesores
INSERT INTO profesores (dni, nombre, apellido, email, profesion, telefono) VALUES
('34563040', 'Juan', 'Perez', 'juan.perez@gmail.com', 'Programacion', '5492234384177'),
('45674050', 'Ana', 'Lopez', 'ana.lopez@outlook.com', 'Programacion', '5491157896332'),
('56785060', 'Carlos', 'Gomez', 'carlos.gomez@gmail.com', 'Programacion', '5492234384177');

-- Insertar cursos
INSERT INTO cursos (nombre, descripcion, profesor_id) VALUES
('Programacion 1', 'Introduccion a la programacion', 1),
('Programacion 2', 'Programacion avanzada', 2),
('Base de Datos', 'Diseño y gestion de bases de datos', 3);

-- Insertar cursos_estudiantes
INSERT INTO cursos_estudiantes (curso_id, estudiante_id, nota) VALUES
(1, 1, 85),
(1, 2, 90),
(1, 3, 78),
(2, 4, 88),
(2, 5, 92),
(2, 6, 75),
(3, 7, 80),
(3, 8, 85),
(3, 9, 70),
(1, 10, 95),
(2, 1, 87),
(3, 2, 90);
