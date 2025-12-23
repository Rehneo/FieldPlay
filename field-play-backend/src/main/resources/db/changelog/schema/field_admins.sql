--liquibase formatted sql

--changeset rehneo:schema-init
CREATE TABLE field_admins
(
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    company_id INTEGER NOT NULL REFERENCES companies (id) ON DELETE CASCADE
);