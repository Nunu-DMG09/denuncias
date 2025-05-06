-- Migration script: Create tables for PostgreSQL 16

-- 1. Custom ENUM types
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_documento') THEN
    CREATE TYPE tipo_documento AS ENUM ('DNI', 'Carnet Extranjeria', 'RUC');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sexo') THEN
    CREATE TYPE sexo AS ENUM ('M', 'F');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estado_denuncias') THEN
    CREATE TYPE estado_denuncias AS ENUM (
      'registrado', 'recibida', 'en proceso', 'resuelto', 'rechazado'
    );
  END IF;
END
$$;

BEGIN;

-- 2. administradores
CREATE TABLE administradores (
  dni_admin   VARCHAR(8)     PRIMARY KEY,
  nombres     VARCHAR(255)   NOT NULL,
  password    VARCHAR(255)   NOT NULL,
  categoria   VARCHAR(100)   NOT NULL,
  estado      VARCHAR(100)   NOT NULL
);

-- 3. denunciantes
CREATE TABLE denunciantes (
  id               VARCHAR(8)      PRIMARY KEY,
  nombres          VARCHAR(255)    NOT NULL,
  email            VARCHAR(255)    NOT NULL,
  telefono         VARCHAR(20)     NOT NULL,
  numero_documento VARCHAR(20),
  tipo_documento   tipo_documento  DEFAULT 'DNI',
  sexo             sexo
);

-- 4. denunciados
CREATE TABLE denunciados (
  id                  VARCHAR(8)      PRIMARY KEY,
  nombre              VARCHAR(255),
  numero_documento    VARCHAR(20),
  tipo_documento      tipo_documento  DEFAULT 'DNI',
  representante_legal VARCHAR(255),
  razon_social        VARCHAR(255),
  cargo               VARCHAR(255)
);

-- 5. motivos
CREATE TABLE motivos (
  id          VARCHAR(8)     PRIMARY KEY,
  nombre      VARCHAR(255)   NOT NULL,
  descripcion TEXT
);

-- 6. denuncias
CREATE TABLE denuncias (
  id               VARCHAR(8)         PRIMARY KEY,
  tracking_code    VARCHAR(20)        NOT NULL UNIQUE,
  es_anonimo       BOOLEAN            NOT NULL DEFAULT TRUE,
  denunciante_id   VARCHAR(8),
  motivo_id        VARCHAR(8)         NOT NULL,
  motivo_otro      VARCHAR(255),
  descripcion      TEXT               NOT NULL,
  fecha_incidente  DATE,
  denunciado_id    VARCHAR(8)         NOT NULL,
  dni_admin        VARCHAR(8),
  fecha_registro   TIMESTAMP          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  estado           estado_denuncias   NOT NULL DEFAULT 'registrado',
  pdf_path         VARCHAR(255)
);

-- 7. adjuntos
CREATE TABLE adjuntos (
  id           VARCHAR(8)     PRIMARY KEY,
  denuncia_id  VARCHAR(8)     NOT NULL,
  file_path    VARCHAR(255)   NOT NULL,
  file_name    VARCHAR(100)   NOT NULL,
  file_type    VARCHAR(50)    NOT NULL,
  fecha_subida TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 8. historial_admin
CREATE TABLE historial_admin (
  id            VARCHAR(8)    PRIMARY KEY,
  realizado_por VARCHAR(8)    NOT NULL,
  dni_admin     VARCHAR(8)    NOT NULL,
  accion        VARCHAR(50)   NOT NULL,
  motivo        VARCHAR(255)  NOT NULL,
  fecha_accion  VARCHAR(255)  NOT NULL
);

-- 9. seguimiento_denuncias
CREATE TABLE seguimiento_denuncias (
  id                  VARCHAR(8)     PRIMARY KEY,
  denuncia_id         VARCHAR(8)     NOT NULL,
  estado              VARCHAR(100)   NOT NULL,
  comentario          TEXT,
  fecha_actualizacion TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  dni_admin           VARCHAR(8)
);

COMMIT;