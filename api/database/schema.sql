-- ============================================================
-- Barberazo - esquema minimo para alwaysdata (MariaDB 11.8)
-- ============================================================
-- Este archivo NO crea la base ni hace USE: la base se crea desde
-- el panel de alwaysdata y se selecciona antes de importar.
--
-- Incluye solo el nucleo de agenda:
--   cliente, empleado, servicio, dia_trabajo, horario_trabajo,
--   turno, turno_servicio y empleado_servicio.
--
-- Quedan afuera a proposito: resena, multa, parametros y la tabla
-- cancelacion. La cancelacion se guarda directamente en turno.
-- ============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- ------------------------------------------------------------
-- 1. Cliente
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `cliente` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(50) NOT NULL,
  `apellido` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `strikes` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `telefono` VARCHAR(20) DEFAULT NULL,
  `contrasena` VARCHAR(255) NOT NULL,
  `estado` ENUM('REGISTRADO', 'ACTIVO', 'BLOQUEADO', 'MULTADO')
    NOT NULL DEFAULT 'ACTIVO',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_cliente_email` (`email`),
  KEY `idx_cliente_estado` (`estado`),
  CONSTRAINT `chk_cliente_strikes` CHECK (`strikes` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 2. Empleado
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `empleado` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(50) NOT NULL,
  `apellido` VARCHAR(50) NOT NULL,
  `mail` VARCHAR(100) NOT NULL,
  `telefono` VARCHAR(20) DEFAULT NULL,
  `contrasena` VARCHAR(255) NOT NULL,
  `es_admin` TINYINT(1) NOT NULL DEFAULT 0,
  `estado` ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_empleado_mail` (`mail`),
  KEY `idx_empleado_estado` (`estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 3. Servicio
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `servicio` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(50) NOT NULL,
  `descripcion` VARCHAR(255) DEFAULT NULL,
  `duracion` TIME NOT NULL,
  `precio` DECIMAL(10,2) NOT NULL,
  `estado` ENUM('HABILITADO', 'DESHABILITADO')
    NOT NULL DEFAULT 'HABILITADO',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_servicio_nombre` (`nombre`),
  KEY `idx_servicio_estado` (`estado`),
  CONSTRAINT `chk_servicio_precio` CHECK (`precio` >= 0),
  CONSTRAINT `chk_servicio_duracion` CHECK (`duracion` > '00:00:00')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 4. Dia de trabajo (fecha habilitada por el dueno)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `dia_trabajo` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `fecha` DATE NOT NULL,
  `horario_inicio` TIME NOT NULL,
  `horario_fin` TIME NOT NULL,
  `estado` ENUM('HABILITADO', 'DESHABILITADO')
    NOT NULL DEFAULT 'DESHABILITADO',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_dia_trabajo_fecha` (`fecha`),
  KEY `idx_dia_trabajo_estado` (`estado`),
  CONSTRAINT `chk_dia_trabajo_horario` CHECK (`horario_inicio` < `horario_fin`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 5. Horario de un empleado dentro de un dia de trabajo
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `horario_trabajo` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `id_dia_trabajo` INT NOT NULL,
  `id_empleado` INT NOT NULL,
  `inicio` TIME NOT NULL,
  `fin` TIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_horario_dia_empleado_inicio`
    (`id_dia_trabajo`, `id_empleado`, `inicio`),
  KEY `idx_horario_empleado` (`id_empleado`),
  CONSTRAINT `fk_horario_dia_trabajo`
    FOREIGN KEY (`id_dia_trabajo`) REFERENCES `dia_trabajo` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_horario_empleado`
    FOREIGN KEY (`id_empleado`) REFERENCES `empleado` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chk_horario_trabajo` CHECK (`inicio` < `fin`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 6. Turno
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `turno` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `id_cliente` INT NOT NULL,
  `id_dia_trabajo` INT NOT NULL,
  `id_empleado` INT NOT NULL,
  `fecha_hora` DATETIME NOT NULL,
  `estado` ENUM(
    'SOLICITADO',
    'ASISTIDO',
    'NO_ASISTIDO',
    'CANCELADO',
    'CANCELADO_EMPLEADO'
  ) NOT NULL DEFAULT 'SOLICITADO',
  `motivo_cancelacion` VARCHAR(255) DEFAULT NULL,
  `cancelado_por` ENUM('CLIENTE', 'EMPLEADO', 'ADMIN') DEFAULT NULL,
  `fecha_creacion` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_turno_cliente` (`id_cliente`),
  KEY `idx_turno_empleado_fecha` (`id_empleado`, `fecha_hora`),
  KEY `idx_turno_dia_estado` (`id_dia_trabajo`, `estado`),
  CONSTRAINT `fk_turno_cliente`
    FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_turno_dia_trabajo`
    FOREIGN KEY (`id_dia_trabajo`) REFERENCES `dia_trabajo` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_turno_empleado`
    FOREIGN KEY (`id_empleado`) REFERENCES `empleado` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 7. Servicios incluidos en un turno (N:M)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `turno_servicio` (
  `id_turno` INT NOT NULL,
  `id_servicio` INT NOT NULL,
  PRIMARY KEY (`id_turno`, `id_servicio`),
  KEY `idx_turno_servicio_servicio` (`id_servicio`),
  CONSTRAINT `fk_turno_servicio_turno`
    FOREIGN KEY (`id_turno`) REFERENCES `turno` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_turno_servicio_servicio`
    FOREIGN KEY (`id_servicio`) REFERENCES `servicio` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 8. Servicios que puede prestar cada empleado (N:M)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `empleado_servicio` (
  `id_empleado` INT NOT NULL,
  `id_servicio` INT NOT NULL,
  PRIMARY KEY (`id_empleado`, `id_servicio`),
  KEY `idx_empleado_servicio_servicio` (`id_servicio`),
  CONSTRAINT `fk_empleado_servicio_empleado`
    FOREIGN KEY (`id_empleado`) REFERENCES `empleado` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_empleado_servicio_servicio`
    FOREIGN KEY (`id_servicio`) REFERENCES `servicio` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
