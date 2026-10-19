-- ========================================================
-- Base de Datos: Barberazo
-- Versión del Motor: MariaDB 11.8 / MySQL
-- Configuración básica para Alwaysdata (Tablas principales)
-- ========================================================

SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;

-- 1. Tabla: cliente
CREATE TABLE IF NOT EXISTS `cliente` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(50) NOT NULL,
  `apellido` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `strikes` TINYINT DEFAULT 0,
  `telefono` VARCHAR(20) NOT NULL,
  `contrasena` VARCHAR(255) NOT NULL,
  `estado` VARCHAR(20) DEFAULT 'activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabla: empleado
CREATE TABLE IF NOT EXISTS `empleado` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(50) NOT NULL,
  `apellido` VARCHAR(50) NOT NULL,
  `mail` VARCHAR(100) NOT NULL UNIQUE,
  `contrasena` VARCHAR(255) NOT NULL,
  `esAdmin` BOOLEAN DEFAULT FALSE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabla: servicio
CREATE TABLE IF NOT EXISTS `servicio` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(50) NOT NULL,
  `descripcion` VARCHAR(255),
  `duracion` TIME NOT NULL,
  `precio` DECIMAL(10,2) NOT NULL,
  `estado` BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tabla intermedia: empleado_servicio
CREATE TABLE IF NOT EXISTS `empleado_servicio` (
  `idEmpleado` INT NOT NULL,
  `idServicio` INT NOT NULL,
  PRIMARY KEY (`idEmpleado`, `idServicio`),
  CONSTRAINT `fk_es_empleado` FOREIGN KEY (`idEmpleado`) REFERENCES `empleado` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_es_servicio` FOREIGN KEY (`idServicio`) REFERENCES `servicio` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Tabla: diaTrabajo
CREATE TABLE IF NOT EXISTS `diaTrabajo` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `fecha` DATE NOT NULL,
  `horarioInicio` TIME NOT NULL,
  `horarioFin` TIME NOT NULL,
  `estado` BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Tabla: horarioTrabajo
CREATE TABLE IF NOT EXISTS `horarioTrabajo` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_diaTrabajo` INT NOT NULL,
  `id_empleado` INT NOT NULL,
  `inicio` TIME NOT NULL,
  `fin` TIME NOT NULL,
  CONSTRAINT `fk_ht_diaTrabajo` FOREIGN KEY (`id_diaTrabajo`) REFERENCES `diaTrabajo` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ht_empleado` FOREIGN KEY (`id_empleado`) REFERENCES `empleado` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Tabla: turno
CREATE TABLE IF NOT EXISTS `turno` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_cliente` INT NOT NULL,
  `id_empleado` INT NOT NULL,
  `id_diaTrabajo` INT NULL,
  `id_resena` INT NULL,
  `id_cancelacion` INT NULL,
  `estado` BOOLEAN DEFAULT TRUE,
  `fechaHora` DATETIME NOT NULL,
  CONSTRAINT `fk_turno_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_turno_empleado` FOREIGN KEY (`id_empleado`) REFERENCES `empleado` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_turno_diaTrabajo` FOREIGN KEY (`id_diaTrabajo`) REFERENCES `diaTrabajo` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Tabla intermedia: turno_servicio
CREATE TABLE IF NOT EXISTS `turno_servicio` (
  `idTurno` INT NOT NULL,
  `idServicio` INT NOT NULL,
  PRIMARY KEY (`idTurno`, `idServicio`),
  CONSTRAINT `fk_ts_turno` FOREIGN KEY (`idTurno`) REFERENCES `turno` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ts_servicio` FOREIGN KEY (`idServicio`) REFERENCES `servicio` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ========================================================
-- Datos de prueba iniciales (Basados en el documento MDF)
-- ========================================================

-- Clientes iniciales
INSERT INTO `cliente` (`id`, `nombre`, `apellido`, `email`, `strikes`, `telefono`, `contrasena`, `estado`) VALUES
(1, 'Juan', 'Pérez', 'juan.perez@email.com', 0, '1144556677', '$2b$10$e8wVf5g7v1Y5N4o8k4J9m.O9oHqXp1.Q/Z8u8t5.Gq4.m', 'activo'),
(2, 'María', 'Gómez', 'maria.gomez@email.com', 1, '1155667788', '$2b$10$a1wVf5g7v1Y5N4o8k4J9m.O9oHqXp1.Q/Z8u8t5.Gq4.m', 'activo'),
(3, 'Carlos', 'López', 'carlos.lopez@email.com', 3, '1166778899', '$2b$10$f3wVf5g7v1Y5N4o8k4J9m.O9oHqXp1.Q/Z8u8t5.Gq4.m', 'bloqueado'),
(4, 'Ana', 'Martínez', 'ana.martinez@email.com', 0, '1177889900', '$2b$10$c9wVf5g7v1Y5N4o8k4J9m.O9oHqXp1.Q/Z8u8t5.Gq4.m', 'activo'),
(5, 'Lucas', 'Rodríguez', 'lucas.r@email.com', 0, '1188990011', '$2b$10$d4wVf5g7v1Y5N4o8k4J9m.O9oHqXp1.Q/Z8u8t5.Gq4.m', 'activo')
ON DUPLICATE KEY UPDATE `nombre` = VALUES(`nombre`);

-- Empleados iniciales
INSERT INTO `empleado` (`id`, `nombre`, `apellido`, `mail`, `contrasena`, `esAdmin`) VALUES
(1, 'Roberto', 'Silva', 'roberto.s@barberia.com', '$2b$10$x1wVf5g7v1Y5N4o8k4J9m.O9oHqXp1.Q/Z8u8t5.Gq4.m', TRUE),
(2, 'Sofia', 'Fernández', 'sofia.f@barberia.com', '$2b$10$y2wVf5g7v1Y5N4o8k4J9m.O9oHqXp1.Q/Z8u8t5.Gq4.m', FALSE),
(3, 'Diego', 'Torres', 'diego.t@barberia.com', '$2b$10$z3wVf5g7v1Y5N4o8k4J9m.O9oHqXp1.Q/Z8u8t5.Gq4.m', FALSE),
(4, 'Laura', 'Benítez', 'laura.b@barberia.com', '$2b$10$w4wVf5g7v1Y5N4o8k4J9m.O9oHqXp1.Q/Z8u8t5.Gq4.m', FALSE),
(5, 'Gonzalo', 'Romero', 'gonzalo.r@barberia.com', '$2b$10$v5wVf5g7v1Y5N4o8k4J9m.O9oHqXp1.Q/Z8u8t5.Gq4.m', FALSE)
ON DUPLICATE KEY UPDATE `nombre` = VALUES(`nombre`);

-- Servicios iniciales
INSERT INTO `servicio` (`id`, `nombre`, `descripcion`, `duracion`, `precio`, `estado`) VALUES
(1, 'Corte de Cabello', 'Corte tradicional con lavado incluido', '00:30:00', 5000.00, TRUE),
(2, 'Perfilado de Barba', 'Arreglo, toalla caliente y delineado', '00:30:00', 3500.00, TRUE),
(3, 'Combo Completo', 'Corte de pelo + barba + peinado', '01:00:00', 7500.00, TRUE),
(4, 'Tintura / Color', 'Tintura completa para cabello corto', '00:45:00', 6000.00, TRUE),
(5, 'Exfoliación Facial', 'Tratamiento expréss de limpieza de piel', '00:20:00', 2500.00, FALSE)
ON DUPLICATE KEY UPDATE `nombre` = VALUES(`nombre`);

-- Empleado - Servicio relaciones
INSERT INTO `empleado_servicio` (`idEmpleado`, `idServicio`) VALUES
(1, 1), (1, 2), (1, 3),
(2, 1), (2, 2),
(3, 1), (3, 3), (3, 4)
ON DUPLICATE KEY UPDATE `idEmpleado` = VALUES(`idEmpleado`);

-- Días de trabajo iniciales
INSERT INTO `diaTrabajo` (`id`, `fecha`, `horarioInicio`, `horarioFin`, `estado`) VALUES
(1, '2026-09-01', '09:00:00', '18:00:00', TRUE),
(2, '2026-09-02', '09:00:00', '18:00:00', TRUE),
(3, '2026-09-03', '09:00:00', '18:00:00', TRUE),
(4, '2026-09-04', '09:00:00', '18:00:00', TRUE),
(5, '2026-09-05', '09:00:00', '14:00:00', TRUE)
ON DUPLICATE KEY UPDATE `fecha` = VALUES(`fecha`);

-- Horarios de trabajo iniciales
INSERT INTO `horarioTrabajo` (`id`, `id_diaTrabajo`, `id_empleado`, `inicio`, `fin`) VALUES
(1, 1, 1, '09:00:00', '13:00:00'),
(2, 1, 1, '14:00:00', '18:00:00'),
(3, 1, 2, '09:00:00', '17:00:00'),
(4, 2, 2, '10:00:00', '18:00:00'),
(5, 2, 3, '09:00:00', '15:00:00')
ON DUPLICATE KEY UPDATE `inicio` = VALUES(`inicio`);

-- Turnos de ejemplo
INSERT INTO `turno` (`id`, `id_cliente`, `id_empleado`, `id_diaTrabajo`, `id_resena`, `id_cancelacion`, `estado`, `fechaHora`) VALUES
(1, 1, 1, 1, NULL, NULL, TRUE, '2026-09-01 10:00:00'),
(2, 2, 2, 1, NULL, NULL, TRUE, '2026-09-01 11:00:00'),
(3, 4, 1, 1, NULL, NULL, TRUE, '2026-09-01 15:00:00'),
(4, 5, 3, 2, NULL, NULL, TRUE, '2026-09-02 10:30:00'),
(5, 3, 2, 2, NULL, NULL, FALSE, '2026-09-02 12:00:00')
ON DUPLICATE KEY UPDATE `fechaHora` = VALUES(`fechaHora`);

-- Turno - Servicio
INSERT INTO `turno_servicio` (`idTurno`, `idServicio`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 1),
(5, 1)
ON DUPLICATE KEY UPDATE `idTurno` = VALUES(`idTurno`);
