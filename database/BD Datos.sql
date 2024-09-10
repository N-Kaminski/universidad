USE universidad;

-- Insertar estudiantes
INSERT INTO estudiantes (dni, nombre, apellido, email) VALUES
('33123456', 'Nahuel', 'Segovia', 'nahuel.segovia@gmail.com'),
('33234567', 'Kaminski', 'Nicolas', 'kaminski.nicolas@outlook.com'),
('34345678', 'Aguirre', 'Macarena', 'aguirre.macarena@gmail.com'),
('34456789', 'Méndez', 'Beatriz', 'mendez.beatriz@outlook.com'),
('35567890', 'Peralta', 'Agustin', 'peralta.agustin@gmail.com'),
('36678901', 'Marcelo', 'Zych', 'marcelo.zych@outlook.com'),
('37789012', 'Ruben', 'Ugarte', 'ruben.ugarte@gmail.com'),
('38890123', 'Cristian', 'Collins', 'cristian.collins@outlook.com'),
('39901234', 'Ivana', 'Cabrera', 'ivana.cabrera@gmail.com'),
('41012345', 'Daniel', 'Miño', 'daniel.mino@outlook.com');

-- Insertar profesores
INSERT INTO profesores (dni, nombre, apellido, email, profesion, telefono) VALUES
('34563040', 'Luis', 'Mercado', 'luis.mercado@gmail.com', 'Web', '5493412345678'),
('35674050', 'Veronica', 'Vogt', 'veronica.vogt@outlook.com', 'Matematica', '5493512345678'),
('36785060', 'Andrea', 'Gonzalez', 'andrea.gonzalez@gmail.com', 'Base de Datos', '5492612345678');

-- Insertar cursos
INSERT INTO cursos (nombre, descripcion, profesor_id) VALUES
('Web', 'Desarrollo web', 1),
('Matematica', 'Matematicas avanzadas', 2),
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
