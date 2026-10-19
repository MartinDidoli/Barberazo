-- ============================================================
-- Barberazo - datos minimos de prueba (opcional)
-- ============================================================
-- Importar DESPUES de schema.sql.
-- Todos los usuarios de prueba usan la contrasena: 123456
-- Hash bcrypt de 123456:
-- $2b$10$SD9veVUALgiK6OK2n/5YQOQjBI2Ja8kVbEszpRI4DrXCkqP2LYwO2
-- ============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- Clientes
INSERT IGNORE INTO `cliente`
  (`id`, `nombre`, `apellido`, `email`, `strikes`, `telefono`, `contrasena`, `estado`)
VALUES
  (1, 'Rodrigo', 'Bozio', 'cliente@barberazo.com', 2, '3415551234',
   '$2b$10$SD9veVUALgiK6OK2n/5YQOQjBI2Ja8kVbEszpRI4DrXCkqP2LYwO2', 'ACTIVO'),
  (2, 'Lucas', 'Martino', 'multado@barberazo.com', 3, '3415559999',
   '$2b$10$SD9veVUALgiK6OK2n/5YQOQjBI2Ja8kVbEszpRI4DrXCkqP2LYwO2', 'MULTADO'),
  (3, 'Angel', 'Di Maria', 'bloqueado@barberazo.com', 1, '3415550000',
   '$2b$10$SD9veVUALgiK6OK2n/5YQOQjBI2Ja8kVbEszpRI4DrXCkqP2LYwO2', 'BLOQUEADO');

-- Empleados (el id 1 es el dueno/admin)
INSERT IGNORE INTO `empleado`
  (`id`, `nombre`, `apellido`, `mail`, `telefono`, `contrasena`, `es_admin`, `estado`)
VALUES
  (1, 'Martín', 'Dueño', 'dueno@barberazo.com', '3415551111',
   '$2b$10$SD9veVUALgiK6OK2n/5YQOQjBI2Ja8kVbEszpRI4DrXCkqP2LYwO2', 1, 'ACTIVO'),
  (2, 'Franco', 'Barbero', 'empleado@barberazo.com', '3415552222',
   '$2b$10$SD9veVUALgiK6OK2n/5YQOQjBI2Ja8kVbEszpRI4DrXCkqP2LYwO2', 0, 'ACTIVO'),
  (3, 'Mateo', 'Bertín', 'mateo@barberazo.com', '3415553333',
   '$2b$10$SD9veVUALgiK6OK2n/5YQOQjBI2Ja8kVbEszpRI4DrXCkqP2LYwO2', 0, 'ACTIVO');

-- Servicios
INSERT IGNORE INTO `servicio`
  (`id`, `nombre`, `descripcion`, `duracion`, `precio`, `estado`)
VALUES
  (1, 'Corte de Cabello', 'Corte tradicional con lavado incluido', '00:30:00', 5000.00, 'HABILITADO'),
  (2, 'Perfilado de Barba', 'Arreglo, toalla caliente y delineado', '00:30:00', 3500.00, 'HABILITADO'),
  (3, 'Combo Completo', 'Corte de pelo + barba + peinado', '01:00:00', 7500.00, 'HABILITADO'),
  (4, 'Tintura / Color', 'Tintura completa para cabello corto', '00:45:00', 6000.00, 'HABILITADO'),
  (5, 'Exfoliación Facial', 'Tratamiento express de limpieza de piel', '00:20:00', 2500.00, 'DESHABILITADO');

-- Dias habilitados (los proximos 3 dias)
INSERT IGNORE INTO `dia_trabajo`
  (`id`, `fecha`, `horario_inicio`, `horario_fin`, `estado`)
VALUES
  (1, CURDATE() + INTERVAL 1 DAY, '09:00:00', '18:00:00', 'HABILITADO'),
  (2, CURDATE() + INTERVAL 2 DAY, '09:00:00', '18:00:00', 'HABILITADO'),
  (3, CURDATE() + INTERVAL 3 DAY, '09:00:00', '14:00:00', 'HABILITADO');

-- Horarios de empleados
INSERT IGNORE INTO `horario_trabajo`
  (`id`, `id_dia_trabajo`, `id_empleado`, `inicio`, `fin`)
VALUES
  (1, 1, 1, '09:00:00', '13:00:00'),
  (2, 1, 1, '14:00:00', '18:00:00'),
  (3, 1, 2, '09:00:00', '17:00:00'),
  (4, 2, 2, '10:00:00', '18:00:00'),
  (5, 2, 3, '09:00:00', '15:00:00'),
  (6, 3, 1, '09:00:00', '14:00:00');

-- Servicios que puede prestar cada empleado
INSERT IGNORE INTO `empleado_servicio` (`id_empleado`, `id_servicio`)
VALUES
  (1, 1), (1, 2), (1, 3), (1, 4),
  (2, 1), (2, 2), (2, 3), (2, 5),
  (3, 1), (3, 3), (3, 4);

-- Turnos de ejemplo
INSERT IGNORE INTO `turno`
  (`id`, `id_cliente`, `id_dia_trabajo`, `id_empleado`, `fecha_hora`, `estado`,
   `motivo_cancelacion`, `cancelado_por`)
VALUES
  (1, 1, 1, 2, CONCAT(CURDATE() + INTERVAL 1 DAY, ' 11:00:00'),
   'SOLICITADO', NULL, NULL),
  (2, 2, 2, 3, CONCAT(CURDATE() + INTERVAL 2 DAY, ' 12:00:00'),
   'CANCELADO', 'Cancelado por el cliente', 'CLIENTE');

-- Servicios de cada turno
INSERT IGNORE INTO `turno_servicio` (`id_turno`, `id_servicio`)
VALUES
  (1, 3),
  (2, 2);
