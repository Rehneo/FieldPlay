--liquibase formatted sql

--changeset rehneo:schema-init
CREATE TYPE user_role AS ENUM ('USER', 'FIELD_ADMIN', 'ADMIN');
CREATE TABLE users
(
    id         SERIAL PRIMARY KEY,
    firstname  VARCHAR(32)  NOT NULL,
    lastname   VARCHAR(32)  NOT NULL,
    birth_date DATE         NOT NULL,
    balance    INTEGER      NOT NULL CHECK (balance >= 0) DEFAULT 0,
    username   VARCHAR(128) NOT NULL UNIQUE,
    password   VARCHAR(128) NOT NULL,
    role       user_role    NOT NULL                      DEFAULT 'USER'
);