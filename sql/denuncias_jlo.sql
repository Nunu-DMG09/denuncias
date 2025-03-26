-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 26-03-2025 a las 15:48:53
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
  `estado` enum('registrado','en proceso','resuelto','rechazado') NOT NULL DEFAULT 'registrado',
  `pdf_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

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
