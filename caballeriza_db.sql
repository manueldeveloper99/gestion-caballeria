-- --------------------------------------------------------
-- Host:                         localhost
-- Versión del servidor:         12.2.2-MariaDB - MariaDB Server
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.14.0.7165
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para caballeriza_db
CREATE DATABASE IF NOT EXISTS `caballeriza_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci */;
USE `caballeriza_db`;

-- Volcando estructura para tabla caballeriza_db.alerta
CREATE TABLE IF NOT EXISTS `alerta` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `inventario_id` bigint(20) NOT NULL,
  `mensaje` varchar(255) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `tipo` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `inventario_id` (`inventario_id`),
  CONSTRAINT `1` FOREIGN KEY (`inventario_id`) REFERENCES `inventario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla caballeriza_db.alerta: ~0 rows (aproximadamente)

-- Volcando estructura para tabla caballeriza_db.caballo
CREATE TABLE IF NOT EXISTS `caballo` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `identificador` varchar(50) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `edad` int(11) DEFAULT NULL,
  `raza` varchar(100) DEFAULT NULL,
  `sexo` varchar(20) DEFAULT NULL,
  `peso` decimal(10,2) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `identificador` (`identificador`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla caballeriza_db.caballo: ~0 rows (aproximadamente)

-- Volcando estructura para tabla caballeriza_db.empleado
CREATE TABLE IF NOT EXISTS `empleado` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `rol` enum('VETERINARIO','POTRADOR','CUIDADOR','ADMINISTRADOR') NOT NULL,
  `contacto` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla caballeriza_db.empleado: ~0 rows (aproximadamente)

-- Volcando estructura para tabla caballeriza_db.historial_medico
CREATE TABLE IF NOT EXISTS `historial_medico` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `caballo_id` bigint(20) NOT NULL,
  `empleado_id` bigint(20) NOT NULL,
  `fecha` date NOT NULL,
  `vacuna` varchar(150) DEFAULT NULL,
  `tratamiento` varchar(255) DEFAULT NULL,
  `alergias` varchar(255) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `caballo_id` (`caballo_id`),
  KEY `empleado_id` (`empleado_id`),
  CONSTRAINT `1` FOREIGN KEY (`caballo_id`) REFERENCES `caballo` (`id`),
  CONSTRAINT `2` FOREIGN KEY (`empleado_id`) REFERENCES `empleado` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla caballeriza_db.historial_medico: ~0 rows (aproximadamente)

-- Volcando estructura para tabla caballeriza_db.inventario
CREATE TABLE IF NOT EXISTS `inventario` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `stock` int(11) NOT NULL,
  `stockMinimo` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla caballeriza_db.inventario: ~0 rows (aproximadamente)

-- Volcando estructura para tabla caballeriza_db.plan_alimentacion
CREATE TABLE IF NOT EXISTS `plan_alimentacion` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `caballo_id` bigint(20) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `cantidad` decimal(10,2) DEFAULT NULL,
  `horario` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `caballo_id` (`caballo_id`),
  CONSTRAINT `1` FOREIGN KEY (`caballo_id`) REFERENCES `caballo` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla caballeriza_db.plan_alimentacion: ~0 rows (aproximadamente)

-- Volcando estructura para tabla caballeriza_db.reserva
CREATE TABLE IF NOT EXISTS `reserva` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint(20) NOT NULL,
  `caballo_id` bigint(20) NOT NULL,
  `empleado_id` bigint(20) DEFAULT NULL,
  `fechaInicio` datetime NOT NULL,
  `fechaFin` datetime NOT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `caballo_id` (`caballo_id`),
  KEY `empleado_id` (`empleado_id`),
  CONSTRAINT `1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`),
  CONSTRAINT `2` FOREIGN KEY (`caballo_id`) REFERENCES `caballo` (`id`),
  CONSTRAINT `3` FOREIGN KEY (`empleado_id`) REFERENCES `empleado` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla caballeriza_db.reserva: ~0 rows (aproximadamente)

-- Volcando estructura para tabla caballeriza_db.suministro
CREATE TABLE IF NOT EXISTS `suministro` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `caballo_id` bigint(20) NOT NULL,
  `inventario_id` bigint(20) NOT NULL,
  `fecha` datetime DEFAULT NULL,
  `tipo` varchar(100) DEFAULT NULL,
  `cantidad` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `caballo_id` (`caballo_id`),
  KEY `inventario_id` (`inventario_id`),
  CONSTRAINT `1` FOREIGN KEY (`caballo_id`) REFERENCES `caballo` (`id`),
  CONSTRAINT `2` FOREIGN KEY (`inventario_id`) REFERENCES `inventario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla caballeriza_db.suministro: ~0 rows (aproximadamente)

-- Volcando estructura para tabla caballeriza_db.tarea
CREATE TABLE IF NOT EXISTS `tarea` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `empleado_id` bigint(20) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `empleado_id` (`empleado_id`),
  CONSTRAINT `1` FOREIGN KEY (`empleado_id`) REFERENCES `empleado` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla caballeriza_db.tarea: ~0 rows (aproximadamente)

-- Volcando estructura para tabla caballeriza_db.turno
CREATE TABLE IF NOT EXISTS `turno` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `empleado_id` bigint(20) NOT NULL,
  `fecha` date NOT NULL,
  `horario` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `empleado_id` (`empleado_id`),
  CONSTRAINT `1` FOREIGN KEY (`empleado_id`) REFERENCES `empleado` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla caballeriza_db.turno: ~0 rows (aproximadamente)

-- Volcando estructura para tabla caballeriza_db.usuario
CREATE TABLE IF NOT EXISTS `usuario` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `empleado_id` bigint(20) DEFAULT NULL,
  `correo` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('ADMINISTRADOR','VETERINARIO','CUIDADOR','CLIENTE') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `correo` (`correo`),
  KEY `empleado_id` (`empleado_id`),
  CONSTRAINT `1` FOREIGN KEY (`empleado_id`) REFERENCES `empleado` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla caballeriza_db.usuario: ~0 rows (aproximadamente)

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
