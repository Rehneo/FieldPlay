--liquibase formatted sql

--changeset rehneo:schema-init
CREATE TABLE football_fields_metro_stations
(
    id                SERIAL PRIMARY KEY,
    football_field_id INTEGER REFERENCES football_fields (id) ON DELETE CASCADE,
    metro_station_id  INTEGER REFERENCES metro_stations (id) ON DELETE CASCADE
);