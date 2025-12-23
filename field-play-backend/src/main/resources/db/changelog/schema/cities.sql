--liquibase formatted sql

--changeset rehneo:schema-init
CREATE TABLE cities
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(32) UNIQUE NOT NULL
);