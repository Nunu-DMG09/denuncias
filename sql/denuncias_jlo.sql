-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 28-03-2025 a las 00:11:06
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `denuncias jlo`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `adjuntos`
--

CREATE TABLE `adjuntos` (
  `id` varchar(8) NOT NULL,
  `denuncia_id` varchar(8) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_name` varchar(100) NOT NULL,
  `file_type` varchar(50) NOT NULL,
  `fecha_subida` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Disparadores `adjuntos`
--
DELIMITER $$
CREATE TRIGGER `before_insert_adjuntos` BEFORE INSERT ON `adjuntos` FOR EACH ROW BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = CONCAT('ad', SUBSTRING(REPLACE(UUID(), '-', ''), 1, 6));
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `administradores`
--

CREATE TABLE `administradores` (
  `dni_admin` varchar(8) NOT NULL,
  `nombres` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `categoria` varchar(100) NOT NULL,
  `estado` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `administradores`
--

INSERT INTO `administradores` (`dni_admin`, `nombres`, `password`, `categoria`, `estado`) VALUES
('60776050', 'CESPEDES TORRES, PEDRO FABIAN', '$2y$10$4xzpJ0oETv4LVHV2cpfrWurz28.bZK.0TdSVnJGoJ6W4l/J0cC/My', 'super_admin', 'activo'),
('72357275', 'MESTA GONZALES,LUIS DAVID', '$2y$10$SRkY8e/9t1RdTnFREmb5k.87p2JKbZbUHx2k/5Y1AXJgGnT1eWM0e', 'super_admin', 'activo'),
('72544864', 'SORIANO PALOMINO, ALEJANDRO GABRIEL', '$2y$10$Bml8yVLlTeo74VBUczaRq.b1e4ZUvQoi3j.YV1eEv5yW1DxH9UJNC', 'super_admin', 'activo'),
('74887540', 'CASTRO PASTOR,DIEGO ALBERTO', '$2y$10$Bgta3YjTknhAS3hCp..MUu399d4PrM3UmU/CXWaMty4Tv/pbzSBLa', 'super_admin', 'activo'),
('76628500', 'BURGA BRACAMONTE, JULIAN', '$2y$10$tfjs0cx9/FFaNHMHnISyuuwX2rf9hQkiZWxVoAnmo2Yl/i6NYFaay', 'super_admin', 'activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `denunciados`
--

CREATE TABLE `denunciados` (
  `id` varchar(8) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `numero_documento` varchar(20) DEFAULT NULL,
  `tipo_documento` enum('DNI','Carnet Extranjeria','RUC') DEFAULT 'DNI',
  `representante_legal` varchar(255) DEFAULT NULL,
  `razon_social` varchar(255) DEFAULT NULL,
  `cargo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `denunciados`
--

INSERT INTO `denunciados` (`id`, `nombre`, `numero_documento`, `tipo_documento`, `representante_legal`, `razon_social`, `cargo`) VALUES
('de001', 'Carlos Ruiz', '34567890', 'DNI', NULL, NULL, 'Gerente'),
('de002', 'Empresa XYZ', '987654321', 'RUC', 'José Pérez', 'XYZ S.A.', 'Director'),
('de003', 'Raúl Gómez', '12344321', 'DNI', NULL, NULL, 'Jefe de área'),
('de004', 'Marina Solís', '56789012', 'DNI', NULL, NULL, 'Supervisora'),
('de005', 'Constructora ABC', '654321098', 'RUC', 'Ana Martínez', 'ABC Construcciones', 'Gerente General'),
('de006', 'Ricardo Torres', '11223344', 'DNI', NULL, NULL, 'Subdirector'),
('de007', 'Liliana Rojas', '22334455', 'DNI', NULL, NULL, 'Coordinadora'),
('de008', 'Javier Fernández', '33445566', 'DNI', NULL, NULL, 'Encargado'),
('de009', 'Gustavo López', '44556677', 'DNI', NULL, NULL, 'Director de Proyectos'),
('de010', 'Transporte Nacional SAC', '998877665', 'RUC', 'Luis Ramírez', 'TN SAC', 'Presidente'),
('de011', 'Isabel Muñoz', '55667788', 'DNI', NULL, NULL, 'Gerente Financiero'),
('de012', 'Pedro Morales', '66778899', 'DNI', NULL, NULL, 'Jefe de Recursos Humanos'),
('de013', 'Natalia Herrera', '77889900', 'DNI', NULL, NULL, 'Coordinadora de Ventas'),
('de014', 'Carlos Pérez', '88990011', 'DNI', NULL, NULL, 'Supervisor de Planta'),
('de015', 'Victoria Sánchez', '99001122', 'DNI', NULL, NULL, 'Gerente de Operaciones'),
('de016', 'Inversiones Delta', '554433221', 'RUC', 'Juan Medina', 'Delta S.A.', 'Socio Fundador'),
('de017', 'Paola Núñez', '44556699', 'DNI', NULL, NULL, 'Abogada'),
('de018', 'Jorge Salas', '66778822', 'DNI', NULL, NULL, 'Analista'),
('de019', 'Empresas Unidas SRL', '112244556', 'RUC', 'Carlos Gutiérrez', 'EUSRL', 'Dueño'),
('de020', 'Marcos Zapata', '77889955', 'DNI', NULL, NULL, 'Administrador');

--
-- Disparadores `denunciados`
--
DELIMITER $$
CREATE TRIGGER `before_insert_denunciados` BEFORE INSERT ON `denunciados` FOR EACH ROW BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = CONCAT('de', SUBSTRING(REPLACE(UUID(), '-', ''), 1, 6));
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `denunciantes`
--

CREATE TABLE `denunciantes` (
  `id` varchar(8) NOT NULL,
  `nombres` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `numero_documento` varchar(20) DEFAULT NULL,
  `tipo_documento` enum('DNI','Carnet Extranjeria','RUC') DEFAULT 'DNI',
  `sexo` enum('M','F') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `denunciantes`
--

INSERT INTO `denunciantes` (`id`, `nombres`, `email`, `telefono`, `numero_documento`, `tipo_documento`, `sexo`) VALUES
('dn001', 'Juan Pérez', 'juanp@example.com', '987654321', '12345678', 'DNI', 'M'),
('dn002', 'María López', 'marial@example.com', '987654322', '87654321', 'DNI', 'F'),
('dn003', 'Carlos Gómez', 'carlosg@example.com', '987654323', '11223344', 'DNI', 'M'),
('dn004', 'Ana Torres', 'anatorres@example.com', '987654324', '22334455', 'DNI', 'F'),
('dn005', 'Pedro Sánchez', 'pedros@example.com', '987654325', '33445566', 'DNI', 'M'),
('dn006', 'Lucía Ramírez', 'luciar@example.com', '987654326', '44556677', 'DNI', 'F'),
('dn007', 'Roberto Castro', 'robertoc@example.com', '987654327', '55667788', 'DNI', 'M'),
('dn008', 'Elena Vargas', 'elenav@example.com', '987654328', '66778899', 'DNI', 'F'),
('dn009', 'Miguel Rojas', 'miguelr@example.com', '987654329', '77889900', 'DNI', 'M'),
('dn010', 'Gabriela Fernández', 'gabriela@example.com', '987654330', '88990011', 'DNI', 'F'),
('dn011', 'Luis Mendoza', 'luism@example.com', '987654331', '99001122', 'DNI', 'M'),
('dn012', 'Paula Herrera', 'paulah@example.com', '987654332', '11223344', 'DNI', 'F'),
('dn013', 'Fernando Silva', 'fernandos@example.com', '987654333', '22334455', 'DNI', 'M'),
('dn014', 'Diana Ríos', 'dianar@example.com', '987654334', '33445566', 'DNI', 'F'),
('dn015', 'José Castro', 'josec@example.com', '987654335', '44556677', 'DNI', 'M'),
('dn016', 'Sandra Guzmán', 'sandrag@example.com', '987654336', '55667788', 'DNI', 'F'),
('dn017', 'Alberto Vega', 'albertov@example.com', '987654337', '66778899', 'DNI', 'M'),
('dn018', 'Carmen Salazar', 'carmens@example.com', '987654338', '77889900', 'DNI', 'F'),
('dn019', 'Hugo Flores', 'hugof@example.com', '987654339', '88990011', 'DNI', 'M'),
('dn020', 'Valeria Campos', 'valeriac@example.com', '987654340', '99001122', 'DNI', 'F');

--
-- Disparadores `denunciantes`
--
DELIMITER $$
CREATE TRIGGER `before_insert_denunciantes` BEFORE INSERT ON `denunciantes` FOR EACH ROW BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = CONCAT('dn', SUBSTRING(REPLACE(UUID(), '-', ''), 1, 6));
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `denuncias`
--

CREATE TABLE `denuncias` (
  `id` varchar(8) NOT NULL,
  `tracking_code` varchar(20) NOT NULL,
  `es_anonimo` tinyint(1) NOT NULL DEFAULT 1,
  `denunciante_id` varchar(8) DEFAULT NULL,
  `motivo_id` varchar(8) NOT NULL,
  `motivo_otro` varchar(255) DEFAULT NULL,
  `descripcion` text NOT NULL,
  `fecha_incidente` date DEFAULT NULL,
  `denunciado_id` varchar(8) NOT NULL,
  `dni_admin` varchar(8) DEFAULT NULL,
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp(),
  `estado` enum('registrado','recibida','en proceso','resuelto','rechazado') NOT NULL DEFAULT 'registrado',
  `pdf_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `denuncias`
--

INSERT INTO `denuncias` (`id`, `tracking_code`, `es_anonimo`, `denunciante_id`, `motivo_id`, `motivo_otro`, `descripcion`, `fecha_incidente`, `denunciado_id`, `dni_admin`, `fecha_registro`, `estado`, `pdf_path`) VALUES
('den001', 'TRK001', 0, 'dn001', 'mo221768', NULL, 'Incidente con gerente.', '2025-03-20', 'de001', NULL, '2025-03-27 17:57:22', 'registrado', NULL),
('den002', 'TRK002', 1, NULL, 'mo22176a', 'Otra razón', 'Denuncia contra empresa por malas prácticas.', '2025-03-21', 'de002', NULL, '2025-03-27 17:57:22', 'registrado', NULL),
('den003', 'TRK003', 0, 'dn002', 'mo58aa06', NULL, 'Problema con jefe de área.', '2025-03-18', 'de003', NULL, '2025-03-27 17:57:22', 'registrado', NULL),
('den004', 'TRK004', 0, 'dn003', 'mo58aa1e', NULL, 'Acoso laboral por parte de supervisora.', '2025-03-19', 'de004', NULL, '2025-03-27 17:57:22', 'registrado', NULL),
('den005', 'TRK005', 1, NULL, 'mo58aa1f', NULL, 'Incumplimiento de contrato por parte de empresa.', '2025-03-22', 'de005', NULL, '2025-03-27 17:57:22', 'registrado', NULL),
('den006', 'TRK006', 0, 'dn004', 'mod4b288', NULL, 'Discriminación en la oficina.', '2025-03-17', 'de006', NULL, '2025-03-27 17:57:22', 'registrado', NULL),
('den007', 'TRK007', 0, 'dn005', 'mod4b28c', NULL, 'Negligencia del coordinador.', '2025-03-15', 'de007', NULL, '2025-03-27 17:57:22', 'registrado', NULL),
('den008', 'TRK008', 1, NULL, 'mo_otros', NULL, 'Maltrato verbal por parte del encargado.', '2025-03-14', 'de008', NULL, '2025-03-27 17:57:22', 'registrado', NULL),
('den009', 'TRK009', 0, 'dn006', 'mo221768', NULL, 'Corrupción en dirección de proyectos.', '2025-03-23', 'de009', NULL, '2025-03-27 17:57:22', 'registrado', NULL),
('den010', 'TRK010', 0, 'dn007', 'mo22176a', NULL, 'Falta de pago en empresa de transporte.', '2025-03-16', 'de010', NULL, '2025-03-27 17:57:22', 'registrado', NULL),
('den011', 'TRK011', 0, 'dn008', 'mo58aa06', NULL, 'Desvío de fondos en gerencia financiera.', '2025-03-12', 'de011', NULL, '2025-03-27 17:57:22', 'registrado', NULL),
('den012', 'TRK012', 1, NULL, 'mo58aa1e', NULL, 'Acoso laboral en recursos humanos.', '2025-03-10', 'de012', NULL, '2025-03-27 17:57:22', 'registrado', NULL),
('den013', 'TRK013', 0, 'dn009', 'mo58aa1f', NULL, 'Venta fraudulenta en coordinadora de ventas.', '2025-03-11', 'de013', NULL, '2025-03-27 17:57:22', 'registrado', NULL),
('den014', 'TRK014', 0, 'dn010', 'mod4b288', NULL, 'Problemas con supervisor de planta.', '2025-03-09', 'de014', NULL, '2025-03-27 17:57:22', 'registrado', NULL),
('den015', 'TRK015', 0, 'dn011', 'mod4b28c', NULL, 'Mala administración de operaciones.', '2025-03-08', 'de015', NULL, '2025-03-27 17:57:22', 'registrado', NULL),
('den016', 'TRK016', 1, NULL, 'mo_otros', NULL, 'Empresa con contratos fraudulentos.', '2025-03-07', 'de016', NULL, '2025-03-27 17:57:22', 'registrado', NULL),
('den017', 'TRK017', 0, 'dn012', 'mo221768', NULL, 'Estafa de abogado en trámites legales.', '2025-03-06', 'de017', NULL, '2025-03-27 17:57:22', 'registrado', NULL),
('den018', 'TRK018', 0, 'dn013', 'mo22176a', NULL, 'Análisis erróneo en departamento financiero.', '2025-03-05', 'de018', NULL, '2025-03-27 17:57:22', 'registrado', NULL),
('den019', 'TRK019', 1, NULL, 'mo58aa06', NULL, 'Problemas de gestión en empresa SRL.', '2025-03-04', 'de019', NULL, '2025-03-27 17:57:22', 'registrado', NULL),
('den020', 'TRK020', 0, 'dn014', 'mo58aa1e', NULL, 'Acoso laboral por parte de administrador.', '2025-03-03', 'de020', NULL, '2025-03-27 17:57:22', 'registrado', NULL);

--
-- Disparadores `denuncias`
--
DELIMITER $$
CREATE TRIGGER `before_insert_denuncias` BEFORE INSERT ON `denuncias` FOR EACH ROW BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = CONCAT('de', SUBSTRING(REPLACE(UUID(), '-', ''), 1, 6));
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `motivos`
--

CREATE TABLE `motivos` (
  `id` varchar(8) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `motivos`
--

INSERT INTO `motivos` (`id`, `nombre`, `descripcion`) VALUES
('mo221768', 'Acceso a ventajas indebidas (incluye soborno nacional y transnacional) ', 'Cuando el servidor propicia, solicita o acepta alguna ventaja o beneficio indebido (regalos, donaciones a título personal, bienes, incentivos, cortesías o favores). Incluye el soborno a un servidor público extranjero para obtener o retener un negocio u otra ventaja indebida en la realización de actividades económicas o comerciales internacionales. '),
('mo22176a', 'Invocación de influencias en el Estado ', 'Cuando el servidor utiliza o simula su capacidad de influencia en el sector público para obtener un beneficio o una ventaja irregular. '),
('mo58aa06', 'Mantener intereses en conflicto ', 'Cuando el servidor mantiene vínculos familiares, comerciales, institucionales o laborales que podrían afectar el manejo imparcial de los asuntos a su cargo y las relaciones de la entidad con actores externos. '),
('mo58aa1e', 'Obstrucción al acceso a la información pública ', 'Cuando el servidor se rehúsa a entregar información pública solicitada por los conductos regulares que no sea reservada, confidencial o secreta, de acuerdo con las normas vigentes. '),
('mo58aa1f', 'Abuso de autoridad ', 'Cuando el servidor comete u ordena un acto arbitrario alegando el cumplimiento de sus funciones.'),
('mod4b288', 'Favorecimiento indebido ', 'Cuando el servidor utiliza su cargo para favorecer irregularmente a alguna persona por un interés particular o por un interés ajeno al cumplimiento de sus funciones.'),
('mod4b28c', 'Apropiación o uso indebido de recursos, bienes o información del Estado ', 'Cuando el servidor se adueña o utiliza de manera indebida dinero, recursos (incluyendo el tiempo asignado a la función pública), bienes o información del Estado. '),
('mo_otros', 'Otros', 'Cualquier acto contrario a la Ley del Código de Ética de la Función Pública o conducta indebida no contemplada en las categorías anteriores, incluyendo irregularidades administrativas, conflictos de interés no declarados, u otros actos que comprometan la integridad de la función pública.');

--
-- Disparadores `motivos`
--
DELIMITER $$
CREATE TRIGGER `before_insert_motivos` BEFORE INSERT ON `motivos` FOR EACH ROW BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = CONCAT('mo', SUBSTRING(REPLACE(UUID(), '-', ''), 1, 6));
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seguimiento_denuncias`
--

CREATE TABLE `seguimiento_denuncias` (
  `id` varchar(8) NOT NULL,
  `denuncia_id` varchar(8) NOT NULL,
  `estado` varchar(100) NOT NULL,
  `comentario` text DEFAULT NULL,
  `fecha_actualizacion` datetime NOT NULL DEFAULT current_timestamp(),
  `dni_admin` varchar(8) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `seguimiento_denuncias`
--

INSERT INTO `seguimiento_denuncias` (`id`, `denuncia_id`, `estado`, `comentario`, `fecha_actualizacion`, `dni_admin`) VALUES
('sdf7fa2d', 'den017', 'recibida', 'La denuncia ha sido recibida por el administrador', '2025-03-27 23:10:19', '74887540');

--
-- Disparadores `seguimiento_denuncias`
--
DELIMITER $$
CREATE TRIGGER `before_insert_seguimiento_denuncias` BEFORE INSERT ON `seguimiento_denuncias` FOR EACH ROW BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = CONCAT('sd', SUBSTRING(REPLACE(UUID(), '-', ''), 1, 6));
  END IF;
END
$$
DELIMITER ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `adjuntos`
--
ALTER TABLE `adjuntos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_adjuntos_denuncia` (`denuncia_id`);

--
-- Indices de la tabla `administradores`
--
ALTER TABLE `administradores`
  ADD PRIMARY KEY (`dni_admin`);

--
-- Indices de la tabla `denunciados`
--
ALTER TABLE `denunciados`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `denunciantes`
--
ALTER TABLE `denunciantes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `denuncias`
--
ALTER TABLE `denuncias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tracking_code` (`tracking_code`),
  ADD KEY `fk_denuncias_motivo` (`motivo_id`),
  ADD KEY `fk_denuncias_denunciado` (`denunciado_id`),
  ADD KEY `fk_denuncias_denunciante` (`denunciante_id`),
  ADD KEY `dni_admin` (`dni_admin`);

--
-- Indices de la tabla `motivos`
--
ALTER TABLE `motivos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `seguimiento_denuncias`
--
ALTER TABLE `seguimiento_denuncias`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_seguimiento_denuncia` (`denuncia_id`),
  ADD KEY `fk_seguimiento_admin` (`dni_admin`);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `adjuntos`
--
ALTER TABLE `adjuntos`
  ADD CONSTRAINT `fk_adjuntos_denuncia` FOREIGN KEY (`denuncia_id`) REFERENCES `denuncias` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `denuncias`
--
ALTER TABLE `denuncias`
  ADD CONSTRAINT `denuncias_ibfk_1` FOREIGN KEY (`dni_admin`) REFERENCES `administradores` (`dni_admin`),
  ADD CONSTRAINT `fk_denuncias_denunciado` FOREIGN KEY (`denunciado_id`) REFERENCES `denunciados` (`id`),
  ADD CONSTRAINT `fk_denuncias_denunciante` FOREIGN KEY (`denunciante_id`) REFERENCES `denunciantes` (`id`),
  ADD CONSTRAINT `fk_denuncias_motivo` FOREIGN KEY (`motivo_id`) REFERENCES `motivos` (`id`);

--
-- Filtros para la tabla `seguimiento_denuncias`
--
ALTER TABLE `seguimiento_denuncias`
  ADD CONSTRAINT `fk_seguimiento_admin` FOREIGN KEY (`dni_admin`) REFERENCES `administradores` (`dni_admin`),
  ADD CONSTRAINT `fk_seguimiento_denuncia` FOREIGN KEY (`denuncia_id`) REFERENCES `denuncias` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
