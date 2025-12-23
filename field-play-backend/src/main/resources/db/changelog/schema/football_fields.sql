--liquibase formatted sql

--changeset rehneo:schema-init
CREATE TYPE football_field_type AS ENUM ('OUTDOOR', 'INDOOR');
CREATE TYPE surface_type AS ENUM ('NATURAL', 'ARTIFICIAL', 'PARQUET', 'LINOLEUM');
CREATE TABLE football_fields
(
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(32)         NOT NULL,
    city_id       INTEGER             NOT NULL REFERENCES cities (id),
    address       VARCHAR(64)         NOT NULL,
    type          football_field_type NOT NULL,
    surface_type  surface_type        NOT NULL,
    max_players   INTEGER             NOT NULL CHECK (max_players > 0) DEFAULT 20,
    length        FLOAT               NOT NULL CHECK (length > 0 ),
    width         FLOAT               NOT NULL CHECK (width > 0),
    height        FLOAT CHECK (height > 0),
    locker_room   BOOLEAN             NOT NULL,
    stands        BOOLEAN             NOT NULL,
    shower        BOOLEAN             NOT NULL,
    lighting      BOOLEAN             NOT NULL,
    parking_space BOOLEAN             NOT NULL,
    company_id    INTEGER             NOT NULL REFERENCES companies (id) ON DELETE CASCADE
);