-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 07-04-2025 a las 18:20:34
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
-- Volcado de datos para la tabla `adjuntos`
--

INSERT INTO `adjuntos` (`id`, `denuncia_id`, `file_path`, `file_name`, `file_type`, `fecha_subida`) VALUES
('ad106704', 'de4598db', 'uploads/de4598db/1743521242_6dee7412a222a0ca6285.webp', 'Img web.webp', 'image/webp', '2025-04-01 10:27:22'),
('ad2c94f0', 'decb7ebe', 'uploads/decb7ebe/1743607771_796ae30f9891b2534cbf.pdf', 'Denuncia-TD590CF71C2E6EA3C8FC.pdf', 'application/pdf', '2025-04-02 10:29:31'),
('ad2f97f3', 'de4598db', 'uploads/de4598db/1743521242_b8f220f36816872f77ed.mp4', 'Prueba 7.16 MB.mp4', 'video/mp4', '2025-04-01 10:27:22'),
('ad3b3c61', 'de8b849d', 'uploads/de8b849d/1743439538_1dd55f3ac0b56856fea5.jpg', 'Almanaques.jpg', 'image/jpeg', '2025-03-31 11:45:38'),
('ad5fac59', 'dea60a05', 'uploads/dea60a05/1743104843_4f69281f357e63e8040e.pdf', 'Denuncia-TDB332C2423DEC96E3FF.pdf', 'application/pdf', '2025-03-27 14:47:23'),
('ad63e833', 'decb7ebe', 'uploads/decb7ebe/1743607771_f227c12fbcee4d18f73d.avif', 'Img-avif.avif', 'image/avif', '2025-04-02 10:29:31'),
('ad982ff3', 'decb7ebe', 'uploads/decb7ebe/1743607771_61ce312748f51324280e.mp4', 'Prueba 7.16 MB.mp4', 'video/mp4', '2025-04-02 10:29:31'),
('adacebb7', 'de4598db', 'uploads/de4598db/1743521242_5cf42146a86ff6b1bb14.avif', 'Img-avif.avif', 'image/avif', '2025-04-01 10:27:22'),
('adc8993f', 'de4598db', 'uploads/de4598db/1743521242_b053c828aa93f3ffa1d4.pdf', 'Prueba pdf.pdf', 'application/pdf', '2025-04-01 10:27:22'),
('ade572db', 'deb50b23', 'uploads/deb50b23/1743426091_87f4e9b659d2b3de32d5.jpg', 'afiches.jpg', 'image/jpeg', '2025-03-31 08:01:31'),
('ade70d9f', 'decb7ebe', 'uploads/decb7ebe/1743607771_4cfeec3cb07ac759b89d.mp3', 'Prueba-8.1-MB audio.mp3', 'audio/mpeg', '2025-04-02 10:29:31'),
('ade88131', 'decb7ebe', 'uploads/decb7ebe/1743607771_cb248c5c0447c2be3a6b.webp', 'Img web.webp', 'image/webp', '2025-04-02 10:29:31'),
('adf2375b', 'de4598db', 'uploads/de4598db/1743521242_6260f5f22047a27ca3bc.mp3', 'Prueba-8.1-MB audio.mp3', 'audio/mpeg', '2025-04-01 10:27:22');

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
('74887540', 'CASTRO P. DIEGO A.', '$2y$10$z3l9n/8Zcx4IjXBHBveFf.3OO3rKtB/J1NuWOc8NsWXZxU89DG3g6', 'super_admin', 'activo'),
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
('de0001', 'Empresa ABC', '20123456789', 'RUC', 'Juan Perez', 'Empresa ABC S.A.', 'Gerente'),
('de0002', 'Empresa XYZ', '20198765432', 'RUC', 'Maria Lopez', 'Empresa XYZ S.A.', 'Directora'),
('de0003', 'Gobierno Local', '12345678', 'DNI', 'Carlos Sanchez', 'Municipalidad', 'Alcalde'),
('de0004', 'Compañía LMN', '20111222333', 'RUC', 'Ana Garcia', 'Compañía LMN Ltda.', 'CEO'),
('de0005', 'Instituto QRS', '87654321', 'DNI', 'Luis Ramirez', 'Instituto QRS', 'Director'),
('de23499b', 'BURGA BRACAMONTE, JULIAN', '76628500', 'DNI', NULL, NULL, 'ga '),
('de366a58', 'BURGA BRACAMONTE, JULIAN', '76628500', 'DNI', NULL, NULL, 'no se '),
('de6ca417', 'BURGA BRACAMONTE, JULIAN', '76628500', 'DNI', NULL, NULL, 'idiota profesional'),
('de78fe36', 'BURGA BRACAMONTE, JULIAN', '76628500', 'DNI', NULL, NULL, 'nose'),
('debd8bfc', 'BURGA BRACAMONTE, JULIAN', '76628500', 'DNI', NULL, NULL, 'dsadadads'),
('ded4fec0', 'BURGA BRACAMONTE, JULIAN', '76628500', 'DNI', NULL, NULL, 'nose'),
('deda1cc4', 'BURGA BRACAMONTE, JULIAN', '76628500', 'DNI', NULL, NULL, 'dddddddd'),
('dedcda20', 'BURGA BRACAMONTE, JULIAN', '76628500', 'DNI', NULL, NULL, '12345678'),
('def810e8', 'BURGA BRACAMONTE, JULIAN', '76628500', 'DNI', NULL, NULL, 'ing ');

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
('dn0001', 'Pedro Martinez', 'pedro@example.com', '987654321', '12345678', 'DNI', 'M'),
('dn0002', 'Laura Gomez', 'laura@example.com', '912345678', '87654321', 'DNI', 'F'),
('dn0003', 'Carlos Ruiz', 'carlos@example.com', '998877665', '11223344', 'DNI', 'M'),
('dn0004', 'Sofia Rojas', 'sofia@example.com', '977665544', '22334455', 'DNI', 'F'),
('dn0005', 'Andres Lopez', 'andres@example.com', '966554433', '33445566', 'DNI', 'M'),
('dn0006', 'Marta Diaz', 'marta@example.com', '955443322', '44556677', 'DNI', 'F'),
('dn0007', 'Jorge Perez', 'jorge@example.com', '944332211', '55667788', 'DNI', 'M'),
('dn0008', 'Valeria Mendez', 'valeria@example.com', '933221100', '66778899', 'DNI', 'F'),
('dn0009', 'Ricardo Silva', 'ricardo@example.com', '922110099', '77889900', 'DNI', 'M'),
('dn0010', 'Camila Torres', 'camila@example.com', '911009988', '88990011', 'DNI', 'F'),
('dn3e7a3d', 'CASTRO PASTOR, DIEGO ALBERTO', 'julian@gmial.com', '123456789', '74887540', 'DNI', 'M');

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
('de0d4112', 'TD2E9BBB10F2E1A309FD', 1, NULL, 'mod4b28c', NULL, 'gaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', '2025-03-07', 'de78fe36', '76628500', '2025-03-26 12:30:06', 'recibida', NULL),
('de3ca8b1', 'TD12F7B7079987A2F7FD', 1, NULL, 'mo221768', NULL, 'xddddddddxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', '2025-02-28', 'de366a58', '76628500', '2025-03-27 11:11:51', 'recibida', NULL),
('de4598db', 'TD590CF71C2E6EA3C8FC', 0, 'dn3e7a3d', 'mo221768', NULL, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', '2025-03-24', 'def810e8', '76628500', '2025-04-01 10:27:21', 'recibida', NULL),
('de8b849d', 'TD178C3C146A440707DC', 1, NULL, 'mo221768', NULL, 'xddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd', '2025-02-27', 'debd8bfc', '76628500', '2025-03-31 11:45:38', 'recibida', NULL),
('dea14169', 'TDDE5551700C5253B68E', 1, NULL, 'mod4b28c', NULL, 'no me acuerdo a la firme pe mano, estoy escribiendo esto como webon y a la firme ya quiero acabar ', '2025-03-12', 'de6ca417', NULL, '2025-03-26 19:37:50', 'recibida', NULL),
('dea60a05', 'TD6C53CA9E4529447B24', 1, NULL, 'mod4b28c', NULL, 'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', '2025-03-06', 'deda1cc4', NULL, '2025-03-27 14:47:22', 'registrado', NULL),
('deb50b23', 'TD629B018DDB76F53893', 1, NULL, 'mo221768', NULL, 'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq', '2025-03-05', 'de23499b', NULL, '2025-03-31 08:01:31', 'registrado', NULL),
('decb7ebe', 'TD77DFC2F15EA1270976', 1, NULL, 'mo221768', NULL, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', '2025-04-01', 'dedcda20', '76628500', '2025-04-02 10:29:31', 'recibida', NULL),
('dnc00001', 'TRK0001', 1, 'dn0001', 'mo221768', NULL, 'Descripción de la denuncia número 1: incidente relacionado con ventajas indebidas.', '2025-03-01', 'de0001', '76628500', '2025-03-26 11:45:33', 'registrado', NULL),
('dnc00002', 'TRK0002', 0, 'dn0002', 'mo22176a', NULL, 'Descripción de la denuncia número 2: uso indebido de influencias.', '2025-03-02', 'de0002', '76628500', '2025-03-26 11:45:33', 'en proceso', NULL),
('dnc00003', 'TRK0003', 1, 'dn0003', 'mo58aa06', NULL, 'Descripción de la denuncia número 3: conflicto de intereses en gestión pública.', '2025-03-03', 'de0003', '76628500', '2025-03-26 11:45:33', 'resuelto', NULL),
('dnc00004', 'TRK0004', 0, 'dn0004', 'mo58aa1e', NULL, 'Descripción de la denuncia número 4: obstrucción en el acceso a información.', '2025-03-04', 'de0004', '76628500', '2025-03-26 11:45:33', 'rechazado', NULL),
('dnc00005', 'TRK0005', 1, 'dn0005', 'mo58aa1f', NULL, 'Descripción de la denuncia número 5: abuso de autoridad detectado en la institución.', '2025-03-05', 'de0005', '76628500', '2025-03-26 11:45:33', 'registrado', NULL),
('dnc00006', 'TRK0006', 0, 'dn0006', 'mod4b288', NULL, 'Descripción de la denuncia número 6: favorecimiento indebido en contratos.', '2025-03-06', 'de0001', '76628500', '2025-03-26 11:45:33', 'en proceso', NULL),
('dnc00007', 'TRK0007', 1, 'dn0007', 'mod4b28c', NULL, 'Descripción de la denuncia número 7: uso indebido de recursos estatales.', '2025-03-07', 'de0002', '76628500', '2025-03-26 11:45:33', 'resuelto', NULL),
('dnc00008', 'TRK0008', 0, 'dn0008', 'mo_otros', 'Otro motivo en denuncia 8: situación particular no clasificada.', 'Descripción de la denuncia número 8: incidente atípico.', '2025-03-08', 'de0003', '76628500', '2025-03-26 11:45:33', 'rechazado', NULL),
('dnc00009', 'TRK0009', 1, 'dn0009', 'mo221768', NULL, 'Descripción de la denuncia número 9: análisis de ventajas indebidas.', '2025-03-09', 'de0004', '76628500', '2025-03-26 11:45:33', 'registrado', NULL),
('dnc00010', 'TRK0010', 0, 'dn0010', 'mo22176a', NULL, 'Descripción de la denuncia número 10: irregularidades en el uso de influencias.', '2025-03-10', 'de0005', '76628500', '2025-03-26 11:45:33', 'en proceso', NULL),
('dnc00011', 'TRK0011', 1, 'dn0001', 'mo58aa06', NULL, 'Descripción de la denuncia número 11: conflicto de intereses detectado.', '2025-03-11', 'de0001', '76628500', '2025-03-26 11:45:33', 'resuelto', NULL),
('dnc00012', 'TRK0012', 0, 'dn0002', 'mo58aa1e', NULL, 'Descripción de la denuncia número 12: información restringida sin justificación.', '2025-03-12', 'de0002', '76628500', '2025-03-26 11:45:33', 'rechazado', NULL),
('dnc00013', 'TRK0013', 1, 'dn0003', 'mo58aa1f', NULL, 'Descripción de la denuncia número 13: abuso de poder en gestión de recursos.', '2025-03-13', 'de0003', '76628500', '2025-03-26 11:45:33', 'registrado', NULL),
('dnc00014', 'TRK0014', 0, 'dn0004', 'mod4b288', NULL, 'Descripción de la denuncia número 14: favorecimiento indebido en asignación de proyectos.', '2025-03-14', 'de0004', '76628500', '2025-03-26 11:45:33', 'en proceso', NULL),
('dnc00015', 'TRK0015', 1, 'dn0005', 'mod4b28c', NULL, 'Descripción de la denuncia número 15: mal uso de bienes públicos detectado.', '2025-03-15', 'de0005', '76628500', '2025-03-26 11:45:33', 'resuelto', NULL),
('dnc00016', 'TRK0016', 0, 'dn0006', 'mo_otros', 'Otro motivo en denuncia 16: situación excepcional no categorizada.', 'Descripción de la denuncia número 16: caso especial.', '2025-03-16', 'de0001', '76628500', '2025-03-26 11:45:33', 'rechazado', NULL),
('dnc00017', 'TRK0017', 1, 'dn0007', 'mo221768', NULL, 'Descripción de la denuncia número 17: revisión de posibles sobornos.', '2025-03-17', 'de0002', '76628500', '2025-03-26 11:45:33', 'registrado', NULL),
('dnc00018', 'TRK0018', 0, 'dn0008', 'mo22176a', NULL, 'Descripción de la denuncia número 18: injerencia indebida en procesos.', '2025-03-18', 'de0003', '76628500', '2025-03-26 11:45:33', 'en proceso', NULL),
('dnc00019', 'TRK0019', 1, 'dn0009', 'mo58aa06', NULL, 'Descripción de la denuncia número 19: conflicto de intereses en contratación.', '2025-03-19', 'de0004', '76628500', '2025-03-26 11:45:33', 'resuelto', NULL),
('dnc00020', 'TRK0020', 0, 'dn0010', 'mo58aa1e', NULL, 'Descripción de la denuncia número 20: bloqueo injustificado de información.', '2025-03-20', 'de0005', '76628500', '2025-03-26 11:45:33', 'rechazado', NULL),
('dnc00021', 'TRK0021', 1, 'dn0001', 'mo58aa1f', NULL, 'Descripción de la denuncia número 21: abuso de autoridad en gestión local.', '2025-03-21', 'de0001', '76628500', '2025-03-26 11:45:33', 'registrado', NULL),
('dnc00022', 'TRK0022', 0, 'dn0002', 'mod4b288', NULL, 'Descripción de la denuncia número 22: favorecimiento en licitaciones públicas.', '2025-03-22', 'de0002', '76628500', '2025-03-26 11:45:33', 'en proceso', NULL),
('dnc00023', 'TRK0023', 1, 'dn0003', 'mod4b28c', NULL, 'Descripción de la denuncia número 23: uso indebido de recursos durante gestión.', '2025-03-23', 'de0003', '76628500', '2025-03-26 11:45:33', 'resuelto', NULL),
('dnc00024', 'TRK0024', 0, 'dn0004', 'mo_otros', 'Otro motivo en denuncia 24: situación particular de este caso.', 'Descripción de la denuncia número 24: caso atípico.', '2025-03-24', 'de0004', '76628500', '2025-03-26 11:45:33', 'rechazado', NULL),
('dnc00025', 'TRK0025', 1, 'dn0005', 'mo221768', NULL, 'Descripción de la denuncia número 25: revisión de manejo indebido de ventajas.', '2025-03-25', 'de0005', '76628500', '2025-03-26 11:45:33', 'registrado', NULL),
('dnc00026', 'TRK0026', 0, 'dn0006', 'mo22176a', NULL, 'Descripción de la denuncia número 26: injerencia en procesos de contratación.', '2025-03-26', 'de0001', '76628500', '2025-03-26 11:45:33', 'en proceso', NULL),
('dnc00027', 'TRK0027', 1, 'dn0007', 'mo58aa06', NULL, 'Descripción de la denuncia número 27: conflicto de intereses en adjudicaciones.', '2025-03-27', 'de0002', '76628500', '2025-03-26 11:45:33', 'resuelto', NULL),
('dnc00028', 'TRK0028', 0, 'dn0008', 'mo58aa1e', NULL, 'Descripción de la denuncia número 28: negativa injustificada de información.', '2025-03-28', 'de0003', '76628500', '2025-03-26 11:45:33', 'rechazado', NULL),
('dnc00029', 'TRK0029', 1, 'dn0009', 'mo58aa1f', NULL, 'Descripción de la denuncia número 29: abuso de autoridad en el sector público.', '2025-03-29', 'de0004', '76628500', '2025-03-26 11:45:33', 'registrado', NULL),
('dnc00030', 'TRK0030', 0, 'dn0010', 'mod4b288', NULL, 'Descripción de la denuncia número 30: favorecimiento indebido en asignaciones.', '2025-03-30', 'de0005', '76628500', '2025-03-26 11:45:33', 'en proceso', NULL),
('dnc00031', 'TRK0031', 1, 'dn0001', 'mod4b28c', NULL, 'Descripción de la denuncia número 31: uso irregular de recursos públicos.', '2025-03-31', 'de0001', '76628500', '2025-03-26 11:45:33', 'resuelto', NULL),
('dnc00032', 'TRK0032', 0, 'dn0002', 'mo_otros', 'Otro motivo en denuncia 32: situación no clasificada previamente.', 'Descripción de la denuncia número 32: caso particular.', '2025-04-01', 'de0002', '76628500', '2025-03-26 11:45:33', 'rechazado', NULL),
('dnc00033', 'TRK0033', 1, 'dn0003', 'mo221768', NULL, 'Descripción de la denuncia número 33: revisión de sobornos en gestiones.', '2025-04-02', 'de0003', '76628500', '2025-03-26 11:45:33', 'registrado', NULL),
('dnc00034', 'TRK0034', 0, 'dn0004', 'mo22176a', NULL, 'Descripción de la denuncia número 34: irregularidades en uso de influencias.', '2025-04-03', 'de0004', '76628500', '2025-03-26 11:45:33', 'en proceso', NULL),
('dnc00035', 'TRK0035', 1, 'dn0005', 'mo58aa06', NULL, 'Descripción de la denuncia número 35: conflicto de intereses en procesos licitatorios.', '2025-04-04', 'de0005', '76628500', '2025-03-26 11:45:33', 'resuelto', NULL),
('dnc00036', 'TRK0036', 0, 'dn0006', 'mo58aa1e', NULL, 'Descripción de la denuncia número 36: retención indebida de información pública.', '2025-04-05', 'de0001', '76628500', '2025-03-26 11:45:33', 'rechazado', NULL),
('dnc00037', 'TRK0037', 1, 'dn0007', 'mo58aa1f', NULL, 'Descripción de la denuncia número 37: abuso de autoridad en procesos internos.', '2025-04-06', 'de0002', '76628500', '2025-03-26 11:45:33', 'registrado', NULL),
('dnc00038', 'TRK0038', 0, 'dn0008', 'mod4b288', NULL, 'Descripción de la denuncia número 38: favorecimiento indebido en contrataciones.', '2025-04-07', 'de0003', '76628500', '2025-03-26 11:45:33', 'en proceso', NULL),
('dnc00039', 'TRK0039', 1, 'dn0009', 'mod4b28c', NULL, 'Descripción de la denuncia número 39: uso inadecuado de recursos estatales.', '2025-04-08', 'de0004', '76628500', '2025-03-26 11:45:33', 'resuelto', NULL),
('dnc00040', 'TRK0040', 0, 'dn0010', 'mo_otros', 'Otro motivo en denuncia 40: circunstancia excepcional no clasificada.', 'Descripción de la denuncia número 40: caso particular.', '2025-04-09', 'de0005', '76628500', '2025-03-26 11:45:33', 'rechazado', NULL),
('dnc00041', 'TRK0041', 1, 'dn0001', 'mo221768', NULL, 'Descripción de la denuncia número 41: revisión de posibles irregularidades en sobornos.', '2025-04-10', 'de0001', '76628500', '2025-03-26 11:45:33', 'registrado', NULL),
('dnc00042', 'TRK0042', 0, 'dn0002', 'mo22176a', NULL, 'Descripción de la denuncia número 42: análisis de influencia indebida en contratos.', '2025-04-11', 'de0002', '76628500', '2025-03-26 11:45:33', 'en proceso', NULL),
('dnc00043', 'TRK0043', 1, 'dn0003', 'mo58aa06', NULL, 'Descripción de la denuncia número 43: conflicto de intereses en la adjudicación de proyectos.', '2025-04-12', 'de0003', '76628500', '2025-03-26 11:45:33', 'resuelto', NULL),
('dnc00044', 'TRK0044', 0, 'dn0004', 'mo58aa1e', NULL, 'Descripción de la denuncia número 44: obstrucción al acceso de información esencial.', '2025-04-13', 'de0004', '76628500', '2025-03-26 11:45:33', 'rechazado', NULL),
('dnc00045', 'TRK0045', 1, 'dn0005', 'mo58aa1f', NULL, 'Descripción de la denuncia número 45: abuso de autoridad detectado en el sector público.', '2025-04-14', 'de0005', NULL, '2025-03-26 11:45:33', 'registrado', NULL),
('dnc00046', 'TRK0046', 0, 'dn0006', 'mod4b288', NULL, 'Descripción de la denuncia número 46: favorecimiento en asignaciones de contratos.', '2025-04-15', 'de0001', '76628500', '2025-03-26 11:45:33', 'en proceso', NULL),
('dnc00047', 'TRK0047', 1, 'dn0007', 'mod4b28c', NULL, 'Descripción de la denuncia número 47: uso indebido de recursos durante gestión administrativa.', '2025-04-16', 'de0002', '76628500', '2025-03-26 11:45:33', 'resuelto', NULL),
('dnc00048', 'TRK0048', 0, 'dn0008', 'mo_otros', 'Otro motivo en denuncia 48: situación irregular no clasificada.', 'Descripción de la denuncia número 48: caso especial.', '2025-04-17', 'de0003', '76628500', '2025-03-26 11:45:33', 'rechazado', NULL),
('dnc00049', 'TRK0049', 1, 'dn0009', 'mo221768', NULL, 'Descripción de la denuncia número 49: revisión de sobornos y ventajas indebidas.', '2025-04-18', 'de0004', '76628500', '2025-03-26 11:45:33', 'recibida', NULL),
('dnc00050', 'TRK0050', 0, 'dn0010', 'mo22176a', NULL, 'Descripción de la denuncia número 50: análisis de influencias indebidas en la gestión pública.', '2025-04-19', 'de0005', '76628500', '2025-03-26 11:45:33', 'en proceso', NULL);

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
-- Estructura de tabla para la tabla `historial_admin`
--

CREATE TABLE `historial_admin` (
  `id` varchar(8) NOT NULL,
  `realizado_por` varchar(8) NOT NULL,
  `dni_admin` varchar(8) NOT NULL,
  `accion` varchar(50) NOT NULL,
  `motivo` varchar(255) NOT NULL,
  `fecha_accion` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `historial_admin`
--

INSERT INTO `historial_admin` (`id`, `realizado_por`, `dni_admin`, `accion`, `motivo`, `fecha_accion`) VALUES
('ha146557', '76628500', '', 'password', 'Cambio de contraseña programado', ''),
('ha77559f', '76628500', '74887540', 'estado', 'a', ''),
('ha87c9b5', '74887540', '', '', 'por que si', ''),
('haa9006c', '76628500', '', 'estado', 'me cae mal', ''),
('haeb2b2c', '76628500', '', 'password', 'Cambio de contraseña programado', ''),
('haed9f61', '76628500', '74887540', 'estado', 'a', '');

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
('sd054410', 'de4598db', 'rechazado', 'hola', '2025-04-01 15:37:10', '76628500'),
('sd14ea16', 'dnc00049', 'recibida', 'La denuncia ha sido recibida por el administrador', '2025-03-27 16:08:48', '76628500'),
('sd1b4e99', 'de3ca8b1', 'recibida', 'La denuncia ha sido recibida por el administrador', '2025-03-31 13:37:28', '76628500'),
('sd20171b', 'decb7ebe', 'recibida', 'La denuncia ha sido recibida por el administrador', '2025-04-02 15:29:49', '76628500'),
('sd339b28', 'de4598db', 'recibida', 'La denuncia ha sido recibida por el administrador', '2025-04-01 15:31:19', '76628500'),
('sd4abf1b', 'dnc00045', 'recibida', 'La denuncia ha sido recibida por el administrador', '2025-03-27 16:02:08', '76628500'),
('sd4d2ca5', 'de3ca8b1', 'recibida', 'La denuncia ha sido recibida por el administrador', '2025-03-27 19:48:00', '76628500'),
('sd558b26', 'dnc00049', 'recibida', 'La denuncia ha sido recibida por el administrador', '2025-03-31 13:03:22', '76628500'),
('sd5e0d11', 'de3ca8b1', 'recibida', 'La denuncia ha sido recibida por el administrador', '2025-03-27 16:12:06', '76628500'),
('sd64b9ba', 'decb7ebe', 'registrado', 'Denuncia registrada', '2025-04-02 15:29:31', NULL),
('sd8ce483', 'de0d4112', 'registrado', 'Denuncia registrada', '2025-03-26 17:30:06', NULL),
('sd96f01c', 'dnc00045', 'recibida', 'La denuncia ha sido recibida por el administrador', '2025-03-27 16:02:27', '76628500'),
('sd994a55', 'dnc00045', 'recibida', 'La denuncia ha sido recibida por el administrador', '2025-03-27 16:06:18', '76628500'),
('sda2976d', 'dea60a05', 'registrado', 'Denuncia registrada', '2025-03-27 19:47:23', NULL),
('sdb26d9b', 'de8b849d', 'recibida', 'La denuncia ha sido recibida por el administrador', '2025-03-31 16:46:36', '76628500'),
('sdbaffe7', 'deb50b23', 'registrado', 'Denuncia registrada', '2025-03-31 13:01:31', NULL),
('sdc3d84d', 'dea14169', 'registrado', 'Denuncia registrada', '2025-03-27 00:37:50', NULL),
('sdcb6211', 'de4598db', 'registrado', 'Denuncia registrada', '2025-04-01 15:27:22', NULL),
('sdcf73af', 'de8b849d', 'registrado', 'Denuncia registrada', '2025-03-31 16:45:38', NULL),
('sdffa4b3', 'de3ca8b1', 'registrado', 'Denuncia registrada', '2025-03-27 16:11:51', NULL);

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
-- Indices de la tabla `historial_admin`
--
ALTER TABLE `historial_admin`
  ADD PRIMARY KEY (`id`),
  ADD KEY `realizado_por` (`realizado_por`),
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
