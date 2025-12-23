--liquibase formatted sql

--changeset rehneo:schema-init
CREATE TABLE metro_stations
(
    id      SERIAL PRIMARY KEY,
    name    VARCHAR(32) UNIQUE NOT NULL,
    city_id INTEGER            NOT NULL REFERENCES cities (id)
);