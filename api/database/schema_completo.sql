-- ========================================================
-- Base de Datos: Barberazo
-- Versión del Motor: MariaDB 11.8 / MySQL
-- Modelo de Datos Físico (MDF) Completo
-- ========================================================

SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;

-- 1. Cliente
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

-- 2. Empleado
CREATE TABLE IF NOT EXISTS `empleado` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(50) NOT NULL,
  `apellido` VARCHAR(50) NOT NULL,
  `mail` VARCHAR(100) NOT NULL UNIQUE,
  `contrasena` VARCHAR(255) NOT NULL,
  `esAdmin` BOOLEAN DEFAULT FALSE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Servicio
CREATE TABLE IF NOT EXISTS `servicio` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(50) NOT NULL,
  `descripcion` VARCHAR(255),
  `duracion` TIME NOT NULL,
  `precio` DECIMAL(10,2) NOT NULL,
  `estado` BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Empleado_servicio (Muchos a Muchos)
CREATE TABLE IF NOT EXISTS `empleado_servicio` (
  `idEmpleado` INT NOT NULL,
  `idServicio` INT NOT NULL,
  PRIMARY KEY (`idEmpleado`, `idServicio`),
  CONSTRAINT `fk_comp_es_empleado` FOREIGN KEY (`idEmpleado`) REFERENCES `empleado` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_comp_es_servicio` FOREIGN KEY (`idServicio`) REFERENCES `servicio` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Día de Trabajo
CREATE TABLE IF NOT EXISTS `diaTrabajo` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `fecha` DATE NOT NULL,
  `horarioInicio` TIME NOT NULL,
  `horarioFin` TIME NOT NULL,
  `estado` BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Horario de Trabajo
CREATE TABLE IF NOT EXISTS `horarioTrabajo` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_diaTrabajo` INT NOT NULL,
  `id_empleado` INT NOT NULL,
  `inicio` TIME NOT NULL,
  `fin` TIME NOT NULL,
  CONSTRAINT `fk_comp_ht_diaTrabajo` FOREIGN KEY (`id_diaTrabajo`) REFERENCES `diaTrabajo` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_comp_ht_empleado` FOREIGN KEY (`id_empleado`) REFERENCES `empleado` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Turno
CREATE TABLE IF NOT EXISTS `turno` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_cliente` INT NOT NULL,
  `id_empleado` INT NOT NULL,
  `id_diaTrabajo` INT NULL,
  `id_resena` INT NULL,
  `id_cancelacion` INT NULL,
  `estado` BOOLEAN DEFAULT TRUE,
  `fechaHora` DATETIME NOT NULL,
  CONSTRAINT `fk_comp_turno_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_comp_turno_empleado` FOREIGN KEY (`id_empleado`) REFERENCES `empleado` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_comp_turno_diaTrabajo` FOREIGN KEY (`id_diaTrabajo`) REFERENCES `diaTrabajo` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Turno_servicio (Muchos a Muchos)
CREATE TABLE IF NOT EXISTS `turno_servicio` (
  `idTurno` INT NOT NULL,
  `idServicio` INT NOT NULL,
  PRIMARY KEY (`idTurno`, `idServicio`),
  CONSTRAINT `fk_comp_ts_turno` FOREIGN KEY (`idTurno`) REFERENCES `turno` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_comp_ts_servicio` FOREIGN KEY (`idServicio`) REFERENCES `servicio` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Reseña
CREATE TABLE IF NOT EXISTS `resena` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_turno` INT NOT NULL,
  `descripcion` VARCHAR(255) NULL,
  `puntuacion` TINYINT NOT NULL,
  CONSTRAINT `fk_comp_resena_turno` FOREIGN KEY (`id_turno`) REFERENCES `turno` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Cancelación
CREATE TABLE IF NOT EXISTS `cancelacion` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_turno` INT NOT NULL,
  `fechaHora` DATETIME NOT NULL,
  CONSTRAINT `fk_comp_cancelacion_turno` FOREIGN KEY (`id_turno`) REFERENCES `turno` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Multa
CREATE TABLE IF NOT EXISTS `multa` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_cliente` INT NOT NULL,
  `monto` DECIMAL(10,2) NOT NULL,
  `fecha` DATETIME NOT NULL,
  `estado` BOOLEAN DEFAULT FALSE,
  CONSTRAINT `fk_comp_multa_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Parámetros Generales
CREATE TABLE IF NOT EXISTS `parametros` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `montoMulta` DECIMAL(10,2) NOT NULL DEFAULT 2500.00,
  `maxStrikes` INT NOT NULL DEFAULT 3,
  `maxPuntuacion` INT NOT NULL DEFAULT 5,
  `horarioInicio` TIME NOT NULL DEFAULT '09:00:00',
  `horarioFin` TIME NOT NULL DEFAULT '18:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
